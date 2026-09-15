import { cn } from "@/lib/utils";
import type { ScoutTier } from "@/lib/data";

const TIER_STYLE: Record<ScoutTier, string> = {
  1: "bg-primary/15 text-primary border-primary/30",
  2: "bg-chart-2/15 text-chart-2 border-chart-2/30 dark:text-[#a9bcd6]",
  3: "bg-warning/15 text-warning border-warning/30",
};

const TIER_LABEL: Record<ScoutTier, string> = {
  1: "Tier 1",
  2: "Tier 2",
  3: "Tier 3",
};

export function TierBadge({ tier }: { tier: ScoutTier }) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        TIER_STYLE[tier],
      )}
    >
      {TIER_LABEL[tier]}
    </span>
  );
}
