"use client";

import { FileText, Send, Stamp, Landmark, CheckCircle2, RotateCcw } from "lucide-react";
import { scoutById } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/data";

const LEGAL_STEPS = [
  { key: "not_started", label: "Draft SAFE", icon: FileText },
  { key: "draft_generated", label: "Send for signature", icon: Send },
  { key: "sent_for_signature", label: "Mark executed", icon: Stamp },
  { key: "executed", label: "Executed", icon: CheckCircle2 },
] as const;

function legalStepIndex(status: Deal["legalDocStatus"]) {
  return LEGAL_STEPS.findIndex((s) => s.key === status);
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
        {closing.length} approved deal{closing.length === 1 ? "" : "s"} moving through SAFE + wire before
        they&apos;re check_written
      </span>

      {closing.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing in closing — every approved deal has been wired.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {closing.map((d) => {
            const scout = scoutById.get(d.scoutId);
            const stepIdx = legalStepIndex(d.legalDocStatus);
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

                {/* Legal step tracker */}
                <div className="flex items-center gap-1.5">
                  {LEGAL_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const reached = i <= stepIdx;
                    return (
                      <div key={step.key} className="flex flex-1 items-center gap-1.5">
                        <div
                          className={cn(
                            "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                            reached
                              ? "border-primary bg-primary/15 text-primary"
                              : "border-border bg-secondary/30 text-muted-foreground",
                          )}
                        >
                          <Icon className="size-3" />
                        </div>
                        {i < LEGAL_STEPS.length - 1 ? (
                          <div className={cn("h-px flex-1", i < stepIdx ? "bg-primary" : "bg-border")} />
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {d.legalDocStatus === "not_started" ? (
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
                    <span className="text-xs text-success">Wired — moving to check_written.</span>
                  ) : null}
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {legalDone
                      ? d.wireStatus === "not_initiated"
                        ? "SAFE executed — awaiting wire"
                        : d.wireStatus === "initiated"
                          ? "Wire sent — awaiting bank confirmation"
                          : "Wire confirmed"
                      : "Legal not yet executed"}
                  </span>
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
