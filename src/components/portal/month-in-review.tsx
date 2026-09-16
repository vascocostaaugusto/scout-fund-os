import { Mail } from "lucide-react";
import { deals, notifications } from "@/lib/data";
import { formatDate } from "@/lib/format";

const TODAY = new Date("2026-09-16T09:00:00Z").getTime();
const THIRTY_DAYS = 30 * 24 * 3600_000;

export function MonthInReview({ scoutId }: { scoutId: string }) {
  const myDealIds = new Set(deals.filter((d) => d.scoutId === scoutId).map((d) => d.id));
  const recent = notifications
    .filter((n) => n.dealId && myDealIds.has(n.dealId) && TODAY - new Date(n.ts).getTime() <= THIRTY_DAYS)
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Mail className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Your month in review</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          preview of the email you&apos;d get on the 1st
        </span>
      </div>

      {recent.length === 0 ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Nothing moved on your deals in the last 30 days — so this month you&apos;d get a short check-in
          instead of a report: &quot;Anything in the pipeline we should know about? No pressure, just
          checking in.&quot;
        </p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {recent.slice(0, 6).map((n) => (
            <li key={n.id} className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
              <span>
                <span className="text-foreground">{formatDate(n.ts)}</span> — {n.text}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
