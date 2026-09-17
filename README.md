# Scout Fund OS

A working prototype of the operating system for a venture scout program — built as a proposal for the Shapers Fund II scout fund.

It's three things:

| | |
|---|---|
| **The app** | Where the fund and its scouts actually work: a decision queue, the legal and wire chain behind a funded check, portfolio outcomes, exit distributions, and a scout-facing portal. |
| **Program brief** | Every assumption and mechanic behind the program — tiers, pool economics, carry, fund structure, performance targets. |
| **System architecture** | What connects to what: where data enters, what leaves, and which parts are real versus planned. |

---

## Everything here is synthetic

**No figure in this repository is a real Shapers number.** The fund size, pool size, carry splits, ticket ranges, and deployment targets are illustrative assumptions made to build a coherent prototype. Every one of them is documented, with its reasoning, in [`BLOCKERS.md`](./BLOCKERS.md).

The 30 scouts are **invented people**. Company affiliations reference real firms (Wise, N26, Monzo, Qonto and others) as background colour for the kind of operator the program would recruit — but the individuals themselves do not exist, and nothing here represents a real person's views or employment.

The 150 deals, their companies, check sizes and outcomes are generated from a seeded random number generator, so the dataset is identical on every run.

## What actually works

The app isn't a clickable mockup. State changes are real, computed live, and persist in your browser:

- **Decide** on a pending memo — it moves on the kanban board and appears in the decision audit trail immediately.
- **Close** an approved deal through SAFE drafting, e-signature, execution and wire confirmation. Only a confirmed wire marks a deal as funded.
- **Record an outcome** — a company raising again, exiting at a given multiple, or being written off. A recorded exit multiple flows through to the scout's carry.
- **Confirm** proposed record changes in the overnight inbox pass, which mirrors what an email-reading job would surface for a human to approve.

Every stat tile, table and chart recomputes from the same live state, so a decision made in one place can't disagree with a number shown two clicks away.

What's simulated rather than built — the Gmail/Slack scan, e-signature, banking rails, authentication — is marked as such in the architecture document rather than implied to be working.

## Running it

```bash
npm install
npm run dev
```

Then open [localhost:3000](http://localhost:3000).

Decisions you make are stored in `localStorage`. To reset to the seeded state, run `localStorage.clear()` in the browser console and refresh.

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Recharts. No backend — the data layer is a seeded generator, and session state lives in React context backed by `localStorage`.

## Repository notes

- [`BLOCKERS.md`](./BLOCKERS.md) — every ambiguous decision made during the build, the assumption taken, and why.
- [`PLAN.md`](./PLAN.md) — the original implementation plan.
