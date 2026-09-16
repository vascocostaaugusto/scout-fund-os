import type { Metadata } from "next";
import { LineChart as LineChartIcon } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { HeadlineCarryChart } from "@/components/charts/headline-carry-chart";
import { ScoutActivityChart } from "@/components/charts/scout-activity-chart";
import { SlaTrendChart } from "@/components/charts/sla-trend-chart";
import { CoverageMap } from "@/components/charts/coverage-map";
import { FollowOnFunnel } from "@/components/charts/follow-on-funnel";
import { RetentionChart } from "@/components/charts/retention-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fundedConversionRate,
  avgSlaHours,
  vpTrackScouts,
  fundIICarryAtMaturity,
  scoutCarryAtMaturity,
  coverageTags,
} from "@/lib/data";
import { formatPct, formatHours, formatUsdCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "Success Dashboard · Scout Fund OS",
  description: "KPIs and performance tracking across near, medium, and long-term horizons.",
};

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={LineChartIcon}
        tagline="Component 6 of 7"
        title="Success Dashboard"
        description="How the program is judged, across three time horizons — sourcing velocity today, conversion and retention over the next few cohorts, and the number that actually matters to LPs: the carry this sliver of capital ends up producing."
      />

      <HeadlineCarryChart />

      <Section title="Performance by horizon" subtitle="Each horizon answers a different question about whether the program is working.">
        <Tabs defaultValue="near">
          <TabsList>
            <TabsTrigger value="near">Near-term</TabsTrigger>
            <TabsTrigger value="medium">Medium-term</TabsTrigger>
            <TabsTrigger value="long">Long-term</TabsTrigger>
          </TabsList>

          <TabsContent value="near" className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatTile label="% of scout deals funded" value={formatPct(fundedConversionRate, 1)} hint="of all memos submitted" />
              <StatTile
                label="Avg. SLA response"
                value={formatHours(avgSlaHours)}
                deltaTone={avgSlaHours <= 48 ? "good" : "bad"}
                delta={avgSlaHours <= 48 ? "Under 48h target" : "Over 48h target"}
              />
              <StatTile label="Coverage tags added" value={`${coverageTags.length}`} hint="sub-verticals with active deal flow" />
              <StatTile label="Reporting cadence" value="Weekly" hint="SLA + pipeline, partner-facing" />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ScoutActivityChart />
              <SlaTrendChart />
            </div>
            <CoverageMap />
          </TabsContent>

          <TabsContent value="medium" className="flex flex-col gap-4 pt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <FollowOnFunnel />
              </div>
              <StatTile
                label="Scouts on VP track"
                value={`${vpTrackScouts}`}
                hint="converted to Venture Partner / future GP track"
                emphasis
              />
            </div>
            <RetentionChart />
          </TabsContent>

          <TabsContent value="long" className="flex flex-col gap-4 pt-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatTile label="Fund II carry at maturity" value={formatUsdCompact(fundIICarryAtMaturity)} hint="modeled, whole fund, Year 8" />
              <StatTile
                label="Scout-sourced carry"
                value={formatUsdCompact(scoutCarryAtMaturity)}
                hint="modeled, scout book, Year 8"
                emphasis
              />
              <StatTile label="Whole-fund MOIC" value="3.0x" hint="blended gross assumption" />
              <StatTile label="Scout-book MOIC" value="4.5x" hint="earlier, cheaper entry assumption" />
            </div>
            <p className="rounded-xl border border-dashed border-border bg-card p-4 text-xs leading-relaxed text-muted-foreground">
              See the headline chart above — the scout program is modeled to punch well above its capital weight in
              Fund II&apos;s carry pool, because scout checks land earlier and cheaper into the same companies that
              would otherwise only be reachable at a priced round.
            </p>
          </TabsContent>
        </Tabs>
      </Section>

      <ConnectionCallout slug="dashboard" />
    </div>
  );
}
