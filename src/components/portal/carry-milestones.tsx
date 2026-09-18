"use client";

import { Trophy, Lock } from "lucide-react";
import { CARRY_MILESTONES, milestoneProgressFor } from "@/lib/data";
import { useLiveStats } from "@/lib/use-live-stats";
import { formatUsd, formatPct } from "@/lib/format";
import { cn } from "@/lib/utils";

export function CarryMilestones({ scoutId }: { scoutId: string }) {
  const { scoutStats } = useLiveStats();
  const stats = scoutStats.get(scoutId);
  if (!stats) return null;

  const deployed = stats.attributedDeployedUsd;
  const { reached, next, remainingUsd } = milestoneProgressFor(deployed);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <Trophy className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Carry milestones</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {reached ? `${formatPct(reached.fundCarryPct, 2)} of fund carry unlocked` : "None reached yet"}
        </span>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        Past your per-deal carry, sourcing consistently unlocks a small share of the fund&apos;s overall
        carry. Progress counts every dollar the fund has deployed into companies you sourced, across the
        full 24 months — <span className="text-foreground">{formatUsd(deployed)}</span> so far.
        {next ? ` ${formatUsd(remainingUsd)} more to reach the ${next.label.toLowerCase()}.` : ""}
      </p>

      <div className="flex flex-col gap-2">
        {CARRY_MILESTONES.map((m) => {
          const isReached = deployed >= m.deployedUsd;
          const pct = Math.min(deployed / m.deployedUsd, 1);
          return (
            <div
              key={m.id}
              className={cn(
                "flex flex-col gap-1.5 rounded-lg border px-3 py-2.5",
                isReached ? "border-primary/40 bg-primary/[0.06]" : "border-border/60 bg-background/40",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {isReached ? (
                    <Trophy className="size-3.5 shrink-0 text-primary" />
                  ) : (
                    <Lock className="size-3.5 shrink-0 text-muted-foreground/60" />
                  )}
                  <span className={cn("text-xs font-medium", isReached ? "text-foreground" : "text-muted-foreground")}>
                    {formatUsd(m.deployedUsd)} sourced
                  </span>
                </div>
                <span className={cn("text-xs tabular-nums", isReached ? "text-primary" : "text-muted-foreground")}>
                  {formatPct(m.fundCarryPct, 2)} of fund carry
                </span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", isReached ? "bg-primary" : "bg-muted-foreground/40")}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground/70">
        Milestones step up rather than stack — reaching the third means holding 0.50%, not the sum of all
        three. The rungs are sized against the full $6M pool, not this year&apos;s run-rate — clearing the
        first one puts you well into the top of the roster. Intros to companies the fund had already met
        don&apos;t count toward them.
      </p>
    </div>
  );
}
