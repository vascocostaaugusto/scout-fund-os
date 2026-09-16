"use client";

import { Mail } from "lucide-react";
import { scouts, notifications } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatDate } from "@/lib/format";

const TODAY = new Date("2026-09-16T09:00:00Z").getTime();
const THIRTY_DAYS = 30 * 24 * 3600_000;

export function MonthlyEmailStatus() {
  const { deals } = useDealStore();
  const digestEvents = notifications.filter((n) => n.kind === "digest");
  const lastDigest = digestEvents[0];

  const rows = scouts.map((s) => {
    const own = deals.filter((d) => d.scoutId === s.id);
    const recentActivity = own.some((d) => TODAY - new Date(d.submittedAt).getTime() <= THIRTY_DAYS);
    return { scout: s, recentActivity };
  });

  const recapCount = rows.filter((r) => r.recentActivity).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center gap-2">
        <Mail className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Monthly scout emails</span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        {lastDigest ? `Last batch sent ${formatDate(lastDigest.ts)} — ` : ""}
        {recapCount} pipeline recaps, {rows.length - recapCount} check-in nudges this cycle.
      </p>
      <div className="flex max-h-72 flex-col divide-y divide-border overflow-y-auto">
        {rows.map(({ scout, recentActivity }) => (
          <div key={scout.id} className="flex items-center justify-between py-2 text-xs">
            <span className="text-foreground">{scout.name}</span>
            <span className={recentActivity ? "text-success" : "text-muted-foreground"}>
              {recentActivity ? "Pipeline recap" : "Check-in nudge"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
