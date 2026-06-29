/**
 * Angled "moving ribbon" — a slanted band beneath the hero whose keywords
 * scroll infinitely. Pure CSS animation (no JS): the items are duplicated and
 * the track scrolls by exactly half its width, so the loop is seamless. The
 * band is rotated and over-sized so its edges sit off-screen.
 */
const ITEMS = [
  "For the culture",
  "Nightlife",
  "Live music",
  "Community",
  "After dark",
  "Poznań",
  "Good energy",
  "Real moments",
];

export function Marquee() {
  // Two identical copies so a -50% translate loops without a jump.
  const track = [...ITEMS, ...ITEMS];

  return (
    <section className="relative overflow-hidden py-8 sm:py-12">
      {/* The ribbon: white band, slightly rotated, wider than the viewport. */}
      <div className="w-[112%] -translate-x-[6%] -rotate-2 bg-white py-3 shadow-neon sm:py-4">
        <div className="flex w-max animate-marquee items-center gap-6 whitespace-nowrap sm:gap-8">
          {track.map((item, i) => (
            <span key={i} className="flex items-center gap-6 sm:gap-8">
              <span className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-950 sm:text-3xl">
                {item}
              </span>
              {/* Dot separator (no icons) */}
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink-950/50" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
