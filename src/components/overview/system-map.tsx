import Link from "next/link";
import { NAV_NODES } from "@/lib/nav";

export function SystemMap() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {NAV_NODES.map((node) => {
        const Icon = node.icon;
        return (
          <Link
            key={node.slug}
            href={node.href}
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="text-sm font-semibold text-foreground">{node.title}</div>
              <p className="text-xs leading-snug text-muted-foreground">{node.oneLiner}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
