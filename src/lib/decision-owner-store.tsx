"use client";

// Who is acting in the Fund Portal right now. Held in one place so every
// decision made anywhere on the page — a first look, a follow-on call, an
// exit, a write-off — is attributed to the same named partner, rather than
// each surface inventing its own idea of who's logged in.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { PARTNERS } from "@/lib/data";
import type { Partner } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:decision-owner";

interface DecisionOwnerValue {
  owner: Partner;
  setOwner: (owner: Partner) => void;
}

const DecisionOwnerContext = createContext<DecisionOwnerValue | null>(null);

export function DecisionOwnerProvider({ children }: { children: ReactNode }) {
  const [owner, setOwnerState] = useState<Partner>(PARTNERS[0]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local state after mount, not derivable from props/state
      if (raw && (PARTNERS as readonly string[]).includes(raw)) setOwnerState(raw as Partner);
    } catch {
      // localStorage unavailable — fall back to the first partner
    }
  }, []);

  const setOwner = useCallback((next: Partner) => {
    setOwnerState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // best-effort only
    }
  }, []);

  const value = useMemo(() => ({ owner, setOwner }), [owner, setOwner]);
  return <DecisionOwnerContext.Provider value={value}>{children}</DecisionOwnerContext.Provider>;
}

export function useDecisionOwner() {
  const ctx = useContext(DecisionOwnerContext);
  if (!ctx) throw new Error("useDecisionOwner must be used inside <DecisionOwnerProvider>");
  return ctx;
}
