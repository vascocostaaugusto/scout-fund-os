import { Fragment } from "react";
import { risks } from "@/lib/data";
import { cn } from "@/lib/utils";

const LIKELIHOOD = ["High", "Medium", "Low"] as const;
const IMPACT = ["Low", "Medium", "High", "Critical"] as const;

function cellTone(li: number, ii: number) {
  // li: 0 (High) -> 2 (Low) row index; ii: 0 (Low) -> 3 (Critical) column index
  const severity = (2 - li) + ii; // 0..5
  if (severity >= 4) return "bg-critical/20";
  if (severity === 3) return "bg-serious/20";
  if (severity >= 1) return "bg-warning/15";
  return "bg-success/10";
}

export function RiskMatrix() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Likelihood × impact matrix</span>
        <span className="text-xs text-muted-foreground">4 tracked risks</span>
      </div>
      <div className="grid grid-cols-[auto_repeat(4,1fr)] gap-1 text-[11px]">
        <div />
        {IMPACT.map((im) => (
          <div key={im} className="pb-1 text-center font-medium text-muted-foreground">
            {im}
          </div>
        ))}
        {LIKELIHOOD.map((lik, li) => (
          <Fragment key={lik}>
            <div className="flex items-center justify-end pr-2 font-medium text-muted-foreground">
              {lik}
            </div>
            {IMPACT.map((im, ii) => {
              const cellRisks = risks.filter((r) => r.likelihood === lik && r.impact === im);
              return (
                <div
                  key={`${lik}-${im}`}
                  className={cn("flex min-h-14 flex-col items-center justify-center gap-1 rounded-md p-1", cellTone(li, ii))}
                >
                  {cellRisks.map((r) => (
                    <span
                      key={r.id}
                      title={r.risk}
                      className="w-full truncate rounded bg-card px-1.5 py-0.5 text-center text-[10px] font-medium text-foreground shadow-sm"
                    >
                      {r.category}
                    </span>
                  ))}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Low risk</span>
        <span>Critical risk</span>
      </div>
    </div>
  );
}
