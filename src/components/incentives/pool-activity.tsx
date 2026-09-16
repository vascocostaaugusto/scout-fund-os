"use client";

import { scouts } from "@/lib/data";
import { useLiveStats } from "@/lib/use-live-stats";
import { formatUsd } from "@/lib/format";

const DISPLAY_LIMIT = 12;

export function PoolActivity() {
  const { scoutStats } = useLiveStats();
  const ranked = [...scouts]
    .map((s) => ({ scout: s, deployed: scoutStats.get(s.id)!.capitalDeployedUsd }))
    .filter((r) => r.deployed > 0)
    .sort((a, b) => b.deployed - a.deployed);

  const top = ranked.slice(0, DISPLAY_LIMIT);
  const maxDeployed = top[0]?.deployed ?? 1;
  const remaining = ranked.length - top.length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Ticket activity from the shared pool</span>
        <span className="text-xs text-muted-foreground">{ranked.length} of {scouts.length} scouts have written a check</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {top.map(({ scout, deployed }) => (
          <div key={scout.id} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-xs text-foreground">{scout.name}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.max((deployed / maxDeployed) * 100, 4)}%` }}
              />
            </div>
            <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {formatUsd(deployed)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] text-muted-foreground">
        {remaining > 0 ? `+${remaining} more scouts have also written checks, not shown. ` : ""}
        Every scout draws from the same pool — there&apos;s no personal ceiling to run out of.
      </p>
    </div>
  );
}
