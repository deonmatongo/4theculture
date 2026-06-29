"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
];

/** Sticky glassmorphic top navigation for the public site. */
export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="glass-strong border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 font-display font-extrabold text-lg tracking-tight"
              onClick={() => setOpen(false)}
            >
              <span className="text-gradient">4theculture</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition",
                      active
                        ? "text-white bg-white/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link href="/events" className="btn-neon ml-2 !py-2 !px-5 text-sm">
                Get Tickets
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
              onClick={() => setOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden border-t border-white/10 px-4 py-4 space-y-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-white/80 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="btn-neon w-full mt-2"
            >
              Get Tickets
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
