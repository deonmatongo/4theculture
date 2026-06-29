import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-4 bg-grid-glow text-center">
      <div>
        <Sparkles className="mx-auto h-10 w-10 text-neon-pink" />
        <h1 className="font-display text-6xl font-extrabold mt-4 text-gradient">
          404
        </h1>
        <p className="text-white/60 mt-2">
          This page wandered off to the afterparty.
        </p>
        <Link href="/" className="btn-neon mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}
