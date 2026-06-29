"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/store";
import { ADMIN_CREDENTIALS } from "@/lib/data";

export default function AdminLoginPage() {
  const router = useRouter();
  const { authed, login } = useAuth();
  const [email, setEmail] = useState(ADMIN_CREDENTIALS.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (mounted && authed) router.replace("/admin");
  }, [mounted, authed, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password
    ) {
      login(email.trim().toLowerCase());
      router.replace("/admin");
    } else {
      setError("Invalid credentials. Try the demo login below.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-grid-glow">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-display font-extrabold text-2xl">
            <span className="text-gradient">4theculture</span>
          </div>
          <p className="text-white/50 mt-2">Team Admin Console</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="h-5 w-5 text-neon-cyan" />
            <h1 className="font-display text-xl font-bold">Secure sign in</h1>
          </div>

          <label className="block mb-4">
            <span className="text-xs uppercase tracking-widest text-white/40">
              Email
            </span>
            <input
              type="email"
              className="input-field mt-1.5"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-widest text-white/40">
              Password
            </span>
            <input
              type="password"
              className="input-field mt-1.5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-white/10 border border-white/25 px-3 py-2 text-sm text-white/80">
              {error}
            </p>
          )}

          <button type="submit" className="btn-neon w-full mt-6">
            <Lock className="h-4 w-4" /> Sign in
          </button>

          <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/50">
            <p className="font-semibold text-white/70 mb-1">Demo credentials</p>
            <p>Email: <span className="text-neon-cyan">{ADMIN_CREDENTIALS.email}</span></p>
            <p>Password: <span className="text-neon-cyan">{ADMIN_CREDENTIALS.password}</span></p>
          </div>
        </form>
      </div>
    </div>
  );
}
