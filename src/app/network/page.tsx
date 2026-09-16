import type { Metadata } from "next";
import { Users } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ScoutActivityChart } from "@/components/charts/scout-activity-chart";
import { PoolActivity } from "@/components/incentives/pool-activity";
import { TierBadge } from "@/components/network/tier-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scouts, scoutStats, totalScouts, activeScouts, capitalDeployedUsd, scoutCountByTier, repeatFunderScouts } from "@/lib/data";
import { formatUsd, formatUsdCompact, formatPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Scout Network · Scout Fund OS",
  description: "The scout roster behind the Shapers Scout Fund.",
};

export default function NetworkPage() {
  const roster = [...scouts].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Users}
        tagline="Program component"
        title="Scout Network"
        description="The active roster, tiered by coverage — who's sourcing, and how much they've moved."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Active scouts" value={`${activeScouts}`} hint={`of ${totalScouts} total in Cohort 1`} />
        <StatTile label="Tier split" value={`${scoutCountByTier[1]} / ${scoutCountByTier[2]} / ${scoutCountByTier[3]}`} hint="operators · founders · specialists" />
        <StatTile label="Capital deployed" value={formatUsdCompact(capitalDeployedUsd)} hint="from the shared $6M pool" emphasis />
        <StatTile label="Repeat scouts" value={`${repeatFunderScouts}`} hint="funded 2+ deals" />
      </div>

      <Section title="Roster" subtitle="Every scout and their sourcing activity this cohort — aggregated live from the deal pipeline. Tickets draw from the shared pool, not a personal ceiling.">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Scout</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead className="text-right">Deployed</TableHead>
                <TableHead className="text-right">Memos</TableHead>
                <TableHead className="text-right">Funded</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((s) => {
                const stats = scoutStats.get(s.id)!;
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{s.name}</span>
                        <span className="text-xs text-muted-foreground">{s.title} · {s.affiliation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TierBadge tier={s.tier} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.coverage}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {stats.capitalDeployedUsd ? formatUsd(stats.capitalDeployedUsd) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{stats.memosSubmitted}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{stats.dealsFunded}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-muted-foreground">
                      {stats.memosSubmitted ? formatPct(stats.conversionRate, 0) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
