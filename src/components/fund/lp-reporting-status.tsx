import { FileClock, CheckCircle2, Clock } from "lucide-react";
import { lpReports } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export function LpReportingStatus() {
  const recent = [...lpReports].reverse().slice(0, 5);

  return (
    <div className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2">
        <FileClock className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">LP &amp; regulatory reporting</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          Scout program marks roll into the fund&apos;s quarterly filing
        </span>
      </div>
      {recent.map((r) => (
        <div
          key={r.quarter}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs",
            r.status === "upcoming" ? "border-dashed border-border/70 bg-transparent" : "border-border/60 bg-background/40",
          )}
        >
          <div className="flex items-center gap-2">
            {r.status === "sent" ? (
              <CheckCircle2 className="size-3.5 shrink-0 text-success" />
            ) : (
              <Clock className="size-3.5 shrink-0 text-muted-foreground" />
            )}
            <span className="font-medium text-foreground">{r.quarter}</span>
            <span className="text-muted-foreground">quarter ends {formatDate(r.periodEndsAt)}</span>
          </div>
          <span className={r.status === "sent" ? "text-success" : "text-muted-foreground"}>
            {r.status === "sent" ? `Filed ${formatDate(r.sentAt!)}` : "Not yet due"}
          </span>
        </div>
      ))}
    </div>
  );
}
