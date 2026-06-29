"use client";

import { useEffect, useRef, useState } from "react";
import {
  QrCode,
  Camera,
  CameraOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ScanLine,
  Loader2,
} from "lucide-react";
import type { Booking } from "@/lib/types";
import { checkIn, useAdminData } from "@/lib/api";
import { cn, formatEventDate } from "@/lib/utils";

type ScanResult = {
  ok: boolean;
  reason?: string;
  message: string;
  booking?: Booking;
} | null;

/**
 * Mobile-friendly on-site check-in tool.
 * Staff can either tap a ticket from the live list ("simulate scan"),
 * paste a scanned QR payload / booking id, or open the device camera.
 * Each scan validates against the backend and flips status to "Checked In",
 * rejecting duplicates so a ticket can't be used twice.
 */
export function CheckInScanner() {
  const { bookings, loading, refresh } = useAdminData();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<ScanResult>(null);
  const [busy, setBusy] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const total = bookings.length;
  const checkedIn = bookings.filter((b) => b.status === "Checked In").length;

  // Manage the camera stream lifecycle.
  useEffect(() => {
    if (!cameraOn) return;
    let cancelled = false;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraOn(false));
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOn]);

  /** Accepts a raw QR payload (JSON) or a bare booking id. */
  function parseCode(raw: string): string {
    const trimmed = raw.trim();
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed?.id) return String(parsed.id);
    } catch {
      /* not JSON — treat as bare id */
    }
    return trimmed;
  }

  async function handleScan(raw: string) {
    const id = parseCode(raw);
    if (!id) return;
    setBusy(true);
    const res = await checkIn(id);
    setResult(res);
    setCode("");
    setBusy(false);
    refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header>
        <h1 className="font-display text-3xl font-bold">QR Check-In</h1>
        <p className="text-white/50 mt-1">
          Scan tickets at the door. Duplicates are blocked automatically.
        </p>
      </header>

      {/* Live counters */}
      <div className="grid grid-cols-3 gap-3">
        <Counter label="Checked in" value={checkedIn} accent="text-neon-lime" />
        <Counter label="Total sold" value={total} accent="text-neon-cyan" />
        <Counter
          label="Remaining"
          value={Math.max(0, total - checkedIn)}
          accent="text-neon-pink"
        />
      </div>

      {/* Scanner */}
      <div className="glass-strong rounded-2xl p-6">
        {/* Camera viewport */}
        <div className="relative aspect-square sm:aspect-video rounded-xl overflow-hidden bg-ink-950 grid place-items-center">
          {cameraOn ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
              />
              {/* Scan reticle */}
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="relative h-48 w-48 rounded-2xl border-2 border-neon-cyan/70">
                  <ScanLine className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-44 w-44 text-neon-cyan/30 animate-pulse" />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-white/40 p-6">
              <QrCode className="mx-auto h-12 w-12" />
              <p className="mt-2 text-sm">
                Camera off — use manual entry or tap a ticket below.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={() => setCameraOn((c) => !c)}
          className="btn-ghost w-full mt-4"
        >
          {cameraOn ? (
            <>
              <CameraOff className="h-4 w-4" /> Stop camera
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" /> Start camera
            </>
          )}
        </button>

        {/* Manual entry */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleScan(code);
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter / paste ticket code (e.g. 4TC-1001)"
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="btn-neon !px-5 disabled:opacity-40"
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : "Validate"}
          </button>
        </form>

        {/* Result banner */}
        {result && <ResultBanner result={result} />}
      </div>

      {/* Quick-scan list */}
      <div className="glass rounded-2xl p-5">
        <h2 className="font-semibold mb-3">
          Quick scan{" "}
          <span className="text-white/40 text-sm font-normal">
            (tap to simulate a scan)
          </span>
        </h2>
        {loading ? (
          <p className="text-white/50 text-sm">Loading tickets…</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {bookings.map((b) => {
              const done = b.status === "Checked In";
              return (
                <button
                  key={b.id}
                  onClick={() => handleScan(b.id)}
                  disabled={busy}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition",
                    done
                      ? "bg-neon-lime/10 border border-neon-lime/20"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <div>
                    <p className="font-medium text-sm">{b.customerName}</p>
                    <p className="text-xs text-white/40">
                      {b.eventTitle} · {formatEventDate(b.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[11px] text-white/40">
                      {b.id}
                    </span>
                    {done && (
                      <CheckCircle2 className="h-4 w-4 text-neon-lime" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Counter({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="glass rounded-2xl p-4 text-center">
      <div className={cn("text-3xl font-bold tabular-nums", accent)}>
        {value}
      </div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </div>
  );
}

function ResultBanner({ result }: { result: NonNullable<ScanResult> }) {
  const isDuplicate = result.reason === "already_checked_in";
  const Icon = result.ok ? CheckCircle2 : isDuplicate ? AlertTriangle : XCircle;
  // Monochrome states differentiated by brightness (icons carry the meaning):
  //   valid → solid white, duplicate → mid grey, denied → dim outline.
  const tone = result.ok
    ? "bg-white text-ink-950 border-white"
    : isDuplicate
    ? "bg-white/15 border-white/40 text-white"
    : "bg-white/5 border-white/25 text-white/70";

  return (
    <div className={cn("mt-4 rounded-xl border p-4 flex items-start gap-3", tone)}>
      <Icon className="h-6 w-6 shrink-0" />
      <div>
        <p className="font-semibold">{result.message}</p>
        {result.booking && (
          <p className="text-sm opacity-80 mt-0.5">
            {result.booking.customerName} · {result.booking.eventTitle}
            {result.booking.checkedInAt &&
              ` · in at ${new Date(
                result.booking.checkedInAt
              ).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}`}
          </p>
        )}
      </div>
    </div>
  );
}
