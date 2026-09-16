"use client";

import { useState } from "react";
import { TrendingUp, X } from "lucide-react";
import { scoutById } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd } from "@/lib/format";
import { Button } from "@/components/ui/button";

const DEFAULT_FOLLOW_ON = 150_000;

export function FollowOnDecisions() {
  const { deals, decideFollowOn } = useDealStore();
  const [checks, setChecks] = useState<Record<string, number>>({});

  const undecided = deals.filter((d) => d.stage === "follow_on_watch" && d.followOnDecision === "undecided");
  const resolved = deals.filter((d) => d.stage === "follow_on_watch" && d.followOnDecision !== "undecided");

  return (
    <div className="flex flex-col gap-4">
      <span className="text-xs text-muted-foreground">
        {undecided.length} compan{undecided.length === 1 ? "y" : "ies"} signaling a next round, waiting on a
        follow-on call — separate capital from Fund II, not the scout pool.
      </span>

      {undecided.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          No open follow-on decisions right now.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {undecided.map((d) => {
            const scout = scoutById.get(d.scoutId);
            return (
              <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div>
                  <div className="text-sm font-semibold text-foreground">{d.companyName}</div>
                  <div className="text-xs text-muted-foreground">
                    {d.sector} · sourced by {scout?.name} · original ticket {formatUsd(d.checkSizeUsd ?? 0)}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    Follow-on check
                    <input
                      type="number"
                      min={50_000}
                      step={10_000}
                      value={checks[d.id] ?? DEFAULT_FOLLOW_ON}
                      onChange={(e) => setChecks((prev) => ({ ...prev, [d.id]: Number(e.target.value) }))}
                      className="w-28 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                  </label>
                  <div className="ml-auto flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-critical hover:bg-critical/10 hover:text-critical"
                      onClick={() => decideFollowOn(d.id, "passed")}
                    >
                      <X className="size-3.5" />
                      Pass
                    </Button>
                    <Button size="sm" onClick={() => decideFollowOn(d.id, "participating", checks[d.id] ?? DEFAULT_FOLLOW_ON)}>
                      <TrendingUp className="size-3.5" />
                      Follow on
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {resolved.length > 0 ? (
        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-card/60 p-4">
          <span className="text-xs font-medium text-muted-foreground">Already decided</span>
          {resolved.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-foreground">{d.companyName}</span>
              <span className={d.followOnDecision === "participating" ? "text-success" : "text-muted-foreground"}>
                {d.followOnDecision === "participating"
                  ? `Following on · ${formatUsd(d.followOnCheckUsd ?? 0)}`
                  : "Passed"}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
