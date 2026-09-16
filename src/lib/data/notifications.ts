import { deals } from "./deals";
import { scoutById } from "./scouts";
import type { NotificationEvent, DealStage } from "./types";

const STAGE_VERB: Partial<Record<DealStage, string>> = {
  under_review: "moved to Under Review",
  declined: "was declined",
  approved: "cleared first look",
  check_written: "check written",
  follow_on_watch: "flagged for follow-on watch",
  exited: "exited",
  dead: "written off",
};

function scoutName(scoutId: string) {
  return scoutById.get(scoutId)?.name ?? "Unknown scout";
}

let events: NotificationEvent[] = [];
let n = 0;
const nextId = () => `ntf_${String(++n).padStart(4, "0")}`;

for (const deal of deals) {
  events.push({
    id: nextId(),
    ts: deal.submittedAt,
    kind: "submission",
    dealId: deal.id,
    actor: scoutName(deal.scoutId),
    text: `${scoutName(deal.scoutId)} submitted a memo for ${deal.companyName} (${deal.sector}).`,
  });

  if (deal.stage !== "submitted" && deal.firstLookAt) {
    const verb = STAGE_VERB[deal.stage] ?? "updated";
    events.push({
      id: nextId(),
      ts: deal.firstLookAt,
      kind: deal.isLate ? "late_response" : "status_change",
      dealId: deal.id,
      actor: deal.reviewingPartner,
      text: deal.isLate
        ? `Response ran late: ${deal.companyName} sat ${deal.responseHours?.toFixed(0)}h before first look from ${deal.reviewingPartner}.`
        : `${deal.companyName} ${verb} — ${deal.reviewingPartner}, ${deal.responseHours?.toFixed(0)}h response.`,
    });
  }
}

// Monthly scout summaries — one per month from a month after cohort start
// through the current month. Each scout gets a personal recap of their own
// pipeline that month (built in the Scout Portal); this program-level entry
// is the aggregate "digest sent" event in the shared feed.
const COHORT_START = new Date("2025-01-20T09:00:00Z");
const TODAY = new Date("2026-09-16T09:00:00Z");

const digestDates: string[] = [];
{
  const cursor = new Date(COHORT_START);
  cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  while (cursor < TODAY) {
    digestDates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
}

for (const d of digestDates) {
  events.push({
    id: nextId(),
    ts: new Date(`${d}T08:00:00Z`).toISOString(),
    kind: "digest",
    dealId: null,
    actor: "Info Hub",
    text: "Monthly scout summaries generated and sent — a personal recap for each active scout, or a quick check-in where there was nothing new to report.",
  });
}

events = events.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

export const notifications = events;
export const monthlyDigestCount = digestDates.length;
