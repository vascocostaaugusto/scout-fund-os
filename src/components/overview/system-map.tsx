"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_NODES } from "@/lib/nav";
import { CONNECTIONS } from "@/lib/connections";
import { cn } from "@/lib/utils";

const RADIUS = 42; // percent of container — the container's own wide aspect
// ratio does the ellipse-flattening, so this stays a true circle in logical space
const CENTER = 50;

// Math.sin/cos can differ in their last bit between server (Node) and
// client (browser) engines — rounding avoids a hydration mismatch on
// these SVG coordinates. 4 decimal places is far more precision than a
// percentage-based layout needs.
function round(n: number) {
  return Math.round(n * 10_000) / 10_000;
}

function positionFor(index: number, total: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = round(CENTER + RADIUS * Math.cos(angle));
  const y = round(CENTER + RADIUS * Math.sin(angle));
  return { x, y };
}

const positions = NAV_NODES.map((_, i) => positionFor(i, NAV_NODES.length));
const slugToIndex = new Map(NAV_NODES.map((n, i) => [n.slug, i]));

export function SystemMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  const connectedSlugs = new Set<string>();
  if (hovered) {
    connectedSlugs.add(hovered);
    for (const c of CONNECTIONS[hovered] ?? []) connectedSlugs.add(c.slug);
  }

  return (
    <>
      {/* Narrow viewports: the circular hub-and-spoke layout has no room to
          breathe below ~lg, so fall back to a simple responsive grid. */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
        {NAV_NODES.map((node) => {
          const Icon = node.icon;
          return (
            <Link
              key={node.slug}
              href={node.href}
              className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="text-sm font-semibold text-foreground">{node.title}</div>
                <p className="text-xs leading-snug text-muted-foreground">{node.oneLiner}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="relative mx-auto hidden aspect-[16/6.5] w-full max-w-5xl select-none lg:block">
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* hub -> node spokes */}
        {positions.map((p, i) => {
          const slug = NAV_NODES[i].slug;
          const active = hovered === null || connectedSlugs.has(slug);
          return (
            <line
              key={`spoke-${slug}`}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke="var(--border)"
              strokeWidth={hovered === slug ? 0.5 : 0.3}
              opacity={active ? (hovered === slug ? 0.9 : 0.5) : 0.15}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {/* cross-connections between related nodes */}
        {Object.entries(CONNECTIONS).flatMap(([slug, conns]) =>
          conns
            .filter((c) => slugToIndex.get(c.slug)! > slugToIndex.get(slug)!)
            .map((c) => {
              const a = positions[slugToIndex.get(slug)!];
              const b = positions[slugToIndex.get(c.slug)!];
              const isHoveredEdge =
                hovered === slug || hovered === c.slug;
              const dim = hovered !== null && !isHoveredEdge;
              return (
                <line
                  key={`edge-${slug}-${c.slug}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="var(--primary)"
                  strokeDasharray="1.5 1.5"
                  strokeWidth={isHoveredEdge ? 0.4 : 0.25}
                  opacity={dim ? 0.06 : isHoveredEdge ? 0.55 : 0.18}
                  vectorEffect="non-scaling-stroke"
                />
              );
            }),
        )}
      </svg>

      {/* hub */}
      <div
        className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary/30 bg-card text-center shadow-sm"
        style={{ left: `${CENTER}%`, top: `${CENTER}%`, width: "13%", aspectRatio: "1" }}
      >
        <div className="text-[0.65rem] font-semibold uppercase tracking-wide text-primary">Scout Fund</div>
        <div className="text-[0.55rem] text-muted-foreground">Shapers Fund II</div>
      </div>

      {NAV_NODES.map((node, i) => {
        const p = positions[i];
        const Icon = node.icon;
        const dim = hovered !== null && !connectedSlugs.has(node.slug);
        return (
          <Link
            key={node.slug}
            href={node.href}
            aria-label={`${node.title} — ${node.oneLiner}`}
            onMouseEnter={() => setHovered(node.slug)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(node.slug)}
            onBlur={() => setHovered(null)}
            className={cn(
              "group absolute w-44 -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-3.5 shadow-sm transition-all duration-200",
              "hover:-translate-y-[calc(50%+3px)] hover:border-primary/50 hover:shadow-lg",
              "focus-visible:-translate-y-[calc(50%+3px)] focus-visible:border-primary/60 focus-visible:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              dim ? "opacity-40" : "opacity-100",
              hovered === node.slug ? "border-primary/60 shadow-lg" : "border-border",
            )}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <div className="flex items-center gap-2">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="size-3.5" />
              </div>
              <div className="text-sm font-semibold text-foreground">{node.title}</div>
            </div>
            <p className="mt-2 text-xs leading-snug text-muted-foreground">{node.oneLiner}</p>
          </Link>
        );
      })}
      </div>
    </>
  );
}
