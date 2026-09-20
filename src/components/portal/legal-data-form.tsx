"use client";

// The scout's side of the ops handoff: once a deal is approved, the SAFE
// can't be drafted until this data is on file — who the money actually
// goes to, and the proposed terms. See submitLegalData / generateSafe in
// deal-store.tsx for how this feeds the closing queue.
import { useState } from "react";
import { FileCheck2, Landmark } from "lucide-react";
import { useDealStore } from "@/lib/deal-store";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50";

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function LegalDataForm({ scoutId }: { scoutId: string }) {
  const { deals, submitLegalData } = useDealStore();
  const [drafts, setDrafts] = useState<
    Record<string, { legalEntityName: string; taxId: string; amount: number; cap: number; discount: number; date: string }>
  >({});

  const awaiting = deals
    .filter((d) => d.scoutId === scoutId && d.stage === "approved" && !d.legalDataSubmittedAt)
    .sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());

  if (awaiting.length === 0) return null;

  function draftFor(dealId: string, checkSizeUsd: number | null) {
    return (
      drafts[dealId] ?? {
        legalEntityName: "",
        taxId: "",
        amount: checkSizeUsd ?? 10_000,
        cap: 6_000_000,
        discount: 20,
        date: todayIso(),
      }
    );
  }

  function update(dealId: string, checkSizeUsd: number | null, patch: Partial<ReturnType<typeof draftFor>>) {
    setDrafts((prev) => ({ ...prev, [dealId]: { ...draftFor(dealId, checkSizeUsd), ...patch } }));
  }

  function submit(dealId: string, checkSizeUsd: number | null) {
    const d = draftFor(dealId, checkSizeUsd);
    if (!d.legalEntityName.trim() || !d.taxId.trim() || d.amount <= 0 || d.cap <= 0) return;
    submitLegalData(dealId, {
      legalEntityName: d.legalEntityName,
      taxId: d.taxId,
      investmentAmountUsd: d.amount,
      valuationCapUsd: d.cap,
      discountPct: d.discount,
      safeDate: d.date,
    });
    setDrafts((prev) => {
      const next = { ...prev };
      delete next[dealId];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Landmark className="size-4 text-primary" />
        Legal and SAFE data needed to close
      </span>
      <p className="text-[11px] text-muted-foreground">
        Approved and waiting on you: the legal entity, its NIF, and the proposed SAFE terms. The fund drafts
        the SAFE straight from what you file here.
      </p>
      {awaiting.map((d) => {
        const draft = draftFor(d.id, d.checkSizeUsd);
        const canSubmit = draft.legalEntityName.trim().length > 1 && draft.taxId.trim().length > 3 && draft.amount > 0 && draft.cap > 0;
        return (
          <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
            <div className="text-sm font-semibold text-foreground">{d.companyName}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">Legal entity name</span>
                <input
                  value={draft.legalEntityName}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { legalEntityName: e.target.value })}
                  placeholder="Kestrel Payments, Lda."
                  className={FIELD}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">NIF / tax ID</span>
                <input
                  value={draft.taxId}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { taxId: e.target.value })}
                  placeholder="513 xxx xxx"
                  className={FIELD}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">Amount (USD)</span>
                <input
                  type="number"
                  step={1000}
                  value={draft.amount}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { amount: Number(e.target.value) })}
                  className={cn(FIELD, "tabular-nums")}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">Valuation cap (USD)</span>
                <input
                  type="number"
                  step={100_000}
                  value={draft.cap}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { cap: Number(e.target.value) })}
                  className={cn(FIELD, "tabular-nums")}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">Discount rate (%)</span>
                <input
                  type="number"
                  step={1}
                  min={0}
                  max={100}
                  value={draft.discount}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { discount: Number(e.target.value) })}
                  className={cn(FIELD, "tabular-nums")}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] text-muted-foreground">SAFE date</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(e) => update(d.id, d.checkSizeUsd, { date: e.target.value })}
                  className={FIELD}
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => submit(d.id, d.checkSizeUsd)} disabled={!canSubmit}>
                <FileCheck2 className="size-3.5" />
                File legal data
              </Button>
              <span className="text-[11px] text-muted-foreground">
                Approved {formatDate(d.submittedAt)}. Once filed, the fund can draft the SAFE.
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
