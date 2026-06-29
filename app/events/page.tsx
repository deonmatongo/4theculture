import type { Metadata } from "next";
import { SiteFrame } from "@/components/site/SiteFrame";
import { EventsExplorer } from "@/components/site/EventsExplorer";
import { listEvents } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming parties, live music, and community events.",
};

export default function EventsPage() {
  const events = listEvents();
  return (
    <SiteFrame>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 sm:pt-16">
        <p className="text-sm uppercase tracking-widest text-neon-violet">
          What's on
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold mt-2">
          All <span className="text-gradient">events</span>
        </h1>
        <p className="mt-3 max-w-xl text-white/60">
          Filter by vibe and lock in your tickets. The culture moves fast — so
          do the good seats.
        </p>

        <div className="mt-10">
          <EventsExplorer events={events} />
        </div>
      </section>
    </SiteFrame>
  );
}
