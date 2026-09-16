"use client";

import { AlertTriangle, CircleDollarSign } from "lucide-react";
import { STAGE_MARK_MULTIPLE, CARRY_RATE, SCOUT_CARRY_RATE_ASSUMPTION } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { useScoutOnboarding } from "@/lib/scout-onboarding-store";
import { formatUsd, formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function ExitDistributions() {
  const { deals, markCarryPaid } = useDealStore();
  const { scouts } = useScoutOnboarding();

  const exited = deals
    .filter((d) => d.stage === "exited")
    .map((d) => {
      const scout = scouts.find((s) => s.id === d.scoutId);
      const checkSizeUsd = d.checkSizeUsd ?? 0;
      const exitValueUsd = checkSizeUsd * (STAGE_MARK_MULTIPLE.exited ?? 1);
      const profitUsd = Math.max(exitValueUsd - checkSizeUsd, 0);
      const carryOwedUsd = profitUsd * CARRY_RATE * SCOUT_CARRY_RATE_ASSUMPTION;
      const paperworkReady = scout?.taxFormStatus === "submitted" && scout?.payoutAccountStatus === "linked";
      return { deal: d, scout, checkSizeUsd, exitValueUsd, profitUsd, carryOwedUsd, paperworkReady };
    });

  if (exited.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        No exits yet this cohort — nothing to distribute.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {exited.map(({ deal, scout, checkSizeUsd, exitValueUsd, profitUsd, carryOwedUsd, paperworkReady }) => (
        <div key={deal.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-semibold text-foreground">{deal.companyName}</div>
              <div className="text-xs text-muted-foreground">
                {scout?.name} · ticket {formatUsd(checkSizeUsd)} → exit value {formatUsd(exitValueUsd)} (
                {STAGE_MARK_MULTIPLE.exited}x)
              </div>
            </div>
            {deal.carryPaidAt ? (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-medium text-success">
                Paid {formatDate(deal.carryPaidAt)}
              </span>
            ) : (
              <span className="rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning">
                Distribution pending
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/30 px-3 py-2.5 text-xs">
            <div>
              <div className="text-muted-foreground">Profit</div>
              <div className="font-medium text-foreground">{formatUsd(profitUsd)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Fund carry (20%)</div>
              <div className="font-medium text-foreground">{formatUsd(profitUsd * CARRY_RATE)}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Scout&apos;s share (12.5% of that)</div>
              <div className="font-semibold text-primary">{formatUsd(carryOwedUsd)}</div>
            </div>
          </div>

          {!deal.carryPaidAt ? (
            paperworkReady ? (
              <Button size="sm" className="self-start" onClick={() => markCarryPaid(deal.id)}>
                <CircleDollarSign className="size-3.5" />
                Mark carry distribution paid
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-[11px] text-warning">
                <AlertTriangle className="size-3.5 shrink-0" />
                Blocked — {scout?.name} is missing{" "}
                {[
                  scout?.taxFormStatus !== "submitted" ? "a tax form" : null,
                  scout?.payoutAccountStatus !== "linked" ? "a linked payout account" : null,
                ]
                  .filter(Boolean)
                  .join(" and ")}
                . Can&apos;t distribute until that&apos;s on file.
              </div>
            )
          ) : null}
        </div>
      ))}
    </div>
  );
}
