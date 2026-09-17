"use client";

// The Fund Portal is one long working page. This is its index: every
// section, what's waiting in it right now, and a click to jump straight
// there — so a partner opening the portal sees where the work is instead
// of scrolling to find out.
import {
  Gavel,
  FileSignature,
  TrendingUp,
  CircleDollarSign,
  LineChart,
  UserPlus,
  Table2,
  Bell,
} from "lucide-react";
import { useLiveStats } from "@/lib/use-live-stats";
import { useCandidateStore } from "@/lib/candidate-store";
import { cn } from "@/lib/utils";

export function PortalIndex() {
  const { pipelineByStage, closingQueueCount, totalMemos, fundedDeals } = useLiveStats();
  const { candidates } = useCandidateStore();

  const pendingDecisions = pipelineByStage.submitted + pipelineByStage.under_review;
  const openFollowOns = fundedDeals.filter(
    (d) => d.stage === "follow_on_watch" && d.followOnDecision === "undecided",
  ).length;
  const unpaidExits = fundedDeals.filter((d) => d.stage === "exited" && !d.carryPaidAt).length;
  const openCandidates = candidates.filter((c) => c.stage !== "signed" && c.stage !== "declined").length;

  const items = [
    {
      href: "#pending-decisions",
      icon: Gavel,
      label: "Pending decisions",
      count: pendingDecisions,
      sub: "memos awaiting a first look",
      urgent: pendingDecisions > 0,
    },
    {
      href: "#legal-closing",
      icon: FileSignature,
      label: "Legal & closing",
      count: closingQueueCount,
      sub: "approved, not yet wired",
      urgent: closingQueueCount > 0,
    },
    {
      href: "#follow-on",
      icon: TrendingUp,
      label: "Follow-on decisions",
      count: openFollowOns,
      sub: "next rounds awaiting a call",
      urgent: openFollowOns > 0,
    },
    {
      href: "#exit-distributions",
      icon: CircleDollarSign,
      label: "Exit distributions",
      count: unpaidExits,
      sub: "carry not yet paid out",
      urgent: unpaidExits > 0,
    },
    {
      href: "#scout-recruiting",
      icon: UserPlus,
      label: "Scout recruiting",
      count: openCandidates,
      sub: "candidates in the pipeline",
      urgent: false,
    },
    {
      href: "#deployment-pacing",
      icon: LineChart,
      label: "Deployment pacing",
      count: null,
      sub: "vs. the 24-month target",
      urgent: false,
    },
    {
      href: "#system-of-record",
      icon: Table2,
      label: "System of record",
      count: totalMemos,
      sub: "every deal, searchable",
      urgent: false,
    },
    {
      href: "#comms",
      icon: Bell,
      label: "Notifications & reporting",
      count: null,
      sub: "scout emails, LP filings",
      urgent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors",
              item.urgent ? "border-primary/40 hover:border-primary" : "border-border hover:border-primary/40",
            )}
          >
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                item.urgent
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary/60 text-muted-foreground group-hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex min-w-0 flex-col">
              <div className="flex items-baseline gap-1.5">
                {item.count !== null ? (
                  <span className="text-sm font-semibold tabular-nums text-foreground">{item.count}</span>
                ) : null}
                <span className="truncate text-xs font-medium text-foreground">{item.label}</span>
              </div>
              <span className="truncate text-[11px] text-muted-foreground">{item.sub}</span>
            </div>
          </a>
        );
      })}
    </div>
  );
}
