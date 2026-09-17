import { cn } from "@/lib/utils";

// The Shapers wordmark: heavy geometric grotesque, tight tracking, with the
// "A" replaced by a solid triangle. The triangle is an SVG rather than a
// glyph so it keeps its proportions at any size and inherits currentColor.
// In a baseline-aligned inline-flex, a replaced element's baseline is its
// bottom edge — which is exactly where the triangle should sit.
export function ShapersWordmark({
  className,
  showTriangle = true,
}: {
  className?: string;
  showTriangle?: boolean;
}) {
  if (!showTriangle) {
    return <span className={cn("font-display font-extrabold tracking-[-0.02em]", className)}>SHAPERS</span>;
  }

  return (
    <span className={cn("inline-flex items-baseline font-display font-extrabold tracking-[-0.02em]", className)}>
      <span aria-hidden="true">SH</span>
      <svg
        viewBox="0 0 10 10"
        aria-hidden="true"
        focusable="false"
        className="mx-[0.07em] h-[0.72em] w-[0.72em] shrink-0"
      >
        <polygon points="5,0 10,10 0,10" fill="currentColor" />
      </svg>
      <span aria-hidden="true">PERS</span>
      <span className="sr-only">Shapers</span>
    </span>
  );
}

// The triangle on its own — for the favicon-scale mark, avatars, and the
// collapsed sidebar badge.
export function ShapersMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false" className={cn("shrink-0", className)}>
      <polygon points="5,0 10,10 0,10" fill="currentColor" />
    </svg>
  );
}
