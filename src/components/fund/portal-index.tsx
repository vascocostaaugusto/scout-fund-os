"use client";

// The Fund Portal is one long working page, so its index sticks to the top
// of the scroll container and stays there. That constrains the design: at
// three rows of tiles it would eat a third of the viewport permanently, so
// it collapses to a single scrollable row — count, label, and a green
// outline on anything with work waiting.
import {
  Gavel,
  FileSignature,
  TrendingUp,
  Boxes,
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
  const liveCompanies = fundedDeals.filter(
    (d) => d.stage === "check_written" || d.stage === "follow_on_watch",
  ).length;
  const openCandidates = candidates.filter((c) => c.stage !== "signed" && c.stage !== "declined").length;

  const items = [
    { href: "#pending-decisions", icon: Gavel, label: "Pending decisions", count: pendingDecisions, urgent: pendingDecisions > 0 },
    { href: "#legal-closing", icon: FileSignature, label: "Legal & closing", count: closingQueueCount, urgent: closingQueueCount > 0 },
    { href: "#follow-on", icon: TrendingUp, label: "Follow-on", count: openFollowOns, urgent: openFollowOns > 0 },
    { href: "#portfolio", icon: Boxes, label: "Portfolio", count: liveCompanies, urgent: false },
    { href: "#exit-distributions", icon: CircleDollarSign, label: "Exits", count: unpaidExits, urgent: unpaidExits > 0 },
    { href: "#scout-recruiting", icon: UserPlus, label: "Recruiting", count: openCandidates, urgent: false },
    { href: "#deployment-pacing", icon: LineChart, label: "Pacing", count: null, urgent: false },
    { href: "#system-of-record", icon: Table2, label: "All deals", count: totalMemos, urgent: false },
    { href: "#comms", icon: Bell, label: "Reporting", count: null, urgent: false },
  ];

  return (
    <div className="sticky top-0 z-20 -mx-6 border-b border-border bg-background/85 px-6 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "group flex shrink-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors",
                item.urgent
                  ? "border-primary/40 bg-primary/[0.07] hover:border-primary"
                  : "border-border bg-card hover:border-primary/40",
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 shrink-0 transition-colors",
                  item.urgent ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {item.count !== null ? (
                <span className="text-xs font-semibold tabular-nums text-foreground">{item.count}</span>
              ) : null}
              <span className="whitespace-nowrap text-xs text-muted-foreground group-hover:text-foreground">
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
