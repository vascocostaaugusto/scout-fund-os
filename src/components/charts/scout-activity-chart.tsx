"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { scouts, scoutStats } from "@/lib/data";
import { ChartTooltip } from "./chart-tooltip";

const data = scouts
  .map((s) => ({
    name: s.name.split(" ")[0] + " " + s.name.split(" ")[1][0] + ".",
    memos: scoutStats.get(s.id)?.memosSubmitted ?? 0,
    funded: scoutStats.get(s.id)?.dealsFunded ?? 0,
    tier: s.tier,
  }))
  .sort((a, b) => b.memos - a.memos);

const TIER_OPACITY: Record<number, number> = { 1: 1, 2: 0.72, 3: 0.5 };

export function ScoutActivityChart() {
  return (
    <div className="h-80 w-full rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Memos submitted per scout</span>
        <span className="text-xs text-muted-foreground">Program to date</span>
      </div>
      <ResponsiveContainer width="100%" height="88%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
            interval={0}
            angle={-40}
            textAnchor="end"
            height={54}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: "var(--accent)" }}
            content={
              <ChartTooltip
                formatter={(value, name) => (name === "memos" ? `${value} memos submitted` : `${value}`)}
              />
            }
          />
          <Bar dataKey="memos" radius={[4, 4, 0, 0]} maxBarSize={22}>
            {data.map((d, i) => (
              <Cell key={i} fill="var(--chart-1)" fillOpacity={TIER_OPACITY[d.tier]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
