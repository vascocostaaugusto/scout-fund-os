"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, ShieldAlert } from "lucide-react";
import { scoutById } from "@/lib/data";
import type { DealStage } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { STAGE_LABEL, STAGE_BADGE, STAGE_ORDER } from "@/lib/stage-labels";
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

const STAGES = STAGE_ORDER;

type SortKey = "company" | "check" | "submitted";
type SortDir = "asc" | "desc";

const SORTABLE: { key: SortKey; label: string; className?: string }[] = [
  { key: "company", label: "Company" },
  { key: "check", label: "Check", className: "text-right" },
  { key: "submitted", label: "Submitted" },
];

export function DealTable() {
  const { deals } = useDealStore();
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: "submitted", dir: "desc" });

  function toggleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );
  }

  const rows = useMemo(() => {
    const filtered = stageFilter === "all" ? deals : deals.filter((d) => d.stage === stageFilter);
    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sort.key === "company") cmp = a.companyName.localeCompare(b.companyName);
      else if (sort.key === "check") cmp = (a.checkSizeUsd ?? -1) - (b.checkSizeUsd ?? -1);
      else cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [stageFilter, sort, deals]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{rows.length} of {deals.length} records</span>
        <Select value={stageFilter} onValueChange={(v) => v && setStageFilter(v)}>
          <SelectTrigger className="w-44">
            <SelectValue>{(v: string) => (v === "all" ? "All stages" : STAGE_LABEL[v as DealStage])}</SelectValue>
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
                {SORTABLE.map((col) => (
                  <TableHead key={col.key} className={col.className}>
                    <button
                      type="button"
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-1 transition-colors hover:text-foreground",
                        col.className === "text-right" && "flex-row-reverse",
                      )}
                    >
                      {col.label}
                      {sort.key === col.key ? (
                        sort.dir === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-30" />
                      )}
                    </button>
                  </TableHead>
                ))}
                <TableHead>Scout</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Partner notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    No records in this stage yet — the program is 20 months into its 24-month
                    window, so exits in particular are still early.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {d.companyName}
                        {d.conflictDisclosed ? (
                          <span title={d.conflictNotes ?? "Conflict of interest disclosed"}>
                            <ShieldAlert
                              className="size-3.5 shrink-0 text-critical"
                              aria-label="Conflict of interest disclosed"
                            />
                          </span>
                        ) : null}
                      </span>
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {d.checkSizeUsd ? formatUsd(d.checkSizeUsd) : "—"}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{formatDate(d.submittedAt)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {scoutById.get(d.scoutId)?.name}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{d.sector}</TableCell>
                    <TableCell>
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", STAGE_BADGE[d.stage])}>
                        {STAGE_LABEL[d.stage]}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-56 truncate text-xs text-muted-foreground" title={d.partnerNotes}>
                      {d.partnerNotes}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
