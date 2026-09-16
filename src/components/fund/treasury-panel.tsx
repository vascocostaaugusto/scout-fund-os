"use client";

// A partner approving a new ticket needs to know what's actually left in
// the pool — not just what's been wired, but what's already earmarked in
// deals sitting in the closing queue (SAFE signed or not). Without this,
// nothing stops the fund from approving past the $6M ceiling.
import { useDealStore } from "@/lib/deal-store";
import { SCOUT_POOL_SIZE } from "@/lib/data";
import { formatUsd, formatPct } from "@/lib/format";

const CONFIRMED_STAGES = new Set(["check_written", "follow_on_watch", "exited", "dead"]);

export function TreasuryPanel() {
  const { deals } = useDealStore();

  const deployedUsd = deals
    .filter((d) => CONFIRMED_STAGES.has(d.stage) && d.wireStatus === "confirmed")
    .reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

  const committedUsd = deals
    .filter((d) => d.stage === "approved")
    .reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

  const availableUsd = Math.max(SCOUT_POOL_SIZE - deployedUsd - committedUsd, 0);
  const deployedPct = deployedUsd / SCOUT_POOL_SIZE;
  const committedPct = committedUsd / SCOUT_POOL_SIZE;
  const availablePct = availableUsd / SCOUT_POOL_SIZE;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <div>
          <span className="text-xs text-muted-foreground">Available to deploy right now</span>
          <div className="text-xl font-semibold text-foreground">{formatUsd(availableUsd)}</div>
        </div>
        <div className="flex gap-5 text-xs">
          <div>
            <span className="text-muted-foreground">Wired</span>
            <div className="font-medium text-foreground">
              {formatUsd(deployedUsd)} <span className="text-muted-foreground">({formatPct(deployedPct, 0)})</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Committed, closing</span>
            <div className="font-medium text-foreground">
              {formatUsd(committedUsd)} <span className="text-muted-foreground">({formatPct(committedPct, 0)})</span>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Pool size</span>
            <div className="font-medium text-foreground">{formatUsd(SCOUT_POOL_SIZE)}</div>
          </div>
        </div>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary/40">
        <div className="h-full bg-primary" style={{ width: `${deployedPct * 100}%` }} title="Wired" />
        <div className="h-full bg-primary/40" style={{ width: `${committedPct * 100}%` }} title="Committed, closing" />
        <div className="h-full bg-transparent" style={{ width: `${availablePct * 100}%` }} />
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        &quot;Committed&quot; is capital earmarked by an approved ticket that hasn&apos;t wired yet — still part of
        the pool&apos;s draw-down, not free to double-approve against.
      </p>
    </div>
  );
}
