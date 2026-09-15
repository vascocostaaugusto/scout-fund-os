"use client";

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { totalFunded, followOnParticipationRate } from "@/lib/data";
import { formatPct } from "@/lib/format";
import { ChartTooltip } from "./chart-tooltip";

const followOnCount = Math.round(totalFunded * followOnParticipationRate);

const data = [
  { name: "Funded by scout", value: totalFunded, fill: "var(--chart-2)" },
  { name: "Follow-on w/ Shapers", value: followOnCount, fill: "var(--chart-1)" },
];

export function FollowOnFunnel() {
  return (
    <div className="flex h-72 w-full flex-col rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Follow-on participation</span>
        <span className="text-xs font-medium text-primary">{formatPct(followOnParticipationRate, 0)}</span>
      </div>
      <p className="mb-2 text-xs text-muted-foreground">
        Share of scout-funded companies raising a follow-on round Shapers participates in.
      </p>
      <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
          <Tooltip content={<ChartTooltip formatter={(v, n) => `${n}: ${v} companies`} />} />
          <Funnel dataKey="value" data={data} isAnimationActive nameKey="name">
            <LabelList
              position="right"
              dataKey="name"
              fill="var(--foreground)"
              stroke="none"
              fontSize={12}
            />
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
}
