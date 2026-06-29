"use client";

import { QRCodeSVG } from "qrcode.react";
import { CalendarDays, MapPin } from "lucide-react";
import type { Booking, EventItem } from "@/lib/types";
import { currency, formatEventDate, formatEventTime } from "@/lib/utils";

/** Standalone, shareable e-ticket with QR — rendered at /ticket/:id. */
export function TicketView({
  booking,
  event,
}: {
  booking: Booking;
  event?: EventItem;
}) {
  const payload = JSON.stringify({ t: "4tc-ticket", id: booking.id });
  const checkedIn = booking.status === "Checked In";

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl bg-white text-ink-950 overflow-hidden shadow-neon">
        <div className="bg-ink-950 p-5 text-white">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest">
            <span>4theculture</span>
            <span>{checkedIn ? "Checked In ✓" : "Valid E-Ticket"}</span>
          </div>
          <h1 className="font-display text-2xl font-extrabold mt-2 leading-tight">
            {booking.eventTitle}
          </h1>
        </div>

        <div className="p-6">
          <div className="grid place-items-center">
            <QRCodeSVG value={payload} size={200} level="M" fgColor="#05040a" />
          </div>
          <p className="text-center font-mono text-sm text-ink-600 mt-3">
            {booking.id}
          </p>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-600">Guest</span>
              <span className="font-semibold">{booking.customerName}</span>
            </div>
            {event && (
              <>
                <div className="flex items-center gap-2 text-ink-600">
                  <CalendarDays className="h-4 w-4" />
                  {formatEventDate(event.date)} · {formatEventTime(event.date)}
                </div>
                <div className="flex items-center gap-2 text-ink-600">
                  <MapPin className="h-4 w-4" />
                  {event.venue}, {event.city}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 border-t border-dashed border-ink-600/30 pt-4 text-sm">
            {booking.lines.map((l) => (
              <div key={l.tierId} className="flex justify-between">
                <span>
                  {l.quantity}× {l.tierName}
                </span>
                <span className="font-semibold">
                  {currency(l.unitPrice * l.quantity)}
                </span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-2 pt-2 border-t border-ink-600/20">
              <span>Total</span>
              <span>{currency(booking.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-white/40 mt-4">
        Present this QR code at the door. Screenshots are accepted.
      </p>
    </div>
  );
}
