import { notFound } from "next/navigation";
import { scoutById } from "@/lib/data";
import { PortalHeader } from "@/components/portal/portal-header";
import { LiveScoutStats } from "@/components/portal/live-scout-stats";
import { SubmitIntro } from "@/components/portal/submit-intro";
import { CarryMilestones } from "@/components/portal/carry-milestones";
import { NeedsYourReply } from "@/components/portal/needs-your-reply";
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

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
      <PortalHeader scout={scout} />

      <LiveScoutStats scoutId={scoutId} />

      <p className="rounded-xl border border-dashed border-border bg-card px-4 py-3 text-[11px] leading-relaxed text-muted-foreground">
        Tickets are typically $10K–$50K, drawn from the same shared pool every other scout draws from — there&apos;s
        no personal ceiling here to track, and an outlier company can justify a check outside that range. Estimated
        upside is marked using the same convention the fund uses for its own quarterly filing — not a contractual
        number, and it changes as deals re-mark. Actual carry is only ever realized on exit.
      </p>

      <SubmitIntro scoutId={scoutId} />

      <NeedsYourReply scoutId={scoutId} />

      <div className="flex flex-col gap-4">
        <span className="text-sm font-medium text-foreground">My deals</span>
        <MyDealsTable scoutId={scoutId} />
      </div>

      <CarryMilestones scoutId={scoutId} />

      <div className="grid gap-4 lg:grid-cols-2">
        <MonthInReview scoutId={scoutId} />
        <ProgramPaperwork scoutId={scoutId} />
      </div>
    </div>
  );
}
