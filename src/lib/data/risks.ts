import type { RiskItem } from "./types";

export const risks: RiskItem[] = [
  {
    id: "risk_signaling",
    category: "Founder Relations",
    risk: "Signaling risk — a scout's small check is misread by the founder (or the market) as a full Shapers commitment, creating false expectations for the priced round.",
    likelihood: "Medium",
    impact: "High",
    mitigation:
      "Explicit language in the scout agreement and in the founder conversation: the scout check is personal-track capital with a right-of-first-look, not a lead commitment from Shapers.",
  },
  {
    id: "risk_compliance",
    category: "Legal & Compliance",
    risk: "Compliance exposure from cash-based finder's fees — paying scouts a cash success fee on deals they source risks broker-dealer / finder's-fee regulatory classification.",
    likelihood: "Low",
    impact: "Critical",
    mitigation:
      "Compensation is carry-only, deal-by-deal, never transaction-based cash. Keeps the program defensible under the same treatment as GP carry.",
  },
  {
    id: "risk_bandwidth",
    category: "Operations",
    risk: "Partner bandwidth / SLA erosion — as scout volume grows, the 48-hour first-look SLA slips, undermining the program's core promise to scouts.",
    likelihood: "Medium",
    impact: "Medium",
    mitigation:
      "Rotating review responsibility across partners; SLA is tracked per deal and reported in the quarterly digest so erosion is visible before it compounds.",
  },
  {
    id: "risk_thesis_drift",
    category: "Investment Strategy",
    risk: "Thesis drift outside fintech — scout networks naturally surface adjacent, non-fintech opportunities that dilute focus and portfolio construction.",
    likelihood: "Low",
    impact: "Medium",
    mitigation:
      "Scout mandate is explicitly scoped to fintech sub-verticals and the scout's assigned geography or vertical — out-of-scope memos are declined at first look.",
  },
];
