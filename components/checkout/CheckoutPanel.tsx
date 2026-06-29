"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Minus,
  Plus,
  Lock,
  CreditCard,
  CheckCircle2,
  Ticket,
  Loader2,
  Download,
  PartyPopper,
} from "lucide-react";
import type { Booking, CartLine, EventItem } from "@/lib/types";
import { useCart } from "@/lib/store";
import { cn, currency, tierRemaining } from "@/lib/utils";

type CartLines = Record<string, CartLine>;
type SetQuantity = (line: Omit<CartLine, "quantity">, quantity: number) => void;

type Step = "select" | "checkout" | "success";

/**
 * Self-contained ticket checkout flow for a single event:
 *   1. select  — pick quantities across active tiers (cart state in zustand)
 *   2. checkout — Name / Email / Phone + simulated Stripe payment
 *   3. success — booking confirmation with a scannable QR code
 */
export function CheckoutPanel({ event }: { event: EventItem }) {
  const { lines, setEvent, setQuantity, clear, totalQuantity, totalAmount } =
    useCart();
  const [step, setStep] = useState<Step>("select");
  const [booking, setBooking] = useState<Booking | null>(null);

  // Bind the cart to this event (resets if you navigate between events).
  useEffect(() => {
    setEvent(event.id);
  }, [event.id, setEvent]);

  const qty = totalQuantity();
  const amount = totalAmount();
  const soldOut = event.status === "Sold Out";
  const activeTiers = event.tiers.filter((t) => t.active);

  return (
    <div className="glass-strong rounded-2xl p-6">
      {step === "select" && (
        <SelectStep
          event={event}
          activeTiers={activeTiers}
          soldOut={soldOut}
          lines={lines}
          setQuantity={setQuantity}
          qty={qty}
          amount={amount}
          onContinue={() => setStep("checkout")}
        />
      )}

      {step === "checkout" && (
        <CheckoutStep
          event={event}
          amount={amount}
          qty={qty}
          onBack={() => setStep("select")}
          onComplete={(b) => {
            setBooking(b);
            setStep("success");
            clear();
          }}
        />
      )}

      {step === "success" && booking && <SuccessStep booking={booking} />}
    </div>
  );
}

/* --------------------------- Step 1: select --------------------------- */

function SelectStep({
  event,
  activeTiers,
  soldOut,
  lines,
  setQuantity,
  qty,
  amount,
  onContinue,
}: {
  event: EventItem;
  activeTiers: EventItem["tiers"];
  soldOut: boolean;
  lines: CartLines;
  setQuantity: SetQuantity;
  qty: number;
  amount: number;
  onContinue: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold">Select tickets</h3>
        <Ticket className="h-5 w-5 text-neon-violet" />
      </div>

      {soldOut || activeTiers.length === 0 ? (
        <div className="rounded-xl bg-white/5 p-6 text-center text-white/60">
          <p className="font-semibold text-white/80">This event is sold out</p>
          <p className="text-sm mt-1">
            Join the waitlist on our socials for release drops.
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {activeTiers.map((tier) => {
              const remaining = tierRemaining(tier);
              const current = lines[tier.id]?.quantity ?? 0;
              const maxReached = current >= remaining;
              return (
                <div
                  key={tier.id}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{tier.name}</p>
                      {tier.description && (
                        <p className="text-xs text-white/50 mt-0.5">
                          {tier.description}
                        </p>
                      )}
                      <p className="text-sm font-bold text-neon-cyan mt-1">
                        {currency(tier.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <QtyButton
                        aria-label="Decrease"
                        disabled={current <= 0}
                        onClick={() =>
                          setQuantity(
                            {
                              tierId: tier.id,
                              tierName: tier.name,
                              unitPrice: tier.price,
                            },
                            current - 1
                          )
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </QtyButton>
                      <span className="w-6 text-center font-bold tabular-nums">
                        {current}
                      </span>
                      <QtyButton
                        aria-label="Increase"
                        disabled={maxReached}
                        onClick={() =>
                          setQuantity(
                            {
                              tierId: tier.id,
                              tierName: tier.name,
                              unitPrice: tier.price,
                            },
                            current + 1
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </QtyButton>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-white/40">
                    {remaining <= 20
                      ? `Only ${remaining} left`
                      : `${remaining} available`}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>{qty} ticket{qty === 1 ? "" : "s"}</span>
              <span className="text-lg font-bold text-white">
                {currency(amount)}
              </span>
            </div>
            <button
              disabled={qty === 0}
              onClick={onContinue}
              className="btn-neon w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Continue to checkout
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/40">
              <Lock className="h-3 w-3" /> Secure checkout · simulated payment
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function QtyButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 hover:bg-neon-purple/40 transition disabled:opacity-30 disabled:hover:bg-white/10"
    >
      {children}
    </button>
  );
}

/* -------------------------- Step 2: checkout -------------------------- */

function CheckoutStep({
  event,
  amount,
  qty,
  onBack,
  onComplete,
}: {
  event: EventItem;
  amount: number;
  qty: number;
  onBack: () => void;
  onComplete: (b: Booking) => void;
}) {
  const { lines } = useCart();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    form.name.trim() &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.phone.trim().length >= 7 &&
    card.number.replace(/\s/g, "").length >= 12 &&
    card.exp.trim() &&
    card.cvc.trim().length >= 3;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);

    // Simulate Stripe payment latency, then persist the booking.
    await new Promise((r) => setTimeout(r, 1400));

    try {
      const payload = {
        eventId: event.id,
        eventTitle: event.title,
        customerName: form.name,
        email: form.email,
        phone: form.phone,
        vip: Object.values(lines).some((l) =>
          l.tierName.toLowerCase().includes("vip")
        ),
        lines: Object.values(lines).map((l) => ({
          tierId: l.tierId,
          tierName: l.tierName,
          quantity: l.quantity,
          unitPrice: l.unitPrice,
        })),
        total: amount,
      };
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Payment could not be processed.");
      const { booking } = await res.json();
      onComplete(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handlePay}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold">Checkout</h3>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-white/50 hover:text-white"
        >
          ← Edit tickets
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Full name">
          <input
            className="input-field"
            placeholder="Jordan Blake"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            className="input-field"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field label="Phone">
          <input
            className="input-field"
            placeholder="+1 404 555 0100"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
      </div>

      {/* Simulated Stripe card element */}
      <div className="mt-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/70 mb-2">
          <CreditCard className="h-4 w-4 text-neon-violet" /> Card details
          <span className="ml-auto text-[10px] font-normal text-white/30">
            Powered by Stripe (demo)
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-ink-900/80 p-3 space-y-3">
          <input
            className="input-field !bg-transparent !border-0 !ring-0 !p-1"
            placeholder="4242 4242 4242 4242"
            inputMode="numeric"
            value={card.number}
            onChange={(e) =>
              setCard({ ...card, number: formatCard(e.target.value) })
            }
          />
          <div className="flex gap-3 border-t border-white/10 pt-3">
            <input
              className="input-field !bg-transparent !border-0 !ring-0 !p-1"
              placeholder="MM / YY"
              value={card.exp}
              onChange={(e) => setCard({ ...card, exp: e.target.value })}
            />
            <input
              className="input-field !bg-transparent !border-0 !ring-0 !p-1"
              placeholder="CVC"
              inputMode="numeric"
              maxLength={4}
              value={card.cvc}
              onChange={(e) =>
                setCard({ ...card, cvc: e.target.value.replace(/\D/g, "") })
              }
            />
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg bg-white/10 border border-white/25 px-3 py-2 text-sm text-white/80">
          {error}
        </p>
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-white/60">
            {qty} ticket{qty === 1 ? "" : "s"} · Total
          </span>
          <span className="text-xl font-bold text-gradient">
            {currency(amount)}
          </span>
        </div>
        <button
          type="submit"
          disabled={!valid || submitting}
          className="btn-neon w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Processing…
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay {currency(amount)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-white/40">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function formatCard(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

/* --------------------------- Step 3: success -------------------------- */

function SuccessStep({ booking }: { booking: Booking }) {
  // The QR encodes the booking id; the on-site scanner validates against it.
  const payload = useMemo(
    () => JSON.stringify({ t: "4tc-ticket", id: booking.id }),
    [booking.id]
  );

  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-neon-lime/20">
        <CheckCircle2 className="h-8 w-8 text-neon-lime" />
      </div>
      <h3 className="font-display text-2xl font-bold mt-4 flex items-center justify-center gap-2">
        You're in! <PartyPopper className="h-5 w-5 text-neon-pink" />
      </h3>
      <p className="text-sm text-white/60 mt-1">
        Confirmation sent to {booking.email}
      </p>

      {/* Ticket / QR */}
      <div className="mt-6 rounded-2xl bg-white p-5 text-ink-950">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-ink-600">
          <span>4theculture</span>
          <span>E-Ticket</span>
        </div>
        <div className="my-4 grid place-items-center">
          <QRCodeSVG
            value={payload}
            size={168}
            level="M"
            bgColor="#ffffff"
            fgColor="#05040a"
          />
        </div>
        <p className="font-display font-bold leading-tight">
          {booking.eventTitle}
        </p>
        <p className="text-sm text-ink-600">{booking.customerName}</p>
        <div className="mt-3 border-t border-dashed border-ink-600/30 pt-3 text-left text-sm">
          {booking.lines.map((l) => (
            <div key={l.tierId} className="flex justify-between">
              <span>
                {l.quantity}× {l.tierName}
              </span>
              <span className="font-semibold">{currency(l.unitPrice * l.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-xs text-ink-600">
          <span>ID: {booking.id}</span>
          <span>{currency(booking.total)}</span>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <a
          href={`/ticket/${booking.id}`}
          className="btn-ghost w-full"
        >
          <Download className="h-4 w-4" /> View / save ticket
        </a>
        <a href="/events" className="block text-sm text-white/50 hover:text-white pt-1">
          Browse more events →
        </a>
      </div>
    </div>
  );
}
