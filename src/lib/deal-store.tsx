"use client";

// A lightweight client-side store for decisions made *in this browser
// session* — the thing that makes the Fund Portal an actual place to work,
// not just a read-only view of the seeded dataset. There's no backend, so
// "persistence" is localStorage, scoped to one browser. Every deal-consuming
// view that should reflect live decisions reads through useDeals() instead
// of importing the static `deals` array directly.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { deals as seedDeals } from "@/lib/data";
import type { Deal, DealStage } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:deal-overrides";
const REFERENCE_NOW = new Date("2026-09-16T09:00:00Z");

export interface DealOverride {
  stage: DealStage;
  partnerNotes: string;
  reviewingPartner: string;
  firstLookAt: string;
  responseHours: number;
  isLate: boolean;
  decidedAt: string;
}

interface DealStoreValue {
  deals: Deal[];
  overrides: Record<string, DealOverride>;
  decideDeal: (dealId: string, decision: "approved" | "declined", partner: string, note: string) => void;
  resetDeal: (dealId: string) => void;
}

const DealStoreContext = createContext<DealStoreValue | null>(null);

export function DealStoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, DealOverride>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local decisions after mount, not derivable from props/state
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start clean
    }
  }, []);

  const persist = useCallback((next: Record<string, DealOverride>) => {
    setOverrides(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const decideDeal = useCallback(
    (dealId: string, decision: "approved" | "declined", partner: string, note: string) => {
      const base = seedDeals.find((d) => d.id === dealId);
      if (!base) return;
      const responseHours = Math.round(((REFERENCE_NOW.getTime() - new Date(base.submittedAt).getTime()) / 3600_000) * 10) / 10;
      const override: DealOverride = {
        stage: decision,
        partnerNotes: note || (decision === "approved" ? "Approved, closing docs with scout." : "Declined."),
        reviewingPartner: partner,
        firstLookAt: REFERENCE_NOW.toISOString(),
        responseHours,
        isLate: responseHours > 48,
        decidedAt: REFERENCE_NOW.toISOString(),
      };
      persist({ ...overrides, [dealId]: override });
    },
    [overrides, persist],
  );

  const resetDeal = useCallback(
    (dealId: string) => {
      const next = { ...overrides };
      delete next[dealId];
      persist(next);
    },
    [overrides, persist],
  );

  const mergedDeals = useMemo(
    () =>
      seedDeals.map((d) => {
        const o = overrides[d.id];
        if (!o) return d;
        return {
          ...d,
          stage: o.stage,
          partnerNotes: o.partnerNotes,
          reviewingPartner: o.reviewingPartner,
          firstLookAt: o.firstLookAt,
          responseHours: o.responseHours,
          isLate: o.isLate,
          rightOfFirstLook: o.stage === "approved",
        } satisfies Deal;
      }),
    [overrides],
  );

  const value = useMemo(
    () => ({ deals: mergedDeals, overrides, decideDeal, resetDeal }),
    [mergedDeals, overrides, decideDeal, resetDeal],
  );

  return <DealStoreContext.Provider value={value}>{children}</DealStoreContext.Provider>;
}

export function useDealStore() {
  const ctx = useContext(DealStoreContext);
  if (!ctx) throw new Error("useDealStore must be used inside <DealStoreProvider>");
  return ctx;
}
