import { NextResponse } from "next/server";
import { getBooking, updateBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/bookings/:id — fetch one booking (used by ticket / QR lookups). */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const booking = getBooking(params.id);
  if (!booking)
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ booking });
}

/** PATCH /api/bookings/:id — update status / vip flag (admin guestlist). */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = await req.json().catch(() => ({}));
  const booking = updateBooking(params.id, patch);
  if (!booking)
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ booking });
}
