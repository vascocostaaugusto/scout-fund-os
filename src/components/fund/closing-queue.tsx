"use client";

import { FileText, Send, Stamp, Landmark, CheckCircle2, RotateCcw, Bell, Clock } from "lucide-react";
import { scoutById } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/data";

// The full chain from an approved decision to money actually leaving the
// account. Labels are states ("Drafted"), not actions ("Draft SAFE") —
// the tracker says where the deal *is*; the button below says what to do
// next.
const CLOSING_STEPS = [
  { key: "drafted", label: "SAFE drafted", icon: FileText },
  { key: "sent", label: "Sent to sign", icon: Send },
  { key: "executed", label: "Executed", icon: Stamp },
  { key: "wire_sent", label: "Wire sent", icon: Landmark },
  { key: "wired", label: "Wire confirmed", icon: CheckCircle2 },
] as const;

// -1 = nothing done yet; 4 = fully wired.
function closingStepIndex(d: Deal): number {
  if (d.wireStatus === "confirmed") return 4;
  if (d.wireStatus === "initiated") return 3;
  if (d.legalDocStatus === "executed") return 2;
  if (d.legalDocStatus === "sent_for_signature") return 1;
  if (d.legalDocStatus === "draft_generated") return 0;
  return -1;
}

export function ClosingQueue() {
  const { deals, overrides, generateSafe, sendForSignature, markExecuted, initiateWire, confirmWire, resetDeal } =
    useDealStore();

  const closing = deals
    .filter((d) => d.stage === "approved")
    .sort((a, b) => (a.firstLookAt ?? "").localeCompare(b.firstLookAt ?? ""));

  const fundedThisSession = Object.entries(overrides)
    .filter(([, o]) => o.patch.wireStatus === "confirmed")
    .sort((a, b) => new Date(b[1].lastActionAt).getTime() - new Date(a[1].lastActionAt).getTime());

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs text-muted-foreground">
        {closing.length} approved deal{closing.length === 1 ? "" : "s"} moving through SAFE and wire — none
        of them count as funded until the wire clears
      </span>

      {closing.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing in closing — every approved deal has been wired.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {closing.map((d) => {
            const scout = scoutById.get(d.scoutId);
            const stepIdx = closingStepIndex(d);
            const legalDone = d.legalDocStatus === "executed";

            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{d.companyName}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.sector} · sourced by {scout?.name} · ticket {formatUsd(d.checkSizeUsd ?? 0)}
                    </div>
                  </div>
                  {d.safeTerms ? (
                    <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {d.safeTerms.instrument} · {formatUsd(d.safeTerms.valuationCapUsd)} cap ·{" "}
                      {d.safeTerms.discountPct}% discount
                    </span>
                  ) : null}
                </div>

                {d.legalEntityName ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-1 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-[11px] text-muted-foreground">
                    <span>
                      <span className="text-foreground">{d.legalEntityName}</span> · NIF {d.taxId}
                    </span>
                    {d.proposedSafeDate ? <span>SAFE date {formatDate(d.proposedSafeDate)}</span> : null}
                  </div>
                ) : null}

                {/* Closing tracker: SAFE drafted → sent → executed → wire sent → wired */}
                <div className="relative flex items-start pt-1">
                  {/* connector track, spanning first icon centre (10%) to last (90%) */}
                  <div className="absolute left-[10%] right-[10%] top-4 h-px bg-border" />
                  <div
                    className="absolute left-[10%] top-4 h-px bg-primary transition-all duration-300"
                    style={{ width: `${(Math.max(stepIdx, 0) / (CLOSING_STEPS.length - 1)) * 80}%` }}
                  />
                  {CLOSING_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const reached = i <= stepIdx;
                    return (
                      <div key={step.key} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border bg-card transition-colors",
                            reached ? "border-primary text-primary" : "border-border text-muted-foreground/50",
                          )}
                        >
                          <Icon className="size-3" />
                        </div>
                        <span
                          className={cn(
                            "text-center text-[10px] leading-tight",
                            reached ? "text-foreground" : "text-muted-foreground/60",
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {d.legalDocStatus === "not_started" && !d.legalDataSubmittedAt ? (
                  <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/[0.06] px-3 py-2 text-[11px] text-warning">
                    <Clock className="size-3.5 shrink-0" />
                    Awaiting legal and SAFE data from the scout: name, NIF, amount, cap, discount, date. The
                    SAFE can&apos;t be drafted until that&apos;s on file.
                  </div>
                ) : null}

                {legalDone && d.wireStatus === "not_initiated" ? (
                  <div className="flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/[0.06] px-3 py-2 text-[11px] text-primary">
                    <Bell className="size-3.5 shrink-0" />
                    Wire reminder: the founder signed. Nothing else is blocking this check.
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-2">
                  {d.legalDocStatus === "not_started" && d.legalDataSubmittedAt ? (
                    <Button size="sm" onClick={() => generateSafe(d.id)}>
                      <FileText className="size-3.5" />
                      Generate SAFE
                    </Button>
                  ) : null}
                  {d.legalDocStatus === "draft_generated" ? (
                    <Button size="sm" onClick={() => sendForSignature(d.id)}>
                      <Send className="size-3.5" />
                      Send for e-signature
                    </Button>
                  ) : null}
                  {d.legalDocStatus === "sent_for_signature" ? (
                    <Button size="sm" onClick={() => markExecuted(d.id)}>
                      <Stamp className="size-3.5" />
                      Mark countersigned / executed
                    </Button>
                  ) : null}
                  {legalDone && d.wireStatus === "not_initiated" ? (
                    <Button size="sm" onClick={() => initiateWire(d.id)}>
                      <Landmark className="size-3.5" />
                      Initiate wire
                    </Button>
                  ) : null}
                  {legalDone && d.wireStatus === "initiated" ? (
                    <Button size="sm" onClick={() => confirmWire(d.id)}>
                      <CheckCircle2 className="size-3.5" />
                      Confirm wire &amp; fund
                    </Button>
                  ) : null}
                  {legalDone && d.wireStatus === "confirmed" ? (
                    <span className="text-xs text-success">Wired — moving to Check written.</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {fundedThisSession.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/60 p-4">
          <span className="text-xs font-medium text-muted-foreground">Funded this session</span>
          {fundedThisSession.map(([dealId, o]) => {
            const deal = deals.find((d) => d.id === dealId);
            if (!deal) return null;
            return (
              <div key={dealId} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground">
                  {deal.companyName} — <span className="text-success">Wired {formatUsd(deal.checkSizeUsd ?? 0)}</span>{" "}
                  · {formatDate(o.lastActionAt)}
                </span>
                <button
                  type="button"
                  onClick={() => resetDeal(dealId)}
                  className="flex shrink-0 items-center gap-1 text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3" />
                  Undo
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
