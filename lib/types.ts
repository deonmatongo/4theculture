/**
 * Shared domain types for the 4theculture platform.
 * These describe the shape of data flowing between the mock Node backend
 * (lib/db.ts + /app/api routes) and the React front-end.
 */

export type EventCategory = "Parties" | "Community" | "Live Music";

export type EventStatus = "On Sale" | "Selling Fast" | "Sold Out" | "Draft";

/** A single purchasable ticket tier within an event. */
export interface TicketTier {
  id: string;
  name: string; // e.g. "Early Bird", "General Admission", "VIP Table"
  price: number; // in the platform's base currency (USD)
  /** Total inventory for this tier. */
  capacity: number;
  /** Tickets already sold for this tier. */
  sold: number;
  /** Admins can toggle a tier off without deleting it. */
  active: boolean;
  description?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  /** ISO 8601 start datetime. */
  date: string;
  venue: string;
  city: string;
  description: string;
  lineup: string[];
  dressCode: string;
  coverImage: string;
  gallery: string[];
  capacity: number;
  status: EventStatus;
  tiers: TicketTier[];
  featured?: boolean;
}

export type BookingStatus = "Confirmed" | "Pending" | "Checked In" | "Cancelled";

/** A line item inside a booking: a quantity of a specific tier. */
export interface BookingLine {
  tierId: string;
  tierName: string;
  quantity: number;
  unitPrice: number;
}

export interface Booking {
  id: string; // also encoded into the QR payload
  eventId: string;
  eventTitle: string;
  customerName: string;
  email: string;
  phone: string;
  lines: BookingLine[];
  total: number;
  status: BookingStatus;
  vip: boolean;
  /** ISO timestamp of purchase. */
  createdAt: string;
  /** ISO timestamp of on-site check-in, if any. */
  checkedInAt?: string;
}

/** Item held in the checkout cart on a single event detail page. */
export interface CartLine {
  tierId: string;
  tierName: string;
  unitPrice: number;
  quantity: number;
}
