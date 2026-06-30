import type { EventItem, TicketTier } from "./types";

/** Join class names, dropping falsy values. Tiny clsx replacement. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export const currency = (n: number) =>
  new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    maximumFractionDigits: 0,
  }).format(n);

export const compactNumber = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);

export function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEventTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function tierRemaining(tier: TicketTier): number {
  return Math.max(0, tier.capacity - tier.sold);
}

export function eventSoldRatio(event: EventItem): number {
  const sold = event.tiers.reduce((s, t) => s + t.sold, 0);
  const cap = event.tiers.reduce((s, t) => s + t.capacity, 0) || 1;
  return sold / cap;
}

export function lowestPrice(event: EventItem): number {
  const active = event.tiers.filter((t) => t.active);
  if (active.length === 0) return 0;
  return Math.min(...active.map((t) => t.price));
}
