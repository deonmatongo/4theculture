import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Shirt,
  Mic2,
  ArrowLeft,
} from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckoutPanel } from "@/components/checkout/CheckoutPanel";
import { getEvent, listEvents } from "@/lib/db";
import { formatEventDate, formatEventTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { slug: string } }) {
  const event = getEvent(params.slug);
  return { title: event?.title ?? "Event" };
}

export default function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = getEvent(params.slug);
  if (!event) notFound();

  const related = listEvents()
    .filter((e) => e.id !== event.id && e.category === event.category)
    .slice(0, 3);

  return (
    <SiteFrame>
      {/* Hero banner */}
      <section className="relative">
        <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
          <Image
            src={event.coverImage}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-ink-950/20" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="-mt-28 relative">
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4" /> Back to events
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="chip glass text-white/80">{event.category}</span>
              <StatusBadge status={event.status} />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold max-w-3xl">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-10 grid gap-10 lg:grid-cols-3">
        {/* ---------------- Left: details ---------------- */}
        <div className="lg:col-span-2 space-y-10">
          {/* Quick facts */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Fact icon={<CalendarDays className="h-5 w-5 text-neon-cyan" />} label="Date & time">
              {formatEventDate(event.date)}
              <br />
              {formatEventTime(event.date)}
            </Fact>
            <Fact icon={<MapPin className="h-5 w-5 text-neon-pink" />} label="Venue">
              {event.venue}
              <br />
              {event.city}
            </Fact>
            <Fact icon={<Shirt className="h-5 w-5 text-neon-violet" />} label="Dress code">
              {event.dressCode}
            </Fact>
            <Fact icon={<Mic2 className="h-5 w-5 text-neon-lime" />} label="Capacity">
              {event.capacity.toLocaleString()} people
            </Fact>
          </div>

          {/* About */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-3">About this event</h2>
            <p className="text-white/60 leading-relaxed">{event.description}</p>
          </section>

          {/* Line-up */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4">The line-up</h2>
            <div className="flex flex-wrap gap-3">
              {event.lineup.map((act) => (
                <span
                  key={act}
                  className="glass rounded-xl px-4 py-3 font-semibold text-white/80"
                >
                  {act}
                </span>
              ))}
            </div>
          </section>

          {/* Venue map placeholder */}
          <section>
            <h2 className="font-display text-2xl font-bold mb-4">Getting there</h2>
            <div className="relative h-64 rounded-2xl glass overflow-hidden grid place-items-center">
              <div className="absolute inset-0 bg-grid-glow opacity-50" />
              <div className="relative text-center">
                <MapPin className="mx-auto h-8 w-8 text-neon-pink" />
                <p className="mt-2 font-semibold">{event.venue}</p>
                <p className="text-sm text-white/50">{event.city}</p>
                <p className="mt-2 text-xs text-white/30">[ Map embed placeholder ]</p>
              </div>
            </div>
          </section>
        </div>

        {/* ---------------- Right: sticky checkout ---------------- */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <CheckoutPanel event={event} />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
          <h2 className="font-display text-2xl font-bold mb-6">
            More {event.category.toLowerCase()}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((e) => (
              <Link
                key={e.id}
                href={`/events/${e.slug}`}
                className="glass rounded-xl p-4 hover:bg-white/10 transition flex items-center gap-3"
              >
                <div className="relative h-14 w-14 rounded-lg overflow-hidden shrink-0">
                  <Image src={e.coverImage} alt={e.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm leading-tight">{e.title}</p>
                  <p className="text-xs text-white/50">{formatEventDate(e.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </SiteFrame>
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-4 flex gap-3">
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-widest text-white/40">
          {label}
        </div>
        <div className="mt-1 font-medium text-white/90 text-sm leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}
