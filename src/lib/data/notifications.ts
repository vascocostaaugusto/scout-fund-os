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
      kind: deal.slaBreached ? "sla_warning" : "status_change",
      dealId: deal.id,
      actor: deal.reviewingPartner,
      text: deal.slaBreached
        ? `SLA breached: ${deal.companyName} sat ${deal.slaHours?.toFixed(0)}h before first look from ${deal.reviewingPartner}.`
        : `${deal.companyName} ${verb} — ${deal.reviewingPartner}, ${deal.slaHours?.toFixed(0)}h response.`,
    });
  }
}

// Quarterly digests — one every ~13 weeks from cohort start through today.
const digestDates = ["2025-04-20", "2025-07-20", "2025-10-20", "2026-01-20", "2026-04-20", "2026-07-20"];
for (const d of digestDates) {
  events.push({
    id: nextId(),
    ts: new Date(`${d}T08:00:00Z`).toISOString(),
    kind: "digest",
    dealId: null,
    actor: "Info Hub",
    text: `Quarterly scout digest generated and shared to the ${digestDates.indexOf(d) + 1 === digestDates.length ? "full" : "active"} cohort.`,
  });
}

events = events.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

export const notifications = events;
