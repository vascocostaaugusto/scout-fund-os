"use client";

import { UserCircle2 } from "lucide-react";
import { PARTNERS } from "@/lib/data";
import type { Partner } from "@/lib/data";
import { useDecisionOwner } from "@/lib/decision-owner-store";

// Sits at the top of the Fund Portal because it governs the whole page:
// whoever is selected here owns every decision recorded below, and their
// name is what lands in the audit trail.
export function DecisionOwner() {
  const { owner, setOwner } = useDecisionOwner();

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-border bg-card px-4 py-3">
      <UserCircle2 className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">Decision owner</span>
        <span className="text-[11px] text-muted-foreground">
          Every decision you record below is logged under this name
        </span>
      </div>
      <div className="ml-auto flex gap-1.5">
        {PARTNERS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setOwner(p as Partner)}
            aria-pressed={owner === p}
            className={
              owner === p
                ? "rounded-lg border border-primary bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition-colors"
                : "rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            }
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
