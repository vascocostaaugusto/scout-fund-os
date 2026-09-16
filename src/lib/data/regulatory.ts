// Quarterly regulatory filing history — the fund's NAV marks are produced
// once per quarter for its own regulatory reporting (Form PF) and LP
// quarterly report (ILPA template). This file assumes that same pipeline
// feeds this app: instead of a separately-maintained set of assumptions,
// the scout program's performance-to-date is read off the same marks
// already being sent to regulators, so there's no parallel process to
// keep in sync or go stale.
import { scoutBookMoicToDate } from "./aggregates";

export interface RegulatoryFiling {
  quarter: string; // e.g. "Q2 2026"
  filedAt: string; // ISO date
  wholeFundMoicToDate: number;
  scoutBookMoicToDate: number;
  filingRef: string;
}

// Historical quarters are the fund's reported marks as of that filing date.
// The most recent (current) quarter reads live off the same deal data that
// drives the rest of this app — so this file and aggregates.ts can never
// silently disagree about "today's" number.
export const regulatoryFilings: RegulatoryFiling[] = [
  { quarter: "Q1 2025", filedAt: "2025-04-15", wholeFundMoicToDate: 1.0, scoutBookMoicToDate: 1.0, filingRef: "Form PF — initial period" },
  { quarter: "Q2 2025", filedAt: "2025-07-15", wholeFundMoicToDate: 1.02, scoutBookMoicToDate: 1.08, filingRef: "Form PF Q2'25" },
  { quarter: "Q3 2025", filedAt: "2025-10-15", wholeFundMoicToDate: 1.05, scoutBookMoicToDate: 1.24, filingRef: "Form PF Q3'25" },
  { quarter: "Q4 2025", filedAt: "2026-01-15", wholeFundMoicToDate: 1.08, scoutBookMoicToDate: 1.41, filingRef: "Form PF Q4'25" },
  { quarter: "Q1 2026", filedAt: "2026-04-15", wholeFundMoicToDate: 1.11, scoutBookMoicToDate: 1.63, filingRef: "Form PF Q1'26" },
  {
    quarter: "Q2 2026",
    filedAt: "2026-07-15",
    wholeFundMoicToDate: 1.14,
    scoutBookMoicToDate: Math.round(scoutBookMoicToDate * 100) / 100,
    filingRef: "Form PF Q2'26 (latest filed)",
  },
];

export const latestFiling = regulatoryFilings[regulatoryFilings.length - 1];

export const nextFilingDue = {
  quarter: "Q3 2026",
  dueAt: "2026-10-15",
};
