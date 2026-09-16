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
        tagline="Component 5 of 6"
        title="Fund Structure"
        description="How the scout pool actually sits inside Shapers Fund II — a governance decision, not a detail. One structure fits the program's speed and the trust already built with the LP base; the alternative was considered and set aside."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Fund II target" value={`${formatUsdCompact(FUND_II_TARGET_LOW)}–${formatUsdCompact(FUND_II_TARGET_HIGH)}`} hint="target raise" />
        <StatTile label="Scout pool" value={formatUsdCompact(SCOUT_POOL_SIZE)} hint={`${formatPct(SCOUT_POOL_PCT_OF_FUND, 1)} of Fund II`} />
        <StatTile label="Recommendation" value="Option A" hint="in-fund carve-out" emphasis />
        <StatTile label="Settle by" value="Fund II close" hint="not retrofittable after" />
      </div>

      <Section
        title="The structure"
        subtitle="Capital stays inside Fund II either way — the question was ever only how carry and cap-table exposure get isolated per deal, and Option A wins that on every axis that matters at this scale."
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
