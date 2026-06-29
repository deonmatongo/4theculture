import type { Booking, EventItem } from "./types";

/**
 * Seed data for the 4theculture demo. The mock backend (lib/db.ts) clones
 * these on first access so the app is fully interactive on first load.
 *
 * Event dates are intentionally in the near future relative to mid-2026 so the
 * homepage countdown always has something to tick down to.
 */

const img = (id: string, w = 1200, h = 800) =>
  `https://picsum.photos/seed/${id}/${w}/${h}`;

export const seedEvents: EventItem[] = [
  {
    id: "evt_neon_jungle",
    slug: "neon-jungle-rooftop",
    title: "Neon Jungle — Rooftop Edition",
    category: "Parties",
    date: "2026-07-18T21:00:00.000Z",
    venue: "The Skyline Loft",
    city: "Poznań, Poland",
    description:
      "Our flagship summer rave returns to the rooftop. Three rooms of sound, immersive light installations, and the skyline as your backdrop. Dress to glow — this is where the culture comes alive after dark.",
    lineup: ["DJ Marsh", "AMARA", "Kweku Beats", "Selecta Vee"],
    dressCode: "Neon / Streetwear — glow encouraged",
    coverImage: img("neonjungle", 1600, 900),
    gallery: [img("nj1"), img("nj2"), img("nj3"), img("nj4")],
    capacity: 600,
    status: "Selling Fast",
    featured: true,
    tiers: [
      {
        id: "tier_nj_early",
        name: "Early Bird",
        price: 35,
        capacity: 150,
        sold: 142,
        active: true,
        description: "Limited release. First through the doors.",
      },
      {
        id: "tier_nj_ga",
        name: "General Admission",
        price: 55,
        capacity: 350,
        sold: 188,
        active: true,
        description: "Full access to all three rooms.",
      },
      {
        id: "tier_nj_vip",
        name: "VIP Table",
        price: 480,
        capacity: 20,
        sold: 11,
        active: true,
        description: "Reserved table for up to 6, bottle service, skybox view.",
      },
    ],
  },
  {
    id: "evt_sunday_service",
    slug: "sunday-service-cookout",
    title: "Sunday Service — The Cookout",
    category: "Community",
    date: "2026-07-05T16:00:00.000Z",
    venue: "Freedom Park Pavilion",
    city: "Poznań, Poland",
    description:
      "A daytime community cookout celebrating food, family, and the founders of the culture. Live cooking, local vendors, kids' zone, and a sunset acoustic set. All ages welcome.",
    lineup: ["Live Band: The Gathering", "Chef Tunde", "Poet Laureate Nia"],
    dressCode: "Casual / Summer fits",
    coverImage: img("sundayservice", 1600, 900),
    gallery: [img("ss1"), img("ss2"), img("ss3"), img("ss4")],
    capacity: 400,
    status: "On Sale",
    tiers: [
      {
        id: "tier_ss_ga",
        name: "General Admission",
        price: 20,
        capacity: 320,
        sold: 96,
        active: true,
        description: "Entry + welcome drink.",
      },
      {
        id: "tier_ss_family",
        name: "Family Pack (4)",
        price: 60,
        capacity: 80,
        sold: 21,
        active: true,
        description: "Admission for four, includes kids' zone wristbands.",
      },
    ],
  },
  {
    id: "evt_live_sessions",
    slug: "live-sessions-vol-7",
    title: "Live Sessions Vol. 7",
    category: "Live Music",
    date: "2026-08-02T20:00:00.000Z",
    venue: "The Basement",
    city: "Poznań, Poland",
    description:
      "An intimate live-music showcase spotlighting rising artists across soul, afrobeats, and neo-R&B. Limited capacity, raw sound, unforgettable nights.",
    lineup: ["Sade Mae", "Olu & The Wave", "K. Reign", "Surprise Headliner"],
    dressCode: "Smart casual",
    coverImage: img("livesessions", 1600, 900),
    gallery: [img("ls1"), img("ls2"), img("ls3"), img("ls4")],
    capacity: 220,
    status: "On Sale",
    tiers: [
      {
        id: "tier_ls_ga",
        name: "General Admission",
        price: 40,
        capacity: 170,
        sold: 64,
        active: true,
        description: "Standing room, full show access.",
      },
      {
        id: "tier_ls_seated",
        name: "Reserved Seating",
        price: 75,
        capacity: 50,
        sold: 30,
        active: true,
        description: "Guaranteed seat, front-of-house.",
      },
    ],
  },
  {
    id: "evt_midnight_marauders",
    slug: "midnight-marauders-warehouse",
    title: "Midnight Marauders — Warehouse",
    category: "Parties",
    date: "2026-06-14T22:00:00.000Z",
    venue: "Westside Warehouse 9",
    city: "Poznań, Poland",
    description:
      "A sold-out warehouse takeover from earlier this season. Featured here in the gallery and as a reference for the analytics dashboard.",
    lineup: ["DJ Marsh", "Phantom", "BASSLINE"],
    dressCode: "All black everything",
    coverImage: img("midnight", 1600, 900),
    gallery: [img("mm1"), img("mm2"), img("mm3"), img("mm4")],
    capacity: 500,
    status: "Sold Out",
    tiers: [
      {
        id: "tier_mm_ga",
        name: "General Admission",
        price: 50,
        capacity: 450,
        sold: 450,
        active: false,
        description: "Sold out.",
      },
      {
        id: "tier_mm_vip",
        name: "VIP Table",
        price: 500,
        capacity: 50,
        sold: 50,
        active: false,
        description: "Sold out.",
      },
    ],
  },
];

/** Helper to build a booking quickly for the seed set. */
function mkBooking(
  id: string,
  evt: EventItem,
  name: string,
  email: string,
  phone: string,
  tierIdx: number,
  qty: number,
  status: Booking["status"],
  vip: boolean,
  createdAt: string,
  checkedInAt?: string
): Booking {
  const tier = evt.tiers[tierIdx];
  return {
    id,
    eventId: evt.id,
    eventTitle: evt.title,
    customerName: name,
    email,
    phone,
    lines: [
      {
        tierId: tier.id,
        tierName: tier.name,
        quantity: qty,
        unitPrice: tier.price,
      },
    ],
    total: tier.price * qty,
    status,
    vip,
    createdAt,
    checkedInAt,
  };
}

const [njg, ssc, lsv, mmw] = seedEvents;

export const seedBookings: Booking[] = [
  mkBooking("4TC-1001", njg, "Jordan Blake", "jordan.blake@example.com", "+1 404 555 0111", 1, 2, "Confirmed", false, "2026-06-10T14:22:00.000Z"),
  mkBooking("4TC-1002", njg, "Amina Cole", "amina.cole@example.com", "+1 404 555 0122", 2, 1, "Confirmed", true, "2026-06-11T18:02:00.000Z"),
  mkBooking("4TC-1003", njg, "Marcus Lee", "marcus.lee@example.com", "+1 404 555 0133", 0, 1, "Checked In", false, "2026-06-01T09:41:00.000Z", "2026-06-14T22:31:00.000Z"),
  mkBooking("4TC-1004", ssc, "Tasha Greene", "tasha.greene@example.com", "+1 404 555 0144", 0, 3, "Confirmed", false, "2026-06-12T12:10:00.000Z"),
  mkBooking("4TC-1005", ssc, "Devon Price", "devon.price@example.com", "+1 404 555 0155", 1, 1, "Pending", false, "2026-06-13T08:55:00.000Z"),
  mkBooking("4TC-1006", lsv, "Priya Nair", "priya.nair@example.com", "+1 404 555 0166", 1, 2, "Confirmed", true, "2026-06-09T20:30:00.000Z"),
  mkBooking("4TC-1007", lsv, "Chris Okafor", "chris.okafor@example.com", "+1 404 555 0177", 0, 1, "Confirmed", false, "2026-06-14T11:05:00.000Z"),
  mkBooking("4TC-1008", mmw, "Bianca Ruiz", "bianca.ruiz@example.com", "+1 404 555 0188", 0, 2, "Checked In", false, "2026-05-20T13:00:00.000Z", "2026-06-14T22:48:00.000Z"),
  mkBooking("4TC-1009", mmw, "Andre Thomas", "andre.thomas@example.com", "+1 404 555 0199", 1, 1, "Checked In", true, "2026-05-22T17:45:00.000Z", "2026-06-14T23:02:00.000Z"),
  mkBooking("4TC-1010", njg, "Leah Kim", "leah.kim@example.com", "+1 404 555 0210", 1, 4, "Confirmed", false, "2026-06-14T15:30:00.000Z"),
  mkBooking("4TC-1011", njg, "Samuel Boateng", "samuel.b@example.com", "+1 404 555 0221", 2, 1, "Pending", true, "2026-06-15T10:12:00.000Z"),
  mkBooking("4TC-1012", lsv, "Maya Johnson", "maya.j@example.com", "+1 404 555 0232", 0, 2, "Confirmed", false, "2026-06-15T19:48:00.000Z"),
];

/** Admin credentials for the mock auth gate (demo only). */
export const ADMIN_CREDENTIALS = {
  email: "admin@4theculture.com",
  password: "letmein",
};
