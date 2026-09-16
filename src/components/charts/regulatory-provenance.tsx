"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { FileCheck2 } from "lucide-react";
import { regulatoryFilings, latestFiling, nextFilingDue } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";

const data = regulatoryFilings.map((f) => ({
  quarter: f.quarter,
  "Scout book": f.scoutBookMoicToDate,
  "Whole fund": f.wholeFundMoicToDate,
}));

export function RegulatoryProvenance() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-start justify-between gap-4">
        <div>
          <span className="text-sm font-medium text-foreground">MOIC-to-date, by quarterly filing</span>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            The maturity model above isn&apos;t a standalone guess — it&apos;s calibrated each quarter against
            these marks, which are the same numbers Fund II reports to regulators. No separate process to keep in
            sync, nothing to go stale.
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-2.5 py-1 text-[11px] font-medium text-primary sm:flex">
          <FileCheck2 className="size-3" />
          Live-fed
        </div>
      </div>

      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="quarter"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
              tickFormatter={(v) => `${v}x`}
            />
            <Tooltip
              cursor={{ stroke: "var(--border)" }}
              content={<ChartTooltip formatter={(v, n) => `${n}: ${v}x`} />}
            />
            <Legend
              verticalAlign="top"
              height={24}
              align="right"
              wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
            />
            <Line
              type="monotone"
              dataKey="Scout book"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 2, stroke: "var(--card)" }}
            />
            <Line
              type="monotone"
              dataKey="Whole fund"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3, fill: "var(--chart-2)", strokeWidth: 2, stroke: "var(--card)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-[11px] text-muted-foreground">
        <span>
          Latest: <span className="text-foreground">{latestFiling.filingRef}</span>, filed {formatDate(latestFiling.filedAt)}
        </span>
        <span className="text-border">·</span>
        <span>
          Next update: {nextFilingDue.quarter}, due {formatDate(nextFilingDue.dueAt)}
        </span>
      </div>
    </div>
  );
}
