import Link from "next/link";
import { Instagram, Youtube, Music2 } from "lucide-react";

/** Public site footer with social placeholders and an admin entry point. */
export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-ink-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display font-extrabold text-xl">
              <span className="text-gradient">4theculture</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-white/50">
              An event-hosting collective built on community, nightlife, and
              culture. Real moments, real people — for the culture, always.
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Youtube, Music2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass rounded-full p-2.5 hover:bg-white/10 transition"
                  aria-label="Social link"
                >
                  <Icon className="h-5 w-5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/events" className="hover:text-neon-cyan">Events</Link></li>
              <li><Link href="/gallery" className="hover:text-neon-cyan">Gallery</Link></li>
              <li><Link href="/events" className="hover:text-neon-cyan">Get Tickets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white/80 mb-3">Team</h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li><Link href="/admin" className="hover:text-neon-cyan">Admin Dashboard</Link></li>
              <li><Link href="/admin/checkin" className="hover:text-neon-cyan">On-Site Check-In</Link></li>
            </ul>
          </div>
        </div>

        <div className="glow-divider my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} 4theculture. All rights reserved.</p>
          <p>Built for the culture · Demo experience</p>
        </div>
      </div>
    </footer>
  );
}
