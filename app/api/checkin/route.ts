import { NextResponse } from "next/server";
import { checkInBooking } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * POST /api/checkin — validate a scanned ticket and check it in.
 * Body: { id: string }  (the booking id encoded in the QR payload)
 *
 * Returns a structured result so the on-site scanner UI can show the right
 * state: valid (just checked in), duplicate (already checked in), or invalid.
 */
export async function POST(req: Request) {
  const { id } = await req.json().catch(() => ({ id: "" }));
  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { ok: false, reason: "not_found", message: "No ticket id provided." },
      { status: 400 }
    );
  }

  const result = checkInBooking(id.trim());

  const messages: Record<string, string> = {
    not_found: "Ticket not recognised. Check the code and try again.",
    already_checked_in: "Already checked in — possible duplicate.",
    cancelled: "This booking was cancelled. Entry denied.",
  };

  return NextResponse.json(
    {
      ok: result.ok,
      reason: result.reason,
      message: result.ok
        ? "Welcome in — ticket validated."
        : messages[result.reason ?? "not_found"],
      booking: result.booking,
    },
    { status: result.ok ? 200 : 409 }
  );
}
