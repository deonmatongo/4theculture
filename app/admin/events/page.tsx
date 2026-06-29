"use client";

import { useState } from "react";
import { Plus, ChevronDown, Check, Power } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { EventFormModal } from "@/components/admin/EventFormModal";
import { useAdminData, patchTier } from "@/lib/api";
import { cn, currency, formatEventDate } from "@/lib/utils";

export default function AdminEventsPage() {
  const { events, loading, refresh } = useAdminData();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [priceDraft, setPriceDraft] = useState<Record<string, string>>({});

  async function toggleTier(eventId: string, tierId: string, active: boolean) {
    await patchTier(eventId, tierId, { active });
    refresh();
  }

  async function savePrice(eventId: string, tierId: string) {
    const key = `${eventId}:${tierId}`;
    const value = Number(priceDraft[key]);
    if (!Number.isNaN(value) && value >= 0) {
      await patchTier(eventId, tierId, { price: value });
      refresh();
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Events & Tickets</h1>
          <p className="text-white/50 mt-1">
            Create events and manage ticket tiers on the fly.
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-neon shrink-0">
          <Plus className="h-5 w-5" /> <span className="hidden sm:inline">Create</span> Event
        </button>
      </header>

      {loading ? (
        <div className="text-white/50">Loading events…</div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          {/* Table header (desktop) */}
          <div className="hidden md:grid grid-cols-[2fr_1.2fr_1fr_1fr_40px] gap-4 px-5 py-3 text-xs uppercase tracking-widest text-white/40 border-b border-white/10">
            <span>Event</span>
            <span>Date</span>
            <span>Sold / Cap</span>
            <span>Status</span>
            <span />
          </div>

          <div className="divide-y divide-white/5">
            {events.map((e) => {
              const sold = e.tiers.reduce((s, t) => s + t.sold, 0);
              const cap = e.tiers.reduce((s, t) => s + t.capacity, 0);
              const isOpen = expanded === e.id;
              return (
                <div key={e.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : e.id)}
                    className="w-full grid md:grid-cols-[2fr_1.2fr_1fr_1fr_40px] gap-2 md:gap-4 px-5 py-4 text-left hover:bg-white/5 transition items-center"
                  >
                    <div>
                      <p className="font-semibold">{e.title}</p>
                      <p className="text-xs text-white/40">
                        {e.category} · {e.venue}
                      </p>
                    </div>
                    <span className="text-sm text-white/60">
                      {formatEventDate(e.date)}
                    </span>
                    <span className="text-sm text-white/60 tabular-nums">
                      {sold} / {cap}
                    </span>
                    <span>
                      <StatusBadge status={e.status} />
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-white/40 transition justify-self-end",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Expanded: tier controls */}
                  {isOpen && (
                    <div className="px-5 pb-5 bg-ink-900/40">
                      <p className="text-xs uppercase tracking-widest text-white/40 mb-3 pt-1">
                        Ticket tiers — toggle availability or change price
                      </p>
                      <div className="space-y-2">
                        {e.tiers.map((t) => {
                          const key = `${e.id}:${t.id}`;
                          const draft = priceDraft[key] ?? String(t.price);
                          return (
                            <div
                              key={t.id}
                              className="flex flex-wrap items-center gap-3 rounded-xl bg-white/5 p-3"
                            >
                              <div className="flex-1 min-w-[140px]">
                                <p className="font-medium text-sm">{t.name}</p>
                                <p className="text-xs text-white/40">
                                  {t.sold}/{t.capacity} sold
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-white/40 text-sm">$</span>
                                <input
                                  type="number"
                                  value={draft}
                                  onChange={(ev) =>
                                    setPriceDraft({
                                      ...priceDraft,
                                      [key]: ev.target.value,
                                    })
                                  }
                                  className="input-field w-24 !py-1.5 !px-2 text-sm"
                                />
                                <button
                                  onClick={() => savePrice(e.id, t.id)}
                                  className="p-2 rounded-lg bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25"
                                  aria-label="Save price"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              </div>

                              <button
                                onClick={() => toggleTier(e.id, t.id, !t.active)}
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                                  t.active
                                    ? "bg-neon-lime/15 text-neon-lime"
                                    : "bg-white/10 text-white/50"
                                )}
                              >
                                <Power className="h-3.5 w-3.5" />
                                {t.active ? "On sale" : "Off"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <EventFormModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            refresh();
          }}
        />
      )}
    </div>
  );
}
