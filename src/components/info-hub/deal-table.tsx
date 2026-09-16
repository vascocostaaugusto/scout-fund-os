"use client";

import { useMemo, useState } from "react";
import { deals, scoutById } from "@/lib/data";
import type { DealStage } from "@/lib/data";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const STAGES = Object.keys(STAGE_LABEL) as DealStage[];

export function DealTable() {
  const [stageFilter, setStageFilter] = useState<string>("all");

  const rows = useMemo(() => {
    const filtered = stageFilter === "all" ? deals : deals.filter((d) => d.stage === stageFilter);
    return [...filtered].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [stageFilter]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{rows.length} of {deals.length} records</span>
        <Select value={stageFilter} onValueChange={(v) => v && setStageFilter(v)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {STAGE_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="max-h-[520px] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Scout</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Check</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Partner notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium text-foreground">{d.companyName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {scoutById.get(d.scoutId)?.name}
                  </TableCell>
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
                  <TableCell className="max-w-56 truncate text-xs text-muted-foreground" title={d.partnerNotes}>
                    {d.partnerNotes}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
