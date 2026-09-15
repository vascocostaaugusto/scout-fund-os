import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CONNECTIONS } from "@/lib/connections";
import { NAV_NODES } from "@/lib/nav";

const bySlug = new Map(NAV_NODES.map((n) => [n.slug, n]));

export function ConnectionCallout({ slug }: { slug: string }) {
  const links = CONNECTIONS[slug] ?? [];
  if (links.length === 0) return null;

  return (
    <div className="rounded-xl border border-dashed border-primary/30 bg-accent/40 p-5">
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-primary">
        How this connects
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {links.map((link) => {
          const node = bySlug.get(link.slug);
          if (!node) return null;
          const Icon = node.icon;
          return (
            <Link
              key={link.slug}
              href={node.href}
              className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
            >
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <Icon className="size-3.5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                  {node.title}
                  <ArrowUpRight className="size-3 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-xs leading-snug text-muted-foreground">{link.note}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
