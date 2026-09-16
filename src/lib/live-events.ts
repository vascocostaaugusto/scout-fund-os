// Client-side-only synthetic event generator for the "live" simulations
// (toast stream, notification feed ticker). Deliberately uses Math.random —
// unlike src/lib/data, these are cosmetic simulated-future events, not part
// of the consistent historical dataset.
import { scouts } from "@/lib/data";

const FIRST_NAMES = ["Nova", "Ledger", "Bridge", "Vault", "Anchor", "Prism", "Keystone", "Summit"];
const SUFFIXES = ["Pay", "Flow", "Base", "Hub", "Fi", "Stack"];
const SECTORS = ["Embedded Finance", "Open Banking", "Credit Infra", "Cross-Border Payments", "Stablecoin Infra"];
const PARTNERS = ["Nils Haverkamp", "Beatriz Coelho", "Simon Whitfield", "Katarzyna Wolski", "Marcus Lindqvist"];

function randomOf<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export type LiveEventKind = "submission" | "status_change";

export interface LiveEvent {
  kind: LiveEventKind;
  title: string;
  description: string;
  actor: string;
}

export function randomLiveEvent(): LiveEvent {
  const scout = randomOf(scouts);
  const company = `${randomOf(FIRST_NAMES)}${randomOf(SUFFIXES)}`;
  const flavor = randomOf(["submission", "review", "check"] as const);

  if (flavor === "submission") {
    return {
      kind: "submission",
      title: `${scout.name} submitted a memo`,
      description: `${company} · ${randomOf(SECTORS)}`,
      actor: scout.name,
    };
  }
  if (flavor === "review") {
    const partner = randomOf(PARTNERS);
    return {
      kind: "status_change",
      title: `${partner} completed first look`,
      description: `${company} moved to Under Review`,
      actor: partner,
    };
  }
  return {
    kind: "status_change",
    title: `Check written by ${scout.name}`,
    description: `${company} · SAFE executed, right-of-first-look logged`,
    actor: scout.name,
  };
}
