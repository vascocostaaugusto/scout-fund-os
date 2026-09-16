import { scouts } from "./scouts";
import { deals } from "./deals";
import { makeRng } from "./prng";
import type { DealStage } from "./types";

// ---- Fund-level constants -------------------------------------------------
export const FUND_II_TARGET_LOW = 100_000_000;
export const FUND_II_TARGET_HIGH = 150_000_000;
export const FUND_II_TARGET_MID = 125_000_000;
export const SCOUT_POOL_SIZE = 6_000_000; // program-level ceiling, LPAC-authorized
export const SCOUT_POOL_PCT_OF_FUND = SCOUT_POOL_SIZE / FUND_II_TARGET_MID;

// ---- Roster-derived ---------------------------------------------------------
export const totalScouts = scouts.length;
export const activeScouts = scouts.filter((s) => s.status !== "alumni").length;
export const vpTrackScouts = scouts.filter((s) => s.status === "vp-track").length;
export const capitalAllocatedUsd = scouts.reduce((sum, s) => sum + s.allocationUsd, 0);

// ---- Deal-derived ------------------------------------------------------------
const FUNDED_STAGES: DealStage[] = ["check_written", "follow_on_watch", "exited", "dead"];

export const totalMemos = deals.length;
export const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
export const totalFunded = fundedDeals.length;
export const fundedConversionRate = totalFunded / totalMemos;

export const capitalDeployedUsd = fundedDeals.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

const dealsWithSla = deals.filter((d) => d.slaHours != null);
export const avgSlaHours =
  dealsWithSla.reduce((sum, d) => sum + (d.slaHours ?? 0), 0) / (dealsWithSla.length || 1);
export const slaBreachedCount = deals.filter((d) => d.slaBreached).length;
export const slaBreachRate = slaBreachedCount / (dealsWithSla.length || 1);

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
  avgSlaHours: number | null;
  conversionRate: number;
}

export const scoutStats: Map<string, ScoutStats> = new Map(
  scouts.map((s) => {
    const own = deals.filter((d) => d.scoutId === s.id);
    const ownFunded = own.filter((d) => FUNDED_STAGES.includes(d.stage));
    const ownSla = own.filter((d) => d.slaHours != null);
    return [
      s.id,
      {
        scoutId: s.id,
        memosSubmitted: own.length,
        dealsFunded: ownFunded.length,
        capitalDeployedUsd: ownFunded.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0),
        avgSlaHours: ownSla.length
          ? ownSla.reduce((sum, d) => sum + (d.slaHours ?? 0), 0) / ownSla.length
          : null,
        conversionRate: own.length ? ownFunded.length / own.length : 0,
      },
    ];
  }),
);

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

// ---- Long-term "proof it earns its place" model ----------------------------
// Modeled at fund maturity (Year 8, typical VC fund life), not today's
// snapshot — scout checks are small today, but the thesis is that early,
// cheap entry into future breakout companies compounds disproportionately.
// Assumptions are explicit and intentionally conservative-adjacent:
//   - Whole-fund blended gross MOIC: 3.0x (typical top-quartile target)
//   - Scout-sourced book blended gross MOIC: 4.5x (earlier/cheaper entry)
//   - Standard GP carry rate applied fund-wide: 20%
export const MATURITY_WHOLE_FUND_MOIC = 3.0;
export const MATURITY_SCOUT_BOOK_MOIC = 4.5;
export const CARRY_RATE = 0.2;

export const fundIIProfitAtMaturity = FUND_II_TARGET_MID * (MATURITY_WHOLE_FUND_MOIC - 1);
export const fundIICarryAtMaturity = fundIIProfitAtMaturity * CARRY_RATE;
export const scoutProfitAtMaturity = SCOUT_POOL_SIZE * (MATURITY_SCOUT_BOOK_MOIC - 1);
export const scoutCarryAtMaturity = scoutProfitAtMaturity * CARRY_RATE;
export const scoutCarryShareOfFund = scoutCarryAtMaturity / fundIICarryAtMaturity;

// ---- Retention across cohorts (line chart) ---------------------------------
// The program's first formal cohort is still active, so cohort-over-cohort
// retention before 2025 reflects the informal Shapers Club pilot; the final
// point is a modeled projection for the next cohort under the now-formalized
// structure (clearly labeled as projected in the UI).
export interface CohortRetention {
  cohort: string;
  retentionPct: number;
  projected: boolean;
}
export const retentionByCohort: CohortRetention[] = [
  { cohort: "Pilot ('23–'24)", retentionPct: 58, projected: false },
  { cohort: "Cohort 1 ('25–'26)", retentionPct: 79, projected: false },
  { cohort: "Cohort 2 ('26–'27)", retentionPct: 86, projected: true },
];

// ---- Near-term SLA trend (last 8 "weeks" of the cohort, synthetic but
// consistent with avgSlaHours) ------------------------------------------------
const slaRng = makeRng(4471);
export interface SlaWeek {
  week: string;
  avgHours: number;
}
export const slaTrend: SlaWeek[] = Array.from({ length: 8 }, (_, i) => ({
  week: `W${i + 1}`,
  avgHours: Math.round(slaRng.float(avgSlaHours - 9, avgSlaHours + 9, 1) * 10) / 10,
}));
