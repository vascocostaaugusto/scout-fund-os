import { totalFunded, followOnParticipationRate } from "@/lib/data";
import { formatPct } from "@/lib/format";

const followOnCount = Math.round(totalFunded * followOnParticipationRate);

const STAGES = [
  { label: "Funded by scout", value: totalFunded, widthPct: 100, tone: "bg-chart-2" },
  { label: "Follow-on w/ Shapers", value: followOnCount, widthPct: Math.max((followOnCount / totalFunded) * 100, 28), tone: "bg-primary" },
];

export function FollowOnFunnel() {
  return (
    <div className="flex h-72 w-full flex-col rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Follow-on participation</span>
        <span className="text-xs font-medium text-primary">{formatPct(followOnParticipationRate, 0)}</span>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Share of scout-funded companies raising a follow-on round Shapers participates in.
      </p>
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {STAGES.map((s, i) => (
          <div key={s.label} className="flex w-full flex-col items-center gap-1.5">
            <div
              className={`flex h-11 items-center justify-center rounded-md ${s.tone} text-sm font-semibold tabular-nums text-background`}
              style={{ width: `${s.widthPct}%` }}
            >
              {s.value}
            </div>
            <span className="text-xs text-muted-foreground">{s.label}</span>
            {i === 0 ? <span className="text-muted-foreground/40">↓</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}
