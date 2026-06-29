"use client";

import { useMemo } from "react";
import {
  DollarSign,
  Ticket,
  CalendarCheck,
  Activity,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/admin/MetricCard";
import {
  RevenueByEventChart,
  SalesVelocityChart,
} from "@/components/admin/SalesCharts";
import { StatusBadge } from "@/components/StatusBadge";
import { useAdminData } from "@/lib/api";
import { compactNumber, currency, eventSoldRatio } from "@/lib/utils";

export default function AdminOverviewPage() {
  const { events, bookings, loading } = useAdminData();

  const metrics = useMemo(() => {
    const paid = bookings.filter((b) => b.status !== "Cancelled");
    const revenue = paid.reduce((s, b) => s + b.total, 0);
    const tickets = paid.reduce(
      (s, b) => s + b.lines.reduce((q, l) => q + l.quantity, 0),
      0
    );
    const activeEvents = events.filter(
      (e) => e.status !== "Sold Out" && e.status !== "Draft"
    ).length;
    const liveAttendance = bookings.filter(
      (b) => b.status === "Checked In"
    ).length;
    return { revenue, tickets, activeEvents, liveAttendance };
  }, [events, bookings]);

  // Ticket-sales velocity: group paid bookings by purchase day.
  const velocity = useMemo(() => {
    const byDay = new Map<string, { tickets: number; revenue: number }>();
    for (const b of bookings) {
      if (b.status === "Cancelled") continue;
      const day = new Date(b.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const qty = b.lines.reduce((q, l) => q + l.quantity, 0);
      const cur = byDay.get(day) ?? { tickets: 0, revenue: 0 };
      byDay.set(day, {
        tickets: cur.tickets + qty,
        revenue: cur.revenue + b.total,
      });
    }
    return Array.from(byDay.entries())
      .map(([date, v]) => ({ date, ...v }))
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  }, [bookings]);

  const revenueByEvent = useMemo(
    () =>
      events.map((e) => ({
        name: e.title,
        revenue: bookings
          .filter((b) => b.eventId === e.id && b.status !== "Cancelled")
          .reduce((s, b) => s + b.total, 0),
      })),
    [events, bookings]
  );

  if (loading) {
    return <div className="text-white/50">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold">Overview</h1>
        <p className="text-white/50 mt-1">
          Real-time snapshot across every event.
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={currency(metrics.revenue)}
          delta="↑ live"
          icon={<DollarSign className="h-5 w-5" />}
          accent="lime"
        />
        <MetricCard
          label="Tickets Sold"
          value={compactNumber(metrics.tickets)}
          icon={<Ticket className="h-5 w-5" />}
          accent="purple"
        />
        <MetricCard
          label="Active Events"
          value={String(metrics.activeEvents)}
          icon={<CalendarCheck className="h-5 w-5" />}
          accent="cyan"
        />
        <MetricCard
          label="Live Attendance"
          value={String(metrics.liveAttendance)}
          delta="checked in"
          icon={<Activity className="h-5 w-5" />}
          accent="pink"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-neon-violet" />
            <h2 className="font-semibold">Ticket sales velocity</h2>
          </div>
          <SalesVelocityChart data={velocity} />
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-neon-lime" />
            <h2 className="font-semibold">Revenue by event</h2>
          </div>
          <RevenueByEventChart data={revenueByEvent} />
        </div>
      </div>

      {/* Capacity table */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Event capacity</h2>
        <div className="space-y-4">
          {events.map((e) => {
            const ratio = eventSoldRatio(e);
            return (
              <div key={e.id}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium">{e.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50">
                      {Math.round(ratio * 100)}% sold
                    </span>
                    <StatusBadge status={e.status} />
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-pink"
                    style={{ width: `${Math.min(100, ratio * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
