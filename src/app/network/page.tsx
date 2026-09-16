import type { Metadata } from "next";
import { Users } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { ScoutActivityChart } from "@/components/charts/scout-activity-chart";
import { PoolActivity } from "@/components/incentives/pool-activity";
import { LiveRosterStats, LiveRosterTable } from "@/components/network/live-roster";

export const metadata: Metadata = {
  title: "Scout Network · Scout Fund OS",
  description: "The scout roster behind the Shapers Scout Fund.",
};

export default function NetworkPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Users}
        tagline="Program component"
        title="Scout Network"
        description="The active roster, tiered by coverage — who's sourcing, and how much they've moved."
      />

      <LiveRosterStats />

      <Section title="Roster" subtitle="Every scout and their sourcing activity this cohort — aggregated live from the deal pipeline. Tickets draw from the shared pool, not a personal ceiling.">
        <LiveRosterTable />
      </Section>

      <Section title="Sourcing activity" subtitle="Shading tracks tier — Tier 1 operators carry the widest network and, expectedly, the highest memo volume.">
        <ScoutActivityChart />
      </Section>

      <Section title="Pool activity" subtitle="Every scout draws from the same $6M evergreen pool — this is who's actually put tickets to work.">
        <PoolActivity />
      </Section>
    </div>
  );
}
