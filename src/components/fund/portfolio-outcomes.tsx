"use client";

// The back half of the deal lifecycle. Once a check is wired, a company
// eventually does one of three things: raises again (follow-on watch),
// exits, or dies. Before this existed the app could move a deal all the way
// to "check written" and then had no way to record what actually happened
// to it — the "exited" and "written off" stages existed in the data and on
// the kanban with no way to reach them.
import { useState } from "react";
import { TrendingUp, Trophy, Skull, ChevronDown } from "lucide-react";
import { scoutById } from "@/lib/data";
import { useDealStore } from "@/lib/deal-store";
import { useDecisionOwner } from "@/lib/decision-owner-store";
import { formatUsd, timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_EXIT_MULTIPLE = 3;

export function PortfolioOutcomes() {
  const { deals, flagFollowOnWatch, markExited, writeOff } = useDealStore();
  const { owner } = useDecisionOwner();
  const [openId, setOpenId] = useState<string | null>(null);
  const [mode, setMode] = useState<"exit" | "writeoff" | null>(null);
  const [multiple, setMultiple] = useState<number>(DEFAULT_EXIT_MULTIPLE);
  const [note, setNote] = useState("");

  // Live companies: the check has cleared and the outcome isn't settled yet.
  const live = deals
    .filter((d) => d.stage === "check_written" || d.stage === "follow_on_watch")
    .sort((a, b) => (b.wireConfirmedAt ?? "").localeCompare(a.wireConfirmedAt ?? ""));

  function open(dealId: string, m: "exit" | "writeoff") {
    setOpenId(dealId);
    setMode(m);
    setMultiple(DEFAULT_EXIT_MULTIPLE);
    setNote("");
  }

  function close() {
    setOpenId(null);
    setMode(null);
    setNote("");
  }

  function submit(dealId: string) {
    if (mode === "exit") markExited(dealId, multiple, owner, note.trim() || undefined);
    if (mode === "writeoff") writeOff(dealId, note.trim() || "Company ceased operations.", owner);
    close();
  }

  if (live.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        No live portfolio companies — every funded deal has a recorded outcome.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs text-muted-foreground">
        {live.length} funded compan{live.length === 1 ? "y" : "ies"} still live — record what happens to them here.
      </span>

      <div className="flex max-h-[520px] flex-col gap-2 overflow-y-auto">
        {live.map((d) => {
          const scout = scoutById.get(d.scoutId);
          const isOpen = openId === d.id;

          return (
            <div key={d.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{d.companyName}</span>
                    {d.stage === "follow_on_watch" ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                        Follow-on watch
                      </span>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {d.sector} · {scout?.name} · {formatUsd(d.checkSizeUsd ?? 0)}
                    {d.wireConfirmedAt ? ` · funded ${timeAgo(d.wireConfirmedAt)}` : ""}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-1.5">
                  {d.stage === "check_written" ? (
                    <Button size="sm" variant="ghost" onClick={() => flagFollowOnWatch(d.id, owner)}>
                      <TrendingUp className="size-3.5" />
                      Raising again
                    </Button>
                  ) : null}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-success hover:bg-success/10 hover:text-success"
                    onClick={() => (isOpen && mode === "exit" ? close() : open(d.id, "exit"))}
                  >
                    <Trophy className="size-3.5" />
                    Exited
                    <ChevronDown className={cn("size-3 transition-transform", isOpen && mode === "exit" && "rotate-180")} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-critical hover:bg-critical/10 hover:text-critical"
                    onClick={() => (isOpen && mode === "writeoff" ? close() : open(d.id, "writeoff"))}
                  >
                    <Skull className="size-3.5" />
                    Write off
                    <ChevronDown className={cn("size-3 transition-transform", isOpen && mode === "writeoff" && "rotate-180")} />
                  </Button>
                </div>
              </div>

              {isOpen ? (
                <div className="flex flex-col gap-2.5 rounded-lg border border-border/60 bg-background/40 p-3">
                  {mode === "exit" ? (
                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      Exit multiple
                      <input
                        type="number"
                        step={0.5}
                        value={multiple}
                        onChange={(e) => setMultiple(Number(e.target.value))}
                        className="w-20 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                      <span className="text-muted-foreground/70">
                        on {formatUsd(d.checkSizeUsd ?? 0)} ={" "}
                        <span className="text-foreground">{formatUsd((d.checkSizeUsd ?? 0) * multiple)}</span> back
                      </span>
                    </label>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">
                      Writing off marks the ticket at zero and closes the position. The scout keeps no carry on it.
                    </span>
                  )}
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder={
                      mode === "exit" ? "How it exited — acquirer, terms, anything worth logging" : "What happened"
                    }
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => submit(d.id)}>
                      {mode === "exit" ? "Record exit" : "Confirm write-off"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={close}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
