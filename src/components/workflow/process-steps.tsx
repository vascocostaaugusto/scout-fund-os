import { FileText, Clock, PenLine, Eye } from "lucide-react";

const STEPS = [
  {
    icon: FileText,
    title: "1-page memo",
    body: "Scout submits a single-page deal memo through one intake channel — no format debate, no separate process per scout.",
  },
  {
    icon: Clock,
    title: "48h first look",
    body: "A rotating partner responds yes / no / more-info within 48 hours. No full partner-level diligence yet — that's reserved for the priced round.",
  },
  {
    icon: PenLine,
    title: "Small check",
    body: "On yes, the scout writes a SAFE or convertible from their personal allocation — capped, fast, no negotiation overhead.",
  },
  {
    icon: Eye,
    title: "Right-of-first-look",
    body: "Logged explicitly for the next priced round. The scout never promises a lead investment — that would create signaling risk for the founder.",
  },
];

export function ProcessSteps() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <div key={s.title} className="relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <s.icon className="size-3.5" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">Step {i + 1}</span>
          </div>
          <div className="text-sm font-semibold text-foreground">{s.title}</div>
          <p className="text-xs leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
