import type { Metadata } from "next";
import { GitBranch } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { KanbanBoard } from "@/components/workflow/kanban-board";
import { ProcessSteps } from "@/components/workflow/process-steps";
import { DecisionAuditLog } from "@/components/workflow/decision-audit-log";
import { avgSlaHours, slaBreachRate, pipelineOpenCount, totalMemos } from "@/lib/data";
import { formatHours, formatPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Deal Workflow · Scout Fund OS",
  description: "Intake, 48-hour SLA, and the pipeline from memo to check.",
};

export default function WorkflowPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={GitBranch}
        tagline="Component 3 of 7"
        title="Deal Workflow"
        description="One intake channel, a hard 48-hour SLA on the first response, and a small check with no full diligence at this stage. The workflow is deliberately lightweight — the underwriting happens later, at the priced round."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Avg. first-look SLA"
          value={formatHours(avgSlaHours)}
          hint="target: under 48h"
          deltaTone={avgSlaHours <= 48 ? "good" : "bad"}
          delta={avgSlaHours <= 48 ? "On target" : "Above target"}
          emphasis
        />
        <StatTile label="SLA breach rate" value={formatPct(slaBreachRate, 1)} hint="first looks over 48h" />
        <StatTile label="Open pipeline" value={`${pipelineOpenCount}`} hint={`of ${totalMemos} memos submitted`} />
        <StatTile label="Diligence at this stage" value="None" hint="reserved for the priced follow-on round" />
      </div>

      <Section title="How a deal moves" subtitle="Four steps from memo to check — built to be fast, not thorough.">
        <ProcessSteps />
      </Section>

      <Section
        title="Live pipeline"
        subtitle="Every scout-sourced deal, by current stage. Scroll a column to see the full list."
      >
        <KanbanBoard />
      </Section>

      <Section
        title="Decision audit trail"
        subtitle="Every reviewed deal, logged with who made the call, when, and why — the compliance-facing view of the same kanban above."
      >
        <DecisionAuditLog />
      </Section>

      <ConnectionCallout slug="workflow" />
    </div>
  );
}
