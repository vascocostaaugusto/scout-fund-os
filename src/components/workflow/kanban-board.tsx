"use client";

import { scoutById } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, STAGE_DOT, STAGE_HINT, STAGE_ORDER } from "@/lib/stage-labels";

export function KanbanBoard() {
  const { deals } = useDealStore();
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {STAGE_ORDER.map((stage, colIndex) => {
        const col = { stage, label: STAGE_LABEL[stage], hint: STAGE_HINT[stage] };
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
                        {d.isLate ? (
                          <span className="rounded-full bg-critical/15 px-1.5 py-0.5 text-[9px] font-medium text-critical">
                            Late
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
