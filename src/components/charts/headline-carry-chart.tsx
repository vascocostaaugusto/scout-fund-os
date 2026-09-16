import {
  scoutBookMoicToDate,
  latestFiling,
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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className={`text-base font-semibold tabular-nums ${emphasis ? "text-primary" : "text-foreground"}`}>
          {formatPct(pct, 1)}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${emphasis ? "bg-primary" : "bg-chart-2"}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
      <span className="text-[11px] text-muted-foreground">{hint}</span>
    </div>
  );
}

export function HeadlineCarryChart() {
  const multiple = scoutCarryShareOfFund / SCOUT_POOL_PCT_OF_FUND;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-accent/60 to-card p-7">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Today — {latestFiling.filingRef}
        </span>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-5xl font-semibold tabular-nums text-primary">{scoutBookMoicToDate.toFixed(2)}×</span>
            <span className="text-xs text-muted-foreground">Scout-book MOIC to date</span>
          </div>
          <div className="flex flex-col gap-0.5 pb-1">
            <span className="text-2xl font-semibold tabular-nums text-foreground">{latestFiling.wholeFundMoicToDate.toFixed(2)}×</span>
            <span className="text-xs text-muted-foreground">Whole-fund MOIC to date</span>
          </div>
        </div>
        <p className="mt-1 max-w-md text-sm leading-snug text-muted-foreground">
          Real, marked figures — not modeled — computed from the actual funded deals and the fund&apos;s own
          latest quarterly filing. The scout book is already marking up faster than the whole fund, this early
          in the cohort.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card/60 p-5">
        <div className="mb-4 flex items-baseline justify-between gap-3">
          <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Projected — modeled at Fund II maturity (Year 8)
          </span>
          <span className="text-sm font-semibold tabular-nums text-foreground">{multiple.toFixed(2)}× capital weight</span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Meter label="Capital represented" pct={SCOUT_POOL_PCT_OF_FUND} hint="Scout pool as a share of Fund II" />
          <Meter label="Carry contributed" pct={scoutCarryShareOfFund} emphasis hint="Scout-sourced carry as a share of Fund II's total" />
        </div>
        <p className="mt-4 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
          Model assumptions: whole-fund blended gross MOIC of {MATURITY_WHOLE_FUND_MOIC.toFixed(1)}x vs. a scout-book
          blended MOIC of {MATURITY_SCOUT_BOOK_MOIC.toFixed(1)}x — reflecting earlier, cheaper entry into the same
          eventual breakout companies — at a standard {formatPct(CARRY_RATE, 0)} carry rate applied fund-wide. See
          the Long-term tab for the quarterly filing history this is calibrated against.
        </p>
      </div>
    </div>
  );
}
