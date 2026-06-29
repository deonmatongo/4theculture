"use client";

import { useState } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type { EventCategory, EventItem, TicketTier } from "@/lib/types";
import { createEvent } from "@/lib/api";

interface DraftTier {
  name: string;
  price: string;
  capacity: string;
}

const CATEGORIES: EventCategory[] = ["Parties", "Live Music", "Community"];

/** Modal form to create a new event with one or more ticket tiers. */
export function EventFormModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (event: EventItem) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    category: "Parties" as EventCategory,
    date: "",
    venue: "",
    city: "Poznań, Poland",
    capacity: "",
    description: "",
    coverImage: "",
  });
  const [tiers, setTiers] = useState<DraftTier[]>([
    { name: "General Admission", price: "40", capacity: "200" },
  ]);
  const [saving, setSaving] = useState(false);

  const valid = form.title.trim() && form.date && form.venue.trim();

  function updateTier(i: number, patch: Partial<DraftTier>) {
    setTiers((t) => t.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSaving(true);

    const builtTiers: TicketTier[] = tiers
      .filter((t) => t.name.trim())
      .map((t, i) => ({
        id: `tier_new_${i}_${t.name.toLowerCase().replace(/\s+/g, "")}`,
        name: t.name.trim(),
        price: Number(t.price) || 0,
        capacity: Number(t.capacity) || 0,
        sold: 0,
        active: true,
      }));

    const capacity =
      Number(form.capacity) ||
      builtTiers.reduce((s, t) => s + t.capacity, 0);

    const event = await createEvent({
      title: form.title.trim(),
      category: form.category,
      date: new Date(form.date).toISOString(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      capacity,
      description: form.description.trim(),
      coverImage:
        form.coverImage.trim() ||
        `https://picsum.photos/seed/${encodeURIComponent(form.title)}/1600/900`,
      tiers: builtTiers,
      status: "On Sale",
    });

    onCreated(event);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl glass-strong rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold">Create new event</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Event title" full>
              <input
                className="input-field"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Neon Jungle — Vol. 2"
              />
            </FormField>
            <FormField label="Category">
              <select
                className="input-field"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as EventCategory })
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-ink-800">
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Date & time">
              <input
                type="datetime-local"
                className="input-field"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </FormField>
            <FormField label="Venue">
              <input
                className="input-field"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                placeholder="The Skyline Loft"
              />
            </FormField>
            <FormField label="City">
              <input
                className="input-field"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </FormField>
            <FormField label="Total capacity">
              <input
                type="number"
                className="input-field"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                placeholder="Auto from tiers"
              />
            </FormField>
            <FormField label="Cover image URL">
              <input
                className="input-field"
                value={form.coverImage}
                onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                placeholder="https://… (optional)"
              />
            </FormField>
          </div>

          <FormField label="Description" full>
            <textarea
              className="input-field min-h-[88px] resize-y"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Tell people what to expect…"
            />
          </FormField>

          {/* Ticket tiers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-widest text-white/40">
                Ticket tiers
              </span>
              <button
                type="button"
                onClick={() =>
                  setTiers((t) => [...t, { name: "", price: "", capacity: "" }])
                }
                className="text-sm text-neon-violet hover:text-neon-pink inline-flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add tier
              </button>
            </div>
            <div className="space-y-2">
              {tiers.map((t, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="input-field flex-1"
                    placeholder="Tier name"
                    value={t.name}
                    onChange={(e) => updateTier(i, { name: e.target.value })}
                  />
                  <input
                    type="number"
                    className="input-field w-24"
                    placeholder="$"
                    value={t.price}
                    onChange={(e) => updateTier(i, { price: e.target.value })}
                  />
                  <input
                    type="number"
                    className="input-field w-24"
                    placeholder="Qty"
                    value={t.capacity}
                    onChange={(e) => updateTier(i, { capacity: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setTiers((arr) => arr.filter((_, idx) => idx !== i))
                    }
                    className="p-2 rounded-lg hover:bg-white/15 text-white/40 hover:text-white"
                    aria-label="Remove tier"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!valid || saving}
              className="btn-neon flex-1 disabled:opacity-40 disabled:hover:scale-100"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                "Create event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={full ? "block sm:col-span-2" : "block"}>
      <span className="text-xs uppercase tracking-widest text-white/40">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
