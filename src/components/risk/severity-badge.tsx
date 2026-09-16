import { cn } from "@/lib/utils";

const STYLE: Record<string, string> = {
  Low: "bg-success/15 text-success",
  Medium: "bg-warning/15 text-warning",
  High: "bg-serious/15 text-serious",
  Critical: "bg-critical/15 text-critical",
};

export function SeverityBadge({ level }: { level: string }) {
  return (
    <span className={cn("inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-medium", STYLE[level])}>
      {level}
    </span>
  );
}
