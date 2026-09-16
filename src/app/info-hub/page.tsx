import type { Metadata } from "next";
import { Database, Mail } from "lucide-react";
import { DetailHeader } from "@/components/detail/detail-header";
import { Section } from "@/components/detail/section";
import { StatTile } from "@/components/detail/stat-tile";
import { ConnectionCallout } from "@/components/detail/connection-callout";
import { DealTable } from "@/components/info-hub/deal-table";
import { NotificationFeed } from "@/components/info-hub/notification-feed";
import { totalMemos, notifications, monthlyDigestCount } from "@/lib/data";

export const metadata: Metadata = {
  title: "Info Hub · Scout Fund OS",
  description: "The centralized tracking system and integrations behind the scout pipeline.",
};

export default function InfoHubPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <DetailHeader
        icon={Database}
        tagline="Component 4 of 6"
        title="Info Hub"
        description="One system of record — a single Airtable/Notion-style base with one row per scout-sourced company. Every submission and status change fires a notification automatically, and a monthly summary rolls each scout's own pipeline back up to them."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Records tracked" value={`${totalMemos}`} hint="one row per scout-sourced company" />
        <StatTile label="Notifications fired" value={`${notifications.length}`} hint="submissions + status changes" />
        <StatTile label="Monthly summaries sent" value={`${monthlyDigestCount}`} hint="personal recap, per scout" />
        <StatTile label="Integrations" value="3" hint="base · notifications · monthly email" emphasis />
      </div>

      <Section
        title="System of record"
        subtitle="Scout, sector, check size, status, and partner notes — one row per company, filterable and sortable by stage."
      >
        <DealTable />
      </Section>

      <Section
        title="Notification feed"
        subtitle="Simulated — the real integration would post to Slack. Every submission and stage change lands here automatically."
      >
        <NotificationFeed />
      </Section>

      <div className="flex items-start gap-3 rounded-xl border border-dashed border-primary/30 bg-accent/40 p-5">
        <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <div className="text-sm font-semibold text-foreground">Monthly, not quarterly</div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Each scout gets a personal email once a month, generated straight from their own slice of this
            table — what moved, what&apos;s pending, what they earned. If nothing happened that month, it
            sends a short check-in instead of a stale report. The same recap is always available live in
            their own portal — see the Scout Portal in the sidebar.
          </p>
        </div>
      </div>

      <ConnectionCallout slug="info-hub" />
    </div>
  );
}
