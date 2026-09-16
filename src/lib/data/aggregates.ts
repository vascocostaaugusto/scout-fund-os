import { scouts } from "./scouts";
import { deals } from "./deals";
import { makeRng } from "./prng";
import * as derive from "./derive";

// ---- Fund-level constants -------------------------------------------------
export const FUND_II_TARGET_LOW = 100_000_000;
export const FUND_II_TARGET_HIGH = 150_000_000;
export const FUND_II_TARGET_MID = 125_000_000;
// A single shared, evergreen pool — not split into per-scout ceilings. Any
// scout can draw a ticket from it at any time; the pool replenishes as
// deals realize and is targeted for full deployment within 24 months of
// the program's start.
export const SCOUT_POOL_SIZE = 6_000_000;
export const SCOUT_POOL_PCT_OF_FUND = SCOUT_POOL_SIZE / FUND_II_TARGET_MID;
// $10K–$50K is the typical ticket band, not a hard floor or ceiling — an
// outlier company can justify a check outside it, and the fund adapts deal
// by deal rather than mechanically enforcing a range. Used for display and
// as the default suggestion in the Fund Portal's approval form, never as a
// validation constraint.
export const TICKET_SIZE_TYPICAL_MIN = 10_000;
export const TICKET_SIZE_TYPICAL_MAX = 50_000;
export const PACING_TARGET_MONTHS = 24;
export const PACING_MONTHLY_TARGET_USD = SCOUT_POOL_SIZE / PACING_TARGET_MONTHS;

// ---- Roster-derived (unaffected by session deal decisions — safe static) --
export const totalScouts = scouts.length;
export const activeScouts = scouts.filter((s) => s.status !== "alumni").length;
export const scoutCountByTier: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
for (const s of scouts) scoutCountByTier[s.tier]++;

// ---- Deal-derived (cohort-at-a-glance snapshot, as of the published docs
// and first paint) — anything shown live in the working app while a partner
// or scout is making decisions should instead read through useLiveStats(),
// which runs these exact same formulas over the session's live deals. See
// src/lib/use-live-stats.ts. -------------------------------------------------
const dealDerived = derive.computeDealDerived(deals);
export const totalMemos = dealDerived.totalMemos;
export const fundedDeals = dealDerived.fundedDeals;
export const totalFunded = dealDerived.totalFunded;
export const fundedConversionRate = dealDerived.fundedConversionRate;
export const capitalDeployedUsd = dealDerived.capitalDeployedUsd;
export const avgResponseHours = dealDerived.avgResponseHours;
export const lateResponseCount = dealDerived.lateResponseCount;
export const lateResponseRate = dealDerived.lateResponseRate;
export const pipelineByStage = dealDerived.pipelineByStage;
export const pipelineOpenCount = dealDerived.pipelineOpenCount;
export const followOnParticipationRate = dealDerived.followOnParticipationRate;
export const closingQueueCount = dealDerived.closingQueueCount;
export const closingByLegalStatus = dealDerived.closingByLegalStatus;
export const closingAwaitingWire = dealDerived.closingAwaitingWire;

// ---- Per-scout rollups ------------------------------------------------------
export type ScoutStats = derive.ScoutStats;
export const scoutStats = derive.computeScoutStats(deals, scouts);

// A scout with 2+ funded deals has proven repeatable sourcing, not a
// one-time introduction — the medium-term signal that the network compounds.
export const repeatFunderScouts = derive.computeRepeatFunderScouts(scoutStats);

// ---- Payout readiness (exited deals whose scout is missing tax/payout
// paperwork — the thing that actually blocks a carry check from going out,
// independent of whether the deal itself realized a return) -----------------
export const scoutsBlockedForPayout = derive.computeScoutsBlockedForPayout(deals, scouts);

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
// filing — see the architecture doc's marks & regulatory feed section) -----
// Unlike the maturity model in the program brief, this is a bottom-up figure
// computed directly from the funded deals' current stage: each stage implies
// a conservative interim markup convention the fund already uses for
// regulatory NAV reporting.
export const STAGE_MARK_MULTIPLE = derive.STAGE_MARK_MULTIPLE;
export const scoutBookMoicToDate = derive.computeScoutBookMoic(deals);

// Standard GP carry rate, applied fund-wide — still needed for the Scout
// Portal's estimated-upside math below.
export const CARRY_RATE = derive.CARRY_RATE;

// ---- Per-scout estimated upside (Scout Portal) ------------------------------
// Carry rate is a blended midpoint of the 10–15% range (the exact rate is
// negotiated per scout; the portal shows a fair estimate, not a contractual
// figure — labeled as such in the UI).
export const SCOUT_CARRY_RATE_ASSUMPTION = derive.SCOUT_CARRY_RATE_ASSUMPTION;
export type ScoutUpside = derive.ScoutUpside;
export const scoutUpside = derive.computeScoutUpside(deals, scouts);

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
export const PROGRAM_START = new Date("2025-01-20T09:00:00Z");
export const TODAY_REF = new Date("2026-09-16T09:00:00Z");

export type PacingPoint = derive.PacingPoint;
export const deploymentPacing: PacingPoint[] = derive.computeDeploymentPacing(deals, {
  poolSize: SCOUT_POOL_SIZE,
  targetMonths: PACING_TARGET_MONTHS,
  programStart: PROGRAM_START,
  todayRef: TODAY_REF,
});
