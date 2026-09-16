"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { FileText, RefreshCw } from "lucide-react";
import { randomLiveEvent } from "@/lib/live-events";

export function LiveActivityToasts() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function schedule(delay: number) {
      timeoutRef.current = setTimeout(() => {
        const event = randomLiveEvent();
        const Icon = event.kind === "submission" ? FileText : RefreshCw;
        toast(event.title, {
          description: event.description,
          icon: <Icon className="size-4" />,
        });
        schedule(18_000 + Math.random() * 22_000);
      }, delay);
    }

    schedule(6_000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return null;
}
