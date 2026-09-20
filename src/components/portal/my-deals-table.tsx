"use client";

import { useDealStore } from "@/lib/deal-store";
import { formatUsd, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, STAGE_BADGE } from "@/lib/stage-labels";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MyDealsTable({ scoutId }: { scoutId: string }) {
  const { deals } = useDealStore();
  const rows = deals
    .filter((d) => d.scoutId === scoutId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        No deals submitted yet — your first one will show up here as soon as you submit it.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Company</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Check</TableHead>
            <TableHead>Submitted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium text-foreground">{d.companyName}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{d.sector}</TableCell>
              <TableCell>
                <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", STAGE_BADGE[d.stage])}>
                  {STAGE_LABEL[d.stage]}
                </span>
              </TableCell>
              <TableCell className="text-right tabular-nums text-sm">
                {d.checkSizeUsd ? formatUsd(d.checkSizeUsd) : "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">{formatDate(d.submittedAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
