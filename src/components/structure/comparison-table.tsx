import { Check, Star } from "lucide-react";

export function ComparisonTable() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-xl border border-primary/50 bg-accent/40 p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Option A — In-Fund Carve-Out</span>
          <span className="flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
            <Star className="size-3 fill-current" />
            Recommended
          </span>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Capital and carry both come directly from Fund II. The scout program is a line item inside the main
          fund — no new legal entity per deal.
        </p>

        <div className="flex flex-col gap-1.5">
          {[
            "Fastest to operate — no new legal entity per deal",
            "Leans on trust already built with the Shapers Club LP base",
            "Simpler LP reporting — one fund, one set of financials",
          ].map((p) => (
            <div key={p} className="flex items-start gap-2 text-xs text-foreground">
              <Check className="mt-0.5 size-3 shrink-0 text-success" />
              <span>{p}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-lg border border-dashed border-border px-3 py-2 text-[11px] text-muted-foreground">
          Requires: LPA carve-out clause + LPAC sign-off, settled pre-close
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Considered and rejected — Fund-Seeded SPVs
        </span>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Wrapping each scout deal in its own SPV gives cleaner carry isolation per deal, but a new entity and
          new admin for every single check works directly against a program built around fast first-look
          responses — and fragments LP reporting across many small vehicles instead of one fund. No advantage
          worth that cost at this scale.
        </p>
      </div>
    </div>
  );
}
