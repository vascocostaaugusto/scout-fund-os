"use client";

// Same pattern as deal-store.tsx: session-local overrides over the seeded
// candidates array, persisted to localStorage. Advancing a candidate to
// "signed" does not splice them into the live `scouts` roster — that would
// cascade into every tier count and aggregate in the app. It's left as an
// explicit, honest stopping point (see the confirmation copy in the panel).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { candidates as seedCandidates } from "@/lib/data";
import type { CandidateStage, ScoutCandidate } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:candidate-overrides";

const ADVANCE_ORDER: CandidateStage[] = [
  "nominated",
  "interview_scheduled",
  "reference_check",
  "agreement_sent",
  "signed",
];

interface CandidateStoreValue {
  candidates: ScoutCandidate[];
  advanceCandidate: (id: string) => void;
  declineCandidate: (id: string) => void;
}

const CandidateStoreContext = createContext<CandidateStoreValue | null>(null);

export function CandidateStoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, CandidateStage>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local state after mount, not derivable from props/state
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start clean
    }
  }, []);

  const persist = useCallback((next: Record<string, CandidateStage>) => {
    setOverrides(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const advanceCandidate = useCallback(
    (id: string) => {
      const base = seedCandidates.find((c) => c.id === id);
      if (!base) return;
      const current = overrides[id] ?? base.stage;
      const idx = ADVANCE_ORDER.indexOf(current);
      if (idx === -1 || idx === ADVANCE_ORDER.length - 1) return;
      persist({ ...overrides, [id]: ADVANCE_ORDER[idx + 1] });
    },
    [overrides, persist],
  );

  const declineCandidate = useCallback(
    (id: string) => {
      persist({ ...overrides, [id]: "declined" });
    },
    [overrides, persist],
  );

  const mergedCandidates = useMemo(
    () => seedCandidates.map((c) => (overrides[c.id] ? { ...c, stage: overrides[c.id] } : c)),
    [overrides],
  );

  const value = useMemo(
    () => ({ candidates: mergedCandidates, advanceCandidate, declineCandidate }),
    [mergedCandidates, advanceCandidate, declineCandidate],
  );

  return <CandidateStoreContext.Provider value={value}>{children}</CandidateStoreContext.Provider>;
}

export function useCandidateStore() {
  const ctx = useContext(CandidateStoreContext);
  if (!ctx) throw new Error("useCandidateStore must be used inside <CandidateStoreProvider>");
  return ctx;
}
