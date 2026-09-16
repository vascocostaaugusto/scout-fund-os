"use client";

// The live counterpart to aggregates.ts — same formulas (derive.ts), run
// over the session's actual deals from useDealStore() instead of the frozen
// seed snapshot. Anything the app displays *while a partner or scout is
// working it* should read from here, not from the static aggregate exports,
// or a decision in the Fund Portal won't show up anywhere else in the app.
import { useMemo } from "react";
import { useDealStore } from "./deal-store";
import { scouts } from "./data";
import {
  computeDealDerived,
  computeScoutStats,
  computeRepeatFunderScouts,
  computeScoutUpside,
  computeScoutsBlockedForPayout,
} from "./data/derive";

export function useLiveStats() {
  const { deals } = useDealStore();

  return useMemo(() => {
    const dealDerived = computeDealDerived(deals);
    const scoutStats = computeScoutStats(deals, scouts);
    return {
      ...dealDerived,
      scoutStats,
      repeatFunderScouts: computeRepeatFunderScouts(scoutStats),
      scoutUpside: computeScoutUpside(deals, scouts),
      scoutsBlockedForPayout: computeScoutsBlockedForPayout(deals, scouts),
    };
  }, [deals]);
}
