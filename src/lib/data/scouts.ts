import { makeRng } from "./prng";
import type { Scout as ScoutType } from "./types";

const onboardingRng = makeRng(9182);

interface ScoutSeed {
  name: string;
  profile: string;
  title: string;
  affiliation: string;
  coverage: string;
  joinedAt: string;
  status?: "active" | "alumni";
}

const SEEDS: ScoutSeed[] = [
  // Operators with an existing Shapers Club relationship — the widest
  // network, and the highest sourcing volume by design.
  { name: "Elena Marchetti", profile: "Operator", title: "Co-founder & CEO", affiliation: "formerly Wise", coverage: "DACH · Banking-as-a-Service", joinedAt: "2025-01-13" },
  { name: "Jonas Aldenhoven", profile: "Operator", title: "Former VP Growth", affiliation: "formerly N26", coverage: "Germany · Neobanking", joinedAt: "2025-01-13" },
  { name: "Camille Rousseau", profile: "Operator", title: "Co-founder & COO", affiliation: "formerly Qonto", coverage: "France · SME Fintech", joinedAt: "2025-01-13" },
  { name: "Sofia Almeida", profile: "Operator", title: "Former Head of Payments", affiliation: "formerly Adyen", coverage: "Iberia · Payments Infra", joinedAt: "2025-02-03" },
  { name: "Lukas Berg", profile: "Operator", title: "Former VP Product", affiliation: "formerly Klarna", coverage: "Nordics · Embedded Finance", joinedAt: "2025-02-03" },
  { name: "Priya Nair", profile: "Operator", title: "Former Director of Strategy", affiliation: "formerly Revolut", coverage: "UK & Ireland · Open Banking", joinedAt: "2025-02-17" },
  { name: "Tomás Ribeiro", profile: "Ex-founder", title: "Co-founder", affiliation: "formerly SumUp", coverage: "Southern Europe · PSPs", joinedAt: "2025-02-17" },
  { name: "Ingrid Solberg", profile: "Operator", title: "Former Head of BD", affiliation: "formerly Mollie", coverage: "Benelux · B2B Payments", joinedAt: "2025-03-10" },
  { name: "Marco Bittner", profile: "Operator", title: "Former Chief of Staff", affiliation: "formerly Bitpanda", coverage: "Austria & CEE · Retail Fintech", joinedAt: "2025-03-10" },
  { name: "Freya Nilsen", profile: "Ex-founder", title: "Co-founder & CPO", affiliation: "formerly Lunar", coverage: "Denmark · Consumer Neobanking", joinedAt: "2025-03-24" },
  { name: "Bastian Voss", profile: "Operator", title: "Former Head of Risk", affiliation: "formerly Trade Republic", coverage: "Germany · Wealth & Trading", joinedAt: "2025-03-24" },
  { name: "Isabelle Duarte", profile: "Ex-founder", title: "Co-founder & CEO", affiliation: "formerly Vivid Money", coverage: "Germany · Consumer Banking", joinedAt: "2025-04-07" },
  { name: "Robin Ashworth", profile: "Operator", title: "Former VP Engineering", affiliation: "formerly Monzo", coverage: "UK & Ireland · Consumer Banking", joinedAt: "2025-04-07" },
  { name: "Megan Pierce", profile: "Operator", title: "Former Chief of Staff", affiliation: "formerly Starling Bank", coverage: "UK & Ireland · SME Banking", joinedAt: "2025-04-21" },
  { name: "Willem de Groot", profile: "Ex-founder", title: "Co-founder & COO", affiliation: "formerly Bunq", coverage: "Benelux · Consumer Banking", joinedAt: "2025-04-21" },
  { name: "Anders Kristiansen", profile: "Operator", title: "Former Head of Partnerships", affiliation: "formerly Pleo", coverage: "Nordics · Spend Management", joinedAt: "2025-05-05" },
  { name: "Harriet Cole", profile: "Operator", title: "Former VP Product", affiliation: "formerly GoCardless", coverage: "UK & Ireland · Payments Infra", joinedAt: "2025-05-05" },
  { name: "Nikolai Petrov", profile: "Operator", title: "Former Head of BD", affiliation: "formerly Checkout.com", coverage: "Southern Europe · Payments Infra", joinedAt: "2025-05-19" },

  // Founders of existing Shapers portfolio companies, scouting peer founders
  // in adjacent categories — high signal, low volume by nature.
  { name: "Daniel Hoekstra", profile: "Portfolio founder", title: "Founder & CEO", affiliation: "Ledgerly (Shapers portfolio)", coverage: "SME Accounting Automation", joinedAt: "2025-04-01" },
  { name: "Aisha Bello", profile: "Portfolio founder", title: "Founder & CEO", affiliation: "Remitto (Shapers portfolio)", coverage: "Cross-Border Remittance", joinedAt: "2025-04-01" },
  { name: "Felix Turan", profile: "Portfolio founder", title: "Co-founder & CTO", affiliation: "Vaultic (Shapers portfolio)", coverage: "Embedded Banking Rails", joinedAt: "2025-04-15" },
  { name: "Nadia Kowalski", profile: "Portfolio founder", title: "Founder & CEO", affiliation: "Clearlane (Shapers portfolio)", coverage: "Credit & Lending Infra", joinedAt: "2025-05-05" },
  { name: "Mateus Silva", profile: "Portfolio founder", title: "Founder & CEO", affiliation: "Brixly (Shapers portfolio)", coverage: "SME Lending Infra", joinedAt: "2025-05-19" },
  { name: "Chloe Fontaine", profile: "Portfolio founder", title: "Co-founder & CPO", affiliation: "Payflow Labs (Shapers portfolio)", coverage: "B2B Payments Automation", joinedAt: "2025-06-02" },
  { name: "Omar El-Sayed", profile: "Portfolio founder", title: "Founder & CEO", affiliation: "Trustlane (Shapers portfolio)", coverage: "Trade Finance", joinedAt: "2025-06-16" },
  { name: "Greta Lindqvist", profile: "Portfolio founder", title: "Co-founder & CTO", affiliation: "Nimbly (Shapers portfolio)", coverage: "Expense Management", joinedAt: "2025-06-30" },

  // Category specialists patching the one vertical where the core team's
  // network is thinnest: crypto and stablecoin infrastructure.
  { name: "Ravi Chandrasekaran", profile: "Ex-VC", title: "Former Head of Stablecoin Partnerships", affiliation: "formerly Circle", coverage: "Stablecoin Infrastructure", joinedAt: "2025-05-19" },
  { name: "Yusuf Demir", profile: "Operator", title: "Former Compliance Lead", affiliation: "formerly Fireblocks", coverage: "Crypto Custody & Compliance", joinedAt: "2025-06-02" },
  { name: "Layla Haddad", profile: "Ex-VC", title: "Former Head of Compliance", affiliation: "formerly Coinbase", coverage: "Crypto Regulatory & Licensing", joinedAt: "2025-07-07" },
  { name: "Erik Johansson", profile: "Operator", title: "Former Protocol Lead", affiliation: "formerly Paxos", coverage: "Stablecoin Issuance & Reserves", joinedAt: "2025-07-21" },
];

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
  profile: seed.profile,
  title: seed.title,
  affiliation: seed.affiliation,
  coverage: seed.coverage,
  initials: initials(seed.name),
  status: seed.status ?? "active",
  joinedAt: seed.joinedAt,
  // The participation & carry agreement is signed as part of onboarding —
  // scouting can't start before it, so it's always on file for every active
  // scout, dated to the day they joined.
  agreementSignedAt: seed.joinedAt,
  // Payout bank details are a separate step from onboarding — real people
  // procrastinate on paperwork with no immediate payoff, so a realistic
  // minority haven't done it yet. This is what blocks a carry payout on
  // exit even after the deal itself has closed.
  payoutAccountStatus: onboardingRng.bool(0.78) ? "linked" : "not_linked",
}));

export const scoutById = new Map(scouts.map((s) => [s.id, s]));
