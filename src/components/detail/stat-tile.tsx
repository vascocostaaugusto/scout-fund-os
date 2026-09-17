import { cn } from "@/lib/utils";

interface StatTileProps {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: "good" | "bad" | "neutral";
  hint?: string;
  emphasis?: boolean;
}

export function StatTile({ label, value, delta, deltaTone = "neutral", hint, emphasis }: StatTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-xl border p-4",
        emphasis ? "border-primary/40 bg-accent/50" : "border-border bg-card",
      )}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl font-bold tabular-nums tracking-[-0.02em] text-foreground">
          {value}
        </span>
        {delta ? (
          <span
            className={cn(
              "text-xs font-medium",
              deltaTone === "good" && "text-success",
              deltaTone === "bad" && "text-critical",
              deltaTone === "neutral" && "text-muted-foreground",
            )}
          >
            {delta}
          </span>
        ) : null}
      </div>
      {hint ? <span className="text-xs text-muted-foreground">{hint}</span> : null}
    </div>
  );
}
