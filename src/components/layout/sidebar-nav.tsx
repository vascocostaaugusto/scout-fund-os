"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Compass, Landmark } from "lucide-react";
import { NAV_NODES } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col gap-1 p-3">
      <Link
        href="/"
        className={cn(
          "mb-2 flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname === "/"
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <LayoutGrid className="size-4 shrink-0" />
        Overview
      </Link>

      <div className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
        Program components
      </div>

      {NAV_NODES.map((node) => {
        const active = pathname === node.href;
        const Icon = node.icon;
        return (
          <Link
            key={node.href}
            href={node.href}
            className={cn(
              "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-4 shrink-0",
                active ? "text-sidebar-primary" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
              )}
            />
            <span className="truncate">{node.title}</span>
          </Link>
        );
      })}

      <div className="mt-3 mb-1 px-3 text-[11px] font-medium uppercase tracking-wider text-sidebar-foreground/40">
        Portals
      </div>
      <Link
        href="/fund"
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname.startsWith("/fund")
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <Landmark
          className={cn(
            "size-4 shrink-0",
            pathname.startsWith("/fund")
              ? "text-sidebar-primary"
              : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
          )}
        />
        <span className="truncate">Fund Portal</span>
      </Link>
      <Link
        href="/portal"
        className={cn(
          "group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          pathname.startsWith("/portal")
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
      >
        <Compass
          className={cn(
            "size-4 shrink-0",
            pathname.startsWith("/portal")
              ? "text-sidebar-primary"
              : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground/70",
          )}
        />
        <span className="truncate">Scout Portal</span>
      </Link>
    </nav>
  );
}
