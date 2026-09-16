import type { Metadata } from "next";
import { Building2 } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { ComparisonTable } from "@/components/structure/comparison-table";
import { UrgencyTimeline } from "@/components/structure/urgency-timeline";
import { FUND_II_TARGET_LOW, FUND_II_TARGET_HIGH, SCOUT_POOL_SIZE, SCOUT_POOL_PCT_OF_FUND } from "@/lib/data";
import { formatUsdCompact, formatPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Fund Structure · Scout Fund OS",
  description: "In-fund carve-out vs. SPV governance for the Shapers Scout Fund.",
};

export default function StructurePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Building2}
        tagline="Component 5 of 7"
        title="Fund Structure"
        description="How the scout pool actually sits inside Shapers Fund II — a governance decision, not a detail. Two structural options are viable; only one fits the program's speed and the trust already built with the LP base."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Fund II target" value={`${formatUsdCompact(FUND_II_TARGET_LOW)}–${formatUsdCompact(FUND_II_TARGET_HIGH)}`} hint="target raise" />
        <StatTile label="Scout pool" value={formatUsdCompact(SCOUT_POOL_SIZE)} hint={`${formatPct(SCOUT_POOL_PCT_OF_FUND, 1)} of Fund II`} />
        <StatTile label="Structural options" value="2" hint="carve-out vs. fund-seeded SPVs" />
        <StatTile label="Recommendation" value="Option A" hint="in-fund carve-out" emphasis />
      </div>

      <Section
        title="Two viable structures"
        subtitle="Both keep the capital inside Fund II — they differ in how carry and cap-table exposure are isolated per deal."
      >
        <ComparisonTable />
      </Section>

      <Section
        title="Timing is the real risk"
        subtitle="The structure has to be settled before Fund II closes, not after."
      >
        <UrgencyTimeline />
      </Section>

      <ConnectionCallout slug="structure" />
    </div>
  );
}
