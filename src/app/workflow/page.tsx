import type { Metadata } from "next";
import Link from "next/link";
import { GitBranch, ArrowRight } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { KanbanBoard } from "@/components/workflow/kanban-board";
import { DecisionAuditLog } from "@/components/workflow/decision-audit-log";
import { LiveWorkflowStats } from "@/components/workflow/live-workflow-stats";

export const metadata: Metadata = {
  title: "Deal Workflow · Scout Fund OS",
  description: "Intake, a 48-hour first-look response target, and the pipeline from memo to check.",
};

export default function WorkflowPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <DetailHeader
          icon={GitBranch}
          tagline="Program component"
          title="Deal Workflow"
          description="Intake, first-look response, and the pipeline from memo to check."
        />
        <Link
          href="/fund"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Review pending decisions
          <ArrowRight className="size-4" />
        </Link>
      </div>

      <LiveWorkflowStats />

      <Section
        title="Live pipeline"
        subtitle="Every scout-sourced deal, by current stage. Scroll a column to see the full list."
      >
        <KanbanBoard />
      </Section>

      <Section
        title="Decision audit trail"
        subtitle="Every reviewed deal, logged with who made the call, when, and why."
      >
        <DecisionAuditLog />
      </Section>
    </div>
  );
}
