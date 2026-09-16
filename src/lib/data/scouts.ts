import type { Scout as ScoutType } from "./types";

const COHORT = "Cohort 1 (2025–26)";

interface ScoutSeed {
  name: string;
  tier: 1 | 2 | 3;
  title: string;
  affiliation: string;
  coverage: string;
  joinedAt: string;
  status?: "active" | "alumni";
}

const SEEDS: ScoutSeed[] = [
  // Tier 1 — Shapers Club Operators (16–20 scouts), existing LP-operators
  { name: "Elena Marchetti", tier: 1, title: "Co-founder & CEO", affiliation: "formerly Wise", coverage: "DACH · Banking-as-a-Service", joinedAt: "2025-01-13" },
  { name: "Jonas Aldenhoven", tier: 1, title: "Former VP Growth", affiliation: "formerly N26", coverage: "Germany · Neobanking", joinedAt: "2025-01-13" },
  { name: "Camille Rousseau", tier: 1, title: "Co-founder & COO", affiliation: "formerly Qonto", coverage: "France · SME Fintech", joinedAt: "2025-01-13" },
  { name: "Sofia Almeida", tier: 1, title: "Former Head of Payments", affiliation: "formerly Adyen", coverage: "Iberia · Payments Infra", joinedAt: "2025-02-03" },
  { name: "Lukas Berg", tier: 1, title: "Former VP Product", affiliation: "formerly Klarna", coverage: "Nordics · Embedded Finance", joinedAt: "2025-02-03" },
  { name: "Priya Nair", tier: 1, title: "Former Director of Strategy", affiliation: "formerly Revolut", coverage: "UK & Ireland · Open Banking", joinedAt: "2025-02-17" },
  { name: "Tomás Ribeiro", tier: 1, title: "Co-founder", affiliation: "formerly SumUp", coverage: "Southern Europe · PSPs", joinedAt: "2025-02-17" },
  { name: "Ingrid Solberg", tier: 1, title: "Former Head of BD", affiliation: "formerly Mollie", coverage: "Benelux · B2B Payments", joinedAt: "2025-03-10" },
  { name: "Marco Bittner", tier: 1, title: "Former Chief of Staff", affiliation: "formerly Bitpanda", coverage: "Austria & CEE · Retail Fintech", joinedAt: "2025-03-10" },
  { name: "Freya Nilsen", tier: 1, title: "Co-founder & CPO", affiliation: "formerly Lunar", coverage: "Denmark · Consumer Neobanking", joinedAt: "2025-03-24" },
  { name: "Bastian Voss", tier: 1, title: "Former Head of Risk", affiliation: "formerly Trade Republic", coverage: "Germany · Wealth & Trading", joinedAt: "2025-03-24" },
  { name: "Isabelle Duarte", tier: 1, title: "Co-founder & CEO", affiliation: "formerly Vivid Money", coverage: "Germany · Consumer Banking", joinedAt: "2025-04-07" },
  { name: "Robin Ashworth", tier: 1, title: "Former VP Engineering", affiliation: "formerly Monzo", coverage: "UK & Ireland · Consumer Banking", joinedAt: "2025-04-07" },
  { name: "Megan Pierce", tier: 1, title: "Former Chief of Staff", affiliation: "formerly Starling Bank", coverage: "UK & Ireland · SME Banking", joinedAt: "2025-04-21" },
  { name: "Willem de Groot", tier: 1, title: "Co-founder & COO", affiliation: "formerly Bunq", coverage: "Benelux · Consumer Banking", joinedAt: "2025-04-21" },
  { name: "Anders Kristiansen", tier: 1, title: "Former Head of Partnerships", affiliation: "formerly Pleo", coverage: "Nordics · Spend Management", joinedAt: "2025-05-05" },
  { name: "Harriet Cole", tier: 1, title: "Former VP Product", affiliation: "formerly GoCardless", coverage: "UK & Ireland · Payments Infra", joinedAt: "2025-05-05" },
  { name: "Nikolai Petrov", tier: 1, title: "Former Head of BD", affiliation: "formerly Checkout.com", coverage: "Southern Europe · Payments Infra", joinedAt: "2025-05-19" },

  // Tier 2 — Portfolio Founders (6–8 scouts) scouting peer founders
  { name: "Daniel Hoekstra", tier: 2, title: "Founder & CEO", affiliation: "Ledgerly (Shapers portfolio)", coverage: "SME Accounting Automation", joinedAt: "2025-04-01" },
  { name: "Aisha Bello", tier: 2, title: "Founder & CEO", affiliation: "Remitto (Shapers portfolio)", coverage: "Cross-Border Remittance", joinedAt: "2025-04-01" },
  { name: "Felix Turan", tier: 2, title: "Co-founder & CTO", affiliation: "Vaultic (Shapers portfolio)", coverage: "Embedded Banking Rails", joinedAt: "2025-04-15" },
  { name: "Nadia Kowalski", tier: 2, title: "Founder & CEO", affiliation: "Clearlane (Shapers portfolio)", coverage: "Credit & Lending Infra", joinedAt: "2025-05-05" },
  { name: "Mateus Silva", tier: 2, title: "Founder & CEO", affiliation: "Brixly (Shapers portfolio)", coverage: "SME Lending Infra", joinedAt: "2025-05-19" },
  { name: "Chloe Fontaine", tier: 2, title: "Co-founder & CPO", affiliation: "Payflow Labs (Shapers portfolio)", coverage: "B2B Payments Automation", joinedAt: "2025-06-02" },
  { name: "Omar El-Sayed", tier: 2, title: "Founder & CEO", affiliation: "Trustlane (Shapers portfolio)", coverage: "Trade Finance", joinedAt: "2025-06-16" },
  { name: "Greta Lindqvist", tier: 2, title: "Co-founder & CTO", affiliation: "Nimbly (Shapers portfolio)", coverage: "Expense Management", joinedAt: "2025-06-30" },

  // Tier 3 — Category Specialists: crypto/stablecoins (3–5 scouts)
  { name: "Ravi Chandrasekaran", tier: 3, title: "Former Head of Stablecoin Partnerships", affiliation: "formerly Circle", coverage: "Stablecoin Infrastructure", joinedAt: "2025-05-19" },
  { name: "Yusuf Demir", tier: 3, title: "Former Compliance Lead", affiliation: "formerly Fireblocks", coverage: "Crypto Custody & Compliance", joinedAt: "2025-06-02" },
  { name: "Layla Haddad", tier: 3, title: "Former Head of Compliance", affiliation: "formerly Coinbase", coverage: "Crypto Regulatory & Licensing", joinedAt: "2025-07-07" },
  { name: "Erik Johansson", tier: 3, title: "Former Protocol Lead", affiliation: "formerly Paxos", coverage: "Stablecoin Issuance & Reserves", joinedAt: "2025-07-21" },
];

const TIER_LABEL: Record<1 | 2 | 3, string> = {
  1: "Shapers Club Operator",
  2: "Portfolio Founder",
  3: "Category Specialist",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function emailFor(name: string) {
  const [first, last] = name.toLowerCase().split(" ");
  const deaccented = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  return `${deaccented(first)}.${deaccented(last)}@scouts.shapers.vc`;
}

export const scouts: ScoutType[] = SEEDS.map((seed, i) => ({
  id: `sct_${String(i + 1).padStart(2, "0")}`,
  name: seed.name,
  email: emailFor(seed.name),
  tier: seed.tier,
  tierLabel: TIER_LABEL[seed.tier],
  title: seed.title,
  affiliation: seed.affiliation,
  coverage: seed.coverage,
  initials: initials(seed.name),
  cohort: COHORT,
  status: seed.status ?? "active",
  joinedAt: seed.joinedAt,
}));

export const scoutById = new Map(scouts.map((s) => [s.id, s]));

export const COHORT_LABEL = COHORT;
