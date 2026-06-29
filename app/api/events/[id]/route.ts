import { NextResponse } from "next/server";
import { getEvent, updateEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

/** GET /api/events/:id — fetch one event by id or slug. */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const event = getEvent(params.id);
  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json({ event });
}

/** PATCH /api/events/:id — update event fields (admin). */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patch = await req.json().catch(() => ({}));
  const event = updateEvent(params.id, patch);
  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json({ event });
}
