// Pure aggregate math, extracted so it can run twice: once over the static
// seed data (for aggregates.ts — what the published docs cite, what a
// server-rendered page shows on first paint) and once over the live,
// session-decided deals from useDealStore() (for every stat tile and table
// a partner or scout actually watches while working the app). Keeping the
// formulas in one place means the two can never quietly drift apart.
import type { Deal, DealStage, Scout } from "./types";

export const FUNDED_STAGES: DealStage[] = ["check_written", "follow_on_watch", "exited", "dead"];
const TERMINAL_STAGES: DealStage[] = ["declined", "exited", "dead"];

export const STAGE_MARK_MULTIPLE: Partial<Record<DealStage, number>> = {
  check_written: 1.3, // early markup, most recent round's price
  follow_on_watch: 2.6, // priced up by signaled next round
  exited: 4.0, // realized-return proxy
  dead: 0, // written off
};
export const CARRY_RATE = 0.2;
export const SCOUT_CARRY_RATE_ASSUMPTION = 0.125;

// A recorded exit multiple always wins over the stage's standard interim
// mark — once a partner books an actual outcome, that's the real number and
// every downstream figure (scout upside, book MOIC, carry owed) follows it.
export function markMultipleFor(d: Deal): number {
  return d.exitMultiple ?? STAGE_MARK_MULTIPLE[d.stage] ?? 1;
}

export interface DealDerived {
  totalMemos: number;
  fundedDeals: Deal[];
  totalFunded: number;
  fundedConversionRate: number;
  capitalDeployedUsd: number;
  avgResponseHours: number;
  lateResponseCount: number;
  lateResponseRate: number;
  pipelineByStage: Record<DealStage, number>;
  pipelineOpenCount: number;
  followOnParticipationRate: number;
  closingQueueCount: number;
  closingByLegalStatus: { not_started: number; draft_generated: number; sent_for_signature: number; executed: number };
  closingAwaitingWire: number;
}

export function computeDealDerived(deals: Deal[]): DealDerived {
  const totalMemos = deals.length;
  const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
  const totalFunded = fundedDeals.length;
  const fundedConversionRate = totalMemos ? totalFunded / totalMemos : 0;
  const capitalDeployedUsd = fundedDeals.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);

  const dealsWithResponse = deals.filter((d) => d.responseHours != null);
  const avgResponseHours = dealsWithResponse.length
    ? dealsWithResponse.reduce((sum, d) => sum + (d.responseHours ?? 0), 0) / dealsWithResponse.length
    : 0;
  const lateResponseCount = deals.filter((d) => d.isLate).length;
  const lateResponseRate = dealsWithResponse.length ? lateResponseCount / dealsWithResponse.length : 0;

  const pipelineByStage: Record<DealStage, number> = {
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
  const pipelineOpenCount = deals.filter((d) => !TERMINAL_STAGES.includes(d.stage)).length;

  const approvedDeals = deals.filter((d) => d.stage === "approved");
  const closingQueueCount = approvedDeals.length;
  const closingByLegalStatus = {
    not_started: approvedDeals.filter((d) => d.legalDocStatus === "not_started").length,
    draft_generated: approvedDeals.filter((d) => d.legalDocStatus === "draft_generated").length,
    sent_for_signature: approvedDeals.filter((d) => d.legalDocStatus === "sent_for_signature").length,
    executed: approvedDeals.filter((d) => d.legalDocStatus === "executed").length,
  };
  const closingAwaitingWire = approvedDeals.filter(
    (d) => d.legalDocStatus === "executed" && d.wireStatus !== "confirmed",
  ).length;

  const followOnEligible = fundedDeals.length;
  const followOnCount = deals.filter((d) => d.followOnParticipated).length;
  const followOnParticipationRate = followOnEligible ? followOnCount / followOnEligible : 0;

  return {
    totalMemos,
    fundedDeals,
    totalFunded,
    fundedConversionRate,
    capitalDeployedUsd,
    avgResponseHours,
    lateResponseCount,
    lateResponseRate,
    pipelineByStage,
    pipelineOpenCount,
    followOnParticipationRate,
    closingQueueCount,
    closingByLegalStatus,
    closingAwaitingWire,
  };
}

export interface ScoutStats {
  scoutId: string;
  memosSubmitted: number;
  dealsFunded: number;
  capitalDeployedUsd: number;
  avgResponseHours: number | null;
  conversionRate: number;
}

export function computeScoutStats(deals: Deal[], scouts: Scout[]): Map<string, ScoutStats> {
  return new Map(
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
}

export function computeRepeatFunderScouts(scoutStats: Map<string, ScoutStats>): number {
  return [...scoutStats.values()].filter((s) => s.dealsFunded >= 2).length;
}

export interface ScoutUpside {
  scoutId: string;
  deployedUsd: number;
  markedValueUsd: number;
  profitUsd: number;
  estimatedCarryUsd: number;
}

export function computeScoutUpside(deals: Deal[], scouts: Scout[]): Map<string, ScoutUpside> {
  const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
  return new Map(
    scouts.map((s) => {
      const ownFunded = fundedDeals.filter((d) => d.scoutId === s.id);
      const deployedUsd = ownFunded.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);
      const markedValueUsd = ownFunded.reduce(
        (sum, d) => sum + (d.checkSizeUsd ?? 0) * markMultipleFor(d),
        0,
      );
      const profitUsd = Math.max(markedValueUsd - deployedUsd, 0);
      const estimatedCarryUsd = profitUsd * CARRY_RATE * SCOUT_CARRY_RATE_ASSUMPTION;
      return [s.id, { scoutId: s.id, deployedUsd, markedValueUsd, profitUsd, estimatedCarryUsd }];
    }),
  );
}

export function computeScoutBookMoic(deals: Deal[]): number {
  const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
  const capitalDeployedUsd = fundedDeals.reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);
  const markedValueUsd = fundedDeals.reduce(
    (sum, d) => sum + (d.checkSizeUsd ?? 0) * markMultipleFor(d),
    0,
  );
  return capitalDeployedUsd ? markedValueUsd / capitalDeployedUsd : 0;
}

export function computeScoutsBlockedForPayout(deals: Deal[], scouts: Scout[]): number {
  const exitedDeals = deals.filter((d) => d.stage === "exited");
  return new Set(
    exitedDeals
      .map((d) => scouts.find((s) => s.id === d.scoutId)!)
      .filter((s) => s.payoutAccountStatus === "not_linked")
      .map((s) => s.id),
  ).size;
}

export interface PacingPoint {
  month: string;
  monthIndex: number;
  actualCumulativeUsd: number | null;
  targetCumulativeUsd: number;
}

export function computeDeploymentPacing(
  deals: Deal[],
  opts: { poolSize: number; targetMonths: number; programStart: Date; todayRef: Date },
): PacingPoint[] {
  const fundedDeals = deals.filter((d) => FUNDED_STAGES.includes(d.stage));
  const monthlyTarget = opts.poolSize / opts.targetMonths;
  return Array.from({ length: opts.targetMonths + 1 }, (_, m) => {
    const cutoff = new Date(opts.programStart);
    cutoff.setUTCMonth(cutoff.getUTCMonth() + m);
    const isFuture = cutoff > opts.todayRef;
    const actualCumulativeUsd = isFuture
      ? null
      : fundedDeals
          .filter((d) => d.firstLookAt && new Date(d.firstLookAt) <= cutoff)
          .reduce((sum, d) => sum + (d.checkSizeUsd ?? 0), 0);
    return {
      month: `M${m}`,
      monthIndex: m,
      actualCumulativeUsd,
      targetCumulativeUsd: Math.min(monthlyTarget * m, opts.poolSize),
    };
  });
}
