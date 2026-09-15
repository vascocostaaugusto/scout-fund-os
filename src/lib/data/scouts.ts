import { makeRng } from "./prng";
import type { Scout as ScoutType } from "./types";

const rng = makeRng(1337);

const COHORT = "Cohort 1 (2025–26)";

interface ScoutSeed {
  name: string;
  tier: 1 | 2 | 3;
  title: string;
  affiliation: string;
  coverage: string;
  joinedAt: string;
  status?: "active" | "vp-track" | "alumni";
}

const SEEDS: ScoutSeed[] = [
  // Tier 1 — Shapers Club Operators (8–10 scouts), existing LP-operators
  { name: "Elena Marchetti", tier: 1, title: "Co-founder & CEO", affiliation: "formerly Wise", coverage: "DACH · Banking-as-a-Service", joinedAt: "2025-01-13" },
  { name: "Jonas Aldenhoven", tier: 1, title: "Former VP Growth", affiliation: "formerly N26", coverage: "Germany · Neobanking", joinedAt: "2025-01-13" },
  { name: "Camille Rousseau", tier: 1, title: "Co-founder & COO", affiliation: "formerly Qonto", coverage: "France · SME Fintech", joinedAt: "2025-01-13", status: "vp-track" },
  { name: "Sofia Almeida", tier: 1, title: "Former Head of Payments", affiliation: "formerly Adyen", coverage: "Iberia · Payments Infra", joinedAt: "2025-02-03" },
  { name: "Lukas Berg", tier: 1, title: "Former VP Product", affiliation: "formerly Klarna", coverage: "Nordics · Embedded Finance", joinedAt: "2025-02-03" },
  { name: "Priya Nair", tier: 1, title: "Former Director of Strategy", affiliation: "formerly Revolut", coverage: "UK & Ireland · Open Banking", joinedAt: "2025-02-17" },
  { name: "Tomás Ribeiro", tier: 1, title: "Co-founder", affiliation: "formerly SumUp", coverage: "Southern Europe · PSPs", joinedAt: "2025-02-17" },
  { name: "Ingrid Solberg", tier: 1, title: "Former Head of BD", affiliation: "formerly Mollie", coverage: "Benelux · B2B Payments", joinedAt: "2025-03-10" },
  { name: "Marco Bittner", tier: 1, title: "Former Chief of Staff", affiliation: "formerly Bitpanda", coverage: "Austria & CEE · Retail Fintech", joinedAt: "2025-03-10" },

  // Tier 2 — Portfolio Founders (3–4 scouts) scouting peer founders
  { name: "Daniel Hoekstra", tier: 2, title: "Founder & CEO", affiliation: "Ledgerly (Shapers portfolio)", coverage: "SME Accounting Automation", joinedAt: "2025-04-01" },
  { name: "Aisha Bello", tier: 2, title: "Founder & CEO", affiliation: "Remitto (Shapers portfolio)", coverage: "Cross-Border Remittance", joinedAt: "2025-04-01" },
  { name: "Felix Turan", tier: 2, title: "Co-founder & CTO", affiliation: "Vaultic (Shapers portfolio)", coverage: "Embedded Banking Rails", joinedAt: "2025-04-15" },
  { name: "Nadia Kowalski", tier: 2, title: "Founder & CEO", affiliation: "Clearlane (Shapers portfolio)", coverage: "Credit & Lending Infra", joinedAt: "2025-05-05" },

  // Tier 3 — Category Specialists: crypto/stablecoins (2–3 scouts)
  { name: "Ravi Chandrasekaran", tier: 3, title: "Former Head of Stablecoin Partnerships", affiliation: "formerly Circle", coverage: "Stablecoin Infrastructure", joinedAt: "2025-05-19", status: "vp-track" },
  { name: "Yusuf Demir", tier: 3, title: "Former Compliance Lead", affiliation: "formerly Fireblocks", coverage: "Crypto Custody & Compliance", joinedAt: "2025-06-02" },
];

const TIER_LABEL: Record<1 | 2 | 3, string> = {
  1: "Shapers Club Operator",
  2: "Portfolio Founder",
  3: "Category Specialist",
};

// Personal allocation ceilings ($150K–$300K), tier-weighted: Tier 1 operators
// get the top of the band (deepest trust + widest reach), Tier 3 specialists
// start lower until their crypto thesis proves out.
const ALLOCATION_RANGE: Record<1 | 2 | 3, [number, number]> = {
  1: [210_000, 300_000],
  2: [180_000, 260_000],
  3: [150_000, 220_000],
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function round5k(n: number) {
  return Math.round(n / 5000) * 5000;
}

export const scouts: ScoutType[] = SEEDS.map((seed, i) => {
  const [lo, hi] = ALLOCATION_RANGE[seed.tier];
  return {
    id: `sct_${String(i + 1).padStart(2, "0")}`,
    name: seed.name,
    tier: seed.tier,
    tierLabel: TIER_LABEL[seed.tier],
    title: seed.title,
    affiliation: seed.affiliation,
    coverage: seed.coverage,
    initials: initials(seed.name),
    cohort: COHORT,
    status: seed.status ?? "active",
    allocationUsd: round5k(rng.int(lo, hi)),
    joinedAt: seed.joinedAt,
  };
});

export const scoutById = new Map(scouts.map((s) => [s.id, s]));

export const COHORT_LABEL = COHORT;
