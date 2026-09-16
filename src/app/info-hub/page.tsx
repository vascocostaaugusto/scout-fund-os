import type { Metadata } from "next";
import { Database } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { DealTable } from "@/components/info-hub/deal-table";
import { NotificationFeed } from "@/components/info-hub/notification-feed";
import { totalMemos, notifications } from "@/lib/data";

export const metadata: Metadata = {
  title: "Info Hub · Scout Fund OS",
  description: "The centralized tracking system and integrations behind the scout pipeline.",
};

export default function InfoHubPage() {
  const digestCount = notifications.filter((n) => n.kind === "digest").length;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Database}
        tagline="Component 4 of 7"
        title="Info Hub"
        description="One system of record — a single Airtable/Notion-style base with one row per scout-sourced company. Every submission and status change fires a notification automatically, and a quarterly digest rolls the whole pipeline back up to scouts."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Records tracked" value={`${totalMemos}`} hint="one row per scout-sourced company" />
        <StatTile label="Notifications fired" value={`${notifications.length}`} hint="submissions + status changes" />
        <StatTile label="Quarterly digests sent" value={`${digestCount}`} hint="aggregate pipeline health, to scouts" />
        <StatTile label="Integrations" value="3" hint="base · notifications · digest" emphasis />
      </div>

      <Section
        title="System of record"
        subtitle="Scout, sector, check size, status, and partner notes — one row per company, filterable by stage."
      >
        <DealTable />
      </Section>

      <Section
        title="Notification feed"
        subtitle="Simulated — the real integration would post to Slack. Every submission and stage change lands here automatically."
      >
        <NotificationFeed />
      </Section>

      <ConnectionCallout slug="info-hub" />
    </div>
  );
}
