import type { LucideIcon } from "lucide-react";
import {
  Users,
  Coins,
  GitBranch,
  Database,
  Building2,
  LineChart,
} from "lucide-react";

export interface NavNode {
  slug: string;
  href: string;
  title: string;
  oneLiner: string;
  icon: LucideIcon;
}

export const NAV_NODES: NavNode[] = [
  {
    slug: "network",
    href: "/network",
    title: "Scout Network",
    oneLiner: "The tiered scout recruiting model",
    icon: Users,
  },
  {
    slug: "incentives",
    href: "/incentives",
    title: "Incentive Engine",
    oneLiner: "Carry structure and compensation mechanics",
    icon: Coins,
  },
  {
    slug: "workflow",
    href: "/workflow",
    title: "Deal Workflow",
    oneLiner: "Intake → review → approval pipeline",
    icon: GitBranch,
  },
  {
    slug: "info-hub",
    href: "/info-hub",
    title: "Info Hub",
    oneLiner: "Centralized tracking and integrations",
    icon: Database,
  },
  {
    slug: "structure",
    href: "/structure",
    title: "Fund Structure",
    oneLiner: "In-fund carve-out vs. SPV governance",
    icon: Building2,
  },
  {
    slug: "dashboard",
    href: "/dashboard",
    title: "Success Dashboard",
    oneLiner: "KPIs and performance tracking",
    icon: LineChart,
  },
];

export const navNodeByHref = new Map(NAV_NODES.map((n) => [n.href, n]));
