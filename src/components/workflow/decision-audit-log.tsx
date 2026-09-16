"use client";

import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { scoutById } from "@/lib/data";
import type { DealStage } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatDateTime } from "@/lib/format";
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

// Every deal that has passed first look has a decision attached to it —
// this is that decision, formalized as an audit-log row rather than left
// implicit in the kanban. reviewingPartner / firstLookAt / partnerNotes
// already exist on each Deal record; this just surfaces them as who / when / why.
const DECIDED_STAGES: DealStage[] = [
  "declined",
  "approved",
  "check_written",
  "follow_on_watch",
  "exited",
  "dead",
];

const DECISION_LABEL: Record<string, string> = {
  declined: "Declined",
  approved: "Approved",
  check_written: "Approved",
  follow_on_watch: "Approved",
  exited: "Approved",
  dead: "Approved",
};

const DECISION_BADGE: Record<string, string> = {
  declined: "bg-critical/15 text-critical",
  approved: "bg-success/15 text-success",
};

const FILTERS = [
  { value: "all", label: "All decisions" },
  { value: "declined", label: "Declined only" },
  { value: "approved", label: "Approved only" },
];

export function DecisionAuditLog() {
  const [filter, setFilter] = useState("all");
  const { deals } = useDealStore();

  const rows = useMemo(() => {
    const decided = deals.filter((d) => DECIDED_STAGES.includes(d.stage) && d.firstLookAt);
    const filtered =
      filter === "all"
        ? decided
        : decided.filter((d) => (filter === "declined" ? d.stage === "declined" : d.stage !== "declined"));
    return [...filtered].sort((a, b) => new Date(b.firstLookAt!).getTime() - new Date(a.firstLookAt!).getTime());
  }, [filter, deals]);

  const declinedCount = deals.filter((d) => d.stage === "declined").length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {rows.length} logged decisions · {declinedCount} declined, each with a partner and a reason on file
        </span>
        <Select value={filter} onValueChange={(v) => v && setFilter(v)}>
          <SelectTrigger className="w-40">
            <SelectValue>{(v: string) => FILTERS.find((f) => f.value === v)?.label ?? v}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="max-h-[420px] overflow-y-auto">
          <Table className="table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[16%]">Company</TableHead>
                <TableHead className="w-[10%]">Decision</TableHead>
                <TableHead className="w-[16%]">Decided by</TableHead>
                <TableHead className="w-[16%]">Decided at</TableHead>
                <TableHead className="w-[42%]">Rationale</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="whitespace-normal font-medium text-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      {d.companyName}
                      {d.conflictDisclosed ? (
                        <span title={d.conflictNotes ?? "Conflict of interest disclosed"}>
                          <ShieldAlert className="size-3.5 shrink-0 text-critical" aria-label="Conflict disclosed" />
                        </span>
                      ) : null}
                    </span>
                    <div className="text-xs font-normal text-muted-foreground">
                      sourced by {scoutById.get(d.scoutId)?.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        DECISION_BADGE[d.stage === "declined" ? "declined" : "approved"],
                      )}
                    >
                      {DECISION_LABEL[d.stage]}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-normal text-sm text-muted-foreground">
                    {d.reviewingPartner}
                  </TableCell>
                  <TableCell className="whitespace-normal text-xs text-muted-foreground">
                    {formatDateTime(d.firstLookAt!)}
                  </TableCell>
                  <TableCell className="whitespace-normal text-xs leading-relaxed text-muted-foreground">
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
