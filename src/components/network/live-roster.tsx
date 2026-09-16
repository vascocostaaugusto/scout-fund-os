"use client";

import { useLiveStats } from "@/lib/use-live-stats";
import { scouts, totalScouts, activeScouts, scoutCountByTier } from "@/lib/data";
import { StatTile } from "@/components/detail/stat-tile";
import { TierBadge } from "@/components/network/tier-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatUsd, formatUsdCompact, formatPct } from "@/lib/format";

export function LiveRosterStats() {
  const { repeatFunderScouts, capitalDeployedUsd } = useLiveStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile label="Active scouts" value={`${activeScouts}`} hint={`of ${totalScouts} total in Cohort 1`} />
      <StatTile
        label="Tier split"
        value={`${scoutCountByTier[1]} / ${scoutCountByTier[2]} / ${scoutCountByTier[3]}`}
        hint="operators · founders · specialists"
      />
      <StatTile label="Capital deployed" value={formatUsdCompact(capitalDeployedUsd)} hint="from the shared $6M pool" emphasis />
      <StatTile label="Repeat scouts" value={`${repeatFunderScouts}`} hint="funded 2+ deals" />
    </div>
  );
}

export function LiveRosterTable() {
  const { scoutStats } = useLiveStats();
  const roster = [...scouts].sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name));

  return (
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
  );
}
