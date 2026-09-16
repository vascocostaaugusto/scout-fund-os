"use client";

import { useLiveStats } from "@/lib/use-live-stats";
import { StatTile } from "@/components/detail/stat-tile";
import { formatHours, formatPct } from "@/lib/format";

export function LiveWorkflowStats() {
  const { avgResponseHours, lateResponseRate, pipelineOpenCount, totalMemos, pipelineByStage } = useLiveStats();
  const pendingCount = pipelineByStage.submitted + pipelineByStage.under_review;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile
        label="Avg. first-look time"
        value={formatHours(avgResponseHours)}
        hint="target: under 48h"
        deltaTone={avgResponseHours <= 48 ? "good" : "bad"}
        delta={avgResponseHours <= 48 ? "On target" : "Above target"}
        emphasis
      />
      <StatTile label="Late responses" value={formatPct(lateResponseRate, 1)} hint="first looks over 48h" />
      <StatTile label="Open pipeline" value={`${pipelineOpenCount}`} hint={`of ${totalMemos} memos submitted`} />
      <StatTile label="Pending decision" value={`${pendingCount}`} hint="submitted + under review" emphasis />
    </div>
  );
}
