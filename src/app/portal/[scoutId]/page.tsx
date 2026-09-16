import { notFound } from "next/navigation";
import { scoutById, scoutStats, scoutUpside, SCOUT_CARRY_RATE_ASSUMPTION } from "@/lib/data";
import { formatUsd, formatPct } from "@/lib/format";
import { PortalHeader } from "@/components/portal/portal-header";
import { StatTile } from "@/components/detail/stat-tile";
import { MyDealsTable } from "@/components/portal/my-deals-table";
import { MonthInReview } from "@/components/portal/month-in-review";
import { ProgramPaperwork } from "@/components/portal/program-paperwork";

export default async function ScoutPortalDashboard({
  params,
}: {
  params: Promise<{ scoutId: string }>;
}) {
  const { scoutId } = await params;
  const scout = scoutById.get(scoutId);
  if (!scout) notFound();

  const stats = scoutStats.get(scoutId)!;
  const upside = scoutUpside.get(scoutId)!;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <PortalHeader scout={scout} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Memos submitted" value={`${stats.memosSubmitted}`} hint="this cohort" />
        <StatTile label="Deals funded" value={`${stats.dealsFunded}`} hint={`${formatPct(stats.conversionRate, 0)} conversion`} />
        <StatTile
          label="Capital deployed"
          value={formatUsd(upside.deployedUsd)}
          hint="tickets from the shared $6M pool"
        />
        <StatTile
          label="Estimated upside"
          value={formatUsd(upside.estimatedCarryUsd)}
          hint={`marked-to-date, at ${formatPct(SCOUT_CARRY_RATE_ASSUMPTION, 1)} carry`}
          emphasis
        />
      </div>

      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Every ticket is $10K–$50K, drawn from the same shared pool every other scout draws from — there&apos;s no
        personal ceiling here to track. Estimated upside is marked using the same convention the fund uses for its
        own quarterly filing — not a contractual number, and it changes as deals re-mark. Actual carry is only
        ever realized on exit.
      </p>

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-foreground">My deals</span>
        <MyDealsTable scoutId={scoutId} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <MonthInReview scoutId={scoutId} />
        <ProgramPaperwork scoutId={scoutId} />
      </div>
    </div>
  );
}
