"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { retentionByCohort } from "@/lib/data";
import { ChartTooltip } from "./chart-tooltip";

const data = retentionByCohort.map((r, i) => ({
  cohort: r.cohort,
  actual: r.projected ? null : r.retentionPct,
  projected: i > 0 ? r.retentionPct : null,
}));
// bridge the two series at the last actual point so the dashed segment connects
const lastActualIdx = data.findIndex((d) => d.actual == null) - 1;
if (lastActualIdx >= 0) data[lastActualIdx].projected = data[lastActualIdx].actual;

export function RetentionChart() {
  return (
    <div className="h-72 w-full rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Scout retention by cohort</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-px w-3 border-t border-dashed border-muted-foreground" />
          Projected
        </span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 4, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="cohort"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
            domain={[0, 100]}
            unit="%"
          />
          <Tooltip cursor={{ stroke: "var(--border)" }} content={<ChartTooltip formatter={(v) => `${v}% retained`} />} />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 2, stroke: "var(--card)" }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="projected"
            stroke="var(--chart-1)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 4, fill: "var(--card)", strokeWidth: 2, stroke: "var(--chart-1)" }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
