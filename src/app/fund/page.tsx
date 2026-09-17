import type { Metadata } from "next";
import { Landmark } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { TreasuryPanel } from "@/components/fund/treasury-panel";
import { PendingDecisions } from "@/components/fund/pending-decisions";
import { ClosingQueue } from "@/components/fund/closing-queue";
import { ExitDistributions } from "@/components/fund/exit-distributions";
import { FollowOnDecisions } from "@/components/fund/follow-on-decisions";
import { PortfolioOutcomes } from "@/components/fund/portfolio-outcomes";
import { ScoutRecruiting } from "@/components/fund/scout-recruiting";
import { DealTable } from "@/components/info-hub/deal-table";
import { NotificationFeed } from "@/components/info-hub/notification-feed";
import { MonthlyEmailStatus } from "@/components/fund/monthly-email-status";
import { LpReportingStatus } from "@/components/fund/lp-reporting-status";
import { PacingChart } from "@/components/charts/pacing-chart";
import { PortalIndex } from "@/components/fund/portal-index";
import { MorningInbox } from "@/components/fund/morning-inbox";
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

      <PortalIndex />

      <MorningInbox />

      <TreasuryPanel />

      <Section
        id="pending-decisions"
        title="Pending decisions"
        subtitle="Every memo waiting on a first look. Decide here — it updates the kanban and audit trail immediately."
      >
        <PendingDecisions />
      </Section>

      <Section
        id="legal-closing"
        title="Legal & closing"
        subtitle="An approval isn't a funded deal — every approved memo still needs a signed SAFE and a confirmed wire. Work the queue here."
      >
        <ClosingQueue />
      </Section>

      <Section
        id="follow-on"
        title="Follow-on decisions"
        subtitle="A company signaling its next round doesn't get fund capital automatically — decide here, separate from the original scout ticket."
      >
        <FollowOnDecisions />
      </Section>

      <Section
        id="portfolio"
        title="Portfolio outcomes"
        subtitle="What happened to the companies you funded — raising again, exited, or written off. Recording an exit here flows straight through to the scout's carry."
      >
        <PortfolioOutcomes />
      </Section>

      <Section
        id="exit-distributions"
        title="Exit distributions"
        subtitle="When a deal exits, the scout's carry share doesn't pay itself — work it here, blocked automatically until their paperwork is on file."
      >
        <ExitDistributions />
      </Section>

      <Section id="deployment-pacing" title="Deployment pacing" subtitle="Cumulative capital deployed vs. the pace needed to fully deploy the pool in 24 months.">
        <PacingChart />
      </Section>

      <Section
        id="scout-recruiting"
        title="Scout recruiting"
        subtitle="The network doesn't stay at 30 scouts on its own — nominate, vet, and sign new scouts here."
      >
        <ScoutRecruiting />
      </Section>

      <Section
        id="system-of-record"
        title="System of record"
        subtitle={`All ${totalMemos} records — company, scout, sector, check size, status, partner notes.`}
      >
        <DealTable />
      </Section>

      <div id="comms" className="grid scroll-mt-20 gap-4 lg:grid-cols-3">
        <Section title="Notifications" subtitle="Simulated — the real integration posts to Slack.">
          <NotificationFeed limit={12} />
        </Section>
        <Section title="Scout communications" subtitle={`${notifications.filter((n) => n.kind === "digest").length} monthly batches sent to date.`}>
          <MonthlyEmailStatus />
        </Section>
        <LpReportingStatus />
      </div>
    </div>
  );
}
