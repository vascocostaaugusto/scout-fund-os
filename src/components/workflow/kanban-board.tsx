import { deals, scoutById } from "@/lib/data";
import type { DealStage } from "@/lib/data";
import { formatUsd, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

const COLUMNS: { stage: DealStage; label: string; hint: string }[] = [
  { stage: "submitted", label: "Submitted", hint: "Awaiting first look" },
  { stage: "under_review", label: "Under Review", hint: "48h SLA clock running" },
  { stage: "approved", label: "Approved", hint: "Cleared, check pending" },
  { stage: "declined", label: "Declined", hint: "Passed at first look" },
  { stage: "check_written", label: "Check Written", hint: "SAFE / convertible closed" },
  { stage: "follow_on_watch", label: "Follow-on Watch", hint: "Right-of-first-look active" },
  { stage: "exited", label: "Exited", hint: "Return realized" },
  { stage: "dead", label: "Dead", hint: "Written off" },
];

const STAGE_DOT: Record<DealStage, string> = {
  submitted: "bg-muted-foreground",
  under_review: "bg-warning",
  approved: "bg-primary",
  declined: "bg-critical",
  check_written: "bg-primary",
  follow_on_watch: "bg-primary",
  exited: "bg-success",
  dead: "bg-critical",
};

export function KanbanBoard() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {COLUMNS.map((col, colIndex) => {
        const items = deals
          .filter((d) => d.stage === col.stage)
          .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

        return (
          <div
            key={col.stage}
            className="flex w-60 shrink-0 animate-in fade-in slide-in-from-bottom-2 flex-col gap-2.5 rounded-xl border border-border bg-card p-3 fill-mode-both"
            style={{ animationDelay: `${colIndex * 60}ms`, animationDuration: "320ms" }}
          >
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className={cn("size-1.5 rounded-full", STAGE_DOT[col.stage])} />
                <span className="text-xs font-semibold text-foreground">{col.label}</span>
              </div>
              <span className="rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground tabular-nums">
                {items.length}
              </span>
            </div>
            <p className="px-1 text-[11px] text-muted-foreground">{col.hint}</p>

            <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto">
              {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-[11px] text-muted-foreground">
                  No deals in this stage
                </div>
              ) : (
                items.map((d, i) => {
                  const scout = scoutById.get(d.scoutId);
                  return (
                    <div
                      key={d.id}
                      className="flex animate-in fade-in slide-in-from-bottom-1 flex-col gap-1 rounded-lg border border-border bg-background p-2.5 fill-mode-both transition-colors hover:border-primary/40"
                      style={{ animationDelay: `${colIndex * 60 + Math.min(i, 8) * 25}ms`, animationDuration: "260ms" }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{d.companyName}</span>
                        {d.slaBreached ? (
                          <span className="rounded-full bg-critical/15 px-1.5 py-0.5 text-[9px] font-medium text-critical">
                            SLA
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{d.sector}</span>
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] text-muted-foreground">{scout?.name.split(" ")[0]}</span>
                        <span className="text-[10px] tabular-nums text-muted-foreground">
                          {d.checkSizeUsd ? formatUsd(d.checkSizeUsd) : timeAgo(d.submittedAt)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
