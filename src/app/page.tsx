import { SummaryStrip } from "@/components/overview/summary-strip";
import { SystemMap } from "@/components/overview/system-map";

export default function OverviewPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-7 px-6 py-8">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wider text-primary">
          Program architecture
        </span>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Scout Fund OS
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A &lt;5% carve-out of Shapers Fund II that turns the existing Shapers Club
          operator network into a structured, first-look pipeline into fintech&apos;s
          next generation of founders. Seven components, one system — click any
          node to see how it works.
        </p>
      </div>

      <SummaryStrip />

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-foreground">System map</h2>
          <span className="hidden text-xs text-muted-foreground lg:inline">Hover a node to trace its connections</span>
        </div>
        <SystemMap />
      </div>
    </div>
  );
}
