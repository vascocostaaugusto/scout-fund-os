import { Check, X, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  key: string;
  label: string;
  recommended?: boolean;
  summary: string;
  pros: string[];
  cons: string[];
  requires: string;
}

const OPTIONS: Option[] = [
  {
    key: "carve-out",
    label: "Option A — In-Fund Carve-Out",
    recommended: true,
    summary: "Capital and carry both come directly from Fund II. The scout program is a line item inside the main fund.",
    pros: [
      "Fastest to operate — no new legal entity per deal",
      "Leans on trust already built with the Shapers Club LP base",
      "Simpler LP reporting — one fund, one set of financials",
    ],
    cons: [
      "Needs explicit LPA / LPAC authorization before Fund II closes",
      "Carry accounting for scout deals sits inside the main fund's waterfall",
    ],
    requires: "LPA carve-out clause + LPAC sign-off, settled pre-close",
  },
  {
    key: "spv",
    label: "Option B — Fund-Seeded SPVs",
    summary: "Each scout deal is wrapped in its own SPV, seeded by Fund II capital.",
    pros: [
      "Clean carry isolation per deal — no waterfall entanglement",
      "Cap-table exposure contained to a single vehicle per company",
    ],
    cons: [
      "New entity, new docs, new admin for every single scout check",
      "Slower — works against the program's 48-hour-SLA, move-fast design",
      "Fragments LP reporting across many small vehicles",
    ],
    requires: "SPV formation process built out before scaling past a handful of deals",
  },
];

export function ComparisonTable() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {OPTIONS.map((opt) => (
        <div
          key={opt.key}
          className={cn(
            "flex flex-col gap-4 rounded-xl border p-5",
            opt.recommended ? "border-primary/50 bg-accent/40" : "border-border bg-card",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">{opt.label}</span>
            {opt.recommended ? (
              <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Star className="size-3 fill-current" />
                Recommended
              </span>
            ) : null}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{opt.summary}</p>

          <div className="flex flex-col gap-1.5">
            {opt.pros.map((p) => (
              <div key={p} className="flex items-start gap-2 text-xs text-foreground">
                <Check className="mt-0.5 size-3 shrink-0 text-success" />
                <span>{p}</span>
              </div>
            ))}
            {opt.cons.map((c) => (
              <div key={c} className="flex items-start gap-2 text-xs text-muted-foreground">
                <X className="mt-0.5 size-3 shrink-0 text-critical" />
                <span>{c}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-lg border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground">
            Requires: {opt.requires}
          </div>
        </div>
      ))}
    </div>
  );
}
