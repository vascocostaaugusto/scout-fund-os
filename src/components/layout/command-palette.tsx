"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutGrid, Moon, Sun, Compass, Landmark } from "lucide-react";
import { useTheme } from "next-themes";
import { NAV_NODES } from "@/lib/nav";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    function onToggleEvent() {
      setOpen((v) => !v);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scout-fund-os:toggle-command-palette", onToggleEvent);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scout-fund-os:toggle-command-palette", onToggleEvent);
    };
  }, []);

  function go(href: string) {
    router.push(href);
    setOpen(false);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command>
        <CommandInput placeholder="Jump to a component, or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/")}>
              <LayoutGrid />
              Overview
            </CommandItem>
            {NAV_NODES.map((node) => (
              <CommandItem key={node.slug} onSelect={() => go(node.href)}>
                <node.icon />
                {node.title}
                <CommandShortcut className="max-w-40 truncate text-right normal-case tracking-normal">
                  {node.oneLiner}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Portals">
            <CommandItem onSelect={() => go("/fund")}>
              <Landmark />
              Fund Portal
              <CommandShortcut className="max-w-40 truncate text-right normal-case tracking-normal">
                Pending decisions
              </CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => go("/portal")}>
              <Compass />
              Scout Portal
              <CommandShortcut className="max-w-40 truncate text-right normal-case tracking-normal">
                Sign in as a scout
              </CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Preferences">
            <CommandItem onSelect={() => { setTheme(resolvedTheme === "dark" ? "light" : "dark"); setOpen(false); }}>
              {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              Toggle theme
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  );
}
