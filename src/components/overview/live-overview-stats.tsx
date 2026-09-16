"use client";

import { useLiveStats } from "@/lib/use-live-stats";
import { StatTile } from "@/components/detail/stat-tile";
import { formatPct, formatHours } from "@/lib/format";

export function LiveOverviewStats() {
  const { fundedConversionRate, avgResponseHours, pipelineByStage } = useLiveStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile label="% of scout deals funded" value={formatPct(fundedConversionRate, 1)} hint="of all memos submitted" />
      <StatTile
        label="Avg. first-look time"
        value={formatHours(avgResponseHours)}
        deltaTone={avgResponseHours <= 48 ? "good" : "bad"}
        delta={avgResponseHours <= 48 ? "Under 48h target" : "Over 48h target"}
      />
      <StatTile
        label="Pending decision"
        value={`${pipelineByStage.submitted + pipelineByStage.under_review}`}
        hint="submitted + under review"
        emphasis
      />
      <StatTile label="Approved, closing" value={`${pipelineByStage.approved}`} hint="SAFE + wire in progress" />
    </div>
  );
}
