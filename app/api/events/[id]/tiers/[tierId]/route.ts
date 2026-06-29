import { NextResponse } from "next/server";
import { patchTier } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/events/:id/tiers/:tierId
 * Toggle a tier on/off or change its price on the fly (admin).
 * Body: { active?: boolean, price?: number }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string; tierId: string } }
) {
  const body = await req.json().catch(() => ({}));
  const patch: { active?: boolean; price?: number } = {};
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.price === "number" && body.price >= 0) patch.price = body.price;

  const event = patchTier(params.id, params.tierId, patch);
  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json({ event });
}
