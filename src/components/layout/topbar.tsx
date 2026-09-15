"use client";

import { usePathname } from "next/navigation";
import { navNodeByHref } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { COHORT_LABEL } from "@/lib/data";

export function Topbar() {
  const pathname = usePathname();
  const node = navNodeByHref.get(pathname);
  const title = node ? node.title : "Overview";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-foreground">{title}</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-muted-foreground">Scout Fund OS</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground sm:flex">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          {COHORT_LABEL} · Live
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
