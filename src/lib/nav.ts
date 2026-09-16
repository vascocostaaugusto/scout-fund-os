import type { LucideIcon } from "lucide-react";
import { Users, GitBranch } from "lucide-react";

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
    oneLiner: "The scout roster",
    icon: Users,
  },
  {
    slug: "workflow",
    href: "/workflow",
    title: "Deal Workflow",
    oneLiner: "Intake → review → approval pipeline",
    icon: GitBranch,
  },
];

export const navNodeByHref = new Map(NAV_NODES.map((n) => [n.href, n]));
