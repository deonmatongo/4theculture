import { cn } from "@/lib/utils";

/** Single KPI card for the admin overview. */
export function MetricCard({
  label,
  value,
  delta,
  icon,
  accent = "purple",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ReactNode;
  accent?: "purple" | "pink" | "cyan" | "lime";
}) {
  const ring: Record<string, string> = {
    purple: "from-neon-purple/30 text-neon-violet",
    pink: "from-neon-pink/30 text-neon-pink",
    cyan: "from-neon-cyan/30 text-neon-cyan",
    lime: "from-neon-lime/30 text-neon-lime",
  };
  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden">
      <div
        className={cn(
          "absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl opacity-40",
          ring[accent]
        )}
      />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">{label}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
          {delta && <p className="mt-1 text-xs text-neon-lime">{delta}</p>}
        </div>
        <div className={cn("rounded-xl bg-white/5 p-2.5", ring[accent])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
