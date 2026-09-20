"use client";

import { useState } from "react";
import { Check, X, RotateCcw, ShieldAlert, MessageCircleQuestion } from "lucide-react";
import { scoutById, TICKET_HARD_CAP_USD } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { useDecisionOwner } from "@/lib/decision-owner-store";
import { formatDate, formatUsd, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";

const DEFAULT_TICKET = 25_000;

export function PendingDecisions() {
  const { deals, overrides, decideDeal, resetDeal, requestInfo } = useDealStore();
  const { owner: actingAs } = useDecisionOwner();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tickets, setTickets] = useState<Record<string, number>>({});
  const [askingId, setAskingId] = useState<string | null>(null);
  const [question, setQuestion] = useState("");

  // A deal with an unanswered question is parked with the scout, not
  // waiting on a partner — it drops out of the queue until they reply.
  const pending = deals
    .filter((d) => d.stage === "submitted" || d.stage === "under_review")
    .filter((d) => !(d.infoRequest && !d.infoResponse))
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  const waitingOnScouts = deals.filter((d) => d.infoRequest && !d.infoResponse).length;

  const decidedThisSession = Object.entries(overrides)
    .filter(([, o]) => o.patch.stage === "approved" || o.patch.stage === "declined")
    .sort((a, b) => new Date(b[1].decidedAt).getTime() - new Date(a[1].decidedAt).getTime());

  function decide(dealId: string, decision: "approved" | "declined", requestedTicketUsd: number | null) {
    decideDeal(dealId, decision, actingAs, notes[dealId] ?? "", tickets[dealId] ?? requestedTicketUsd ?? DEFAULT_TICKET);
    setNotes((prev) => {
      const next = { ...prev };
      delete next[dealId];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {pending.length} deal{pending.length === 1 ? "" : "s"} awaiting a decision
          {waitingOnScouts > 0 ? ` · ${waitingOnScouts} parked with scouts` : ""}
        </span>
        <span className="text-xs text-muted-foreground">
          Deciding as <span className="font-medium text-foreground">{actingAs}</span>
        </span>
      </div>

      {pending.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
          Nothing pending — every submitted memo has a decision on file.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pending.map((d) => {
            const scout = scoutById.get(d.scoutId);
            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{d.companyName}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.sector} · sourced by {scout?.name} · submitted {timeAgo(d.submittedAt)}
                    </div>
                  </div>
                  <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">
                    {d.stage === "submitted" ? "Awaiting first look" : "Under review"}
                  </span>
                </div>
                {d.problemDesc || d.productDesc || d.teamDesc || d.whyGreatDesc ? (
                  <dl className="grid gap-x-4 gap-y-1.5 border-l-2 border-border pl-3 text-xs leading-relaxed sm:grid-cols-2">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Problem</dt>
                      <dd className="text-muted-foreground">{d.problemDesc || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Product</dt>
                      <dd className="text-muted-foreground">{d.productDesc || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Team</dt>
                      <dd className="text-muted-foreground">{d.teamDesc || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground/70">Why great</dt>
                      <dd className="text-muted-foreground">{d.whyGreatDesc || "—"}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="border-l-2 border-border pl-3 text-xs leading-relaxed text-muted-foreground">
                    {d.pitch}
                  </p>
                )}

                {d.conflictDisclosed ? (
                  <div className="flex items-start gap-2 rounded-lg border border-critical/30 bg-critical/10 px-3 py-2 text-[11px] text-critical">
                    <ShieldAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      <strong className="font-semibold">Prior relationship with the founders, disclosed by scout —</strong>{" "}
                      {d.conflictNotes}
                    </span>
                  </div>
                ) : null}

                {d.infoResponse ? (
                  <div className="flex flex-col gap-1 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-[11px]">
                    <span className="text-muted-foreground">You asked: {d.infoRequest}</span>
                    <span className="text-foreground">
                      <span className="text-success">Scout replied:</span> {d.infoResponse}
                    </span>
                  </div>
                ) : null}

                {askingId === d.id ? (
                  <div className="flex flex-col gap-2 rounded-lg border border-warning/40 bg-warning/[0.06] p-3">
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      rows={2}
                      autoFocus
                      placeholder="What do you need from the scout before deciding?"
                      className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={question.trim().length < 4}
                        onClick={() => {
                          requestInfo(d.id, question.trim(), actingAs);
                          setQuestion("");
                          setAskingId(null);
                        }}
                      >
                        Send to scout
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setAskingId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : null}
                <textarea
                  value={notes[d.id] ?? ""}
                  onChange={(e) => setNotes((prev) => ({ ...prev, [d.id]: e.target.value }))}
                  placeholder="Optional note — why, or what's next"
                  rows={2}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    If approved, ticket
                    <input
                      type="number"
                      step={1000}
                      max={TICKET_HARD_CAP_USD}
                      value={tickets[d.id] ?? d.requestedTicketUsd ?? DEFAULT_TICKET}
                      onChange={(e) =>
                        setTickets((prev) => ({
                          ...prev,
                          [d.id]: Math.min(Number(e.target.value), TICKET_HARD_CAP_USD),
                        }))
                      }
                      className="w-24 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <span className="text-muted-foreground/60">
                      {d.requestedTicketUsd
                        ? `scout requested ${formatUsd(d.requestedTicketUsd)} — `
                        : ""}
                      program cap {formatUsd(TICKET_HARD_CAP_USD)}
                    </span>
                  </label>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-warning hover:bg-warning/10 hover:text-warning"
                      onClick={() => {
                        setAskingId(askingId === d.id ? null : d.id);
                        setQuestion("");
                      }}
                    >
                      <MessageCircleQuestion className="size-3.5" />
                      Ask for info
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-critical hover:bg-critical/10 hover:text-critical"
                      onClick={() => decide(d.id, "declined", d.requestedTicketUsd)}
                    >
                      <X className="size-3.5" />
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => decide(d.id, "approved", d.requestedTicketUsd)}>
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {decidedThisSession.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/60 p-4">
          <span className="text-xs font-medium text-muted-foreground">Decided this session</span>
          {decidedThisSession.map(([dealId, o]) => {
            const deal = deals.find((d) => d.id === dealId);
            if (!deal) return null;
            const declined = o.patch.stage === "declined";
            return (
              <div key={dealId} className="flex items-center justify-between gap-3 text-xs">
                <span className="text-foreground">
                  {deal.companyName} —{" "}
                  <span className={declined ? "text-critical" : "text-success"}>
                    {declined ? "Declined" : `Approved · ${formatUsd(o.patch.checkSizeUsd ?? 0)}`}
                  </span>{" "}
                  by {o.patch.reviewingPartner} · {formatDate(o.decidedAt)}
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
