"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PALETTE = ["#9d4edd", "#ff2e9a", "#22d3ee", "#a3ff12"];

const tooltipStyle = {
  background: "rgba(18,16,31,0.95)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 12,
  color: "#fff",
  fontSize: 12,
};

/** Ticket-sales velocity over time (area/line chart). */
export function SalesVelocityChart({
  data,
}: {
  data: Array<{ date: string; tickets: number; revenue: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9d4edd" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#9d4edd" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#ff2e9a" }} />
        <Area
          type="monotone"
          dataKey="tickets"
          stroke="#b65cff"
          strokeWidth={2.5}
          fill="url(#salesFill)"
          name="Tickets"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/** Revenue by event (bar chart). */
export function RevenueByEventChart({
  data,
}: {
  data: Array<{ name: string; revenue: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.4)"
          fontSize={11}
          tickLine={false}
          interval={0}
          tickFormatter={(v: string) => (v.length > 12 ? v.slice(0, 11) + "…" : v)}
        />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} name="Revenue">
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
