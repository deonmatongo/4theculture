import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { TicketView } from "@/components/checkout/TicketView";
import { getBooking, getEvent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function TicketPage({ params }: { params: { id: string } }) {
  const booking = getBooking(params.id);
  if (!booking) notFound();
  const event = getEvent(booking.eventId);

  return (
    <SiteFrame>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <Link
          href="/events"
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to events
        </Link>
        <TicketView booking={booking} event={event} />
      </section>
    </SiteFrame>
  );
}
