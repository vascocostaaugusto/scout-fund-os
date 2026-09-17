"use client";

import { FileCheck2, Landmark, ShieldCheck } from "lucide-react";
import { useScoutOnboarding } from "@/lib/scout-onboarding-store";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function ProgramPaperwork({ scoutId }: { scoutId: string }) {
  const { scouts, linkPayoutAccount } = useScoutOnboarding();
  const scout = scouts.find((s) => s.id === scoutId);
  if (!scout) return null;

  const allDone = scout.payoutAccountStatus === "linked";

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2">
        <ShieldCheck className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Program paperwork</span>
        <span className="ml-auto text-[11px] text-muted-foreground">
          {allDone ? "All set — nothing blocking a payout" : "Needed before any carry can be paid out to you"}
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="size-3.5 shrink-0 text-success" />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">Participation &amp; carry agreement</span>
              <span className="text-[11px] text-muted-foreground">Signed {formatDate(scout.agreementSignedAt)}</span>
            </div>
          </div>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">On file</span>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <Landmark className={`size-3.5 shrink-0 ${scout.payoutAccountStatus === "linked" ? "text-success" : "text-warning"}`} />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">Payout bank account</span>
              <span className="text-[11px] text-muted-foreground">Where a carry check would be wired</span>
            </div>
          </div>
          {scout.payoutAccountStatus === "linked" ? (
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">Linked</span>
          ) : (
            <Button size="sm" variant="outline" onClick={() => linkPayoutAccount(scoutId)}>
              Link account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
