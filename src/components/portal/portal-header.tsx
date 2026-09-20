import Link from "next/link";
import { LogOut } from "lucide-react";
import type { Scout } from "@/lib/data";

export function PortalHeader({ scout }: { scout: Scout }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
          {scout.initials}
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-foreground">{scout.name}</h1>
          <span className="text-xs text-muted-foreground">
            {scout.coverage} · {scout.profile}
          </span>
        </div>
      </div>
      <Link
        href="/portal"
        className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <LogOut className="size-3.5" />
        Switch account
      </Link>
    </div>
  );
}
