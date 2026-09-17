"use client";

// A lightweight client-side store for everything that happens to a deal
// *in this browser session* — the thing that makes the Fund Portal an
// actual place to work, not just a read-only view of the seeded dataset.
// There's no backend, so "persistence" is localStorage, scoped to one
// browser. Every deal-consuming view that should reflect live changes reads
// through useDealStore() instead of importing the static `deals` array
// directly.
//
// Overrides are stored as a *patch* per deal (not a full replacement
// object) so decisions and closing steps can each apply incrementally —
// approve a deal, then separately generate its SAFE, then send it for
// signature — without one action clobbering another's field.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { deals as seedDeals, safeTermsFor } from "@/lib/data";
import type { Deal, DealStage, LegalDocStatus } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:deal-overrides";
const REFERENCE_NOW = new Date("2026-09-16T09:00:00Z");

interface DealOverrideEntry {
  patch: Partial<Deal>;
  decidedAt: string; // when the decision (approve/decline) was made — used by the "decided this session" list
  lastActionAt: string;
}

interface DealStoreValue {
  deals: Deal[];
  overrides: Record<string, DealOverrideEntry>;
  decideDeal: (dealId: string, decision: "approved" | "declined", partner: string, note: string, ticketUsd?: number) => void;
  resetDeal: (dealId: string) => void;
  generateSafe: (dealId: string) => void;
  sendForSignature: (dealId: string) => void;
  markExecuted: (dealId: string) => void;
  initiateWire: (dealId: string) => void;
  confirmWire: (dealId: string) => void;
  markCarryPaid: (dealId: string) => void;
  decideFollowOn: (dealId: string, decision: "participating" | "passed", checkUsd?: number) => void;
  flagFollowOnWatch: (dealId: string, note?: string) => void;
  markExited: (dealId: string, multiple: number, note?: string) => void;
  writeOff: (dealId: string, note: string) => void;
}

const DealStoreContext = createContext<DealStoreValue | null>(null);

export function DealStoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverridesState] = useState<Record<string, DealOverrideEntry>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local decisions after mount, not derivable from props/state
      if (raw) setOverridesState(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start clean
    }
  }, []);

  const persist = useCallback((next: Record<string, DealOverrideEntry>) => {
    setOverridesState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const snapshot = useCallback(
    (dealId: string): Deal | undefined => {
      const base = seedDeals.find((d) => d.id === dealId);
      if (!base) return undefined;
      const existing = overrides[dealId]?.patch;
      return existing ? { ...base, ...existing } : base;
    },
    [overrides],
  );

  const applyPatch = useCallback(
    (dealId: string, patch: Partial<Deal>, opts?: { isDecision?: boolean }) => {
      const existing = overrides[dealId];
      const entry: DealOverrideEntry = {
        patch: { ...(existing?.patch ?? {}), ...patch },
        decidedAt: opts?.isDecision ? REFERENCE_NOW.toISOString() : existing?.decidedAt ?? REFERENCE_NOW.toISOString(),
        lastActionAt: REFERENCE_NOW.toISOString(),
      };
      persist({ ...overrides, [dealId]: entry });
    },
    [overrides, persist],
  );

  const decideDeal = useCallback(
    (dealId: string, decision: "approved" | "declined", partner: string, note: string, ticketUsd?: number) => {
      const current = snapshot(dealId);
      if (!current) return;
      // "under_review" deals already had their first look — that response
      // time is a fixed historical fact and shouldn't shift just because
      // the *final* decision comes later. Only a deal still sitting in
      // "submitted" (no look yet) gets its first-look time set here.
      const isFirstLook = current.stage === "submitted" || current.responseHours == null;
      const responseHours = isFirstLook
        ? Math.round(((REFERENCE_NOW.getTime() - new Date(current.submittedAt).getTime()) / 3600_000) * 10) / 10
        : current.responseHours!;
      const patch: Partial<Deal> = {
        stage: decision,
        partnerNotes: note || (decision === "approved" ? "Approved, SAFE drafting to start." : "Declined."),
        reviewingPartner: partner,
        firstLookAt: isFirstLook ? REFERENCE_NOW.toISOString() : current.firstLookAt,
        responseHours,
        isLate: responseHours > 48,
        rightOfFirstLook: decision === "approved",
      };
      if (decision === "approved") {
        patch.checkSizeUsd = ticketUsd ?? 25_000;
        patch.legalDocStatus = "not_started";
        patch.safeTerms = null;
        patch.wireStatus = "not_initiated";
        patch.wireConfirmedAt = null;
      }
      applyPatch(dealId, patch, { isDecision: true });
    },
    [snapshot, applyPatch],
  );

  const resetDeal = useCallback(
    (dealId: string) => {
      const next = { ...overrides };
      delete next[dealId];
      persist(next);
    },
    [overrides, persist],
  );

  // ---- Closing steps: SAFE drafting → signature → execution → wire --------
  const generateSafe = useCallback(
    (dealId: string) => {
      const deal = snapshot(dealId);
      if (!deal || deal.checkSizeUsd == null) return;
      const legalDocStatus: LegalDocStatus = "draft_generated";
      applyPatch(dealId, {
        legalDocStatus,
        safeTerms: safeTermsFor(deal.checkSizeUsd, `${dealId}:${REFERENCE_NOW.getTime()}`),
        partnerNotes: "SAFE drafted — post-money, terms out for review.",
      });
    },
    [snapshot, applyPatch],
  );

  const sendForSignature = useCallback(
    (dealId: string) => {
      applyPatch(dealId, {
        legalDocStatus: "sent_for_signature",
        partnerNotes: "SAFE sent for e-signature — fund and founder counter-signing.",
      });
    },
    [applyPatch],
  );

  const markExecuted = useCallback(
    (dealId: string) => {
      applyPatch(dealId, {
        legalDocStatus: "executed",
        partnerNotes: "SAFE executed by both parties — cleared to wire.",
      });
    },
    [applyPatch],
  );

  const initiateWire = useCallback(
    (dealId: string) => {
      applyPatch(dealId, {
        wireStatus: "initiated",
        partnerNotes: "Wire initiated from the fund's operating account.",
      });
    },
    [applyPatch],
  );

  const confirmWire = useCallback(
    (dealId: string) => {
      applyPatch(dealId, {
        wireStatus: "confirmed",
        wireConfirmedAt: REFERENCE_NOW.toISOString(),
        stage: "check_written" as DealStage,
        partnerNotes: "Wire confirmed — check written, right-of-first-look logged.",
      });
    },
    [applyPatch],
  );

  const markCarryPaid = useCallback(
    (dealId: string) => {
      applyPatch(dealId, {
        carryPaidAt: REFERENCE_NOW.toISOString(),
        partnerNotes: "Carry distribution wired to scout.",
      });
    },
    [applyPatch],
  );

  const decideFollowOn = useCallback(
    (dealId: string, decision: "participating" | "passed", checkUsd?: number) => {
      applyPatch(dealId, {
        followOnDecision: decision,
        followOnCheckUsd: decision === "participating" ? (checkUsd ?? 150_000) : null,
        partnerNotes:
          decision === "participating"
            ? `Following on ${checkUsd ? `$${checkUsd.toLocaleString()}` : "$150,000"} from Fund II.`
            : "Passing on the follow-on round — scout ticket stands as-is.",
      });
    },
    [applyPatch],
  );

  // ---- Portfolio outcomes: what happens to a company after the check ------
  const flagFollowOnWatch = useCallback(
    (dealId: string, note?: string) => {
      applyPatch(dealId, {
        stage: "follow_on_watch" as DealStage,
        followOnParticipated: true,
        outcomeNote: note || null,
        partnerNotes: note || "Flagged for follow-on watch — next round signaled.",
      });
    },
    [applyPatch],
  );

  const markExited = useCallback(
    (dealId: string, multiple: number, note?: string) => {
      applyPatch(dealId, {
        stage: "exited" as DealStage,
        exitMultiple: multiple,
        outcomeNote: note || null,
        partnerNotes: note || `Exited at ${multiple}x.`,
      });
    },
    [applyPatch],
  );

  const writeOff = useCallback(
    (dealId: string, note: string) => {
      applyPatch(dealId, {
        stage: "dead" as DealStage,
        exitMultiple: 0,
        outcomeNote: note,
        partnerNotes: note || "Written off — company ceased operations.",
      });
    },
    [applyPatch],
  );

  const mergedDeals = useMemo(
    () =>
      seedDeals.map((d) => {
        const o = overrides[d.id];
        return o ? ({ ...d, ...o.patch } satisfies Deal) : d;
      }),
    [overrides],
  );

  const value = useMemo(
    () => ({
      deals: mergedDeals,
      overrides,
      decideDeal,
      resetDeal,
      generateSafe,
      sendForSignature,
      markExecuted,
      initiateWire,
      confirmWire,
      markCarryPaid,
      decideFollowOn,
      flagFollowOnWatch,
      markExited,
      writeOff,
    }),
    [
      mergedDeals,
      overrides,
      decideDeal,
      resetDeal,
      generateSafe,
      sendForSignature,
      markExecuted,
      initiateWire,
      confirmWire,
      markCarryPaid,
      decideFollowOn,
      flagFollowOnWatch,
      markExited,
      writeOff,
    ],
  );

  return <DealStoreContext.Provider value={value}>{children}</DealStoreContext.Provider>;
}

export function useDealStore() {
  const ctx = useContext(DealStoreContext);
  if (!ctx) throw new Error("useDealStore must be used inside <DealStoreProvider>");
  return ctx;
}
