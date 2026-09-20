"use client";

// The front door of the whole program. Every deal in the pipeline starts as
// a scout filling this in — before this existed the app could work a deal
// all the way from decision to wire to exit, but nothing could actually
// enter the pipeline from the scout's side.
import { useState } from "react";
import { Plus, Send, Check, ShieldAlert, Zap, FileCheck2 } from "lucide-react";
import { SECTORS, GEOGRAPHIES, SCOUT_AUTONOMY_CAP_USD, TICKET_HARD_CAP_USD } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { formatUsd } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FIELD =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50";

const DEFAULT_TICKET = 10_000;

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface LegalDraft {
  dealId: string;
  companyName: string;
  legalEntityName: string;
  taxId: string;
  amount: number;
  cap: number;
  discount: number;
  date: string;
}

export function SubmitIntro({ scoutId }: { scoutId: string }) {
  const { submitIntro, submitLegalData } = useDealStore();
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState<string>(SECTORS[0]);
  const [geography, setGeography] = useState<string>(GEOGRAPHIES[0]);
  const [ticket, setTicket] = useState(DEFAULT_TICKET);
  const [problemDesc, setProblemDesc] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [teamDesc, setTeamDesc] = useState("");
  const [whyGreatDesc, setWhyGreatDesc] = useState("");
  const [hasConflict, setHasConflict] = useState(false);
  const [conflictNotes, setConflictNotes] = useState("");
  const [pendingApproval, setPendingApproval] = useState<string | null>(null);
  const [legalDraft, setLegalDraft] = useState<LegalDraft | null>(null);
  const [filed, setFiled] = useState<string | null>(null);

  const clampedTicket = Math.min(Math.max(ticket, 0), TICKET_HARD_CAP_USD);
  const autonomy = clampedTicket > 0 && clampedTicket <= SCOUT_AUTONOMY_CAP_USD;
  const canSubmit =
    company.trim().length > 1 &&
    clampedTicket > 0 &&
    problemDesc.trim().length > 4 &&
    productDesc.trim().length > 4 &&
    teamDesc.trim().length > 4 &&
    whyGreatDesc.trim().length > 4 &&
    (!hasConflict || conflictNotes.trim().length > 4);

  const canFileLegal =
    !!legalDraft &&
    legalDraft.legalEntityName.trim().length > 1 &&
    legalDraft.taxId.trim().length > 3 &&
    legalDraft.amount > 0 &&
    legalDraft.cap > 0;

  function reset() {
    setCompany("");
    setProblemDesc("");
    setProductDesc("");
    setTeamDesc("");
    setWhyGreatDesc("");
    setHasConflict(false);
    setConflictNotes("");
    setSector(SECTORS[0]);
    setGeography(GEOGRAPHIES[0]);
    setTicket(DEFAULT_TICKET);
  }

  function submit() {
    if (!canSubmit) return;
    const pitch = whyGreatDesc;
    const deal = submitIntro({
      scoutId,
      companyName: company,
      sector,
      geography,
      pitch,
      problemDesc,
      productDesc,
      teamDesc,
      whyGreatDesc,
      requestedTicketUsd: clampedTicket,
      conflictNotes: hasConflict ? conflictNotes : undefined,
    });
    reset();
    setOpen(false);
    setFiled(null);
    if (deal.autonomyApproved) {
      // Under the autonomy threshold, no partner review needed — go
      // straight into the legal & SAFE filing this deal needs to close.
      setPendingApproval(null);
      setLegalDraft({
        dealId: deal.id,
        companyName: deal.companyName,
        legalEntityName: "",
        taxId: "",
        amount: deal.checkSizeUsd ?? clampedTicket,
        cap: 3_000_000,
        discount: 20,
        date: todayIso(),
      });
    } else {
      setLegalDraft(null);
      setPendingApproval(deal.companyName);
    }
  }

  function fileLegalData() {
    if (!legalDraft || !canFileLegal) return;
    submitLegalData(legalDraft.dealId, {
      legalEntityName: legalDraft.legalEntityName,
      taxId: legalDraft.taxId,
      investmentAmountUsd: legalDraft.amount,
      valuationCapUsd: legalDraft.cap,
      discountPct: legalDraft.discount,
      safeDate: legalDraft.date,
    });
    setFiled(legalDraft.companyName);
    setLegalDraft(null);
  }

  return (
    <div className="flex flex-col gap-3">
      {pendingApproval ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3 text-xs text-foreground">
          <Check className="size-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">{pendingApproval}</span> submitted, above the autonomy threshold, so
            it&apos;s now a pending decision in the fund&apos;s queue. You&apos;ll see a first look within 48
            hours, and it appears in your deals below.
          </span>
        </div>
      ) : null}

      {filed ? (
        <div className="flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/[0.06] px-4 py-3 text-xs text-foreground">
          <FileCheck2 className="size-4 shrink-0 text-primary" />
          <span>
            <span className="font-medium">{filed}</span> is filed. The SAFE drafts itself from that data;
            partners just sign it. Nothing else needed from you right now.
          </span>
        </div>
      ) : null}

      {legalDraft ? (
        <div className="flex flex-col gap-3 rounded-xl border border-primary/30 bg-card p-4">
          <div>
            <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Zap className="size-3.5 text-primary" />
              {legalDraft.companyName} approved instantly, at or under the autonomy threshold
            </span>
            <span className="text-[11px] text-muted-foreground">
              No partner review needed. File the legal &amp; SAFE data below so it can close.
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Legal entity name</span>
              <input
                value={legalDraft.legalEntityName}
                onChange={(e) => setLegalDraft({ ...legalDraft, legalEntityName: e.target.value })}
                placeholder="Kestrel Payments, Lda."
                className={FIELD}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">NIF / tax ID</span>
              <input
                value={legalDraft.taxId}
                onChange={(e) => setLegalDraft({ ...legalDraft, taxId: e.target.value })}
                placeholder="513 xxx xxx"
                className={FIELD}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Amount (USD)</span>
              <input
                type="number"
                step={1000}
                value={legalDraft.amount}
                onChange={(e) => setLegalDraft({ ...legalDraft, amount: Number(e.target.value) })}
                className={cn(FIELD, "tabular-nums")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Valuation cap (USD)</span>
              <input
                type="number"
                step={100_000}
                value={legalDraft.cap}
                onChange={(e) => setLegalDraft({ ...legalDraft, cap: Number(e.target.value) })}
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
                value={legalDraft.discount}
                onChange={(e) => setLegalDraft({ ...legalDraft, discount: Number(e.target.value) })}
                className={cn(FIELD, "tabular-nums")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">SAFE date</span>
              <input
                type="date"
                value={legalDraft.date}
                onChange={(e) => setLegalDraft({ ...legalDraft, date: e.target.value })}
                className={FIELD}
              />
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={fileLegalData} disabled={!canFileLegal}>
              <FileCheck2 className="size-3.5" />
              File legal data
            </Button>
            {!canFileLegal ? (
              <span className="text-[11px] text-muted-foreground">Legal entity name, NIF, amount, and cap are required</span>
            ) : null}
          </div>
        </div>
      ) : null}

      {!open && !legalDraft ? (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setPendingApproval(null);
            setFiled(null);
          }}
          className="group flex items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-4 text-left transition-colors hover:border-primary/50"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Plus className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Submit a deal</span>
            <span className="text-xs text-muted-foreground">
              At or under {formatUsd(SCOUT_AUTONOMY_CAP_USD)}, it&apos;s yours to fund. Above that, a partner
              responds within 48 hours.
            </span>
          </div>
        </button>
      ) : null}

      {open ? (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
          <span className="text-sm font-medium text-foreground">Submit a deal</span>

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
            <span className="text-[11px] text-muted-foreground">Ticket size</span>
            <input
              type="number"
              min={0}
              max={TICKET_HARD_CAP_USD}
              step={1000}
              value={ticket}
              onChange={(e) => setTicket(Number(e.target.value))}
              className={cn(FIELD, "max-w-[160px]")}
            />
            <span
              className={cn(
                "flex items-center gap-1.5 text-[11px]",
                autonomy ? "text-primary" : "text-muted-foreground",
              )}
            >
              {autonomy ? <Zap className="size-3 shrink-0" /> : null}
              {autonomy
                ? `At or under ${formatUsd(SCOUT_AUTONOMY_CAP_USD)}: no approval needed, you'll file the legal & SAFE data next.`
                : `Above ${formatUsd(SCOUT_AUTONOMY_CAP_USD)}: needs the fund's OK, up to a ${formatUsd(TICKET_HARD_CAP_USD)} cap.`}
            </span>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Problem</span>
              <textarea
                value={problemDesc}
                onChange={(e) => setProblemDesc(e.target.value)}
                rows={2}
                placeholder="What's broken today, and for whom."
                className={cn(FIELD, "resize-none")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Product</span>
              <textarea
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                rows={2}
                placeholder="What they've actually built, and how far it's gotten."
                className={cn(FIELD, "resize-none")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Team</span>
              <textarea
                value={teamDesc}
                onChange={(e) => setTeamDesc(e.target.value)}
                rows={2}
                placeholder="Who's building it, and why they're the ones to do it."
                className={cn(FIELD, "resize-none")}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] text-muted-foreground">Why they&apos;ll be great</span>
              <textarea
                value={whyGreatDesc}
                onChange={(e) => setWhyGreatDesc(e.target.value)}
                rows={2}
                placeholder="The one thing that makes this worth a check."
                className={cn(FIELD, "resize-none")}
              />
            </label>
          </div>

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
                  I have a prior relationship with this company&apos;s founders
                </span>
                <span className="text-[11px] text-muted-foreground">
                  A personal stake, a past working relationship, a family tie, disclose it here rather than
                  letting it surface in diligence. It doesn&apos;t disqualify the deal.
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
              Submit deal
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            {!canSubmit ? (
              <span className="text-[11px] text-muted-foreground">
                Company, a ticket size, and all four mini-memo fields are required
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
