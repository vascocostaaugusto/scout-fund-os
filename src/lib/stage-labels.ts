import type { DealStage } from "@/lib/data";

// One canonical set of stage labels and badge styles for every view that
// shows a deal's stage — the table, the kanban, the audit log, the scout's
// own deal list. Previously each of those kept its own copy, which is how
// "Submitted" ended up meaning two different things depending on where you
// read it.
//
// "Awaiting first look" rather than "Submitted": every one of the 150
// records was submitted at some point, so "Submitted" doesn't distinguish
// anything. What this stage actually means is that the memo is in and no
// partner has responded to it yet.
export const STAGE_LABEL: Record<DealStage, string> = {
  submitted: "Awaiting first look",
  under_review: "Under review",
  approved: "Approved",
  declined: "Declined",
  check_written: "Check written",
  follow_on_watch: "Follow-on watch",
  exited: "Exited",
  dead: "Written off",
};

export const STAGE_BADGE: Record<DealStage, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  under_review: "bg-warning/15 text-warning",
  approved: "bg-primary/15 text-primary",
  declined: "bg-critical/15 text-critical",
  check_written: "bg-primary/15 text-primary",
  follow_on_watch: "bg-primary/15 text-primary",
  exited: "bg-success/15 text-success",
  dead: "bg-critical/15 text-critical",
};

export const STAGE_DOT: Record<DealStage, string> = {
  submitted: "bg-muted-foreground",
  under_review: "bg-warning",
  approved: "bg-primary",
  declined: "bg-critical",
  check_written: "bg-primary",
  follow_on_watch: "bg-primary",
  exited: "bg-success",
  dead: "bg-critical",
};

// What each stage means in one line — used as the kanban column subtitle.
export const STAGE_HINT: Record<DealStage, string> = {
  submitted: "Memo in, no partner has responded yet",
  under_review: "Partner responded, decision pending",
  approved: "Cleared — SAFE and wire in progress",
  declined: "Passed at first look",
  check_written: "SAFE executed, wire confirmed",
  follow_on_watch: "Next round signaled, fund deciding whether to follow on",
  exited: "Return realized",
  dead: "Capital written off",
};

export const STAGE_ORDER: DealStage[] = [
  "submitted",
  "under_review",
  "approved",
  "declined",
  "check_written",
  "follow_on_watch",
  "exited",
  "dead",
];
