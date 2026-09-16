import { ArrowRight } from "lucide-react";
import { SCOUT_POOL_SIZE, capitalAllocatedUsd, capitalDeployedUsd } from "@/lib/data";
import { formatUsdCompact, formatPct } from "@/lib/format";

const STEPS = [
  {
    label: "LPAC-authorized pool",
    value: SCOUT_POOL_SIZE,
    hint: "the ceiling, set once, <5% of Fund II",
  },
  {
    label: "Allocated to Cohort 1",
    value: capitalAllocatedUsd,
    hint: "sum of all 15 scouts' personal ceilings",
  },
  {
    label: "Actually deployed",
    value: capitalDeployedUsd,
    hint: "checks written so far this cohort",
  },
];

export function CapitalFunnel() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card/60 px-5 py-4">
      <span className="text-xs font-medium text-muted-foreground">
        Why the pool and the allocation don&apos;t match — they&apos;re not the same number
      </span>
      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex flex-1 flex-col gap-0.5 rounded-lg bg-background px-3 py-2">
              <span className="text-lg font-semibold tabular-nums text-foreground">
                {formatUsdCompact(step.value)}
              </span>
              <span className="text-[11px] text-muted-foreground">{step.label}</span>
              <span className="text-[10px] text-muted-foreground/70">{step.hint}</span>
            </div>
            {i < STEPS.length - 1 ? (
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground/50 sm:mx-0" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        The pool is sized with headroom on purpose — {formatUsdCompact(SCOUT_POOL_SIZE)} covers this cohort&apos;s{" "}
        {formatUsdCompact(capitalAllocatedUsd)} in ceilings plus room to add a Cohort 2 without a second trip back
        to the LPAC. Of what&apos;s currently allocated, {formatPct(capitalDeployedUsd / capitalAllocatedUsd, 0)} is
        actually deployed — the rest is ceiling scouts haven&apos;t used yet.
      </p>
    </div>
  );
}
