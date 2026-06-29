import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  PlayCircle,
  Ticket,
  HeartHandshake,
  Search,
  QrCode,
  ShieldCheck,
  Quote,
  Star,
  MapPin,
  CalendarDays,
} from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { Countdown } from "@/components/Countdown";
import { EventCard } from "@/components/EventCard";
import { Newsletter } from "@/components/site/Newsletter";
import { TypingHeadline } from "@/components/site/TypingHeadline";
import { Marquee } from "@/components/site/Marquee";
import { listEvents } from "@/lib/db";
import { getHeroImage, getHeroVideo, getLocalMedia } from "@/lib/media";
import type { EventCategory } from "@/lib/types";
import { formatEventDate, formatEventTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Copy for the "explore by vibe" category cards. */
const CATEGORY_META: Record<EventCategory, { blurb: string }> = {
  Parties: { blurb: "Rooftops, warehouses & all-nighters." },
  "Live Music": { blurb: "Rising artists, raw rooms, real sound." },
  Community: { blurb: "Cookouts, culture & connection." },
};

const TESTIMONIALS = [
  {
    quote:
      "Every 4theculture night feels like home. The energy, the people, the music — nothing else compares in the city.",
    name: "Amina C.",
    role: "Regular since Vol. 1",
  },
  {
    quote:
      "Checkout took ten seconds and the QR ticket just worked at the door. Smoothest event experience I've had.",
    name: "Marcus L.",
    role: "VIP table host",
  },
  {
    quote:
      "They book the artists nobody else is paying attention to yet. I've discovered my favourite acts here.",
    name: "Priya N.",
    role: "Live Sessions fan",
  },
];

export default function HomePage() {
  const events = listEvents();
  // Next upcoming event = soonest future date; fall back to first event.
  const now = Date.now();
  const upcoming =
    [...events]
      .filter((e) => new Date(e.date).getTime() > now)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? events[0];

  const featured = events.filter((e) => e.status !== "Sold Out").slice(0, 3);

  // Real media pool for the homepage sections below.
  const { images: mediaImages, videos: mediaVideos } = getLocalMedia();

  // Hero background: use a specific real clip (different from the gallery's
  // first video), with a photo as poster / fallback.
  const heroImage = getHeroImage() ?? upcoming.coverImage;
  const heroVideo = mediaVideos[9] ?? mediaVideos[1] ?? getHeroVideo();
  const categoryCount = (Object.keys(CATEGORY_META) as EventCategory[]).length;

  // "Explore by vibe" cards: pick distinct, well-spaced photos from the media
  // pool (so the three cards never look alike), falling back to event covers.
  const categories = (Object.keys(CATEGORY_META) as EventCategory[]).map(
    (cat, i) => ({
      cat,
      ...CATEGORY_META[cat],
      count: events.filter((e) => e.category === cat).length,
      image:
        mediaImages.length > 0
          ? mediaImages[
              Math.floor((mediaImages.length * (i + 1)) / (categoryCount + 1))
            ]
          : events.find((e) => e.category === cat)?.coverImage ??
            events[0].coverImage,
    })
  );

  // A handful of past-event photos for the gallery teaser strip — taken from
  // the end of the pool so they differ from the hero & category images above.
  const galleryPreview =
    mediaImages.length >= 6
      ? mediaImages.slice(-6)
      : events.flatMap((e) => e.gallery).slice(0, 6);

  return (
    <SiteFrame>
      {/* ============================= HERO ============================= */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        {/* Full-bleed video background (real footage) with photo fallback */}
        <div className="absolute inset-0 -z-10">
          {heroVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={heroImage}
              preload="auto"
              className="h-full w-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <Image src={heroImage} alt="" fill priority className="object-cover" />
          )}
          {/* Legibility overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/20 to-transparent" />
          <div className="absolute inset-0 bg-grid-glow opacity-30" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 pt-32 pb-14 sm:pt-40 sm:pb-20">
          {/* Kicker */}
          <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            <span className="h-px w-10 bg-white/50" />
            Poznań · Nightlife · Community
            {heroVideo && (
              <span className="ml-1 inline-flex items-center gap-1.5 text-white/40">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Live footage
              </span>
            )}
          </div>

          <TypingHeadline
            lead="FOR THE"
            words={["CULTURE.", "NIGHT.", "MOVEMENT."]}
            className="font-display text-5xl font-extrabold leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl"
          />

          <p className="mt-6 max-w-xl text-lg text-white/70">
            Parties, live music, and community gatherings that move people. Bring
            your people, and let's make memories that outlast the night.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href={`/events/${upcoming.slug}`} className="btn-neon">
              <Ticket className="h-5 w-5" />
              Get Tickets
            </Link>
            <Link href="/gallery" className="btn-ghost">
              <PlayCircle className="h-5 w-5" />
              Watch the recap
            </Link>
          </div>

          {/* Next-event countdown strip */}
          <div className="mt-12 inline-flex flex-col gap-5 rounded-2xl glass-strong p-5 sm:flex-row sm:items-center sm:p-6">
            <div className="min-w-[200px]">
              <p className="text-[11px] uppercase tracking-widest text-white/40">
                Next event
              </p>
              <p className="mt-0.5 font-display text-lg font-bold leading-tight">
                {upcoming.title}
              </p>
              <p className="mt-1 text-sm text-white/50">
                {formatEventDate(upcoming.date)} · {formatEventTime(upcoming.date)}
                <br className="sm:hidden" /> · {upcoming.venue}
              </p>
            </div>
            <div className="hidden h-14 w-px bg-white/10 sm:block" />
            <Countdown target={upcoming.date} />
          </div>
        </div>
      </section>

      {/* =========================== MARQUEE =========================== */}
      <Marquee />

      {/* ======================= EXPLORE BY VIBE ======================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-20">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-neon-violet">
            Find your scene
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
            Explore by <span className="text-gradient">vibe</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {categories.map(({ cat, blurb, count, image }) => (
            <Link
              key={cat}
              href="/events"
              className="group relative overflow-hidden rounded-2xl glass hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-neon"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={image}
                  alt={cat}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover opacity-50 transition-transform duration-500 group-hover:scale-110 group-hover:opacity-70"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-bold">{cat}</h3>
                  <span className="text-xs text-white/40">
                    {count} event{count === 1 ? "" : "s"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white transition">
                  Browse <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================= FEATURED EVENTS ======================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              Upcoming <span className="text-gradient">events</span>
            </h2>
            <p className="mt-2 text-white/50">Don't miss what's coming next.</p>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-1.5 text-neon-violet hover:text-white font-semibold"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/events" className="btn-ghost">
            View all events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ========================= HOW IT WORKS ========================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-neon-violet">
            Simple as it should be
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
            How it <span className="text-gradient">works</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Search,
              step: "01",
              title: "Discover the night",
              text: "Browse upcoming parties, live sets, and community events near you.",
            },
            {
              icon: Ticket,
              step: "02",
              title: "Grab your tickets",
              text: "Pick your tier, check out in seconds, and get a QR ticket instantly.",
            },
            {
              icon: QrCode,
              step: "03",
              title: "Scan in & vibe",
              text: "Skip the line — staff scan your code at the door and you're in.",
            },
          ].map(({ icon: Icon, step, title, text }) => (
            <div key={step} className="glass rounded-2xl p-6 relative">
              <span className="absolute top-5 right-6 font-display text-5xl font-extrabold text-white/5">
                {step}
              </span>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/10">
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-white/55">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================== GALLERY PREVIEW ======================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-neon-violet">
              Straight from the floor
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
              Moments we <span className="text-gradient">made</span>
            </h2>
          </div>
          <Link
            href="/gallery"
            className="hidden sm:inline-flex items-center gap-1.5 text-neon-violet hover:text-white font-semibold"
          >
            Full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryPreview.map((src, i) => (
            <Link
              key={i}
              href="/gallery"
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt="Past event moment"
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink-950/20 group-hover:bg-transparent transition" />
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/gallery" className="btn-ghost">
            Full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ======================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-neon-violet">
            Word on the street
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mt-2">
            Loved by <span className="text-gradient">the people</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6 flex flex-col">
              <Quote className="h-7 w-7 text-white/20" />
              <blockquote className="mt-3 text-white/75 leading-relaxed flex-1">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-white text-white" />
                  ))}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ===================== WHY 4THECULTURE ======================== */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: ShieldCheck,
              title: "Safe & secure",
              text: "Trained staff, clear policies, and a zero-tolerance door.",
            },
            {
              icon: MapPin,
              title: "Iconic venues",
              text: "Rooftops, warehouses, and hidden spaces across the city.",
            },
            {
              icon: CalendarDays,
              title: "Always something on",
              text: "Fresh events every month — there's always a next time.",
            },
            {
              icon: HeartHandshake,
              title: "Community first",
              text: "Built with and for the people who make the culture.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="glass rounded-2xl p-6">
              <Icon className="h-7 w-7 text-white" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm text-white/50">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= NEWSLETTER ========================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <Newsletter />
      </section>

      {/* ========================= CTA BANNER ========================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 mt-24">
        <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-14 text-center">
          <div className="absolute inset-0 bg-grid-glow opacity-70" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold">
              Be part of the <span className="text-gradient">movement</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-white/60">
              Every event is a story. Get your tickets early — our best nights
              sell out fast.
            </p>
            <Link href="/events" className="btn-neon mt-8">
              Explore all events <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
