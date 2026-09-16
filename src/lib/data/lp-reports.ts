// Quarterly LP / regulatory reporting cadence — see the System Architecture
// doc for how this would really be fed (piggybacked on the fund's existing
// Form PF-style quarterly filing prep). Purely a status snapshot here, not
// a report generator.
export interface LpReportRecord {
  quarter: string; // "Q1 2025"
  periodEndsAt: string; // ISO date
  status: "sent" | "in_prep" | "upcoming";
  sentAt: string | null;
}

const PROGRAM_START = new Date("2025-01-20T00:00:00Z");
const TODAY = new Date("2026-09-16T00:00:00Z");

function quarterLabel(d: Date): string {
  const q = Math.floor(d.getUTCMonth() / 3) + 1;
  return `Q${q} ${d.getUTCFullYear()}`;
}

function quarterEnd(year: number, q: number): Date {
  return new Date(Date.UTC(year, q * 3, 0));
}

const records: LpReportRecord[] = [];
{
  let year = PROGRAM_START.getUTCFullYear();
  let q = Math.floor(PROGRAM_START.getUTCMonth() / 3) + 1;
  // Walk quarters from program start through one quarter past today.
  for (;;) {
    const periodEndsAt = quarterEnd(year, q);
    const filedAt = new Date(periodEndsAt);
    filedAt.setUTCDate(filedAt.getUTCDate() + 15); // ~15 days after quarter close, standard turnaround

    let status: LpReportRecord["status"];
    let sentAt: string | null;
    if (filedAt < TODAY) {
      status = "sent";
      sentAt = filedAt.toISOString();
    } else if (periodEndsAt <= TODAY) {
      status = "in_prep";
      sentAt = null;
    } else {
      status = "upcoming";
      sentAt = null;
    }

    records.push({ quarter: quarterLabel(periodEndsAt), periodEndsAt: periodEndsAt.toISOString(), status, sentAt });

    if (status === "upcoming") break;
    q += 1;
    if (q > 4) {
      q = 1;
      year += 1;
    }
  }
}

export const lpReports: LpReportRecord[] = records;
