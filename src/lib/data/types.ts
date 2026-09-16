export type ScoutTier = 1 | 2 | 3;

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
  proposedTier: ScoutTier;
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
// to them (tax form, payout account) — see BLOCKERS #11.
export type TaxFormStatus = "not_submitted" | "submitted";
export type PayoutAccountStatus = "not_linked" | "linked";

export interface Scout {
  id: string;
  name: string;
  email: string;
  tier: ScoutTier;
  tierLabel: string;
  title: string;
  affiliation: string;
  coverage: string; // vertical or geography they own
  initials: string;
  cohort: string; // e.g. "Cohort 1 (2025–26)"
  status: ScoutStatus;
  joinedAt: string; // ISO date
  agreementSignedAt: string; // ISO date — scout participation & carry agreement
  taxFormStatus: TaxFormStatus; // W-9 / W-8BEN on file
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
  rightOfFirstLook: boolean;
  followOnParticipated: boolean;
  // Declared by the scout at submission — does the scout have an existing
  // stake, personal relationship, or other conflict with this company?
  // Standard LPA-driven disclosure requirement, surfaced to the partner
  // before they can decide.
  conflictDisclosed: boolean;
  conflictNotes: string | null;
  legalDocStatus: LegalDocStatus;
  safeTerms: SafeTerms | null;
  wireStatus: WireStatus;
  wireConfirmedAt: string | null;
  carryPaidAt: string | null; // set once the scout's carry share on this exit has actually been distributed
}

export interface NotificationEvent {
  id: string;
  ts: string; // ISO date-time
  kind: "submission" | "status_change" | "digest" | "late_response";
  dealId: string | null;
  actor: string;
  text: string;
}
