"use client";

// Same pattern as deal-store.tsx, scoped to a scout's own onboarding
// paperwork — tax form and payout bank account — which is what actually
// gates a carry payout on exit, independent of whether the deal itself
// closed. Session-local via localStorage; no backend.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scouts as seedScouts } from "@/lib/data";
import type { Scout } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:scout-onboarding-overrides";

interface ScoutOnboardingValue {
  scouts: Scout[];
  completeTaxForm: (scoutId: string) => void;
  linkPayoutAccount: (scoutId: string) => void;
}

const ScoutOnboardingContext = createContext<ScoutOnboardingValue | null>(null);

export function ScoutOnboardingProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, Partial<Scout>>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local state after mount, not derivable from props/state
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start clean
    }
  }, []);

  const persist = useCallback((next: Record<string, Partial<Scout>>) => {
    setOverrides(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const completeTaxForm = useCallback(
    (scoutId: string) => {
      persist({ ...overrides, [scoutId]: { ...overrides[scoutId], taxFormStatus: "submitted" } });
    },
    [overrides, persist],
  );

  const linkPayoutAccount = useCallback(
    (scoutId: string) => {
      persist({ ...overrides, [scoutId]: { ...overrides[scoutId], payoutAccountStatus: "linked" } });
    },
    [overrides, persist],
  );

  const mergedScouts = useMemo(
    () => seedScouts.map((s) => (overrides[s.id] ? { ...s, ...overrides[s.id] } : s)),
    [overrides],
  );

  const value = useMemo(
    () => ({ scouts: mergedScouts, completeTaxForm, linkPayoutAccount }),
    [mergedScouts, completeTaxForm, linkPayoutAccount],
  );

  return <ScoutOnboardingContext.Provider value={value}>{children}</ScoutOnboardingContext.Provider>;
}

export function useScoutOnboarding() {
  const ctx = useContext(ScoutOnboardingContext);
  if (!ctx) throw new Error("useScoutOnboarding must be used inside <ScoutOnboardingProvider>");
  return ctx;
}
