# TODO Backlog

## Core build (in order)
- [x] Plan written (PLAN.md)
- [x] Data layer: seeded PRNG, scouts, deals, notifications, risks, aggregates
- [x] App shell: theme tokens, sidebar, topbar, layout wiring
- [x] Overview: summary strip + system map
- [x] Detail: Scout Network
- [x] Detail: Incentive Engine
- [x] Detail: Deal Workflow
- [x] Detail: Info Hub
- [x] Detail: Fund Structure
- [x] Detail: Success Dashboard
- [x] Detail: Risk & Compliance

## Polish backlog (after core complete)
- [x] Route transition animation polish (template.tsx + framer-motion fade/slide)
- [x] Mock toast notification system (sonner, global, slow randomized cadence)
- [x] Richer animated Slack-style feed (live-ish ticking new items in Info Hub)
- [x] Animated funnel/kanban for Deal Workflow (staggered entrance animations;
      kanban chosen over a literal funnel chart since current-stage snapshot
      counts aren't monotonic — see BLOCKERS.md if this needs revisiting)
- [x] Responsive pass (mobile/tablet breakpoints, sidebar collapse, system map
      grid fallback below lg — verified via Playwright screenshots at 390/820/1440px)
- [x] Empty/edge states (kanban empty column, deal-table zero-result filter)
- [x] Code quality pass: shared types file, strict TS (already on), clean build+lint
- [x] Favicon / metadata / page titles per route
- [x] Keyboard nav / a11y pass on system map (focus-visible rings, aria-labels)
- [ ] Loading skeletons — deliberately skipped: all data is synchronous/static
      (no network fetch, no real latency), so a skeleton state would never
      actually appear and would be dead code. Documented, not forgotten.
- [x] Final build check (`npm run build`) + fix warnings — clean, zero errors
- [x] Visual QA pass via Playwright screenshots — caught and fixed 4 real bugs
      (see git log: system map cutoff, Select showing raw values, risk table
      overflow, broken Recharts FunnelChart) that build/lint could not catch
- [x] SESSION_REPORT.md

- [x] Command palette (Cmd+K) — added, with a visible "Jump to…" trigger in
      the topbar plus the keyboard shortcut. Caught and fixed a real runtime
      crash in the process (shadcn's CommandDialog doesn't auto-wrap children
      in the cmdk Command root context).
- [x] Sortable deal table columns (Company / Check / Submitted, click-to-toggle)

## Remaining ideas (not done — lower value than what shipped, listed for
## transparency; pick up here if resuming this session)
- Per-scout or per-deal drill-down detail pages (explicitly out of scope —
  see BLOCKERS.md #8)
- CSV export affordance on the deal table
- Dedicated unit tests for src/lib/data aggregation logic (currently only
  manually verified via tsx sanity scripts during the data-layer build step)
