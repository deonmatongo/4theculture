import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { currency, formatEventDate, formatEventTime, lowestPrice } from "@/lib/utils";

/** Card used in the events grid and on the homepage. */
export function EventCard({ event }: { event: EventItem }) {
  const from = lowestPrice(event);
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl glass hover:border-neon-purple/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="chip bg-black/40 backdrop-blur text-white/90 border border-white/15">
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={event.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-tight group-hover:text-gradient transition">
          {event.title}
        </h3>

        <div className="mt-3 space-y-1.5 text-sm text-white/60">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-neon-cyan shrink-0" />
            {formatEventDate(event.date)} · {formatEventTime(event.date)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-neon-pink shrink-0" />
            {event.venue}, {event.city}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="text-sm">
            <span className="text-white/40">From </span>
            <span className="font-bold text-white">
              {from > 0 ? currency(from) : "—"}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-neon-violet group-hover:text-neon-pink transition">
            <Ticket className="h-4 w-4" />
            {event.status === "Sold Out" ? "View" : "Get Tickets"}
          </span>
        </div>
      </div>
    </Link>
  );
}
