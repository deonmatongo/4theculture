"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "./types";

/**
 * Cart state — scoped to the event detail page checkout.
 * Persisted to localStorage so a refresh mid-checkout doesn't lose selection.
 */
interface CartState {
  eventId: string | null;
  lines: Record<string, CartLine>; // keyed by tierId
  setEvent: (eventId: string) => void;
  setQuantity: (line: Omit<CartLine, "quantity">, quantity: number) => void;
  clear: () => void;
  totalQuantity: () => number;
  totalAmount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      eventId: null,
      lines: {},
      setEvent: (eventId) => {
        // Switching events resets the cart.
        if (get().eventId !== eventId) set({ eventId, lines: {} });
      },
      setQuantity: (line, quantity) =>
        set((state) => {
          const lines = { ...state.lines };
          if (quantity <= 0) {
            delete lines[line.tierId];
          } else {
            lines[line.tierId] = { ...line, quantity };
          }
          return { lines };
        }),
      clear: () => set({ lines: {} }),
      totalQuantity: () =>
        Object.values(get().lines).reduce((s, l) => s + l.quantity, 0),
      totalAmount: () =>
        Object.values(get().lines).reduce(
          (s, l) => s + l.quantity * l.unitPrice,
          0
        ),
    }),
    { name: "4tc-cart" }
  )
);

/**
 * Admin auth — a deliberately simple mock gate for the protected /admin routes.
 * A real build would use Supabase Auth / NextAuth with httpOnly sessions; here
 * we persist an "authed" flag to localStorage to demonstrate route protection.
 */
interface AuthState {
  authed: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      authed: false,
      email: null,
      login: (email) => set({ authed: true, email }),
      logout: () => set({ authed: false, email: null }),
    }),
    { name: "4tc-admin-auth" }
  )
);
