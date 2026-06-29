import { NextResponse } from "next/server";
import { createEvent, listEvents } from "@/lib/db";

// In-memory store must run on the Node runtime (not edge) and never be cached.
export const dynamic = "force-dynamic";

/** GET /api/events — list all events. */
export async function GET() {
  return NextResponse.json({ events: listEvents() });
}

/** POST /api/events — create a new event (admin). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const event = createEvent(body);
  return NextResponse.json({ event }, { status: 201 });
}
