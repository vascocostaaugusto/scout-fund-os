// The scout ladder: cumulative attributed deployment unlocks a small slice
// of *fund-level* carry, on top of the per-deal carry a scout already earns.
//
// Two things worth being explicit about, because they're easy to gloss over:
//
// 1. This carry is dilutive to the partners. Per-deal scout carry comes out
//    of the carry on that one deal; fund-level carry is a share of the whole
//    pool, and it comes out of the GP's side. Every point granted here is a
//    point the partnership no longer holds.
// 2. The tiers step up — they don't stack. A scout at the third milestone
//    holds 0.50% of fund carry, not 0.85%.
// 3. These are LIFETIME thresholds, not per-cohort ones. Cohort 1's whole
//    scout book is $1.35M deployed across 26 scouts; its best individual
//    scout is at $148K. Nobody reaches $500K inside one cohort, and that's
//    intentional — the ladder is what a scout climbs by staying with the
//    program across cohorts, which is exactly the retention it's there to
//    buy. Sized so the first rung is a genuinely rare event, not a default.
export interface CarryMilestone {
  id: string;
  tier: 1 | 2 | 3;
  deployedUsd: number;
  fundCarryPct: number; // share of the fund's total carry pool
  label: string;
}

export const CARRY_MILESTONES: CarryMilestone[] = [
  { id: "cm1", tier: 1, deployedUsd: 500_000, fundCarryPct: 0.001, label: "First milestone" },
  { id: "cm2", tier: 2, deployedUsd: 1_000_000, fundCarryPct: 0.0025, label: "Second milestone" },
  { id: "cm3", tier: 3, deployedUsd: 1_500_000, fundCarryPct: 0.005, label: "Third milestone" },
];

// Which milestone a given amount of attributed deployment has reached, and
// what's still outstanding to reach the next one.
export interface MilestoneProgress {
  reached: CarryMilestone | null;
  next: CarryMilestone | null;
  remainingUsd: number;
  pctToNext: number; // 0–1, progress through the current step
}

export function milestoneProgressFor(attributedDeployedUsd: number): MilestoneProgress {
  const reached = [...CARRY_MILESTONES].reverse().find((m) => attributedDeployedUsd >= m.deployedUsd) ?? null;
  const next = CARRY_MILESTONES.find((m) => attributedDeployedUsd < m.deployedUsd) ?? null;
  if (!next) return { reached, next: null, remainingUsd: 0, pctToNext: 1 };
  const floor = reached?.deployedUsd ?? 0;
  const span = next.deployedUsd - floor;
  return {
    reached,
    next,
    remainingUsd: next.deployedUsd - attributedDeployedUsd,
    pctToNext: span > 0 ? Math.min(Math.max((attributedDeployedUsd - floor) / span, 0), 1) : 0,
  };
}
