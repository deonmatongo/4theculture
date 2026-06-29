"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarRange,
  Users,
  QrCode,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/events", label: "Events & Tickets", icon: CalendarRange },
  { href: "/admin/bookings", label: "Bookings & Guestlist", icon: Users },
  { href: "/admin/checkin", label: "QR Check-In", icon: QrCode },
];

/**
 * Protects every /admin route behind the mock auth gate and renders the
 * dashboard chrome (sidebar + topbar). The login page is rendered bare.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { authed, email, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Wait for zustand to rehydrate from localStorage before deciding auth.
  useEffect(() => setMounted(true), []);

  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (mounted && !authed && !isLogin) router.replace("/admin/login");
  }, [mounted, authed, isLogin, router]);

  // Login page: no chrome, no guard.
  if (isLogin) return <>{children}</>;

  if (!mounted || !authed) {
    return (
      <div className="min-h-screen grid place-items-center text-white/50">
        <div className="animate-pulse">Securing dashboard…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[260px] glass-strong border-r border-white/10 p-5 flex flex-col transition-transform lg:static lg:translate-x-0",
          navOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 font-display font-extrabold">
            <span className="text-gradient">4theculture</span>
          </Link>
          <button
            className="lg:hidden p-1"
            onClick={() => setNavOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">
          Admin Console
        </p>

        <nav className="mt-8 space-y-1 flex-1">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-gradient-to-r from-neon-purple/30 to-neon-pink/20 text-white border border-white/10"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 hover:text-white px-3 py-2"
          >
            <ExternalLink className="h-4 w-4" /> View public site
          </Link>
          <button
            onClick={() => {
              logout();
              router.replace("/admin/login");
            }}
            className="flex w-full items-center gap-2 text-sm text-white/50 hover:text-neon-pink px-3 py-2"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
          <p className="px-3 text-[11px] text-white/30 truncate">{email}</p>
        </div>
      </aside>

      {navOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex flex-col min-h-screen">
        <header className="lg:hidden flex items-center gap-3 glass-strong border-b border-white/10 px-4 h-14">
          <button onClick={() => setNavOpen(true)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-display font-bold text-gradient">
            4theculture Admin
          </span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
