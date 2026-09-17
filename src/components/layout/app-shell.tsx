import type { ReactNode } from "react";
import Link from "next/link";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";
import { ShapersWordmark } from "@/components/brand/shapers-wordmark";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <Link
          href="/"
          className="flex h-14 shrink-0 flex-col justify-center gap-0.5 border-b border-sidebar-border px-4 transition-opacity hover:opacity-80"
        >
          <ShapersWordmark className="text-base text-sidebar-foreground" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-sidebar-foreground/45">
            Scout Fund OS
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="border-t border-sidebar-border p-3 text-[11px] text-sidebar-foreground/40">
          Internal · Program proposal build
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
