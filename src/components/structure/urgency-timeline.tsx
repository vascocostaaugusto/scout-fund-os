import { AlertTriangle } from "lucide-react";

const STEPS = [
  { label: "Today", state: "done" as const },
  { label: "LPAC review", state: "current" as const },
  { label: "LPA carve-out signed", state: "pending" as const },
  { label: "Fund II first close", state: "deadline" as const },
];

export function UrgencyTimeline() {
  return (
    <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
      <div className="mb-4 flex items-start gap-2">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" />
        <p className="text-xs leading-relaxed text-foreground">
          This has to be settled <span className="font-semibold">before</span> Fund II closes — retrofitting a
          carve-out into an already-closed fund means re-opening the LPA with every LP, not just the LPAC.
        </p>
      </div>
      <div className="flex items-center">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={
                  step.state === "deadline"
                    ? "flex size-3 items-center justify-center rounded-full bg-critical ring-4 ring-critical/15"
                    : step.state === "done"
                      ? "size-2.5 rounded-full bg-success"
                      : step.state === "current"
                        ? "size-2.5 rounded-full bg-warning"
                        : "size-2.5 rounded-full border-2 border-border bg-background"
                }
              />
              <span className="whitespace-nowrap text-[11px] text-muted-foreground">{step.label}</span>
            </div>
            {i < STEPS.length - 1 ? (
              <div
                className={
                  step.state === "done"
                    ? "mx-2 h-px flex-1 bg-success/60"
                    : "mx-2 h-px flex-1 border-t border-dashed border-border"
                }
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
