# Blockers & Assumptions Log

Per working instructions: no stopping to ask questions. Anything ambiguous gets
a reasonable, documented assumption and I keep moving. Logged here as they came
up, not just at the end.

## 1. Exact fund-level dollar figures
**Ambiguity:** Brief gives ranges (Fund II $100–150M, scout pool <5% → $5–7.5M)
but no single numbers to build consistent mock data around.
**Assumption:** Fund II target midpoint $125M. Scout pool $6.0M (4.8% of
Fund II — comfortably under the 5% ceiling). Capital allocated to the current
cohort's 15 scouts sums to ~$3.49M (tier-weighted $150K–$300K ceilings),
leaving headroom in the $6.0M pool for cohort growth. All committed to
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
actually correct behavior — the cohort is ~20 months into an 18–24 month
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

## 5. Scout retention "across cohorts" with only one active cohort
**Ambiguity:** Brief asks for a cohort-over-cohort retention line chart, but
the program (as pitched) has only one formal cohort running.
**Assumption:** Framed as Pilot (informal Shapers Club pre-2025) → Cohort 1
(current, real) → Cohort 2 (2026–27, explicitly labeled "projected" in the
UI, dashed line segment). Keeps the chart honest about what's real vs. modeled.

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
  Structure comparison, the Year-8 maturity model, cohort retention
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
