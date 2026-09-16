import type { Metadata } from "next";
import { Users } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { ScoutActivityChart } from "@/components/charts/scout-activity-chart";
import { TierBadge } from "@/components/network/tier-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { scouts, scoutStats, totalScouts, activeScouts, vpTrackScouts } from "@/lib/data";
import { formatUsd, formatPct } from "@/lib/format";

const TIER_COPY = [
  {
    tier: 1 as const,
    name: "Shapers Club Operators",
    range: "8–10 scouts",
    body:
      "Existing LP-operators — fintech founders from companies like Qonto, Wise, N26, and Bitpanda — each owning a vertical or a geography. They already have the Shapers relationship and the founder network; the program gives that a formal channel.",
  },
  {
    tier: 2 as const,
    name: "Portfolio Founders",
    range: "3–4 scouts",
    body:
      "Founders of existing Shapers portfolio companies, scouting peer founders in adjacent fintech categories. Highest signal-to-noise: they're evaluating people they'd actually want as neighbors on a cap table.",
  },
  {
    tier: 3 as const,
    name: "Category Specialists",
    range: "2–3 scouts",
    body:
      "Dedicated scouts in crypto and stablecoin infrastructure — the one vertical where the core team's network is thinnest today. A deliberate patch, not a general-purpose tier.",
  },
];

export const metadata: Metadata = {
  title: "Scout Network · Scout Fund OS",
  description: "The tiered scout recruiting model behind the Shapers Scout Fund.",
};

export default function NetworkPage() {
  const roster = [...scouts].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Users}
        tagline="Component 1 of 7"
        title="Scout Network"
        description="A three-tier recruiting model that converts the Shapers Club's existing operator relationships into a structured sourcing engine, patched with dedicated coverage where the core team's network runs thin."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Active scouts" value={`${activeScouts}`} hint={`of ${totalScouts} total in Cohort 1`} />
        <StatTile label="Cohort target" value="12–15" hint="active scouts per 18–24 month cohort" />
        <StatTile label="VP-track conversions" value={`${vpTrackScouts}`} hint="scouts promoted to Venture Partner track" emphasis />
        <StatTile label="Tiers" value="3" hint="operators · founders · specialists" />
      </div>

      <Section title="Three tiers, one mandate" subtitle="Each tier solves a different sourcing problem — coverage breadth, founder-level trust, or a specific thesis gap.">
        <div className="grid gap-4 lg:grid-cols-3">
          {TIER_COPY.map((t) => (
            <div key={t.tier} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <TierBadge tier={t.tier} />
                <span className="text-xs text-muted-foreground">{t.range}</span>
              </div>
              <div className="text-sm font-semibold text-foreground">{t.name}</div>
              <p className="text-xs leading-relaxed text-muted-foreground">{t.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Roster" subtitle="Every scout, their allocation ceiling, and sourcing activity this cohort — aggregated live from the deal pipeline.">
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Scout</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Coverage</TableHead>
                <TableHead className="text-right">Allocation</TableHead>
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
                        <span className="font-medium text-foreground">
                          {s.name}
                          {s.status === "vp-track" ? (
                            <span className="ml-2 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
                              VP track
                            </span>
                          ) : null}
                        </span>
                        <span className="text-xs text-muted-foreground">{s.title} · {s.affiliation}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <TierBadge tier={s.tier} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.coverage}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">{formatUsd(s.allocationUsd)}</TableCell>
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

      <ConnectionCallout slug="network" />
    </div>
  );
}
