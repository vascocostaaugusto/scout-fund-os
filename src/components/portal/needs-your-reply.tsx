"use client";

// The other half of the "yes / no / more-info" first look. When a partner
// sends a question back instead of deciding, the deal sits here until the
// scout answers — then it returns to the partner's decision queue.
import { useState } from "react";
import { MessageCircleQuestion, Send, Check } from "lucide-react";
import { useDealStore } from "@/lib/deal-store";
import { timeAgo } from "@/lib/format";
import { Button } from "@/components/ui/button";

export function NeedsYourReply({ scoutId }: { scoutId: string }) {
  const { deals, respondToInfo } = useDealStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const asked = deals.filter((d) => d.scoutId === scoutId && d.infoRequest);
  const open = asked.filter((d) => !d.infoResponse);
  const answered = asked.filter((d) => d.infoResponse);

  if (asked.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/[0.05] p-4">
      <div className="flex items-center gap-2">
        <MessageCircleQuestion className="size-4 text-warning" />
        <span className="text-sm font-medium text-foreground">
          {open.length > 0
            ? `${open.length} deal${open.length === 1 ? "" : "s"} waiting on you`
            : "Questions answered"}
        </span>
      </div>

      {open.map((d) => (
        <div key={d.id} className="flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3">
          <div>
            <div className="text-xs font-medium text-foreground">{d.companyName}</div>
            <div className="text-[11px] text-muted-foreground">
              {d.reviewingPartner || "A partner"} asked {d.infoRequestedAt ? timeAgo(d.infoRequestedAt) : "recently"}
            </div>
          </div>
          <p className="border-l-2 border-warning/50 pl-2.5 text-xs leading-relaxed text-foreground">
            {d.infoRequest}
          </p>
          <textarea
            value={drafts[d.id] ?? ""}
            onChange={(e) => setDrafts((prev) => ({ ...prev, [d.id]: e.target.value }))}
            rows={2}
            placeholder="Your answer — the partner sees this and the deal goes back in their queue"
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <Button
            size="sm"
            className="self-start"
            disabled={(drafts[d.id] ?? "").trim().length < 3}
            onClick={() => {
              respondToInfo(d.id, drafts[d.id].trim());
              setDrafts((prev) => {
                const next = { ...prev };
                delete next[d.id];
                return next;
              });
            }}
          >
            <Send className="size-3.5" />
            Send answer
          </Button>
        </div>
      ))}

      {answered.map((d) => (
        <div key={d.id} className="flex items-start gap-2 text-[11px] text-muted-foreground">
          <Check className="mt-0.5 size-3 shrink-0 text-success" />
          <span>
            <span className="text-foreground">{d.companyName}</span> — you answered, it&apos;s back with the
            partner.
          </span>
        </div>
      ))}
    </div>
  );
}
