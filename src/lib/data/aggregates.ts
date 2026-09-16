import { scouts } from "./scouts";
import { deals } from "./deals";
import { makeRng } from "./prng";
import type { DealStage } from "./types";

// ---- Fund-level constants -------------------------------------------------
export const FUND_II_TARGET_LOW = 100_000_000;
export const FUND_II_TARGET_HIGH = 150_000_000;
export const FUND_II_TARGET_MID = 125_000_000;
// A single shared, evergreen pool — not split into per-scout ceilings. Any
// scout can draw a $10K–$50K ticket from it at any time; the pool
// replenishes as deals realize and is targeted for full deployment within
// 24 months of the program's start.
export const SCOUT_POOL_SIZE = 6_000_000;
export const SCOUT_POOL_PCT_OF_FUND = SCOUT_POOL_SIZE / FUND_II_TARGET_MID;
export const TICKET_SIZE_MIN = 10_000;
export const TICKET_SIZE_MAX = 50_000;
export const PACING_TARGET_MONTHS = 24;
export const PACING_MONTHLY_TARGET_USD = SCOUT_POOL_SIZE / PACING_TARGET_MONTHS;

// ---- Roster-derived ---------------------------------------------------------
export const totalScouts = scouts.length;
export const activeScouts = scouts.filter((s) => s.status !== "alumni").length;
export const scoutCountByTier: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
for (const s of scouts) scoutCountByTier[s.tier]++;

// ---- Deal-derived ------------------------------------------------------------
const FUNDED_STAGES: DealStage[] = ["check_written", "follow_on_watch", "exited", "dead"];

export const totalMemos = deals.length;
export const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
export const totalFunded = fundedDeals.length;
export const fundedConversionRate = totalFunded / totalMemos;

export const capitalDeployedUsd = fundedDeals.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

const dealsWithResponse = deals.filter((d) => d.responseHours != null);
export const avgResponseHours =
  dealsWithResponse.reduce((sum, d) => sum + (d.responseHours ?? 0), 0) / (dealsWithResponse.length || 1);
export const lateResponseCount = deals.filter((d) => d.isLate).length;
export const lateResponseRate = lateResponseCount / (dealsWithResponse.length || 1);

export const pipelineByStage: Record<DealStage, number> = {
  submitted: 0,
  under_review: 0,
  declined: 0,
  approved: 0,
  check_written: 0,
  follow_on_watch: 0,
  exited: 0,
  dead: 0,
};
for (const d of deals) pipelineByStage[d.stage]++;

const TERMINAL_STAGES: DealStage[] = ["declined", "exited", "dead"];
export const pipelineOpenCount = deals.filter((d) => !TERMINAL_STAGES.includes(d.stage)).length;

const followOnEligible = fundedDeals.length;
const followOnCount = deals.filter((d) => d.followOnParticipated).length;
export const followOnParticipationRate = followOnCount / (followOnEligible || 1);

// ---- Per-scout rollups (aggregated from the same deals array — guarantees
// the roster view and the pipeline view can never disagree) -----------------
export interface ScoutStats {
  scoutId: string;
  memosSubmitted: number;
  dealsFunded: number;
  capitalDeployedUsd: number;
  avgResponseHours: number | null;
  conversionRate: number;
}

export const scoutStats: Map<string, ScoutStats> = new Map(
  scouts.map((s) => {
    const own = deals.filter((d) => d.scoutId === s.id);
    const ownFunded = own.filter((d) => FUNDED_STAGES.includes(d.stage));
    const ownResponses = own.filter((d) => d.responseHours != null);
    return [
      s.id,
      {
        scoutId: s.id,
        memosSubmitted: own.length,
        dealsFunded: ownFunded.length,
        capitalDeployedUsd: ownFunded.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0),
        avgResponseHours: ownResponses.length
          ? ownResponses.reduce((sum, d) => sum + (d.responseHours ?? 0), 0) / ownResponses.length
          : null,
        conversionRate: own.length ? ownFunded.length / own.length : 0,
      },
    ];
  }),
);

// A scout with 2+ funded deals has proven repeatable sourcing, not a
// one-time introduction — the medium-term signal that the network compounds.
export const repeatFunderScouts = [...scoutStats.values()].filter((s) => s.dealsFunded >= 2).length;

// ---- Coverage map (vertical/geography tags with memo counts) --------------
export interface CoverageTag {
  label: string;
  count: number;
}
const coverageCounts = new Map<string, number>();
for (const d of deals) {
  coverageCounts.set(d.sector, (coverageCounts.get(d.sector) ?? 0) + 1);
}
export const coverageTags: CoverageTag[] = [...coverageCounts.entries()]
  .map(([label, count]) => ({ label, count }))
  .sort((a, b) => b.count - a.count);

// ---- Current mark-to-market (fed by the fund's quarterly regulatory
// filing, e.g. Form PF / ILPA quarterly report — see regulatory.ts) --------
// Unlike the maturity model below, this is a bottom-up figure computed
// directly from the funded deals' current stage: each stage implies a
// conservative interim markup convention the fund already uses for
// regulatory NAV reporting.
export const STAGE_MARK_MULTIPLE: Partial<Record<DealStage, number>> = {
  check_written: 1.3, // early markup, most recent round's price
  follow_on_watch: 2.6, // priced up by signaled next round
  exited: 4.0, // realized-return proxy
  dead: 0, // written off
};

export const scoutBookMarkedValueUsd = fundedDeals.reduce(
  (sum, d) => sum + (d.checkSizeUsd ?? 0) * (STAGE_MARK_MULTIPLE[d.stage] ?? 1),
  0,
);
export const scoutBookMoicToDate = capitalDeployedUsd
  ? scoutBookMarkedValueUsd / capitalDeployedUsd
  : 0;

// Standard GP carry rate, applied fund-wide — still needed for the Scout
// Portal's estimated-upside math below. The Year-8 maturity projection this
// used to feed (headline "proof it earns its place" chart) moved to the
// program brief document — narrative/modeled content, not app status.
export const CARRY_RATE = 0.2;

// ---- Per-scout estimated upside (Scout Portal) ------------------------------
// Same mark-to-market convention as the fund-wide figure above, scoped to one
// scout's own funded deals. Carry rate is a blended midpoint of the 10–15%
// range (the exact rate is negotiated per scout; the portal shows a fair
// estimate, not a contractual figure — labeled as such in the UI).
export const SCOUT_CARRY_RATE_ASSUMPTION = 0.125;

export interface ScoutUpside {
  scoutId: string;
  deployedUsd: number;
  markedValueUsd: number;
  profitUsd: number;
  estimatedCarryUsd: number;
}

export const scoutUpside: Map<string, ScoutUpside> = new Map(
  scouts.map((s) => {
    const ownFunded = fundedDeals.filter((d) => d.scoutId === s.id);
    const deployedUsd = ownFunded.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);
    const markedValueUsd = ownFunded.reduce(
      (sum, d) => sum + (d.checkSizeUsd ?? 0) * (STAGE_MARK_MULTIPLE[d.stage] ?? 1),
      0,
    );
    const profitUsd = Math.max(markedValueUsd - deployedUsd, 0);
    const estimatedCarryUsd = profitUsd * CARRY_RATE * SCOUT_CARRY_RATE_ASSUMPTION;
    return [s.id, { scoutId: s.id, deployedUsd, markedValueUsd, profitUsd, estimatedCarryUsd }];
  }),
);

// ---- Near-term response-time trend (last 8 "weeks" of the cohort, synthetic
// but consistent with avgResponseHours) --------------------------------------
const responseRng = makeRng(4471);
export interface ResponseWeek {
  week: string;
  avgHours: number;
}
export const responseTimeTrend: ResponseWeek[] = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  avgHours: Math.round(responseRng.float(avgResponseHours - 9, avgResponseHours + 9, 1) * 10) / 10,
}));

// ---- Deployment pacing: cumulative actual vs. the straight-line target to
// fully deploy the pool within PACING_TARGET_MONTHS ---------------------------
// Uses each funded deal's first-look response as a proxy "deployed at" date
// (checks are written shortly after that point) — deals.ts doesn't track a
// separate funding-execution timestamp, and this is the closest one it has.
const PROGRAM_START = new Date("2025-01-20T09:00:00Z");
const TODAY_REF = new Date("2026-09-16T09:00:00Z");

export interface PacingPoint {
  month: string; // e.g. "M0", "M12"
  monthIndex: number;
  actualCumulativeUsd: number | null; // null once past today — unknown yet
  targetCumulativeUsd: number;
}

export const deploymentPacing: PacingPoint[] = Array.from({ length: PACING_TARGET_MONTHS + 1 }, (_, m) => {
  const cutoff = new Date(PROGRAM_START);
  cutoff.setUTCMonth(cutoff.getUTCMonth() + m);
  const isFuture = cutoff > TODAY_REF;

  const actualCumulativeUsd = isFuture
    ? null
    : fundedDeals
        .filter((d) => d.firstLookAt && new Date(d.firstLookAt) <= cutoff)
        .reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

  return {
    month: `M${m}`,
    monthIndex: m,
    actualCumulativeUsd,
    targetCumulativeUsd: Math.min(PACING_MONTHLY_TARGET_USD * m, SCOUT_POOL_SIZE),
  };
});
