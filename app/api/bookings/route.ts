import { NextResponse } from "next/server";
import { createBooking, listBookings } from "@/lib/db";
import type { BookingLine } from "@/lib/types";

export const dynamic = "force-dynamic";

/** GET /api/bookings — list all bookings (admin). */
export async function GET() {
  return NextResponse.json({ bookings: listBookings() });
}

/**
 * POST /api/bookings — create a booking (simulated checkout).
 * Body: { eventId, eventTitle, customerName, email, phone, lines, total, vip? }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const required = ["eventId", "customerName", "email", "phone", "lines"];
  for (const key of required) {
    if (!body[key]) {
      return NextResponse.json(
        { error: `Missing field: ${key}` },
        { status: 400 }
      );
    }
  }

  const lines: BookingLine[] = body.lines;
  if (!Array.isArray(lines) || lines.length === 0) {
    return NextResponse.json(
      { error: "At least one ticket is required" },
      { status: 400 }
    );
  }

  const total =
    typeof body.total === "number"
      ? body.total
      : lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0);

  const booking = createBooking({
    eventId: body.eventId,
    eventTitle: body.eventTitle ?? "",
    customerName: body.customerName,
    email: body.email,
    phone: body.phone,
    lines,
    total,
    vip: Boolean(body.vip),
  });

  return NextResponse.json({ booking }, { status: 201 });
}
