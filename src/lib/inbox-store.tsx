"use client";

// Session state for the overnight inbox pass: which proposed changes a
// partner has confirmed or dismissed. Confirming one applies the actual
// record change through deal-store — the inbox doesn't have its own write
// path, it just queues up changes for a human to approve.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { inboxProposals } from "@/lib/data";
import type { InboxProposal } from "@/lib/data";

const STORAGE_KEY = "scout-fund-os:inbox-resolutions";

export type Resolution = "confirmed" | "dismissed";

interface InboxStoreValue {
  pending: InboxProposal[];
  resolved: { proposal: InboxProposal; resolution: Resolution }[];
  resolve: (id: string, resolution: Resolution) => void;
  reopen: (id: string) => void;
}

const InboxStoreContext = createContext<InboxStoreValue | null>(null);

export function InboxStoreProvider({ children }: { children: ReactNode }) {
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>({});

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring session-local state after mount, not derivable from props/state
      if (raw) setResolutions(JSON.parse(raw));
    } catch {
      // localStorage unavailable or corrupt — start clean
    }
  }, []);

  const persist = useCallback((next: Record<string, Resolution>) => {
    setResolutions(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // best-effort only
    }
  }, []);

  const resolve = useCallback(
    (id: string, resolution: Resolution) => {
      persist({ ...resolutions, [id]: resolution });
    },
    [resolutions, persist],
  );

  const reopen = useCallback(
    (id: string) => {
      const next = { ...resolutions };
      delete next[id];
      persist(next);
    },
    [resolutions, persist],
  );

  const value = useMemo(() => {
    const pending = inboxProposals.filter((p) => !resolutions[p.id]);
    const resolved = inboxProposals
      .filter((p) => resolutions[p.id])
      .map((p) => ({ proposal: p, resolution: resolutions[p.id] }));
    return { pending, resolved, resolve, reopen };
  }, [resolutions, resolve, reopen]);

  return <InboxStoreContext.Provider value={value}>{children}</InboxStoreContext.Provider>;
}

export function useInboxStore() {
  const ctx = useContext(InboxStoreContext);
  if (!ctx) throw new Error("useInboxStore must be used inside <InboxStoreProvider>");
  return ctx;
}
