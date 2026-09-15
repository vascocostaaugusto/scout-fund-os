// The relationship graph between the 7 program components. Used to draw
// cross-links on the system map and to power each detail page's "how this
// connects" callout — single source of truth so the two never drift apart.
export interface Connection {
  slug: string;
  note: string;
}

export const CONNECTIONS: Record<string, Connection[]> = {
  network: [
    { slug: "incentives", note: "Tier and allocation ceiling set each scout's earning potential." },
    { slug: "workflow", note: "Scouts are the sole entry point into the intake pipeline." },
  ],
  incentives: [
    { slug: "workflow", note: "Carry is attributed deal-by-deal, only once a check clears Approval." },
    { slug: "structure", note: "Carry mechanics depend on which structural option Fund II adopts." },
  ],
  workflow: [
    { slug: "info-hub", note: "Every stage change fires a notification and updates the system of record." },
    { slug: "incentives", note: "A written check is what starts a scout's carry attribution." },
  ],
  "info-hub": [
    { slug: "dashboard", note: "Aggregated pipeline data feeds every dashboard chart directly." },
    { slug: "workflow", note: "The Info Hub is the passive system of record behind the kanban." },
  ],
  structure: [
    { slug: "incentives", note: "Carve-out vs. SPV changes how — and when — scout carry is paid out." },
    { slug: "risk", note: "Structure choice is itself the top open item in the risk register." },
  ],
  dashboard: [
    { slug: "workflow", note: "SLA and funnel metrics are computed live from workflow stage data." },
    { slug: "network", note: "Per-scout performance rolls up from the same roster used network-wide." },
  ],
  risk: [
    { slug: "incentives", note: "Carry-only compensation is the primary mitigation for compliance exposure." },
    { slug: "workflow", note: "SLA tracking in the workflow is the mitigation for bandwidth erosion." },
  ],
};
