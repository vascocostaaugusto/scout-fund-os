# Blockers & Assumptions Log

Per working instructions: no stopping to ask questions. Anything ambiguous gets
a reasonable, documented assumption and I keep moving. Logged here as they came
up, not just at the end.

## 1. Exact fund-level dollar figures
**Ambiguity:** Brief gives ranges (Fund II $100–150M, scout pool <5% → $5–7.5M)
but no single numbers to build consistent mock data around.
**Assumption:** Fund II target midpoint $125M. Scout pool $6.0M (4.8% of
Fund II — comfortably under the 5% ceiling). Capital allocated to the current
program's 15 scouts sums to ~$3.49M (tier-weighted $150K–$300K ceilings),
leaving headroom in the $6.0M pool for roster growth. All committed to
`src/lib/data/aggregates.ts` as named constants, not scattered magic numbers.

## 2. Deal/scout volume and funnel shape
**Ambiguity:** Brief's example numbers ("37 memos, 9 funded") are explicitly
illustrative, not a spec.
**Assumption:** 47 memos across 15 scouts (seeded PRNG, `seed=5150` chosen
after sampling ~10 seeds for a distribution with no zero-activity scouts),
13 funded (27.7% conversion), avg SLA 31.7h. Every downstream number (summary
strip, per-scout stats, dashboard charts) derives from this one `deals` array
— see `src/lib/data/deals.ts` and `aggregates.ts`.

## 3. Zero exited/dead deals in the current snapshot
**Observation, not really a blocker:** The seeded data landed with 0 "Exited"
and 1 "Dead" deal. Initially read as a data-realism gap; on reflection this is
actually correct behavior — the program is ~20 months into its 24-month
window, and real venture exits take years. Left as-is; called out explicitly
in the Workflow/Dashboard copy rather than forcing fake exits into the data.

## 4. The "carry vs. capital" headline model (Success Dashboard, long-term)
**Ambiguity:** Brief asks for "scout-sourced capital's share of Fund II's
overall carry vs. the <5% capital it represents" as the headline proof chart,
but a $1M-deployed scout book can't organically outperform a $125M fund's
carry pool at today's snapshot — venture carry realizes over a fund's full
life, not in year 1.7.
**Assumption:** Explicitly modeled at Fund II maturity (Year 8), with stated
assumptions: whole-fund blended gross MOIC 3.0x vs. scout-book blended MOIC
4.5x (the "earlier, cheaper entry into the same eventual winners" thesis),
20% carry rate applied fund-wide. Yields scout carry share ≈ 8.4% against a
4.8% capital share (~1.75x). All assumptions are surfaced in the UI copy
directly under the chart so it's defensible if a partner asks about it live.
See `MATURITY_WHOLE_FUND_MOIC` / `MATURITY_SCOUT_BOOK_MOIC` in
`src/lib/data/aggregates.ts`.

## 5. Scout retention, with no intakes to compare
**Ambiguity:** Brief asks for a retention trend, but the program is a single
fixed 24-month run — there is no second intake to measure a second point
against, so a trend line has nothing to plot.
**Assumption:** Retention is measured *within* the 24-month window instead:
how many scouts onboarded at the start are still submitting at month 20.
That's a real, computable number from the deal data rather than an invented
curve, and it answers the question the trend was reaching for — does the
program hold the people it recruits — without inventing intakes that don't
exist. Superseded by a later decision to drop intake framing entirely; see
entry 18.

## 6. Individual scout/founder names
**Ambiguity:** Source content references real companies (Qonto, Wise, N26,
Bitpanda) as flavor for scout backgrounds, but no real individuals are named.
**Assumption:** Company names kept (they're the user's own brief content,
common in scout-bio framing), but all scout/founder names are invented
fictional people — avoids fabricating statements or affiliations for real
individuals while keeping the company-pedigree realism the brief asked for.

## 7. Design system / accent color
**Ambiguity:** Brief says "avoid default shadcn blue, pick a considered accent
in the deep green/navy/amber family" with no further spec.
**Assumption:** Ran the `dataviz` skill's palette validator to build a
CVD-safe deep-emerald ordinal ramp for both light and dark chart surfaces,
kept the skill's fixed status palette (good/warning/serious/critical — amber
lands naturally on "warning," satisfying the "amber for risk/SLA attention"
ask) untouched since status colors are meant to stay invariant across brands.
Documented in `PLAN.md` and `globals.css` comments.

## 8. No per-scout or per-deal drill-down detail pages
**Ambiguity:** Brief specifies exactly 7 detail views (one per program
component), not a page per scout or per deal.
**Assumption:** Kept to the 7 specified routes. Scout/deal-level detail is
surfaced inline (tables, kanban cards, tooltips) rather than as separate
routes, to stay inside the specified information architecture.

## 9. Shared evergreen pool model (post-launch revision)
**Ambiguity:** User asked to move from per-scout fixed allocations to "a
shared evergreen $6M pool," 30 active scouts, $10K–$50K tickets, and a
24-month full-deployment target — but didn't specify exact roster
composition, ticket-size distribution shape, or how far along deployment
should be today.
**Assumptions:**
- 30 scouts keeps the original 9:4:2 tier ratio doubled to 18:8:4
  (Tier 1/2/3), with 15 new fictional bios added in the same style as the
  original 15 (real company pedigree, invented individuals).
- Ticket size drawn uniformly from $10K–$50K (no skew) — the brief gave a
  flat range, not a distribution shape.
- Deployment-to-date is real and *behind* the straight-line pacing target
  (~20% of pool deployed vs. ~85% of pace-to-date would imply) rather than
  forced to match. This is deliberate: a referral-driven scout program
  plausibly ramps slower than a linear target early on, and showing a real
  gap is what makes the new pacing chart worth having — a chart that
  always shows "on track" proves nothing.
- The 24-month pacing clock uses the same program-start date already used
  everywhere else (Jan 2025) rather than resetting to "today," so the app
  keeps one single consistent timeline instead of introducing a second one.

## 10. Splitting into app / program brief / architecture doc
**Ambiguity:** User asked to separate "informative/assumption" content from
"working" content into three deliverables (a lean app, a program brief
document, an architecture document), with several examples given via
screenshots but not a field-by-field spec of exactly what moves where.
**Assumptions and judgment calls:**
- Treated as "app-worthy": anything computed live from the seeded dataset
  (tables, kanban, charts, the decision queue). Treated as "doc-worthy":
  anything static/narrative that explains *why* rather than shows *what is
  happening now* (tier bios, the 4-step workflow explainer, the Fund
  Structure comparison, the Year-8 maturity model, retention
  projections, the "how this connects" relationship graph).
- Cutting Incentive Engine, Fund Structure, Success Dashboard, and Info Hub
  down to almost nothing left only 2 "program components" (Network,
  Workflow). The circular hub-and-spoke system map was designed for 6-7
  nodes and looked broken with 2, so it's replaced with a simple 2-card
  layout — a visual consequence of the content split, not something
  separately requested, but necessary once the node count collapsed.
- Kept two pieces of the old Success Dashboard that felt like genuine
  *status* rather than *pitch*: the deployment pacing chart (moved to the
  new Fund Portal, since that's where the fund would actually watch it) and
  the three near-term metrics explicitly requested for Overview. Cut the
  rest (headline MOIC/carry chart, regulatory filing history, retention,
  follow-on funnel) to the doc — these were modeled/narrative, not live status.
- Built the Fund Portal's decision queue as **real client-side interactive
  state** (a React context + localStorage), not a static mockup — approving
  or declining a deal there actually updates the kanban and audit trail
  elsewhere in the app. This is scoped to decisions only (deal stage +
  partner notes); it does not make every derived stat elsewhere in the app
  (e.g. Overview's pipeline counts) reactive to session-local changes, since
  that would require turning the whole static aggregates layer into
  client-computed state — a much larger change than "make decisions work."
- The Gmail/other-channel automation the user described is documented in
  the architecture file as an integration, not built — there's no real
  Gmail connection in this prototype, and building one was explicitly
  framed by the user as an architecture-doc concern, not an app feature.

## 11. Legal (SAFE) + banking + carry distribution — closing the "approved
    doesn't mean funded" gap
**Ambiguity:** User, role-playing as the fund partner, asked what's missing
to operationalize this end-to-end and specifically flagged legal (SAFEs) as
something that needs to be covered, even if lightly. There was no spec for
exact SAFE terms, e-signature flow, or how carry distribution should work.
**Assumptions and judgment calls:**
- Every scout check uses one standard instrument — a Post-Money SAFE — to
  avoid the complexity of per-deal negotiated legal structures. Cap ($4M–
  $12M) and discount (15–25%) are randomized per deal but deterministic
  (seeded off the deal id), not user-editable — this is a status/workflow
  simulation, not a real document generator.
- Added a real state machine to the Fund Portal's "Legal & closing" section:
  `not_started → draft_generated → sent_for_signature → executed`, then
  `wireStatus: not_initiated → initiated → confirmed`. Confirming the wire
  is what actually flips the deal to `check_written` — matches the real
  chain (approval alone doesn't move money). Built as live client-side
  state via `deal-store.tsx`, same session-scoped localStorage pattern as
  decisions, not a real DocuSign/banking integration (documented as
  "planned" in the architecture doc).
- Approving a deal now requires a ticket size input (the partner picks
  $10K–$50K at approval time) instead of a size being assigned later —
  matches how a real check-size decision actually gets made.
- Scouts need onboarding paperwork (tax form, payout bank account) before a
  carry distribution can be paid out — modeled as a small independent
  session-store (`scout-onboarding-store.tsx`) surfaced in the Scout
  Portal ("Program paperwork") and enforced in the Fund Portal's new "Exit
  distributions" section, which blocks the "mark paid" action with a named
  reason until both are on file. ~18–22% of the seeded roster starts
  missing one or the other, deliberately, so the blocking logic has
  something real to show on first load.
- Exit distributions use the same mark-to-market convention
  (`STAGE_MARK_MULTIPLE.exited = 4.0x`) and the same fund carry (20%) /
  scout share (12.5% of that) already used for the Scout Portal's
  estimated-upside figure — one formula, not a second one invented for
  this feature.
- Did not build in this round: cap table / ownership-percentage tracking,
  LP capital calls, a follow-on decision workflow distinct from the
  general "approve a memo" flow. Logged as further gaps, not dropped.

## 12. Treasury visibility, conflict-of-interest disclosure, scout
    recruiting, and LP reporting status
**Ambiguity:** Continuing the same partner-eye review as #11, with no
further spec than "keep finding and closing gaps until you run out of
tokens."
**Assumptions and judgment calls:**
- Added a Treasury panel to the top of the Fund Portal: wired vs.
  committed-but-not-yet-wired vs. available capital against the $6M pool.
  "Committed" reads live off approved-but-unwired deals' ticket sizes —
  otherwise nothing stops the fund from approving past the pool ceiling,
  since only confirmed wires counted as deployed before this.
- Added conflict-of-interest disclosure to the deal model — ~6% of memos
  are seeded with a disclosed conflict (a prior personal stake, a former
  colleague founder, a spouse on the cap table), surfaced as a hard-to-miss
  banner in the Fund Portal's decision queue and a flag icon in the system
  of record. This is the one piece explicitly requested ("dont go deep
  ... but needs to be covered, legal meaning SAFEs") extended slightly
  past SAFEs themselves into the adjacent disclosure obligation a real
  LPA would require — kept intentionally shallow (a boolean + a note, no
  formal recusal workflow).
- Added a scout recruiting pipeline (`candidates.ts` + `candidate-store.tsx`)
  — nomination → interview → reference check → agreement sent → signed,
  seeded with 7 candidates across different stages. Deliberately does NOT
  splice a "signed" candidate into the live 30-scout roster (would cascade
  into every tier count and aggregate in the app) — the panel says so
  explicitly rather than silently doing nothing.
- Added a quarterly LP/regulatory reporting status panel, computed from
  fixed program dates rather than stored data — every quarter since
  program start is marked filed ~15 days after quarter close, the current
  quarter shows "not yet due." This is a status view only, consistent with
  the earlier app/doc split decision (#10) — no report is actually
  generated or sent.
- Did not build: an "in prep" intermediate state ever actually appears
  given today's reference date (Sep 16, 2026 falls well after the last
  quarter's filing and before the next quarter even closes) — noted rather
  than forced, since faking a mid-prep state at an arbitrary date would be
  less honest than the panel just showing what's really true today.

## 14. Fixing the cross-page staleness bug (found by an explicit adversarial
    review pass, not by the user)
**Problem:** Every stat tile outside the Fund Portal — Overview, the top of
Deal Workflow, Scout Network's roster stats, the Scout Portal's headline
tiles, and the Scout Portal's own "My deals" table — read from the static
`aggregates.ts` exports (computed once from seed data at module load).
Fund Portal decisions read from live `useDealStore()` state. Result:
decline 3 deals in the Fund Portal and the Fund Portal correctly shows the
new count, but Deal Workflow's "Pending decision" tile — four inches above
its own kanban board, which *does* update — still says the old number.
Confirmed directly: declined 3 deals, kanban dropped from 28→25, Workflow's
own stat tile stayed at 30 through a hard reload. Same pattern reproduced
on the Scout Portal (wired a deal fully through SAFE+e-sign+wire, "Deals
funded" tile stayed at the old count while the deal table beneath it
correctly showed the deal as funded).
**Fix:**
- Extracted every aggregate formula out of `aggregates.ts` into pure
  functions in `src/lib/data/derive.ts` (`computeDealDerived`,
  `computeScoutStats`, `computeScoutUpside`, `computeDeploymentPacing`,
  etc.) that take `deals`/`scouts` as arguments instead of closing over the
  module-level seed arrays.
- `aggregates.ts` now calls these once against the static seed data — same
  export names, same shape, nothing else in the codebase had to change to
  keep working. This is what the published docs cite and what a page shows
  on first paint.
- Added `src/lib/use-live-stats.ts`, a client hook that runs the identical
  functions against `useDealStore()`'s live, session-decided deals.
- Converted every stat tile, roster table, and deals table that a partner
  or scout actually watches while working the app — Overview,
  `SummaryStrip`, Deal Workflow's top tiles, Scout Network's tiles +
  roster table, `PoolActivity`, the Scout Portal's tiles + `MyDealsTable`,
  and the Fund Portal's `PacingChart` — to read through the live hook (or
  `useDealStore()` directly) instead of the static export.
- Left `responseTimeTrend` (the Overview weekly-response sparkline) static
  — it's synthetic backfilled noise for chart texture, not a real
  per-week history the app tracks, so there's no "live" version of it to
  compute. Documented here rather than silently left inconsistent.
- Left the Scout Portal's "Your month in review" digest preview reading
  static `notifications` — that feed is itself pre-generated from the
  seed data's history (see the architecture doc's outbound-notifications
  section); making it reflect live session decisions would mean building
  a live notification-event system, a materially bigger feature than
  fixing the staleness bug. Noted as a real, smaller remaining gap, not
  swept under the rug.
- While fixing this, testing surfaced a second, related bug: declining or
  approving a deal that was already `under_review` (i.e. had already had
  its first look, with a real `responseHours` on file) recomputed
  `responseHours` from scratch as "time since submission until now" —
  overwriting a fixed historical fact with a number reflecting how long
  the *final* decision took, not the first look. Fixed in
  `deal-store.tsx`'s `decideDeal`: only a deal still in `submitted` (no
  look yet) gets its response time set at decision time; an already-
  reviewed deal keeps its original first-look timestamp and hours.

## 15. Ticket sizes are a typical range, not a hard floor or ceiling
**User correction:** "I don't want the tickets to be capped or have a
minimum but the values we are expecting are between 10k or 50k but outlier
companies can be different and we adapt."
**Fix:**
- Renamed `TICKET_SIZE_MIN`/`MAX` to `TICKET_SIZE_TYPICAL_MIN`/`MAX` and
  reworded their comment to state plainly that this is a display/default
  convention, never a validation constraint.
- Removed the hard `min`/`max` HTML attributes from both the Fund Portal's
  approval ticket-size input and its follow-on check-size input — a
  partner can type any number; the typical band is now just a hint label
  next to the field ("typical $10K–$50K — outliers OK").
- Softened every place that stated the range as if it were absolute (Scout
  Portal's paperwork note, the roster subtitle) to "typically."
- Made this real in the seed data, not just the copy: `checkSizeFor()` now
  has an 8% chance of generating an outlier ticket — either an outsized
  $55K–$90K conviction check or a small $3K–$8K pilot check — so the
  system of record actually shows a few tickets outside the typical band
  rather than the claim being true only in the abstract. Current seed
  landed 4 outliers (2 large, 2 small) across ~50 ticketed deals.

## 13. Follow-on decisions as their own workflow
**Ambiguity:** `follow_on_watch` already existed as a deal stage and
`followOnParticipated` already fed the "44.4% follow-on participation"
stat cited in the Program Brief, but neither was ever an actual decision —
just a label baked into seed data.
**Assumptions and judgment calls:**
- Added `followOnDecision` (undecided/participating/passed) and
  `followOnCheckUsd`, actionable only while a deal sits in
  `follow_on_watch`. Deliberately did NOT touch `DealStage` or
  `followOnParticipated` — the kanban column and the already-published
  brief stat keep their existing meaning; this is a new, additive decision
  layered on top, not a redefinition of an existing one.
- Follow-on capital is modeled as coming from Fund II directly ($100K–
  $500K range), not the scout pool — a follow-on check is a fund-level
  conviction bet on a company already past the scout-intro stage, not a
  scout-sourcing reward, so it shouldn't draw down the same $6M ceiling
  the Treasury panel tracks. It does not appear in the Treasury panel's
  "committed" figure for that reason.

## 16. Dropping the tax form from scout onboarding
**User decision:** Remove it entirely — from the scout-facing terms document
and from the app.
**Context:** The paperwork gate was modelled as two items, a tax form
(labelled W-9 / W-8BEN) and a linked payout account. The W-9 and W-8BEN are
US IRS forms, which is the wrong instrument for a European fund paying
European scouts — so the field was carrying US-specific detail that didn't
fit the program it was describing.
**What changed:**
- `taxFormStatus` and `TaxFormStatus` removed from the Scout model, the
  seed generator, the onboarding store, the Scout Portal's paperwork panel,
  and the Fund Portal's blocked-payout message.
- The carry payout gate still exists — it now turns on the linked payout
  account alone, which is the part that's jurisdiction-neutral and still
  genuinely blocks a wire.
- The program brief and architecture note were updated to match, so all
  four surfaces describe the same requirement.
**Worth noting:** a real fund does need tax information before paying
someone. This removes the modelled control rather than solving it, on the
basis that naming the wrong forms was worse than leaving it to the
participation agreement.

## 17. Fund-level carry milestones, and what "sourced" means
**User decision:** Three deployment milestones — $500K, $1M, $1.5M — that
unlock a share of *fund-level* carry, with the percentages left to me and
required to be small. Plus an attribution rule: an intro to a company the
fund had already had contact with does not count as sourced.
**Assumptions and judgment calls:**
- **Percentages: 0.10% / 0.25% / 0.50% of the fund's carry, stepping up
  rather than stacking.** A scout at the third rung holds 0.50%, not the
  0.85% sum. On a $125M fund at 20% carry and a 3x gross return, the whole
  carry pool is ~$50M, so the rungs are worth roughly $50K / $125K / $250K
  if the fund performs. Small enough that granting one isn't a partnership
  event; large enough that a scout changes behaviour to reach it.
- **This carry dilutes the partners, and the model says so out loud.**
  Per-deal scout carry comes out of the carry on that single deal. Fund-level
  carry comes out of the GP's side of the whole pool — every point granted
  here is a point the partnership no longer holds. That is the actual cost of
  the ladder and it belongs in the brief, not in a footnote.
- **Thresholds run over the program's full 24 months, and are sized against
  the pool rather than today's run-rate.** If the $6M pool deploys to target,
  the average scout accounts for ~$200K and a top-decile scout plausibly
  clears $500K — so the first rung is a real but rare outcome. Against the
  current book it is not close: $1.35M deployed at month 20, best scout $148K,
  median $34K, zero scouts on the ladder. Rather than shrink the thresholds so
  the demo lights up, that gap is named for what it is — a deployment-pacing
  problem, not a milestone-calibration one. The Scout Portal says so in plain
  language so no scout reads a progress bar as a promise.
- **Attribution is a partner's explicit call, not an inference.** A checkbox
  on the decision card ("We'd already met this company") flips
  `scoutAttributed` to false. The deal still gets decided, funded and tracked
  as normal — it just stops earning carry and stops counting toward the
  milestone ladder. Seed data generates prior contact at 7% (10 of 150), so
  the case is visible in the demo rather than theoretical.
- **Unattributed still shows in the scout's own funnel.** Their memo count,
  their conversion rate and their capital-deployed tile all still include it;
  only the carry-bearing figure (`attributedDeployedUsd`) excludes it. Hiding
  the deal entirely would make a scout's own numbers unauditable to them.

## 18. Dropping the cohort concept entirely
**User decision:** No mention of cohorts anywhere, in the app or the
documents. The scout program is a single 24-month program.
**What changed:**
- `Scout.cohort` and `COHORT_LABEL` removed from the model. The topbar chip
  that read "Cohort 1 (2025–26)" now reads `PROGRAM_LABEL` — "Month 20 of
  24" — derived from `PROGRAM_START` and `TODAY_REF` rather than hardcoded,
  so the label can't drift from the pacing chart it sits above.
- `COHORT_START` renamed to `PROGRAM_START` in `deals.ts` and
  `notifications.ts`; the two were already the same date, now they're
  visibly the same concept.
- Per-scout stat hints that read "this cohort" now read "over the program";
  roster counts that read "of 30 in Cohort 1" now read "of 30 on the roster".
- The retention story in the brief was cohort-over-cohort (58% → 79% → 86%
  across a pilot and two intakes). With one program there is no second
  intake, so it's re-cut as retention *within* the 24 months.
**The one real consequence:** the carry milestone ladder was justified as
"lifetime, carries across cohorts," which is what made $500K reachable at
all. That justification is gone. Re-cut against the pool instead: at full
$6M deployment the average scout accounts for ~$200K, so a top-decile scout
plausibly clears the first rung inside 24 months. The thresholds themselves
are unchanged. What the gap to today's $1.35M now says is that deployment is
behind pace — which was already true and already in the brief — rather than
that the ladder is mis-sized.
