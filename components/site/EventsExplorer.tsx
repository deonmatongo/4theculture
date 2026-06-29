"use client";

import { useMemo, useState } from "react";
import { EventCard } from "@/components/EventCard";
import type { EventCategory, EventItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const CATEGORIES: Array<"All" | EventCategory> = [
  "All",
  "Parties",
  "Live Music",
  "Community",
];

/** Client-side filterable grid of events. */
export function EventsExplorer({ events }: { events: EventItem[] }) {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(
    () =>
      active === "All"
        ? events
        : events.filter((e) => e.category === active),
    [active, events]
  );

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const count =
            cat === "All"
              ? events.length
              : events.filter((e) => e.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition-all",
                active === cat
                  ? "bg-white text-ink-950 shadow-neon"
                  : "glass text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              {cat}
              <span className="ml-2 text-xs opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-white/50">
          No events in this category yet — check back soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
