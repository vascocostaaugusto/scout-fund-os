import type { Metadata } from "next";
import { Coins, ShieldCheck, TrendingUp, Handshake } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { CarryCalculator } from "@/components/incentives/carry-calculator";
import { PoolActivity } from "@/components/incentives/pool-activity";

export const metadata: Metadata = {
  title: "Incentive Engine · Scout Fund OS",
  description: "Carry structure and compensation mechanics for the Shapers Scout Fund.",
};

export default function IncentivesPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Coins}
        tagline="Component 2 of 6"
        title="Incentive Engine"
        description="Scouts are compensated entirely in carry, attributed deal-by-deal to the capital they personally source and deploy — never pooled, never cash. It's the structure that keeps the program legally defensible and aligns every incentive with founder outcomes, not activity."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Carry rate" value="10–15%" hint="of Fund II's carry on the scout's own deals" />
        <StatTile label="Ticket size" value="$10K–$50K" hint="per deal, from the shared evergreen pool" />
        <StatTile label="Compensation form" value="Carry only" hint="no cash success fees, ever" emphasis />
        <StatTile label="Attribution" value="Deal-by-deal" hint="never pooled across the cohort" />
      </div>

      <Section
        title="Why carry, not cash"
        subtitle="A cash success fee tied to introducing capital is the textbook definition of a finder's fee — and in most jurisdictions, that's broker-dealer territory."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <ShieldCheck className="size-4 text-primary" />
            <div className="text-sm font-semibold text-foreground">Defensible by design</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Carry-only compensation is taxed and regulated the same way GP carry already is. It sidesteps the
              cash-for-introductions structure that draws finder&apos;s-fee scrutiny entirely.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <TrendingUp className="size-4 text-primary" />
            <div className="text-sm font-semibold text-foreground">Aligned with outcomes</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              A scout earns nothing for volume. They earn only when the company they personally sourced actually
              creates value — the same incentive a GP has.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5">
            <Handshake className="size-4 text-primary" />
            <div className="text-sm font-semibold text-foreground">Deal-by-deal, not shared</div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              The capital comes from one shared pool, but carry attribution never does — it&apos;s per company. The
              scout who found the outlier keeps the upside from that outlier, no free-riding across the cohort.
            </p>
          </div>
        </div>
      </Section>

      <Section
        title="Carry illustration"
        subtitle="A sample calculation, not a projection — pick a sourced deal, an exit scenario, and see what the scout actually takes home."
      >
        <CarryCalculator />
      </Section>

      <div className="flex items-start gap-3 rounded-xl border border-dashed border-primary/30 bg-accent/40 p-5">
        <Handshake className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <div className="text-sm font-semibold text-foreground">Co-investment perk</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            If a scout also invests personal capital alongside their sourced deal through a side SPV, Shapers
            waives its own carry on that personal check — the only place in the program where a scout can earn
            founder-level upside instead of a carry share.
          </p>
        </div>
      </div>

      <Section
        title="Pool activity"
        subtitle="Every scout draws from the same $6M evergreen pool — this is who's actually put tickets to work, not a ceiling utilization chart."
      >
        <PoolActivity />
      </Section>

      <ConnectionCallout slug="incentives" />
    </div>
  );
}
