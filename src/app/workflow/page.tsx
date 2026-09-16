import type { Metadata } from "next";
import { GitBranch } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { KanbanBoard } from "@/components/workflow/kanban-board";
import { ProcessSteps } from "@/components/workflow/process-steps";
import { DecisionAuditLog } from "@/components/workflow/decision-audit-log";
import { avgResponseHours, lateResponseRate, pipelineOpenCount, totalMemos } from "@/lib/data";
import { formatHours, formatPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Deal Workflow · Scout Fund OS",
  description: "Intake, a 48-hour first-look response target, and the pipeline from memo to check.",
};

export default function WorkflowPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={GitBranch}
        tagline="Component 3 of 6"
        title="Deal Workflow"
        description="One intake channel, a 48-hour target on the first response, and a small check with no full diligence at this stage. The workflow is deliberately lightweight — the underwriting happens later, at the priced round."
      />

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
        subtitle="Every reviewed deal, logged with who made the call, when, and why — the accountability-facing view of the same kanban above."
      >
        <DecisionAuditLog />
      </Section>

      <ConnectionCallout slug="workflow" />
    </div>
  );
}
