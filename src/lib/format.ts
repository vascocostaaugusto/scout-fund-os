export function formatUsdCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  }
  if (Math.abs(n) >= 1_000) {
    return `$${Math.round(n / 1000)}K`;
  }
  return `$${n.toLocaleString("en-US")}`;
}

export function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function formatPct(n: number, decimals = 1): string {
  return `${(n * 100).toFixed(decimals)}%`;
}

export function formatHours(n: number): string {
  return `${n.toFixed(1)}h`;
}

// Timezone is pinned to UTC deliberately. Without it the server renders in
// its own zone (UTC on Vercel) and the browser renders in the visitor's,
// producing different text for the same timestamp and a hydration mismatch.
// It never shows up locally, where both sides share a timezone. Every date
// in this app is authored in UTC against a frozen reference clock, so UTC
// is also the semantically correct zone to display.
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export function timeAgo(iso: string): string {
  const now = new Date("2026-09-16T09:00:00Z").getTime();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const mins = Math.round(diffMs / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  if (months < 24) return `${months}mo ago`;
  return `${Math.round(months / 12)}y ago`;
}
