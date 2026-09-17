import { SummaryStrip } from "@/components/overview/summary-strip";
import { SystemMap } from "@/components/overview/system-map";
import { ScoutActivityChart } from "@/components/charts/scout-activity-chart";
import { ResponseTrendChart } from "@/components/charts/response-trend-chart";
import { LiveOverviewStats } from "@/components/overview/live-overview-stats";
import { ShapersWordmark } from "@/components/brand/shapers-wordmark";

export default function OverviewPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-7 px-6 py-8">
      <div className="flex flex-col gap-2">
        <span className="brand-eyebrow text-primary">Scout Fund</span>
        <h1 className="flex flex-wrap items-baseline gap-x-3 text-3xl text-foreground">
          <ShapersWordmark />
          <span className="text-muted-foreground/40">/</span>
          <span>Scout Fund OS</span>
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Shapers Fund II&apos;s scout program — status and working tools in one place.
        </p>
      </div>

      <SummaryStrip />

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-foreground">Program</h2>
        <SystemMap />
      </div>

      <div className="flex flex-col gap-4">
        <LiveOverviewStats />
        <div className="grid gap-4 lg:grid-cols-2">
          <ScoutActivityChart />
          <ResponseTrendChart />
        </div>
      </div>
    </div>
  );
}
