"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, Legend } from "recharts";
import { deploymentPacing, SCOUT_POOL_SIZE, PACING_TARGET_MONTHS } from "@/lib/data";
import { formatUsdCompact } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";

const data = deploymentPacing.map((p) => ({
  month: p.monthIndex,
  Actual: p.actualCumulativeUsd,
  Target: p.targetCumulativeUsd,
}));

const todayMonthIndex = deploymentPacing.filter((p) => p.actualCumulativeUsd != null).length - 1;

export function PacingChart() {
  return (
    <div className="flex h-80 w-full flex-col rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Deployment pacing</span>
        <span className="text-xs text-muted-foreground">
          Target: full {formatUsdCompact(SCOUT_POOL_SIZE)} pool in {PACING_TARGET_MONTHS} months
        </span>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">
        Cumulative capital deployed vs. the straight-line pace needed to fully deploy the pool on schedule.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            tickFormatter={(m) => `M${m}`}
            interval={2}
          />
          <YAxis
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(v) => formatUsdCompact(v)}
          />
          <ReferenceLine
            x={todayMonthIndex}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{ value: "Today", position: "top", fill: "var(--muted-foreground)", fontSize: 11 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--border)" }}
            content={<ChartTooltip formatter={(v, n) => `${n}: ${formatUsdCompact(Number(v))}`} />}
          />
          <Legend
            verticalAlign="top"
            height={24}
            align="right"
            wrapperStyle={{ fontSize: 11, color: "var(--muted-foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="Target"
            stroke="var(--chart-2)"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Actual"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
