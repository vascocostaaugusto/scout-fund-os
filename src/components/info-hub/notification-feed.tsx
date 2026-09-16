"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, RefreshCw, AlertTriangle, Newspaper } from "lucide-react";
import { notifications } from "@/lib/data";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { NotificationEvent } from "@/lib/data";
import { randomLiveEvent } from "@/lib/live-events";

const KIND_STYLE: Record<NotificationEvent["kind"], { icon: typeof FileText; className: string }> = {
  submission: { icon: FileText, className: "bg-accent text-accent-foreground" },
  status_change: { icon: RefreshCw, className: "bg-primary/15 text-primary" },
  sla_warning: { icon: AlertTriangle, className: "bg-critical/15 text-critical" },
  digest: { icon: Newspaper, className: "bg-warning/15 text-warning" },
};

interface LiveItem {
  id: string;
  kind: NotificationEvent["kind"];
  text: string;
  actor: string;
}

export function NotificationFeed({ limit = 16 }: { limit?: number }) {
  const items = notifications.slice(0, limit);
  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  useEffect(() => {
    function schedule(delay: number) {
      timeoutRef.current = setTimeout(() => {
        const event = randomLiveEvent();
        idRef.current += 1;
        setLiveItems((prev) =>
          [
            { id: `live_${idRef.current}`, kind: event.kind, text: `${event.title} — ${event.description}`, actor: event.actor },
            ...prev,
          ].slice(0, 6),
        );
        schedule(20_000 + Math.random() * 25_000);
      }, delay);
    }
    schedule(9_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-sm font-medium text-foreground">#scout-pipeline</span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-success" />
          </span>
          Live
        </span>
      </div>
      <div className="flex max-h-[480px] flex-col divide-y divide-border overflow-y-auto">
        <AnimatePresence initial={false}>
          {liveItems.map((n) => {
            const style = KIND_STYLE[n.kind];
            const Icon = style.icon;
            return (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 bg-accent/40 px-4 py-3">
                  <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md", style.className)}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-xs leading-relaxed text-foreground">{n.text}</p>
                    <span className="text-[10px] text-muted-foreground">{n.actor} · Just now</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {items.map((n) => {
          const style = KIND_STYLE[n.kind];
          const Icon = style.icon;
          return (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3">
              <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md", style.className)}>
                <Icon className="size-3.5" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <p className="text-xs leading-relaxed text-foreground">{n.text}</p>
                <span className="text-[10px] text-muted-foreground">{n.actor} · {timeAgo(n.ts)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
