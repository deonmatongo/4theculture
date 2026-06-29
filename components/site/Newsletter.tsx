"use client";

import { useState } from "react";
import { Mail, Check, Send } from "lucide-react";

/**
 * Email capture for event drops. Simulated submit (no backend persistence) —
 * swap the handler for a real list provider (Mailchimp, Resend, etc.).
 */
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    setDone(true);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12">
      <div className="absolute inset-0 bg-grid-glow opacity-60" />
      <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="chip glass text-white/80 mb-4">
            <Mail className="h-3.5 w-3.5" />
            Never miss a drop
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold">
            Get on the <span className="text-gradient">guestlist</span>
          </h2>
          <p className="mt-3 max-w-md text-white/60">
            Early-bird releases, secret-location parties, and members-only
            presales — straight to your inbox. No spam, just the culture.
          </p>
        </div>

        <div>
          {done ? (
            <div className="flex items-center gap-3 rounded-2xl bg-white text-ink-950 p-5 font-semibold">
              <Check className="h-5 w-5" />
              You're on the list — see you on the dancefloor.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field flex-1"
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={!valid}
                className="btn-neon shrink-0 disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" /> Join
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-white/40">
            By joining you agree to receive occasional emails. Unsubscribe
            anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
