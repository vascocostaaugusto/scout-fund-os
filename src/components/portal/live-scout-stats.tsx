"use client";

import { useLiveStats } from "@/lib/use-live-stats";
import { SCOUT_CARRY_RATE_ASSUMPTION } from "@/lib/data";
import { StatTile } from "@/components/detail/stat-tile";
import { formatUsd, formatPct } from "@/lib/format";

export function LiveScoutStats({ scoutId }: { scoutId: string }) {
  const { scoutStats, scoutUpside } = useLiveStats();
  const stats = scoutStats.get(scoutId)!;
  const upside = scoutUpside.get(scoutId)!;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile label="Memos submitted" value={`${stats.memosSubmitted}`} hint="over the program" />
      <StatTile label="Deals funded" value={`${stats.dealsFunded}`} hint={`${formatPct(stats.conversionRate, 0)} conversion`} />
      <StatTile
        label="Capital deployed"
        value={formatUsd(upside.deployedUsd)}
        hint="tickets from the shared $6M pool"
      />
      <StatTile
        label="Estimated upside"
        value={formatUsd(upside.estimatedCarryUsd)}
        hint={`marked-to-date, at ${formatPct(SCOUT_CARRY_RATE_ASSUMPTION, 1)} carry`}
        emphasis
      />
    </div>
  );
}
