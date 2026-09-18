"use client";

// The live counterpart to aggregates.ts — same formulas (derive.ts), run
// over the session's actual deals from useDealStore() instead of the frozen
// seed snapshot. Anything the app displays *while a partner or scout is
// working it* should read from here, not from the static aggregate exports,
// or a decision in the Fund Portal won't show up anywhere else in the app.
import { useMemo } from "react";
import { useDealStore } from "./deal-store";
import { scouts, TODAY_REF } from "./data";
import {
  computeDealDerived,
  computeScoutStats,
  computeRepeatFunderScouts,
  computeScoutUpside,
  computeScoutsBlockedForPayout,
  computeActiveSubmitters,
} from "./data/derive";

// "Still sending us companies" is the retention question for a fixed-term
// program. A quarter is long enough that a scout between intros isn't counted
// as lapsed, short enough that going quiet shows up before the term ends.
const RETENTION_WINDOW_DAYS = 90;

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
      activeSubmitters: computeActiveSubmitters(deals, {
        todayRef: TODAY_REF,
        withinDays: RETENTION_WINDOW_DAYS,
      }),
    };
  }, [deals]);
}
