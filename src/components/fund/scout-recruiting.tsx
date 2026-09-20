"use client";

import { UserPlus, ArrowRight, X } from "lucide-react";
import { useCandidateStore } from "@/lib/candidate-store";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import type { CandidateStage } from "@/lib/data";
import { cn } from "@/lib/utils";

const STAGE_LABEL: Record<CandidateStage, string> = {
  nominated: "Nominated",
  interview_scheduled: "Interview scheduled",
  reference_check: "Reference check",
  agreement_sent: "Agreement sent",
  signed: "Signed",
  declined: "Declined",
};

const NEXT_ACTION_LABEL: Record<CandidateStage, string | null> = {
  nominated: "Schedule interview",
  interview_scheduled: "Move to reference check",
  reference_check: "Send agreement",
  agreement_sent: "Mark signed",
  signed: null,
  declined: null,
};

export function ScoutRecruiting() {
  const { candidates, advanceCandidate, declineCandidate } = useCandidateStore();

  const active = candidates
    .filter((c) => c.stage !== "declined" && c.stage !== "signed")
    .sort((a, b) => new Date(a.notedAt).getTime() - new Date(b.notedAt).getTime());
  const resolved = candidates.filter((c) => c.stage === "signed" || c.stage === "declined");

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs text-muted-foreground">
        {active.length} candidate{active.length === 1 ? "" : "s"} in the pipeline — how the network grows past 30.
      </span>

      <div className="flex flex-col gap-3">
        {active.map((c) => {
          const nextAction = NEXT_ACTION_LABEL[c.stage];
          return (
            <div key={c.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{c.name}</span>
                    <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {c.proposedProfile}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {c.proposedCoverage} · {c.affiliation} · referred by {c.referredBy}
                  </div>
                </div>
                <span className="rounded-full bg-secondary/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                  {STAGE_LABEL[c.stage]}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{c.notes}</p>
              <div className="flex flex-wrap items-center gap-2">
                {nextAction ? (
                  <Button size="sm" onClick={() => advanceCandidate(c.id)}>
                    <ArrowRight className="size-3.5" />
                    {nextAction}
                  </Button>
                ) : null}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-critical hover:bg-critical/10 hover:text-critical"
                  onClick={() => declineCandidate(c.id)}
                >
                  <X className="size-3.5" />
                  Pass
                </Button>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  Nominated {formatDate(c.notedAt)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {resolved.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/60 p-4">
          <span className="text-xs font-medium text-muted-foreground">Resolved</span>
          {resolved.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 text-xs">
              <span className={cn("text-foreground", c.stage === "declined" && "text-muted-foreground")}>
                {c.name} —{" "}
                <span className={c.stage === "signed" ? "text-success" : "text-critical"}>
                  {c.stage === "signed" ? "Signed" : "Passed"}
                </span>
              </span>
              {c.stage === "signed" ? (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <UserPlus className="size-3" />
                  Would provision @scouts.shapers.vc and join the roster on next sync
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
