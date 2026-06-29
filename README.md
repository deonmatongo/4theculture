# 4theculture 🎟️🔥

A full-stack, mobile-first web platform for the **4theculture** event-hosting
collective — a vibrant public ticketing experience plus a secure, data-driven
admin dashboard for managing events, bookings, and on-site entry.

Built with **Next.js 14 (App Router) · TypeScript · Tailwind CSS** and a
**mock Node backend** (in-memory store + REST API routes) so it's fully
interactive the moment you run it.

---

## ✨ Features

### Public site
- **Homepage** — bold hero, immersive media, and a live **countdown timer** to
  the next event with a "Get Tickets" CTA.
- **Events grid** — filterable by category (Parties / Live Music / Community)
  with status badges (`Selling Fast`, `Sold Out`).
- **Event detail + checkout** — rich layout (line-up, dress code, venue map
  placeholder), a **multi-tier ticket selector**, a checkout form, a simulated
  **Stripe** payment, and a **dynamic QR-code ticket** on success.
- **Shareable e-ticket** at `/ticket/[id]`.
- **Media gallery** — masonry photo wall + social video embed placeholders.

### Admin dashboard (`/admin`, protected)
- **Overview analytics** — KPI cards (revenue, tickets sold, active events,
  live attendance) + sales-velocity and revenue charts (Recharts).
- **Event & ticket manager** — table of events, a "Create New Event" modal,
  and live controls to toggle tiers on/off or change prices.
- **Bookings & guestlist** — searchable table, VIP guestlist toggle, and
  approve/reject for pending VIP requests.
- **QR check-in** — mobile-friendly scanner (camera stream + manual/tap entry)
  that validates a ticket and flips it to **Checked In**, blocking duplicates.

---

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

### Admin login
Visit <http://localhost:3000/admin> and sign in with the demo credentials:

| Email                    | Password  |
| ------------------------ | --------- |
| `admin@4theculture.com`  | `letmein` |

---

## 🧱 Architecture

```
app/
  page.tsx                 # Homepage (hero + countdown + featured)
  events/                  # Listing + [slug] detail/checkout
  ticket/[id]/             # Shareable QR e-ticket
  gallery/                 # Media gallery
  admin/                   # Protected dashboard (overview, events, bookings, checkin)
  api/                     # Mock Node backend (events, bookings, checkin, tiers)
components/
  site/                    # Public chrome (navbar, footer, frame, explorer)
  checkout/                # CheckoutPanel (3-step flow) + TicketView
  admin/                   # Shell, metric cards, charts, modals, scanner
  EventCard, Countdown, StatusBadge
lib/
  types.ts                 # Domain models
  data.ts                  # Seed data (4 events, 12 bookings) + admin creds
  db.ts                    # In-memory store singleton (mutations live here)
  api.ts                   # Client fetch helpers + useAdminData hook
  store.ts                 # Zustand: cart + admin auth (persisted)
  utils.ts                 # Formatting helpers
```

### State management
- **Cart** and **admin auth** use **Zustand** with `localStorage` persistence.
- Server data lives in a **singleton in-memory store** (`lib/db.ts`) seeded from
  `lib/data.ts`. All reads/writes route through it, exposed via `/app/api/*`.
- Swapping in **Supabase / Firebase / Postgres** later means reimplementing the
  functions in `lib/db.ts` — the API surface and UI stay unchanged.

> ⚠️ The in-memory store resets when the dev server restarts. That's expected
> for a demo. For real persistence, wire `lib/db.ts` to a database.

---

## 🎨 Design

Dark-mode dominant with neon accents (electric purple, hot pink, cyan),
glassmorphism surfaces, gradient typography, and a 100% mobile-first responsive
layout. Design tokens live in `tailwind.config.ts` and `app/globals.css`.
