import type { Metadata } from "next";
import Image from "next/image";
import { PlayCircle, Instagram } from "lucide-react";
import { SiteFrame } from "@/components/site/SiteFrame";
import { listEvents } from "@/lib/db";
import { getLocalMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Relive past 4theculture events in photos and video.",
};

export default function GalleryPage() {
  const { images, videos, hasMedia } = getLocalMedia();

  // Fallback photo wall (placeholders) used until real media is downloaded.
  const events = listEvents();
  const placeholders = events.flatMap((e) =>
    [e.coverImage, ...e.gallery].map((src, i) => ({
      src,
      title: e.title,
      key: `${e.id}-${i}`,
    }))
  );

  // When real Instagram media exists, use it; otherwise show placeholders.
  const photos = hasMedia
    ? images.map((src, i) => ({ src, title: "4theculture", key: `local-${i}` }))
    : placeholders;

  return (
    <SiteFrame>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16">
        <p className="text-sm uppercase tracking-widest text-neon-violet">
          Memories
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-2">
          The <span className="text-gradient">gallery</span>
        </h1>
        <p className="mt-3 max-w-xl text-white/60">
          Every flash, every drop, every face in the crowd. Relive the nights
          that built the culture.
        </p>

        {/* ----------------------------- Videos ----------------------------- */}
        {videos.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((src, i) => (
              <video
                key={i}
                src={src}
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full rounded-2xl object-cover bg-ink-900 border border-white/10"
              />
            ))}
          </div>
        ) : (
          // Placeholder video embeds until real clips are downloaded.
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="group relative aspect-video rounded-2xl glass overflow-hidden grid place-items-center"
              >
                <Image
                  src={photos[i % photos.length]?.src ?? ""}
                  alt="Recap video"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-60 transition"
                />
                <div className="relative text-center">
                  <PlayCircle className="mx-auto h-14 w-14 text-white drop-shadow-lg group-hover:scale-110 transition" />
                  <p className="mt-2 text-sm font-semibold">Event recap #{i + 1}</p>
                  <p className="text-xs text-white/40">[ Social video embed ]</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --------------------------- Photo wall --------------------------- */}
        <h2 className="font-display text-2xl font-bold mt-14 mb-6">Photo wall</h2>

        {hasMedia ? (
          // Real downloaded photos — natural aspect ratios via a masonry layout.
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {photos.map((p) => (
              <div
                key={p.key}
                className="mb-4 break-inside-avoid relative overflow-hidden rounded-xl group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <p className="text-sm font-semibold">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Placeholder wall using event imagery.
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {placeholders.map((p, i) => (
              <div
                key={p.key}
                className="mb-4 break-inside-avoid relative overflow-hidden rounded-xl group"
              >
                <Image
                  src={p.src}
                  alt={p.title}
                  width={600}
                  height={i % 3 === 0 ? 800 : 600}
                  className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                  <p className="text-sm font-semibold">{p.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Social CTA */}
        <div className="mt-14 glass rounded-2xl p-8 text-center">
          <Instagram className="mx-auto h-8 w-8 text-neon-pink" />
          <h3 className="font-display text-xl font-bold mt-3">
            Tag us @4theculture
          </h3>
          <p className="text-white/50 text-sm mt-1">
            Share your moments and get featured on our wall.
          </p>
        </div>
      </section>
    </SiteFrame>
  );
}
