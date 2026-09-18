# Scout Fund OS — Implementation Plan

## Purpose
Interactive architecture presentation ("internal software", not slides) for a Scout Fund program proposal to Shapers (fintech VC), for a job interview. Dark-mode-first, Linear/Stripe-grade polish, fully local mock data, Next.js App Router + TS + Tailwind + shadcn/ui + Recharts.

## Tech stack (confirmed installed)
- Next.js 16 (App Router), TypeScript, Tailwind v4
- shadcn/ui (neutral base, custom accent token override — deep green/amber fintech palette instead of default blue)
- Recharts for charts
- next-themes for dark/light toggle
- framer-motion for transitions
- lucide-react for icons

## Accent color decision
Base: near-black slate background (dark mode default), warm off-white in light mode.
Accent: deep emerald/green (`--accent`) as primary action/highlight color, with amber (`--warn`) as a secondary "attention" color for SLA/risk states, and a muted navy for secondary surfaces. Avoids shadcn default blue entirely.

## Information architecture
- `/` — Overview: system map (7 nodes) + summary strip
- `/network` — Scout Network
- `/incentives` — Incentive Engine
- `/workflow` — Deal Workflow
- `/info-hub` — Info Hub
- `/structure` — Fund Structure
- `/dashboard` — Success Dashboard
- `/risk` — Risk & Compliance

Shared app shell: left rail nav (persistent, shows all 7 nodes + overview), top bar with theme toggle + live "clock"/status chip, content area with animated route transitions (framer-motion `AnimatePresence` via a template.tsx).

## Data model (src/lib/data/)
Single source of truth generated once with a seeded PRNG so all numbers are internally consistent, then exported as static TS objects (computed at module load, deterministic — not Math.random on every render).

Core entities:
- `Scout`: id, name, tier (1|2|3), role/title, org affiliation, vertical/geography tag, avatarInitials, joinedAt, status (active/alumni), memosSubmitted, dealsFunded, capitalDeployed, slaAvgHours
- `Deal`: id, scoutId, companyName, sector, geography, stage (Submitted/UnderReview/Approved/Declined/CheckWritten/FollowOnWatch/Exited/Dead), checkSize, submittedAt, slaHours, partnerNotes, followOnParticipated (bool)
- `NotificationEvent`: id, ts, type (submission/status-change/digest), text, dealId
- `RiskItem`: id, risk, likelihood, impact, mitigation, category
- Fund-level constants: FUND_II_TARGET_LOW/HIGH, SCOUT_POOL_SIZE, CAPITAL_DEPLOYED, CAPITAL_ALLOCATED

Derived aggregates computed from Scout[]/Deal[] arrays (never hardcoded separately) so overview strip, dashboard charts, and detail views stay mathematically consistent:
- totalScouts, activeScouts, totalMemos, totalFunded, conversionRate, avgSlaHours, capitalDeployed/Allocated, pipeline counts by stage.

Files:
- `src/lib/data/scouts.ts` — scout roster generator
- `src/lib/data/deals.ts` — deal roster generator (tied to scouts)
- `src/lib/data/notifications.ts` — mock notification feed generator (tied to deals)
- `src/lib/data/risks.ts` — static risk register
- `src/lib/data/aggregates.ts` — derived metrics from scouts/deals
- `src/lib/data/prng.ts` — seeded RNG (mulberry32) for determinism
- `src/lib/data/index.ts` — barrel export

## Component structure (src/components/)
- `layout/app-shell.tsx` — sidebar + topbar wrapper
- `layout/sidebar-nav.tsx` — 7 nodes + overview links, active state
- `layout/theme-toggle.tsx`
- `overview/system-map.tsx` — node graph (CSS-positioned cards + SVG connector lines)
- `overview/summary-strip.tsx` — top KPI strip
- `overview/node-card.tsx`
- `detail/detail-header.tsx` — title, one-liner, breadcrumb
- `detail/connection-callout.tsx` — "how this connects" card, reusable, takes links[]
- `charts/*` — one wrapper per chart type used (bar, funnel, line, radial/proof chart, tag-cloud/coverage-map)
- `workflow/kanban-board.tsx`
- `info-hub/notification-feed.tsx` — animated mock Slack-style feed
- `info-hub/deal-table.tsx`
- `structure/comparison-table.tsx`
- `risk/risk-register-table.tsx`
- `ui/*` — shadcn primitives (already scaffolded)

## Route/page plan
Each of the 7 routes is a page.tsx that composes: DetailHeader, explanatory copy (adapted, not pasted), 1+ interactive chart/table, ConnectionCallout. Overview page composes SummaryStrip + SystemMap.

## Build order (commit after each working step)
1. Data layer (seeded generators + aggregates) — no UI yet, verify with a quick script/log
2. App shell: theme (next-themes), sidebar nav, topbar, root layout wiring, custom accent tokens in globals.css
3. Overview: summary strip + system map with working navigation
4. Scout Network detail view
5. Incentive Engine detail view
6. Deal Workflow detail view (kanban)
7. Info Hub detail view (table + notification feed)
8. Fund Structure detail view (comparison)
9. Success Dashboard detail view (multiple charts incl. headline carry-vs-capital chart)
10. Risk & Compliance detail view (register table)
11. Polish pass: transitions, responsive, richer mock Slack feed + toast system, animated funnel, edge cases, a11y, code cleanup
12. SESSION_REPORT.md

TODO.md and BLOCKERS.md maintained throughout; commit after every meaningful working change.
