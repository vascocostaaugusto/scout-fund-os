"use client";

// The front door of the whole program. Every deal in the pipeline starts as
// a scout filling this in — before this existed the app could work a deal
// all the way from decision to wire to exit, but nothing could actually
// enter the pipeline from the scout's side.
import { useState } from "react";
import { Plus, Send, Check, ShieldAlert } from "lucide-react";
import { SECTORS, GEOGRAPHIES } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50";

export function SubmitIntro({ scoutId }: { scoutId: string }) {
  const { submitIntro } = useDealStore();
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState<string>(SECTORS[0]);
  const [geography, setGeography] = useState<string>(GEOGRAPHIES[0]);
  const [pitch, setPitch] = useState("");
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictNotes, setConflictNotes] = useState("");
  const [justSubmitted, setJustSubmitted] = useState<string | null>(null);

  const canSubmit = company.trim().length > 1 && pitch.trim().length > 9 && (!hasConflict || conflictNotes.trim().length > 4);

  function reset() {
    setCompany("");
    setPitch("");
    setHasConflict(false);
    setConflictNotes("");
    setSector(SECTORS[0]);
    setGeography(GEOGRAPHIES[0]);
  }

  function submit() {
    if (!canSubmit) return;
    const deal = submitIntro({
      scoutId,
      companyName: company,
      sector,
      geography,
      pitch,
      conflictNotes: hasConflict ? conflictNotes : undefined,
    });
    setJustSubmitted(deal.companyName);
    reset();
    setOpen(false);
  }

  return (
    <div className="flex flex-col gap-3">
      {justSubmitted ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3 text-xs text-foreground">
          <Check className="size-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">{justSubmitted}</span> submitted — it&apos;s in the partner queue now.
            You&apos;ll see a first look within 48 hours, and it appears in your deals below.
          </span>
        </div>
      ) : null}

      {!open ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setJustSubmitted(null);
          }}
          className="group flex items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-left transition-colors hover:border-primary/50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Plus className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Submit an intro</span>
            <span className="text-xs text-muted-foreground">
              One page, one company — a partner responds within 48 hours
            </span>
          </div>
        </button>
      ) : (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">Submit an intro</span>

          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1.5 sm:col-span-1">
              <span className="text-[11px] text-muted-foreground">Company</span>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Kestrel"
                className={FIELD}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Sector</span>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className={FIELD}>
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Geography</span>
              <select value={geography} onChange={(e) => setGeography(e.target.value)} className={FIELD}>
                {GEOGRAPHIES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] text-muted-foreground">
              Why this company — the one thing that makes it worth a first look
            </span>
            <textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              rows={3}
              placeholder="Second-time founders, ex-Stripe, doing account-to-account payouts for marketplaces. Already live with three design partners."
              className={cn(FIELD, "resize-none")}
            />
          </label>

          <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/40 p-3">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={hasConflict}
                onChange={(e) => setHasConflict(e.target.checked)}
                className="mt-0.5 size-3.5 accent-[var(--primary)]"
              />
              <span className="flex flex-col">
                <span className="text-xs text-foreground">
                  I have a personal stake, prior relationship, or family tie to this company
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Disclose it here rather than letting it surface in diligence — it doesn&apos;t disqualify
                  the intro.
                </span>
              </span>
            </label>
            {hasConflict ? (
              <div className="flex items-start gap-2">
                <ShieldAlert className="mt-2 size-3.5 shrink-0 text-critical" />
                <textarea
                  value={conflictNotes}
                  onChange={(e) => setConflictNotes(e.target.value)}
                  rows={2}
                  placeholder="An angel check from before I joined the program; the founder is a former colleague."
                  className={cn(FIELD, "resize-none text-xs")}
                />
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={submit} disabled={!canSubmit}>
              <Send className="size-3.5" />
              Submit memo
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {!canSubmit ? (
              <span className="text-[11px] text-muted-foreground">
                Company and a line on why it&apos;s worth a look are required
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
