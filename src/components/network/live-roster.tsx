"use client";

import { useLiveStats } from "@/lib/use-live-stats";
import { scouts, totalScouts, coverageAreaCount } from "@/lib/data";
import { StatTile } from "@/components/detail/stat-tile";
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
  const { repeatFunderScouts, capitalDeployedUsd, activeSubmitters } = useLiveStats();

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatTile label="Still submitting" value={`${activeSubmitters}`} hint={`of ${totalScouts} scouts, last 90 days`} />
      <StatTile label="Coverage areas" value={`${coverageAreaCount}`} hint="distinct verticals & geographies owned" />
      <StatTile label="Capital deployed" value={formatUsdCompact(capitalDeployedUsd)} hint="from the shared $6M pool" emphasis />
      <StatTile label="Repeat scouts" value={`${repeatFunderScouts}`} hint="funded 2+ deals" />
    </div>
  );
}

export function LiveRosterTable() {
  const { scoutStats } = useLiveStats();
  const roster = [...scouts].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Scout</TableHead>
            <TableHead>Profile</TableHead>
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
                <TableCell className="text-sm text-muted-foreground">{s.profile}</TableCell>
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
