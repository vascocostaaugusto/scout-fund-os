"use client";

import type { DealStage } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STAGE_LABEL: Record<DealStage, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  approved: "Approved",
  declined: "Declined",
  check_written: "Check Written",
  follow_on_watch: "Follow-on Watch",
  exited: "Exited",
  dead: "Dead",
};

const STAGE_BADGE: Record<DealStage, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  under_review: "bg-warning/15 text-warning",
  approved: "bg-primary/15 text-primary",
  declined: "bg-critical/15 text-critical",
  check_written: "bg-primary/15 text-primary",
  follow_on_watch: "bg-primary/15 text-primary",
  exited: "bg-success/15 text-success",
  dead: "bg-critical/15 text-critical",
};

export function MyDealsTable({ scoutId }: { scoutId: string }) {
  const { deals } = useDealStore();
  const rows = deals
    .filter((d) => d.scoutId === scoutId)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        No memos submitted yet — your first intro will show up here as soon as you submit it.
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
            <TableHead>Right-of-first-look</TableHead>
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
              <TableCell className="text-xs text-muted-foreground">{d.rightOfFirstLook ? "Active" : "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
