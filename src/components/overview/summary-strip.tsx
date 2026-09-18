"use client";

import { Users, Wallet, Landmark, GitBranch } from "lucide-react";
import { activeScouts, totalScouts, SCOUT_POOL_SIZE, totalMemos } from "@/lib/data";
import { useLiveStats } from "@/lib/use-live-stats";
import { formatUsdCompact, formatPct } from "@/lib/format";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: typeof Users;
}

export function SummaryStrip() {
  const { capitalDeployedUsd, pipelineOpenCount } = useLiveStats();

  const stats: Stat[] = [
    {
      label: "Scout pool size",
      value: formatUsdCompact(SCOUT_POOL_SIZE),
      sub: "<5% of Fund II · shared, evergreen",
      icon: Wallet,
    },
    {
      label: "Active scouts",
      value: `${activeScouts}`,
      sub: `of ${totalScouts} on the roster`,
      icon: Users,
    },
    {
      label: "Capital deployed",
      value: formatUsdCompact(capitalDeployedUsd),
      sub: `${formatPct(capitalDeployedUsd / SCOUT_POOL_SIZE, 1)} of the $6M pool`,
      icon: Landmark,
    },
    {
      label: "Deals in pipeline",
      value: `${pipelineOpenCount}`,
      sub: `of ${totalMemos} memos submitted`,
      icon: GitBranch,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col gap-2.5 bg-card px-5 py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <s.icon className="size-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-[0.1em]">{s.label}</span>
          </div>
          <div className="font-display text-2xl font-bold tabular-nums tracking-[-0.02em] text-foreground">
            {s.value}
          </div>
          <div className="text-xs text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
