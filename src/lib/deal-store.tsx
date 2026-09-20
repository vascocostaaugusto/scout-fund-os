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
import { deals as seedDeals, safeTermsFor, pitchFor, SCOUT_AUTONOMY_CAP_USD, TICKET_HARD_CAP_USD } from "@/lib/data";
import type { Deal, DealStage, LegalDocStatus, SafeTerms } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:deal-overrides";
const CREATED_KEY = "scout-fund-os:deals-created";
const REFERENCE_NOW = new Date("2026-09-16T09:00:00Z");

interface DealOverrideEntry {
  patch: Partial<Deal>;
  decidedAt: string; // when the decision (approve/decline) was made — used by the "decided this session" list
  lastActionAt: string;
}

export interface NewIntroInput {
  scoutId: string;
  companyName: string;
  sector: string;
  geography: string;
  pitch: string;
  problemDesc: string;
  productDesc: string;
  teamDesc: string;
  whyGreatDesc: string;
  requestedTicketUsd: number;
  conflictNotes?: string;
}

export interface LegalDataInput {
  legalEntityName: string;
  taxId: string;
  investmentAmountUsd: number;
  valuationCapUsd: number;
  discountPct: number;
  safeDate: string; // ISO date
}

interface DealStoreValue {
  deals: Deal[];
  overrides: Record<string, DealOverrideEntry>;
  submitIntro: (input: NewIntroInput) => Deal;
  requestInfo: (dealId: string, question: string, partner: string) => void;
  respondToInfo: (dealId: string, response: string) => void;
  decideDeal: (dealId: string, decision: "approved" | "declined", partner: string, note: string, ticketUsd?: number) => void;
  resetDeal: (dealId: string) => void;
  submitLegalData: (dealId: string, input: LegalDataInput) => void;
  generateSafe: (dealId: string) => void;
  sendForSignature: (dealId: string) => void;
  markExecuted: (dealId: string) => void;
  initiateWire: (dealId: string) => void;
  confirmWire: (dealId: string) => void;
  markCarryPaid: (dealId: string, partner: string) => void;
  decideFollowOn: (dealId: string, decision: "participating" | "passed", partner: string, checkUsd?: number) => void;
  flagFollowOnWatch: (dealId: string, partner: string, note?: string) => void;
  markExited: (dealId: string, multiple: number, partner: string, note?: string) => void;
  writeOff: (dealId: string, note: string, partner: string) => void;
}

const DealStoreContext = createContext<DealStoreValue | null>(null);

export function DealStoreProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverridesState] = useState<Record<string, DealOverrideEntry>>({});
  // Intros submitted through the Scout Portal this session. Kept separately
  // from the patch map because these are whole new records, not edits to a
  // seeded one — but they're otherwise ordinary deals, and every patch
  // action below works on them identically.
  const [created, setCreatedState] = useState<Deal[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local decisions after mount, not derivable from props/state
      if (raw) setOverridesState(JSON.parse(raw));
      const rawCreated = window.localStorage.getItem(CREATED_KEY);
      if (rawCreated) setCreatedState(JSON.parse(rawCreated));
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

  const persistCreated = useCallback((next: Deal[]) => {
    setCreatedState(next);
    try {
      window.localStorage.setItem(CREATED_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const allBase = useMemo(() => [...created, ...seedDeals], [created]);

  const snapshot = useCallback(
    (dealId: string): Deal | undefined => {
      const base = allBase.find((d) => d.id === dealId);
      if (!base) return undefined;
      const existing = overrides[dealId]?.patch;
      return existing ? { ...base, ...existing } : base;
    },
    [allBase, overrides],
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

  // ---- Scout-side: submit an intro, answer a partner's question ----------
  const submitIntro = useCallback(
    (input: NewIntroInput): Deal => {
      const id = `usr_${String(created.length + 1).padStart(3, "0")}`;
      // Up to the full-autonomy threshold, the scout's own ticket clears
      // immediately — no partner needs to review or be attached to the
      // deal at all. Above it, the deal goes into the ordinary partner
      // queue, same as before; the requested amount just rides along as
      // the suggested ticket, capped at the program's hard maximum.
      const requestedTicketUsd = Math.min(Math.max(Math.round(input.requestedTicketUsd), 0), TICKET_HARD_CAP_USD);
      const autonomyApproved = requestedTicketUsd > 0 && requestedTicketUsd <= SCOUT_AUTONOMY_CAP_USD;
      const deal: Deal = {
        id,
        scoutId: input.scoutId,
        companyName: input.companyName.trim(),
        sector: input.sector,
        geography: input.geography,
        stage: autonomyApproved ? "approved" : "submitted",
        checkSizeUsd: autonomyApproved ? requestedTicketUsd : null,
        submittedAt: REFERENCE_NOW.toISOString(),
        firstLookAt: autonomyApproved ? REFERENCE_NOW.toISOString() : null,
        responseHours: autonomyApproved ? 0 : null,
        isLate: false,
        reviewingPartner: autonomyApproved ? "" : "",
        partnerNotes: autonomyApproved
          ? `Auto-approved under scout full-autonomy threshold ($${SCOUT_AUTONOMY_CAP_USD.toLocaleString()}) — no partner sign-off required.`
          : "Memo received, queued for rotation.",
        pitch: input.pitch.trim() || pitchFor(input.companyName, input.sector),
        problemDesc: input.problemDesc.trim() || null,
        productDesc: input.productDesc.trim() || null,
        teamDesc: input.teamDesc.trim() || null,
        whyGreatDesc: input.whyGreatDesc.trim() || null,
        requestedTicketUsd,
        autonomyApproved,
        followOnParticipated: false,
        conflictDisclosed: Boolean(input.conflictNotes?.trim()),
        conflictNotes: input.conflictNotes?.trim() || null,
        followOnDecision: "undecided",
        followOnCheckUsd: null,
        legalEntityName: null,
        taxId: null,
        proposedValuationCapUsd: null,
        proposedDiscountPct: null,
        proposedSafeDate: null,
        legalDataSubmittedAt: null,
        legalDocStatus: "not_started",
        safeTerms: null,
        wireStatus: "not_initiated",
        wireConfirmedAt: null,
        carryPaidAt: null,
        exitMultiple: null,
        outcomeNote: null,
        infoRequest: null,
        infoRequestedAt: null,
        infoResponse: null,
        submittedByScout: true,
      };
      persistCreated([deal, ...created]);
      return deal;
    },
    [created, persistCreated],
  );

  const requestInfo = useCallback(
    (dealId: string, question: string, partner: string) => {
      applyPatch(dealId, {
        stage: "under_review" as DealStage,
        reviewingPartner: partner,
        infoRequest: question,
        infoRequestedAt: REFERENCE_NOW.toISOString(),
        infoResponse: null,
        partnerNotes: `Waiting on the scout: ${question}`,
      });
    },
    [applyPatch],
  );

  const respondToInfo = useCallback(
    (dealId: string, response: string) => {
      applyPatch(dealId, {
        infoResponse: response,
        partnerNotes: "Scout answered — back in the decision queue.",
      });
    },
    [applyPatch],
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
      };
      if (decision === "approved") {
        // The $100K program cap is enforced here, not just suggested in the
        // form — a partner can't approve past it, revisable only by
        // changing TICKET_HARD_CAP_USD itself.
        patch.checkSizeUsd = Math.min(ticketUsd ?? 25_000, TICKET_HARD_CAP_USD);
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
      // Undoing a scout-submitted intro removes the record entirely — there
      // is no seeded version underneath it to fall back to.
      if (created.some((d) => d.id === dealId)) {
        persistCreated(created.filter((d) => d.id !== dealId));
      }
    },
    [overrides, persist, created, persistCreated],
  );

  // ---- Ops: the scout's legal/SAFE data on the company being funded -------
  // A SAFE can't be drafted out of thin air — it needs who the money
  // actually goes to and the proposed terms. This is the scout's
  // responsibility to file, on any deal that's cleared to close.
  const submitLegalData = useCallback(
    (dealId: string, input: LegalDataInput) => {
      applyPatch(dealId, {
        legalEntityName: input.legalEntityName.trim(),
        taxId: input.taxId.trim(),
        checkSizeUsd: input.investmentAmountUsd,
        proposedValuationCapUsd: input.valuationCapUsd,
        proposedDiscountPct: input.discountPct,
        proposedSafeDate: input.safeDate,
        legalDataSubmittedAt: REFERENCE_NOW.toISOString(),
        partnerNotes: "Legal & SAFE data on file — cleared to draft the SAFE.",
      });
    },
    [applyPatch],
  );

  // ---- Closing steps: SAFE drafting → signature → execution → wire --------
  const generateSafe = useCallback(
    (dealId: string) => {
      const deal = snapshot(dealId);
      if (!deal || deal.checkSizeUsd == null || !deal.legalDataSubmittedAt) return;
      const legalDocStatus: LegalDocStatus = "draft_generated";
      // Drafted straight from what the scout filed — the fund no longer
      // assigns terms independently of the deal's actual legal data.
      const safeTerms: SafeTerms =
        deal.proposedValuationCapUsd != null && deal.proposedDiscountPct != null
          ? {
              instrument: "Post-Money SAFE",
              valuationCapUsd: deal.proposedValuationCapUsd,
              discountPct: deal.proposedDiscountPct,
            }
          : safeTermsFor(deal.checkSizeUsd, `${dealId}:${REFERENCE_NOW.getTime()}`);
      applyPatch(dealId, {
        legalDocStatus,
        safeTerms,
        partnerNotes: "SAFE drafted from filed legal data — post-money, terms out for review.",
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
        // The countersignature from the founder's side is the trigger — the
        // moment it lands, the wire becomes the one open action on the deal.
        partnerNotes: "SAFE signed by the founder — wire reminder: initiate the wire now.",
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
        partnerNotes: "Wire confirmed — check written.",
      });
    },
    [applyPatch],
  );

  const markCarryPaid = useCallback(
    (dealId: string, partner: string) => {
      applyPatch(dealId, {
        carryPaidAt: REFERENCE_NOW.toISOString(),
        reviewingPartner: partner,
        partnerNotes: `Carry distribution wired to scout by ${partner}.`,
      });
    },
    [applyPatch],
  );

  const decideFollowOn = useCallback(
    (dealId: string, decision: "participating" | "passed", partner: string, checkUsd?: number) => {
      applyPatch(dealId, {
        reviewingPartner: partner,
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
    (dealId: string, partner: string, note?: string) => {
      applyPatch(dealId, {
        stage: "follow_on_watch" as DealStage,
        reviewingPartner: partner,
        followOnParticipated: true,
        outcomeNote: note || null,
        partnerNotes: note || "Flagged for follow-on watch — next round signaled.",
      });
    },
    [applyPatch],
  );

  const markExited = useCallback(
    (dealId: string, multiple: number, partner: string, note?: string) => {
      applyPatch(dealId, {
        stage: "exited" as DealStage,
        reviewingPartner: partner,
        exitMultiple: multiple,
        outcomeNote: note || null,
        partnerNotes: note || `Exited at ${multiple}x.`,
      });
    },
    [applyPatch],
  );

  const writeOff = useCallback(
    (dealId: string, note: string, partner: string) => {
      applyPatch(dealId, {
        stage: "dead" as DealStage,
        reviewingPartner: partner,
        exitMultiple: 0,
        outcomeNote: note,
        partnerNotes: note || "Written off — company ceased operations.",
      });
    },
    [applyPatch],
  );

  const mergedDeals = useMemo(
    () =>
      allBase.map((d) => {
        const o = overrides[d.id];
        return o ? ({ ...d, ...o.patch } satisfies Deal) : d;
      }),
    [allBase, overrides],
  );

  const value = useMemo(
    () => ({
      deals: mergedDeals,
      overrides,
      submitIntro,
      requestInfo,
      respondToInfo,
      decideDeal,
      resetDeal,
      submitLegalData,
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
      submitIntro,
      requestInfo,
      respondToInfo,
      decideDeal,
      resetDeal,
      submitLegalData,
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
