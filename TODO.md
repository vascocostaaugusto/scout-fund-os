# TODO Backlog

## Core build (in order)
- [x] Plan written (PLAN.md)
- [ ] Data layer: seeded PRNG, scouts, deals, notifications, risks, aggregates
- [ ] App shell: theme tokens, sidebar, topbar, layout wiring
- [ ] Overview: summary strip + system map
- [ ] Detail: Scout Network
- [ ] Detail: Incentive Engine
- [ ] Detail: Deal Workflow
- [ ] Detail: Info Hub
- [ ] Detail: Fund Structure
- [ ] Detail: Success Dashboard
- [ ] Detail: Risk & Compliance

## Polish backlog (after core complete)
- [ ] Route transition animation polish (framer-motion AnimatePresence)
- [ ] Mock toast notification system (global, triggered on interactions)
- [ ] Richer animated Slack-style feed (live-ish ticking new items)
- [ ] Animated funnel for Deal Workflow
- [ ] Responsive pass (mobile/tablet breakpoints, sidebar collapse)
- [ ] Empty/edge states (e.g., declined deal detail, alumni scout)
- [ ] Code quality pass: shared types file, strict TS check, component prop typing
- [ ] Favicon / metadata / page titles per route
- [ ] Keyboard nav / a11y pass on system map
- [ ] Loading skeletons where relevant
- [ ] Final build check (`npm run build`) + fix warnings
- [ ] SESSION_REPORT.md
