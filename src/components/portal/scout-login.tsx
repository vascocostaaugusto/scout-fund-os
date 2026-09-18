"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { ShapersWordmark } from "@/components/brand/shapers-wordmark";
import { scouts } from "@/lib/data";
import { TierBadge } from "@/components/network/tier-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LAST_SCOUT_KEY = "scout-fund-os:last-scout-id";

export function ScoutLogin() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const last = window.localStorage.getItem(LAST_SCOUT_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading a per-viewer localStorage convenience after mount, not derivable from props/state
      if (last && scouts.some((s) => s.id === last)) setSelected(last);
    } catch {
      // localStorage unavailable — fine, just no pre-selection
    }
  }, []);

  function continueAs(id: string) {
    try {
      window.localStorage.setItem(LAST_SCOUT_KEY, id);
    } catch {
      // best-effort only
    }
    router.push(`/portal/${id}`);
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-6 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <ShapersWordmark className="text-3xl text-foreground" />
        <div>
          <h1 className="text-xl text-foreground">Scout Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Shapers Fund II · 24-month scout program</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-2">
        <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
          Choose your account to continue
        </div>
        <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
          {scouts.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                selected === s.id ? "bg-accent" : "hover:bg-secondary/60",
              )}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                {s.initials}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-foreground">{s.name}</span>
                <span className="truncate text-xs text-muted-foreground">{s.email}</span>
              </div>
              <TierBadge tier={s.tier} />
              {selected === s.id ? <Check className="size-4 shrink-0 text-primary" /> : null}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" disabled={!selected} onClick={() => selected && continueAs(selected)}>
        {selected ? `Continue as ${scouts.find((s) => s.id === selected)?.name.split(" ")[0]}` : "Select an account"}
      </Button>

      <p className="text-center text-[11px] text-muted-foreground">
        Demo login — this always succeeds and skips a real credential check. In production this would be a
        magic-link sign-in tied to each scout&apos;s @scouts.shapers.vc address.
      </p>
    </div>
  );
}
