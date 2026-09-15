import { coverageTags } from "@/lib/data";

const max = Math.max(...coverageTags.map((t) => t.count));

function sizeClass(count: number) {
  const ratio = count / max;
  if (ratio > 0.75) return "text-base font-semibold";
  if (ratio > 0.5) return "text-sm font-medium";
  if (ratio > 0.25) return "text-sm";
  return "text-xs";
}

function opacityFor(count: number) {
  const ratio = count / max;
  return 0.45 + ratio * 0.55;
}

export function CoverageMap() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Vertical & geography coverage</span>
        <span className="text-xs text-muted-foreground">by memos submitted</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {coverageTags.map((tag) => (
          <span
            key={tag.label}
            className={`rounded-full border border-primary/25 bg-accent px-3 py-1 text-accent-foreground ${sizeClass(tag.count)}`}
            style={{ opacity: opacityFor(tag.count) }}
          >
            {tag.label}
            <span className="ml-1.5 text-[10px] text-muted-foreground">{tag.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
