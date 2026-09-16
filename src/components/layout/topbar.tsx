"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { navNodeByHref } from "@/lib/nav";
import { ThemeToggle } from "./theme-toggle";
import { SidebarNav } from "./sidebar-nav";
import { COHORT_LABEL } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Topbar() {
  const pathname = usePathname();
  const node = navNodeByHref.get(pathname);
  const title = node ? node.title : "Overview";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation" />
            }
          >
            <Menu className="size-4" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{title}</span>
          <span className="hidden text-muted-foreground/50 sm:inline">/</span>
          <span className="hidden text-muted-foreground sm:inline">Scout Fund OS</span>
        </div>
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
