import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface DetailHeaderProps {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
}

export function DetailHeader({ icon: Icon, title, tagline, description }: DetailHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-3.5" />
        Overview
      </Link>
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">{tagline}</span>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
}
