// The pipeline for bringing on a new scout — nomination through a signed
// agreement. Distinct from the deal pipeline; this is how the network
// itself grows, not how a deal moves.
export type CandidateStage =
  | "nominated"
  | "interview_scheduled"
  | "reference_check"
  | "agreement_sent"
  | "signed"
  | "declined";

export interface ScoutCandidate {
  id: string;
  name: string;
  proposedProfile: string; // e.g. "Operator", "Portfolio founder" — descriptive, not ranked
  proposedCoverage: string;
  affiliation: string;
  referredBy: string; // an existing scout or partner name
  stage: CandidateStage;
  notedAt: string; // ISO date, when nominated
  notes: string;
}

export type ScoutStatus = "active" | "alumni";

// Onboarding paperwork every scout needs on file before capital can be
// deployed on their intro (agreement) or before carry can ever be paid out
// to them (payout account) — see BLOCKERS #11 and #16.
export type PayoutAccountStatus = "not_linked" | "linked";

export interface Scout {
  id: string;
  name: string;
  email: string;
  // Descriptive, not ranked — the program doesn't sort scouts into tiers.
  // e.g. "Founder", "Ex-VC", "Operator".
  profile: string;
  title: string;
  affiliation: string;
  coverage: string; // vertical or geography they own
  initials: string;
  status: ScoutStatus;
  joinedAt: string; // ISO date
  agreementSignedAt: string; // ISO date — scout participation & carry agreement
  payoutAccountStatus: PayoutAccountStatus; // bank details on file for carry payout
}

export type DealStage =
  | "submitted"
  | "under_review"
  | "declined"
  | "approved"
  | "check_written"
  | "follow_on_watch"
  | "exited"
  | "dead";

// The legal/banking chain that actually turns an "approved" decision into a
// wired check — a real step in the process, not paperwork trivia. See the
// System Architecture doc for which of this is simulated vs. a real
// integration (SAFE drafting, e-signature, wire rails).
export type LegalDocStatus =
  | "not_started"
  | "draft_generated"
  | "sent_for_signature"
  | "executed";

export type WireStatus = "not_initiated" | "initiated" | "confirmed";

export type FollowOnDecision = "undecided" | "participating" | "passed";

export interface SafeTerms {
  instrument: "Post-Money SAFE";
  valuationCapUsd: number;
  discountPct: number;
}

export interface Deal {
  id: string;
  scoutId: string;
  companyName: string;
  sector: string;
  geography: string;
  stage: DealStage;
  checkSizeUsd: number | null; // proposed at approval, final once wired; null before approval
  submittedAt: string; // ISO date
  firstLookAt: string | null; // ISO date-time of partner first response
  responseHours: number | null; // hours to first response, null if still pending
  isLate: boolean; // response took longer than the 48h target
  reviewingPartner: string;
  partnerNotes: string;
  pitch: string; // the scout's own one-line case for the company — the memo itself
  // The mini memo every scout writes per deal — problem, product, team, and
  // why this one's worth a check. Null on older/seeded deals that predate
  // this requirement, which fall back to displaying `pitch` instead.
  problemDesc: string | null;
  productDesc: string | null;
  teamDesc: string | null;
  whyGreatDesc: string | null;
  // What the scout actually asked for at submission. Deals at or under the
  // full-autonomy threshold are auto-approved for this amount with no
  // partner review; above it, it's carried into the Fund Portal queue as
  // the suggested ticket, capped at the program's hard maximum.
  requestedTicketUsd: number | null;
  // True when this deal cleared straight to "approved" under the scout's
  // own authority (ticket at or under SCOUT_AUTONOMY_CAP_USD) rather than
  // through a partner decision.
  autonomyApproved: boolean;
  // The "more info" arm of the first-look response. A partner can send a
  // question back instead of deciding; the deal waits on the scout until
  // they answer, then returns to the decision queue.
  infoRequest: string | null;
  infoRequestedAt: string | null;
  infoResponse: string | null;
  submittedByScout: boolean; // true for intros submitted through the Scout Portal this session
  followOnParticipated: boolean;
  // Declared by the scout at submission — does the scout have an existing
  // stake, personal relationship, or other conflict with this company?
  // Standard LPA-driven disclosure requirement, surfaced to the partner
  // before they can decide.
  conflictDisclosed: boolean;
  conflictNotes: string | null;
  // Attribution. An intro only earns the scout credit, per-deal carry, if
  // the fund had no prior contact with the company. If someone here had
  // already met them or been introduced, the deal can still proceed; it
  // just doesn't count as sourced.
  scoutAttributed: boolean;
  priorContactNote: string | null;
  // A separate decision from the original scout ticket — whether the fund
  // (from Fund II proper, not the scout pool) follows into the company's
  // next priced round. Only actionable while stage is "follow_on_watch".
  followOnDecision: FollowOnDecision;
  followOnCheckUsd: number | null;
  // The legal/ops data the scout submits on an approved deal before a SAFE
  // can be drafted: who the money actually goes to, and the proposed
  // terms. The SAFE is generated from this, not assigned independently of
  // it — see submitLegalData / generateSafe in deal-store.tsx.
  legalEntityName: string | null; // legal name of the company receiving the investment
  taxId: string | null; // NIF / company tax ID
  proposedValuationCapUsd: number | null;
  proposedDiscountPct: number | null;
  proposedSafeDate: string | null; // ISO date, scout's proposed SAFE date
  legalDataSubmittedAt: string | null; // gates "Generate SAFE" in the closing queue
  legalDocStatus: LegalDocStatus;
  safeTerms: SafeTerms | null;
  wireStatus: WireStatus;
  wireConfirmedAt: string | null;
  carryPaidAt: string | null; // set once the scout's carry share on this exit has actually been distributed
  // Set when a partner records an actual exit. Null means "use the stage's
  // standard interim mark" (STAGE_MARK_MULTIPLE) — which is what the seeded
  // book does, since none of its exits have a negotiated outcome on file.
  exitMultiple: number | null;
  outcomeNote: string | null; // why a deal was written off, or how it exited
}

export interface NotificationEvent {
  id: string;
  ts: string; // ISO date-time
  kind: "submission" | "status_change" | "digest" | "late_response";
  dealId: string | null;
  actor: string;
  text: string;
}
