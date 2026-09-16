import { Users, Wallet, Landmark, GitBranch } from "lucide-react";
import {
  activeScouts,
  totalScouts,
  SCOUT_POOL_SIZE,
  capitalDeployedUsd,
  capitalAllocatedUsd,
  pipelineOpenCount,
  totalMemos,
} from "@/lib/data";
import { formatUsdCompact, formatPct } from "@/lib/format";

interface Stat {
  label: string;
  value: string;
  sub: string;
  icon: typeof Users;
}

export function SummaryStrip() {
  const stats: Stat[] = [
    {
      label: "Scout pool size",
      value: formatUsdCompact(SCOUT_POOL_SIZE),
      sub: `<5% of Fund II · ${formatUsdCompact(capitalAllocatedUsd)} allocated to Cohort 1`,
      icon: Wallet,
    },
    {
      label: "Active scouts",
      value: `${activeScouts}`,
      sub: `of ${totalScouts} in Cohort 1`,
      icon: Users,
    },
    {
      label: "Capital deployed",
      value: `${formatUsdCompact(capitalDeployedUsd)} / ${formatUsdCompact(capitalAllocatedUsd)}`,
      sub: `${formatPct(capitalDeployedUsd / capitalAllocatedUsd, 0)} of allocated`,
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
            <span className="text-xs font-medium uppercase tracking-wide">{s.label}</span>
          </div>
          <div className="text-2xl font-semibold tabular-nums text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}
