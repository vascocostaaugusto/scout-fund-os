"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from "recharts";
import { responseTimeTrend } from "@/lib/data";
import { ChartTooltip } from "./chart-tooltip";

export function ResponseTrendChart() {
  return (
    <div className="h-72 w-full rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">First-look response time</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="h-px w-3 border-t border-dashed border-critical" />
          48h target
        </span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={responseTimeTrend} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="week"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={30}
            domain={[0, 60]}
          />
          <ReferenceLine y={48} stroke="var(--critical)" strokeDasharray="3 3" strokeWidth={1} />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={<ChartTooltip formatter={(v) => `${v}h avg. response`} />}
          />
          <Line
            type="monotone"
            dataKey="avgHours"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--chart-1)", strokeWidth: 2, stroke: "var(--card)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
