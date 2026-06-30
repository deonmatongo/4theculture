"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function computeTimeLeft(target: number): TimeLeft {
  const diff = target - Date.now();
  if (diff <= 0)
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
}

/**
 * Live countdown to a target ISO datetime. Renders four glassy time blocks.
 * Mounts client-side only to avoid SSR/CSR hydration mismatch on the clock.
 */
export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(computeTimeLeft(targetMs));
    const id = setInterval(() => setTime(computeTimeLeft(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const blocks = [
    { label: "Days", value: time?.days },
    { label: "Hours", value: time?.hours },
    { label: "Minutes", value: time?.minutes },
    { label: "Seconds", value: time?.seconds },
  ];

  if (time?.done) {
    return (
      <div className="text-gradient text-2xl font-bold">
        🔥 Happening now — doors are open!
      </div>
    );
  }

  return (
    <div className="flex w-full gap-2 sm:w-auto sm:gap-4">
      {blocks.map((b) => (
        <div
          key={b.label}
          className="glass flex-1 rounded-2xl px-2 py-3 text-center min-w-0 sm:min-w-[84px] sm:flex-none sm:px-5 sm:py-4"
        >
          <div className="text-xl font-bold tabular-nums text-gradient sm:text-4xl">
            {b.value === undefined ? "––" : String(b.value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-white/50 sm:text-xs">
            {b.label}
          </div>
        </div>
      ))}
    </div>
  );
}
