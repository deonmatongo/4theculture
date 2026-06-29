import type { EventStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Colour-coded status pill for event cards & tables. */
export function StatusBadge({
  status,
  className,
}: {
  status: EventStatus;
  className?: string;
}) {
  const styles: Record<EventStatus, string> = {
    "On Sale": "bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30",
    "Selling Fast":
      "bg-neon-pink/15 text-neon-pink border border-neon-pink/30 animate-pulse-slow",
    "Sold Out": "bg-white/10 text-white/60 border border-white/15",
    Draft: "bg-white/5 text-white/50 border border-white/15",
  };
  return (
    <span className={cn("chip", styles[status], className)}>
      {status === "Selling Fast" && (
        <span className="h-1.5 w-1.5 rounded-full bg-neon-pink" />
      )}
      {status}
    </span>
  );
}
