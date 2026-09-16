import { makeRng } from "./prng";
import { scouts } from "./scouts";
import type { Deal, DealStage } from "./types";

const rng = makeRng(5150);

const SECTORS = [
  "SME Banking",
  "Embedded Finance",
  "Cross-Border Payments",
  "Open Banking / Data",
  "Credit & Lending Infra",
  "Stablecoin Infrastructure",
  "Crypto Custody",
  "RegTech / Compliance",
  "Expense & Spend Mgmt",
  "InsurTech",
  "Wealth & Investing Infra",
  "B2B Payments Rails",
  "Accounting Automation",
] as const;

const GEOGRAPHIES = [
  "Germany",
  "France",
  "UK & Ireland",
  "Iberia",
  "Nordics",
  "Benelux",
  "Austria & CEE",
  "Southern Europe",
  "Pan-European",
] as const;

const PARTNERS = [
  "Nils Haverkamp",
  "Beatriz Coelho",
  "Simon Whitfield",
  "Katarzyna Wolski",
  "Marcus Lindqvist",
] as const;

const NAME_PREFIX = [
  "Ledger", "Vault", "Nimbus", "Clear", "Bridge", "Flux", "Nexo", "Pier",
  "North", "Delta", "Prism", "Anchor", "Stride", "Coil", "Summit", "Vertex",
  "Fable", "Harbor", "Keystone", "Lumen", "Orbit", "Pivot", "Rally", "Sable",
  "Tally", "Weave", "Alto", "Brisk", "Crest", "Drift", "Ember", "Forge",
] as const;

const NAME_SUFFIX = [
  "ly", "io", "Pay", "Base", "Flow", "Hub", "Works", "Labs", "Fi", "Stack",
  "Loop", "Path", "Link", "Grid", "Sync", "Card", "Wire", "Bank",
] as const;

function makeCompanyName(used: Set<string>): string {
  let name = "";
  do {
    name = `${rng.pick(NAME_PREFIX)}${rng.pick(NAME_SUFFIX)}`;
  } while (used.has(name));
  used.add(name);
  return name;
}

const COHORT_START = new Date("2025-01-20T09:00:00Z").getTime();
const TODAY = new Date("2026-09-16T09:00:00Z").getTime();

function randomSubmittedAt(recentBias: boolean): Date {
  const span = TODAY - COHORT_START;
  // recentBias skews toward "now" for open pipeline stages (submitted/under_review)
  const t = recentBias
    ? TODAY - Math.pow(rng.next(), 2.2) * span * 0.12
    : COHORT_START + rng.next() * span * 0.94;
  return new Date(t);
}

const partnerNotesByStage: Record<DealStage, string[]> = {
  submitted: ["Awaiting first-look assignment.", "Memo received, queued for rotation."],
  under_review: [
    "Reviewing unit economics vs. comps.",
    "Waiting on founder data room access.",
    "Second partner opinion requested.",
  ],
  declined: [
    "Thesis fit too thin outside fintech scope.",
    "Team strong, market too early for our stage.",
    "Passed — overlaps existing portfolio company.",
    "Cap table already crowded at this stage.",
    "Valuation expectations outside scout check range.",
  ],
  approved: ["Cleared first look, SAFE terms in redline.", "Approved, closing docs with scout."],
  check_written: [
    "SAFE executed, right-of-first-look logged.",
    "Convertible closed at cap; monitoring for next round.",
    "Check wired, scout retains board observer intro.",
  ],
  follow_on_watch: [
    "Bridge round signaled for Q1 — evaluating lead.",
    "Strong signal from existing investors on Series A.",
    "Tracking ARR growth ahead of priced round.",
  ],
  exited: ["Acquired by strategic — return realized.", "Secondary sale cleared above mark."],
  dead: ["Company wound down; capital written off.", "Failed to raise follow-on, ceased operations."],
};

// Funnel weights tuned so the numbers read like real early-stage sourcing:
// most memos get declined, a modest slice converts to a check, and only a
// fraction of funded deals survive to follow-on / exit / write-off.
const STAGE_WEIGHTS: [DealStage, number][] = [
  ["submitted", 5],
  ["under_review", 4],
  ["declined", 25],
  ["approved", 2],
  ["check_written", 6],
  ["follow_on_watch", 3],
  ["exited", 1],
  ["dead", 1],
];

const TOTAL_DEALS = 47;

// Tier-1 operators are the most active sourcers by design (widest network,
// most tenure); tier-3 specialists source fewer but higher-conviction deals.
const TIER_ACTIVITY_WEIGHT: Record<1 | 2 | 3, number> = { 1: 1.35, 2: 1.0, 3: 0.75 };

function buildScoutWeights() {
  return scouts.map((s) => [s.id, TIER_ACTIVITY_WEIGHT[s.tier]] as const);
}

function checkSizeFor(scoutAllocation: number): number {
  // Individual checks are a slice of the scout's total allocation, sized as
  // if 2–4 companies will share it across the cohort.
  const perCompanyMax = scoutAllocation / 2.4;
  const perCompanyMin = scoutAllocation / 4.2;
  return Math.round(rng.float(perCompanyMin, perCompanyMax, 0) / 1000) * 1000;
}

function responseHoursFor(stage: DealStage): { hours: number | null; firstLookAt: string | null; late: boolean } {
  if (stage === "submitted") return { hours: null, firstLookAt: null, late: false };
  // Most first-looks land comfortably inside the 48h target; a small tail
  // runs late — used later to power the "partner bandwidth" callout.
  const late = rng.bool(0.09);
  const hours = late ? rng.float(49, 76, 1) : rng.float(6, 47, 1);
  return { hours, firstLookAt: null, late };
}

const used = new Set<string>();
const scoutWeights = buildScoutWeights();

export const deals: Deal[] = Array.from({ length: TOTAL_DEALS }, (_, i) => {
  const scoutId = rng.weighted(scoutWeights);
  const scout = scouts.find((s) => s.id === scoutId)!;
  const stage = rng.weighted(STAGE_WEIGHTS);
  const recentBias = stage === "submitted" || stage === "under_review";
  const submittedAt = randomSubmittedAt(recentBias);
  const { hours, late } = responseHoursFor(stage);
  const firstLookAt = hours != null ? new Date(submittedAt.getTime() + hours * 3600_000).toISOString() : null;

  const funded = stage === "check_written" || stage === "follow_on_watch" || stage === "exited" || stage === "dead";
  const checkSizeUsd = funded ? checkSizeFor(scout.allocationUsd) : null;

  const geography = rng.bool(0.72)
    ? scout.coverage.split(" · ")[0]
    : rng.pick(GEOGRAPHIES);
  const sector = scout.coverage.toLowerCase().includes("crypto") || scout.coverage.toLowerCase().includes("stablecoin")
    ? rng.pick(["Stablecoin Infrastructure", "Crypto Custody", "RegTech / Compliance"] as const)
    : rng.pick(SECTORS);

  return {
    id: `dl_${String(i + 1).padStart(3, "0")}`,
    scoutId,
    companyName: makeCompanyName(used),
    sector,
    geography,
    stage,
    checkSizeUsd,
    submittedAt: submittedAt.toISOString(),
    firstLookAt,
    responseHours: hours,
    isLate: late,
    reviewingPartner: rng.pick(PARTNERS),
    partnerNotes: rng.pick(partnerNotesByStage[stage]),
    rightOfFirstLook: funded,
    followOnParticipated: stage === "follow_on_watch" || stage === "exited",
  } satisfies Deal;
}).sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
  .map((d, i) => ({ ...d, id: `dl_${String(i + 1).padStart(3, "0")}` }));

export const dealById = new Map(deals.map((d) => [d.id, d]));

export { GEOGRAPHIES, SECTORS };
