import type { Booking, EventItem } from "./types";
import { seedBookings, seedEvents } from "./data";
import { getLocalMedia } from "./media";

/**
 * Mock Node backend — an in-memory data store seeded from lib/data.ts.
 *
 * In a real deployment this module would wrap Supabase / Firebase / Postgres.
 * Here it lives as a singleton on `globalThis` so it survives Next.js hot
 * reloads in dev and is shared across all API route handlers in one process.
 * All mutations route through these functions to keep a single source of truth.
 */

interface Store {
  events: EventItem[];
  bookings: Booking[];
}

const globalForDb = globalThis as unknown as { __4tc_store?: Store };

function init(): Store {
  // Deep clone the seeds so runtime mutations never touch the source data.
  const events = structuredClone(seedEvents);
  const bookings = structuredClone(seedBookings);

  // If real Instagram media has been downloaded into /public/images, use those
  // photos for every event's cover + gallery instead of the picsum
  // placeholders, so the whole site shows real 4theculture imagery.
  const { images } = getLocalMedia();
  if (images.length > 0) {
    let cursor = 0;
    const nextImage = () => images[cursor++ % images.length];
    for (const event of events) {
      event.coverImage = nextImage();
      // Give each event a fresh strip of real photos for its gallery.
      const galleryLength = Math.max(4, event.gallery.length);
      event.gallery = Array.from({ length: galleryLength }, () => nextImage());
    }
  }

  return { events, bookings };
}

const store: Store = (globalForDb.__4tc_store ??= init());

/* ----------------------------- Events ----------------------------- */

export function listEvents(): EventItem[] {
  return store.events;
}

export function getEvent(idOrSlug: string): EventItem | undefined {
  return store.events.find((e) => e.id === idOrSlug || e.slug === idOrSlug);
}

export function createEvent(partial: Partial<EventItem>): EventItem {
  const id = partial.id ?? `evt_${cryptoId()}`;
  const slug =
    partial.slug ??
    (partial.title ?? "untitled-event")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const event: EventItem = {
    id,
    slug,
    title: partial.title ?? "Untitled Event",
    category: partial.category ?? "Parties",
    date: partial.date ?? new Date().toISOString(),
    venue: partial.venue ?? "TBA",
    city: partial.city ?? "Poznań, Poland",
    description: partial.description ?? "",
    lineup: partial.lineup ?? [],
    dressCode: partial.dressCode ?? "Come as you are",
    coverImage:
      partial.coverImage ??
      getLocalMedia().images[0] ??
      "https://picsum.photos/seed/newevent/1600/900",
    gallery: partial.gallery ?? [],
    capacity: partial.capacity ?? 0,
    status: partial.status ?? "On Sale",
    featured: partial.featured ?? false,
    tiers: partial.tiers ?? [],
  };
  store.events.unshift(event);
  return event;
}

export function updateEvent(
  id: string,
  patch: Partial<EventItem>
): EventItem | undefined {
  const idx = store.events.findIndex((e) => e.id === id);
  if (idx === -1) return undefined;
  store.events[idx] = { ...store.events[idx], ...patch, id };
  return store.events[idx];
}

/** Toggle a single tier's `active` flag or update its price. */
export function patchTier(
  eventId: string,
  tierId: string,
  patch: { active?: boolean; price?: number }
): EventItem | undefined {
  const event = store.events.find((e) => e.id === eventId);
  if (!event) return undefined;
  event.tiers = event.tiers.map((t) =>
    t.id === tierId ? { ...t, ...patch } : t
  );
  return event;
}

/* ---------------------------- Bookings ---------------------------- */

export function listBookings(): Booking[] {
  // Newest first.
  return [...store.bookings].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function getBooking(id: string): Booking | undefined {
  return store.bookings.find((b) => b.id === id);
}

export function createBooking(
  input: Omit<Booking, "id" | "createdAt" | "status"> &
    Partial<Pick<Booking, "status" | "createdAt">>
): Booking {
  const booking: Booking = {
    id: `4TC-${1000 + store.bookings.length + 1}`,
    createdAt: input.createdAt ?? new Date().toISOString(),
    status: input.status ?? "Confirmed",
    ...input,
  };
  store.bookings.push(booking);

  // Decrement inventory on the relevant event tiers.
  const event = store.events.find((e) => e.id === booking.eventId);
  if (event) {
    for (const line of booking.lines) {
      const tier = event.tiers.find((t) => t.id === line.tierId);
      if (tier) tier.sold = Math.min(tier.capacity, tier.sold + line.quantity);
    }
    recomputeStatus(event);
  }
  return booking;
}

export function updateBooking(
  id: string,
  patch: Partial<Booking>
): Booking | undefined {
  const idx = store.bookings.findIndex((b) => b.id === id);
  if (idx === -1) return undefined;
  store.bookings[idx] = { ...store.bookings[idx], ...patch, id };
  return store.bookings[idx];
}

/** Validate + check in a ticket. Returns a result describing the outcome. */
export function checkInBooking(id: string): {
  ok: boolean;
  reason?: "not_found" | "already_checked_in" | "cancelled";
  booking?: Booking;
} {
  const booking = store.bookings.find((b) => b.id === id);
  if (!booking) return { ok: false, reason: "not_found" };
  if (booking.status === "Cancelled")
    return { ok: false, reason: "cancelled", booking };
  if (booking.status === "Checked In")
    return { ok: false, reason: "already_checked_in", booking };
  booking.status = "Checked In";
  booking.checkedInAt = new Date().toISOString();
  return { ok: true, booking };
}

/* ----------------------------- Helpers ---------------------------- */

function recomputeStatus(event: EventItem) {
  const totalSold = event.tiers.reduce((s, t) => s + t.sold, 0);
  const totalCap = event.tiers.reduce((s, t) => s + t.capacity, 0) || 1;
  const ratio = totalSold / totalCap;
  if (ratio >= 1) event.status = "Sold Out";
  else if (ratio >= 0.8) event.status = "Selling Fast";
  else if (event.status !== "Draft") event.status = "On Sale";
}

function cryptoId(): string {
  // Lightweight unique id without external deps.
  return (
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}
