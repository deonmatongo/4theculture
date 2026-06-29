"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Star,
  Check,
  X as XIcon,
  Crown,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Booking, BookingStatus } from "@/lib/types";
import { useAdminData, patchBooking } from "@/lib/api";
import { cn, currency, formatEventDate } from "@/lib/utils";

const STATUS_FILTERS: Array<BookingStatus | "All" | "VIP"> = [
  "All",
  "Confirmed",
  "Pending",
  "Checked In",
  "VIP",
];

export default function AdminBookingsPage() {
  const { bookings, loading, refresh } = useAdminData();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bookings.filter((b) => {
      const matchesQuery =
        !q ||
        b.customerName.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.eventTitle.toLowerCase().includes(q);
      const matchesFilter =
        filter === "All" ||
        (filter === "VIP" ? b.vip : b.status === filter);
      return matchesQuery && matchesFilter;
    });
  }, [bookings, query, filter]);

  async function setStatus(b: Booking, status: BookingStatus) {
    await patchBooking(b.id, { status });
    refresh();
  }
  async function toggleVip(b: Booking) {
    await patchBooking(b.id, { vip: !b.vip });
    refresh();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl font-bold">
          Bookings & Guestlist
        </h1>
        <p className="text-white/50 mt-1">
          Search buyers, manage the VIP guestlist, approve table requests.
        </p>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, booking ID, event…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
                filter === f
                  ? "bg-white text-ink-950"
                  : "glass text-white/60 hover:text-white"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-white/50">Loading bookings…</div>
      ) : (
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-white/40 border-b border-white/10">
                <th className="px-5 py-3 font-medium">Booking</th>
                <th className="px-5 py-3 font-medium">Event</th>
                <th className="px-5 py-3 font-medium">Tickets</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{b.customerName}</span>
                      {b.vip && (
                        <Crown className="h-3.5 w-3.5 text-neon-lime" aria-label="VIP" />
                      )}
                    </div>
                    <p className="text-xs text-white/40">{b.email}</p>
                    <p className="text-[11px] font-mono text-white/30">{b.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white/80">{b.eventTitle}</p>
                    <p className="text-xs text-white/40">
                      {formatEventDate(b.createdAt)}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-white/70">
                    {b.lines.map((l) => (
                      <div key={l.tierId} className="text-xs">
                        {l.quantity}× {l.tierName}
                      </div>
                    ))}
                  </td>
                  <td className="px-5 py-4 font-semibold">{currency(b.total)}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={b.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleVip(b)}
                        title={b.vip ? "Remove from VIP" : "Add to VIP guestlist"}
                        className={cn(
                          "p-2 rounded-lg transition",
                          b.vip
                            ? "bg-neon-lime/15 text-neon-lime"
                            : "hover:bg-white/10 text-white/40"
                        )}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      {b.status === "Pending" && (
                        <>
                          <button
                            onClick={() => setStatus(b, "Confirmed")}
                            title="Approve"
                            className="p-2 rounded-lg bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setStatus(b, "Cancelled")}
                            title="Reject"
                            className="p-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/15 hover:text-white"
                          >
                            <XIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <Link
                        href={`/ticket/${b.id}`}
                        title="View ticket"
                        className="p-2 rounded-lg hover:bg-white/10 text-white/40"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/40">
                    No bookings match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Confirmed: "bg-white/10 text-white border border-white/20",
    Pending: "bg-white/5 text-white/60 border border-white/15",
    "Checked In": "bg-white text-ink-950",
    Cancelled: "bg-transparent text-white/40 border border-white/15 line-through",
  };
  return <span className={cn("chip", styles[status])}>{status}</span>;
}
