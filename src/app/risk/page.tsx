import type { Metadata } from "next";
import { ShieldAlert } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { RiskRegisterTable } from "@/components/risk/risk-register-table";
import { RiskMatrix } from "@/components/risk/risk-matrix";
import { risks, slaBreachRate } from "@/lib/data";
import { formatPct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Risk & Compliance · Scout Fund OS",
  description: "The scout program's risk register and mitigations.",
};

export default function RiskPage() {
  const highOrCritical = risks.filter((r) => r.impact === "High" || r.impact === "Critical").length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={ShieldAlert}
        tagline="Component 7 of 7"
        title="Risk & Compliance"
        description="The program's four structural risks, tracked the same way any operating risk register is — likelihood, impact, and a mitigation that's already built into how the other six components work, not bolted on after the fact."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Tracked risks" value={`${risks.length}`} hint="reviewed each quarterly digest" />
        <StatTile label="High / critical impact" value={`${highOrCritical}`} hint="of 4 total risks" />
        <StatTile
          label="SLA breach rate"
          value={formatPct(slaBreachRate, 1)}
          hint="live signal for bandwidth erosion risk"
          deltaTone={slaBreachRate < 0.15 ? "good" : "bad"}
        />
        <StatTile label="Compensation form" value="Carry only" hint="primary compliance mitigation" emphasis />
      </div>

      <Section title="Risk register" subtitle="Four risks, each with a mitigation already designed into the program rather than added afterward.">
        <RiskRegisterTable />
      </Section>

      <Section title="Severity map" subtitle="Where each risk sits on likelihood vs. impact.">
        <RiskMatrix />
      </Section>

      <ConnectionCallout slug="risk" />
    </div>
  );
}
