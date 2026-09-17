import { deals } from "./deals";
import { scoutById } from "./scouts";
import type { Deal } from "./types";

// The overnight pass: what an inbox-reading automation would have found in
// email and Slack since yesterday, turned into *proposed* record changes for
// a partner to confirm. Nothing here writes itself — see the architecture
// doc's inbound section for why the design is propose-then-confirm rather
// than silent auto-update.
//
// Proposals are derived from real deals in the dataset so that confirming
// one actually moves a record, rather than being a decorative inbox.
export type ProposalKind = "write_off" | "mark_exited" | "follow_on_watch" | "new_intro";

export interface InboxProposal {
  id: string;
  source: "gmail" | "slack";
  from: string;
  subject: string;
  excerpt: string; // the line the extraction keyed off
  receivedAt: string;
  dealId: string | null;
  kind: ProposalKind;
  summary: string; // the change being proposed, in plain language
  exitMultiple?: number;
  confidence: "high" | "needs review";
}

// The app runs on a frozen clock (see timeAgo in lib/format.ts) — anything
// dated after it reads as a negative "time ago", so the overnight pass is
// anchored to that same reference rather than to the real calendar.
const REFERENCE_NOW = new Date("2026-09-16T09:00:00Z");
const LAST_RUN = new Date("2026-09-16T07:10:00Z");

function at(hoursAgo: number): string {
  return new Date(REFERENCE_NOW.getTime() - hoursAgo * 3600_000).toISOString();
}

// Pick stable, real targets out of the seeded pipeline.
const liveCompanies: Deal[] = deals.filter((d) => d.stage === "check_written");
const watchCompanies: Deal[] = deals.filter((d) => d.stage === "follow_on_watch");

const shutdownTarget = liveCompanies[2] ?? liveCompanies[0] ?? null;
const exitTarget = watchCompanies[1] ?? watchCompanies[0] ?? null;
const raisingTarget = liveCompanies[5] ?? liveCompanies[1] ?? null;

const proposals: InboxProposal[] = [];

if (shutdownTarget) {
  proposals.push({
    id: "inbox_01",
    source: "gmail",
    from: `founders@${shutdownTarget.companyName.toLowerCase()}.com`,
    subject: `Winding down ${shutdownTarget.companyName}`,
    excerpt:
      "After eighteen months we weren't able to find a path to the next round, and the board has agreed to wind the company down at the end of the month.",
    receivedAt: at(11),
    dealId: shutdownTarget.id,
    kind: "write_off",
    summary: `Write off ${shutdownTarget.companyName} — mark the position at zero and close it`,
    confidence: "high",
  });
}

if (exitTarget) {
  proposals.push({
    id: "inbox_02",
    source: "gmail",
    from: "corpdev@northbank.example",
    subject: `Signed — ${exitTarget.companyName} acquisition`,
    excerpt:
      "Confirming the SPA was signed this morning. Proceeds to the SAFE holders work out at roughly 5.5x on the original instrument.",
    receivedAt: at(7),
    dealId: exitTarget.id,
    kind: "mark_exited",
    summary: `Record an exit on ${exitTarget.companyName} at 5.5x`,
    exitMultiple: 5.5,
    confidence: "needs review",
  });
}

if (raisingTarget) {
  const scout = scoutById.get(raisingTarget.scoutId);
  proposals.push({
    id: "inbox_03",
    source: "slack",
    from: scout?.name ?? "A scout",
    subject: `#scout-pipeline — ${raisingTarget.companyName}`,
    excerpt: `Heads up, ${raisingTarget.companyName} is opening a Series A next month and asked whether we want to take our pro-rata.`,
    receivedAt: at(4),
    dealId: raisingTarget.id,
    kind: "follow_on_watch",
    summary: `Flag ${raisingTarget.companyName} for follow-on watch`,
    confidence: "high",
  });
}

proposals.push({
  id: "inbox_04",
  source: "gmail",
  from: "priya.nair@scouts.shapers.vc",
  subject: "Intro — Kestrel (open banking, Dublin)",
  excerpt:
    "Forwarding an intro to the Kestrel founders — ex-Stripe, doing account-to-account payouts for marketplaces. Worth a first look?",
  receivedAt: at(3),
  dealId: null,
  kind: "new_intro",
  summary: "Create a new memo for Kestrel, sourced by Priya Nair",
  confidence: "needs review",
});

export const inboxProposals: InboxProposal[] = proposals.sort(
  (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
);

export const INBOX_LAST_RUN = LAST_RUN.toISOString();
