import {
  SCOUT_POOL_SIZE,
  capitalDeployedUsd,
  PACING_TARGET_MONTHS,
  PACING_MONTHLY_TARGET_USD,
  TICKET_SIZE_MIN,
  TICKET_SIZE_MAX,
} from "@/lib/data";
import { formatUsdCompact, formatPct } from "@/lib/format";

export function CapitalFunnel() {
  const deployedPct = capitalDeployedUsd / SCOUT_POOL_SIZE;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card/60 px-5 py-4">
      <span className="text-xs font-medium text-muted-foreground">
        One shared, evergreen pool — no per-scout ceiling
      </span>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-foreground">
            {formatUsdCompact(capitalDeployedUsd)} deployed of {formatUsdCompact(SCOUT_POOL_SIZE)}
          </span>
          <span className="text-sm font-semibold tabular-nums text-primary">{formatPct(deployedPct, 0)}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(deployedPct, 1) * 100}%` }} />
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Every scout draws {formatUsdCompact(TICKET_SIZE_MIN)}–{formatUsdCompact(TICKET_SIZE_MAX)} tickets from the
        same {formatUsdCompact(SCOUT_POOL_SIZE)} pool — there&apos;s no individual budget to run out of. The pool
        targets full deployment within {PACING_TARGET_MONTHS} months, a pace of roughly{" "}
        {formatUsdCompact(PACING_MONTHLY_TARGET_USD)}/month. See the pacing chart on the Success Dashboard for how
        deployment is actually tracking against that target.
      </p>
    </div>
  );
}
