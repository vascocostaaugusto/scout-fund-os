"use client";

import { Mail, MessageSquare, Check, X, RotateCcw, Sparkles, Send } from "lucide-react";
import { INBOX_LAST_RUN } from "@/lib/data";
import type { InboxProposal } from "@/lib/data";
import { useInboxStore } from "@/lib/inbox-store";
import { useDealStore } from "@/lib/deal-store";
import { useDecisionOwner } from "@/lib/decision-owner-store";
import { formatDateTime, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MorningInbox() {
  const { pending, resolved, resolve, reopen } = useInboxStore();
  const { flagFollowOnWatch, markExited, writeOff } = useDealStore();
  const { owner } = useDecisionOwner();

  function confirm(p: InboxProposal) {
    // Apply the proposed change to the real record, then mark it resolved.
    if (p.dealId) {
      if (p.kind === "write_off") writeOff(p.dealId, `Written off — ${p.subject}.`, owner);
      if (p.kind === "mark_exited") markExited(p.dealId, p.exitMultiple ?? 1, owner, `Exit confirmed — ${p.subject}.`);
      if (p.kind === "follow_on_watch") flagFollowOnWatch(p.dealId, owner, `Next round signaled — ${p.subject}.`);
    }
    resolve(p.id, "confirmed");
  }

  if (pending.length === 0 && resolved.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/[0.03] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">This morning&apos;s inbox pass</span>
        <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[10px] text-muted-foreground">
          Simulated — the real job reads Gmail and Slack
        </span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Last run {formatDateTime(INBOX_LAST_RUN)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {pending.length > 0
          ? `${pending.length} update${pending.length === 1 ? "" : "s"} found overnight that would change a record. Nothing is applied until you confirm it.`
          : "Everything from this morning's pass has been handled."}
      </p>

      {pending.map((p) => {
        const Icon = p.source === "gmail" ? Mail : MessageSquare;
        return (
          <div key={p.id} className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="truncate text-xs font-medium text-foreground">{p.subject}</div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {p.from} · {timeAgo(p.receivedAt)}
                  </div>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                  p.confidence === "high" ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                )}
              >
                {p.confidence === "high" ? "High confidence" : "Needs review"}
              </span>
            </div>

            <p className="border-l-2 border-border pl-2.5 text-[11px] italic leading-relaxed text-muted-foreground">
              &ldquo;{p.excerpt}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-foreground">
                <span className="text-muted-foreground">
                  {p.kind === "new_intro" ? "Not in the pipeline:" : "Proposed:"}
                </span>{" "}
                {p.summary}
              </span>
              <div className="ml-auto flex gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => resolve(p.id, "dismissed")}>
                  <X className="size-3.5" />
                  Dismiss
                </Button>
                {p.kind === "new_intro" ? (
                  <Button size="sm" onClick={() => confirm(p)}>
                    <Send className="size-3.5" />
                    Ask {p.scoutName?.split(" ")[0] ?? "the scout"} to submit it
                  </Button>
                ) : (
                  <Button size="sm" onClick={() => confirm(p)}>
                    <Check className="size-3.5" />
                    Confirm
                  </Button>
                )}
              </div>
            </div>

            {p.kind === "new_intro" ? (
              <span className="text-[11px] text-muted-foreground/70">
                Filing it from this email would guess at sector, geography and whether there&apos;s a
                conflict. The scout submits it from their portal so the disclosure comes from the person
                making it.
              </span>
            ) : null}
          </div>
        );
      })}

      {resolved.length > 0 ? (
        <div className="flex flex-col gap-1.5 border-t border-border/60 pt-2.5">
          {resolved.map(({ proposal, resolution }) => (
            <div key={proposal.id} className="flex items-center justify-between gap-3 text-[11px]">
              <span className="truncate text-muted-foreground">
                <span className={resolution === "confirmed" ? "text-success" : "text-muted-foreground"}>
                  {resolution === "dismissed"
                    ? "Dismissed"
                    : proposal.kind === "new_intro"
                      ? "Nudge sent"
                      : "Applied"}
                </span>{" "}
                —{" "}
                {resolution === "confirmed" && proposal.kind === "new_intro"
                  ? `${proposal.scoutName ?? "The scout"} asked to submit ${proposal.subject.replace(/^Intro — /, "").replace(/ \(.*\)$/, "")} through the portal`
                  : proposal.summary}
              </span>
              <button
                type="button"
                onClick={() => reopen(proposal.id)}
                className="flex shrink-0 items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Undo
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
