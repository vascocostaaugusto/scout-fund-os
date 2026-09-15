export type ScoutTier = 1 | 2 | 3;

export type ScoutStatus = "active" | "vp-track" | "alumni";

export interface Scout {
  id: string;
  name: string;
  tier: ScoutTier;
  tierLabel: string;
  title: string;
  affiliation: string;
  coverage: string; // vertical or geography they own
  initials: string;
  cohort: string; // e.g. "Cohort 1 (2025–26)"
  status: ScoutStatus;
  allocationUsd: number; // personal allocation ceiling for this cohort
  joinedAt: string; // ISO date
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

export interface Deal {
  id: string;
  scoutId: string;
  companyName: string;
  sector: string;
  geography: string;
  stage: DealStage;
  checkSizeUsd: number | null; // null until a check is written
  submittedAt: string; // ISO date
  firstLookAt: string | null; // ISO date-time of partner first response
  slaHours: number | null; // hours to first response, null if still pending
  slaBreached: boolean;
  reviewingPartner: string;
  partnerNotes: string;
  rightOfFirstLook: boolean;
  followOnParticipated: boolean;
}

export interface NotificationEvent {
  id: string;
  ts: string; // ISO date-time
  kind: "submission" | "status_change" | "digest" | "sla_warning";
  dealId: string | null;
  actor: string;
  text: string;
}

export type RiskLikelihood = "Low" | "Medium" | "High";
export type RiskImpact = "Low" | "Medium" | "High" | "Critical";

export interface RiskItem {
  id: string;
  category: string;
  risk: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  mitigation: string;
}
