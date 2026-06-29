"use client";

import { useCallback, useEffect, useState } from "react";
import type { Booking, EventItem } from "./types";

/** Thin client wrappers around the mock backend API routes. */

export async function fetchEvents(): Promise<EventItem[]> {
  const res = await fetch("/api/events", { cache: "no-store" });
  return (await res.json()).events;
}

export async function fetchBookings(): Promise<Booking[]> {
  const res = await fetch("/api/bookings", { cache: "no-store" });
  return (await res.json()).bookings;
}

export async function patchTier(
  eventId: string,
  tierId: string,
  patch: { active?: boolean; price?: number }
) {
  await fetch(`/api/events/${eventId}/tiers/${tierId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
}

export async function createEvent(data: Partial<EventItem>) {
  const res = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return (await res.json()).event as EventItem;
}

export async function patchBooking(id: string, patch: Partial<Booking>) {
  const res = await fetch(`/api/bookings/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  return (await res.json()).booking as Booking;
}

export async function checkIn(id: string) {
  const res = await fetch("/api/checkin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  return res.json() as Promise<{
    ok: boolean;
    reason?: string;
    message: string;
    booking?: Booking;
  }>;
}

/** Loads events + bookings together and exposes a refresh fn. */
export function useAdminData() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [e, b] = await Promise.all([fetchEvents(), fetchBookings()]);
    setEvents(e);
    setBookings(b);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { events, bookings, loading, refresh, setEvents, setBookings };
}
