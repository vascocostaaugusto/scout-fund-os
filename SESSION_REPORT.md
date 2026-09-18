# Session Report — Scout Fund OS

Autonomous build session. No user input was available during the session;
all decisions were made per the working instructions (reasonable assumption,
log it, keep moving). This report summarizes what was built, why, what was
hit along the way, and how to pick it back up.

## How to run it

```bash
cd scout-fund-os
npm run dev
```

Open `http://localhost:3000`. Dark mode is the default; toggle in the top
bar or via the command palette (`Cmd+K` → "Toggle theme"). No environment
variables, API keys, or backend are required — everything is local,
synchronous, and deterministic (seeded).

`npm run build` produces a clean static-friendly production build (all 9
routes prerender as static content) — deployable to Vercel with zero config.

## What was built

A 7-component interactive architecture console for the Shapers Scout Fund
proposal:

1. **Overview** — KPI summary strip + an interactive hub-and-spoke system
   map (SVG connector lines, hover-to-trace cross-component relationships,
   keyboard-accessible). Falls back to a stacked card grid below the `lg`
   breakpoint, where the circular layout has no room.
2. **Scout Network** — three-tier roster (15 scouts), tier cards, a
   sortable-by-activity roster table, and a per-scout memo bar chart.
3. **Incentive Engine** — the carry-only compensation rationale, an
   interactive carry calculator (pick a real sourced deal + exit multiple +
   scout carry rate, see the payout), the co-investment/SPV perk, and a
   personal-allocation-utilization view.
4. **Deal Workflow** — the 4-step intake process, live SLA stats, and a
   full 8-column kanban board (Submitted → … → Exited/Dead) with staggered
   entrance animations, built from the same `deals` array as everything else.
5. **Info Hub** — a filterable, sortable "system of record" table (47 rows),
   plus a mock Slack-style notification feed that ticks in new synthetic
   events on a slow randomized cadence (and a matching global toast stream).
6. **Fund Structure** — side-by-side comparison of the carve-out vs. SPV
   options with a recommendation, and an urgency timeline for the
   pre-close deadline.
7. **Success Dashboard** — the headline "proof it earns its place" chart
   (most visually prominent element in the app, per the brief), plus
   near/medium/long-term tabs with 5 more charts (scout activity, SLA
   trend, coverage tag cloud, follow-on funnel, retention).
8. **Risk & Compliance** — a 4-item risk register table plus a
   likelihood × impact severity matrix.

Plus: dark/light theme toggle, a command palette (`Cmd+K`), route-transition
animations, mobile/tablet responsive layouts, and a live toast/notification
simulation layer — all running on one internally-consistent seeded dataset
(`src/lib/data/`).

## Key decisions (see BLOCKERS.md for the full log with reasoning)

- **One deals array, everything derived.** `src/lib/data/deals.ts` is the
  only place deal-level facts are generated (seeded PRNG, `seed=5150`).
  Every stat — the summary strip, per-scout roster stats, the kanban counts,
  every dashboard chart — is computed from that same array in
  `aggregates.ts`, so nothing can silently disagree with anything else.
- **The headline carry chart is an explicit maturity model**, not a
  snapshot of today's tiny scout book. Labeled "Modeled at Fund II Maturity
  (Year 8)" with the MOIC assumptions printed directly under the chart.
- **Palette:** ran the `dataviz` skill's validator to build a CVD-safe
  deep-emerald ordinal ramp for both chart surfaces, replacing the default
  shadcn blue everywhere (buttons, links, active nav, chart lines).
- **7 routes only** — no per-scout or per-deal drill-down pages, matching
  the brief's information architecture exactly.

## Blockers hit and how they were routed around

Full log in `BLOCKERS.md`. Summary: every "blocker" was a genuinely
ambiguous requirement (exact dollar figures, funnel shape, the carry-vs-
capital methodology, retention with no second intake to compare, deciding
against real people's names). Each was resolved with a documented,
defensible assumption and the build kept moving — none of them stopped
work or required a guess that isn't traceable back to reasoning in that file.

## Bugs found and fixed during a Playwright visual QA pass

This was the single highest-value stretch of the session. `npm run build`
and `npm run lint` were clean the whole time, but they can't catch layout
or runtime issues — so a Playwright script screenshotted every route at
1440px, 820px, and 390px widths (dark and light) partway through the polish
phase. That caught four real, user-facing bugs `build`/`lint` missed:

1. **System map cutoff** — 2 of 7 nodes rendered below the fold on a
   laptop-height viewport. Fixed by flattening the hub-and-spoke aspect
   ratio (16:10 → 16:6.5) and simplifying the position math.
2. **Select components showing raw values** — Base UI's `Select.Value`
   (this project's shadcn is on Base UI, not Radix) doesn't resolve a
   label automatically; every dropdown in the app (deal picker, stage
   filter, exit multiple, carry rate) was showing `"dl_001"`, `"0.125"`,
   `"all"` instead of their labels. Fixed with explicit render-function
   children on every `SelectValue`.
3. **Risk register table overflow** — long sentence cells blew past the
   viewport width under the shadcn `TableCell` default of
   `whitespace-nowrap`. Fixed with `table-fixed` + per-cell
   `whitespace-normal`.
4. **Broken Recharts `FunnelChart`** — rendered as two floating,
   unlabeled, disconnected trapezoids. Replaced with a small custom
   two-stage funnel component that matches the rest of the design system
   and is actually legible.

A fifth issue (not a bug, a design gap) was also caught this way: the
circular system map had no mobile fallback and overlapped illegibly below
`lg`. Added a responsive grid fallback using the same node data.

**Takeaway for future sessions on this kind of task:** `next build` type-
checks and lints, but a UI this visual needs actual rendered screenshots to
catch real bugs. Budget for it — it found more real issues in twenty
minutes than the rest of the polish pass combined.

## What's left (see TODO.md for the live version)

Everything in the original brief is done and polished. Lower-priority ideas
that didn't make the cut, roughly in order of what I'd do next:

- CSV export on the Info Hub deal table
- Unit tests for the `src/lib/data` aggregation logic (currently verified
  manually via `tsx` sanity scripts during the data-layer build — see the
  commit history for the seed-selection process)
- Per-scout/per-deal drill-down pages, if the scope ever expands past the
  7 specified components

Loading skeletons were deliberately not built: every data source is local
and synchronous, so a skeleton state would never actually render — it would
be dead code shipped for its own sake.

## Commit history

23 commits, one per meaningful working step, starting from scaffold through
final content fixes. `git log --oneline` in the repo root has the full
sequence; each core-build commit corresponds to one working screen, each
polish commit is scoped to one improvement or one bug fix.
