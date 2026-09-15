import { scouts, scoutStats } from "@/lib/data";
import { formatUsd } from "@/lib/format";
import { Progress } from "@/components/ui/progress";

export function AllocationUtilization() {
  const rows = [...scouts]
    .map((s) => {
      const stats = scoutStats.get(s.id)!;
      return { scout: s, deployed: stats.capitalDeployedUsd, pct: stats.capitalDeployedUsd / s.allocationUsd };
    })
    .sort((a, b) => b.pct - a.pct);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Personal allocation utilization</span>
        <span className="text-xs text-muted-foreground">Deployed vs. $150K–$300K ceiling</span>
      </div>
      <div className="flex flex-col gap-3.5">
        {rows.map(({ scout, deployed, pct }) => (
          <div key={scout.id} className="flex items-center gap-3">
            <span className="w-36 shrink-0 truncate text-xs text-foreground">{scout.name}</span>
            <Progress value={Math.min(pct, 1) * 100} className="h-1.5 flex-1" />
            <span className="w-28 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
              {formatUsd(deployed)} / {formatUsd(scout.allocationUsd)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
