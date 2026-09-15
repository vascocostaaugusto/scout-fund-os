import {
  SCOUT_POOL_PCT_OF_FUND,
  scoutCarryShareOfFund,
  MATURITY_WHOLE_FUND_MOIC,
  MATURITY_SCOUT_BOOK_MOIC,
  CARRY_RATE,
} from "@/lib/data";
import { formatPct } from "@/lib/format";

const AXIS_MAX = 0.14; // 14% — headroom above the larger of the two bars

function Meter({
  label,
  pct,
  emphasis,
  hint,
}: {
  label: string;
  pct: number;
  emphasis?: boolean;
  hint: string;
}) {
  const widthPct = Math.min((pct / AXIS_MAX) * 100, 100);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className={`text-2xl font-semibold tabular-nums ${emphasis ? "text-primary" : "text-foreground"}`}>
          {formatPct(pct, 1)}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${emphasis ? "bg-primary" : "bg-chart-2"}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </div>
  );
}

export function HeadlineCarryChart() {
  const multiple = scoutCarryShareOfFund / SCOUT_POOL_PCT_OF_FUND;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-accent/60 to-card p-7">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Modeled at Fund II maturity (Year 8)
        </span>
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-5xl font-semibold tabular-nums text-primary">{multiple.toFixed(1)}×</span>
          <span className="max-w-md text-sm leading-snug text-muted-foreground">
            the carry the scout program is modeled to contribute, relative to the sliver of capital it represents.
          </span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Meter
          label="Capital represented"
          pct={SCOUT_POOL_PCT_OF_FUND}
          hint="Scout pool as a share of Fund II"
        />
        <Meter
          label="Carry contributed"
          pct={scoutCarryShareOfFund}
          emphasis
          hint="Scout-sourced carry as a share of Fund II's total"
        />
      </div>

      <p className="border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
        Model assumptions: whole-fund blended gross MOIC of {MATURITY_WHOLE_FUND_MOIC.toFixed(1)}x vs. a scout-book
        blended MOIC of {MATURITY_SCOUT_BOOK_MOIC.toFixed(1)}x — reflecting earlier, cheaper entry into the same
        eventual breakout companies — at a standard {formatPct(CARRY_RATE, 0)} carry rate applied fund-wide.
      </p>
    </div>
  );
}
