import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { PendingDecisions } from "@/components/fund/pending-decisions";
import { ClosingQueue } from "@/components/fund/closing-queue";
import { ExitDistributions } from "@/components/fund/exit-distributions";
import { DealTable } from "@/components/info-hub/deal-table";
import { NotificationFeed } from "@/components/info-hub/notification-feed";
import { MonthlyEmailStatus } from "@/components/fund/monthly-email-status";
import { PacingChart } from "@/components/charts/pacing-chart";
import { totalMemos, notifications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Fund Portal · Scout Fund OS",
  description: "Where the fund works the pipeline — pending decisions, the system of record, and notifications.",
};

export default function FundPortalPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Landmark}
        tagline="Fund-facing"
        title="Fund Portal"
        description="Where the fund actually works the pipeline — decide on pending memos, browse the system of record, and see what scouts have been told."
      />

      <Section
        title="Pending decisions"
        subtitle="Every submitted memo waiting on a first look. Decide here — it updates the kanban and audit trail immediately."
      >
        <PendingDecisions />
      </Section>

      <Section
        title="Legal & closing"
        subtitle="An approval isn't a funded deal — every approved memo still needs a signed SAFE and a confirmed wire. Work the queue here."
      >
        <ClosingQueue />
      </Section>

      <Section
        title="Exit distributions"
        subtitle="When a deal exits, the scout's carry share doesn't pay itself — work it here, blocked automatically until their paperwork is on file."
      >
        <ExitDistributions />
      </Section>

      <Section title="Deployment pacing" subtitle="Cumulative capital deployed vs. the pace needed to fully deploy the pool in 24 months.">
        <PacingChart />
      </Section>

      <Section
        title="System of record"
        subtitle={`All ${totalMemos} records — company, scout, sector, check size, status, partner notes.`}
      >
        <DealTable />
      </Section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Notifications" subtitle="Simulated — the real integration posts to Slack.">
          <NotificationFeed limit={12} />
        </Section>
        <Section title="Scout communications" subtitle={`${notifications.filter((n) => n.kind === "digest").length} monthly batches sent to date.`}>
          <MonthlyEmailStatus />
        </Section>
      </div>
    </div>
  );
}
