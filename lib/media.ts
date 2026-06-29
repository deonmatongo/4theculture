import manifest from "./media-manifest.json";

/**
 * Returns downloaded Instagram media as web-servable URLs ("/images/<file>").
 *
 * The list comes from lib/media-manifest.json, generated at build time by
 * scripts/generate-media-manifest.mjs (npm "prebuild"/"predev"). We deliberately
 * do NOT read the filesystem at runtime: doing so makes Next's file tracer bundle
 * the entire public/images folder into every serverless function (blowing past
 * Vercel's 250MB function limit). The actual files are served statically by URL,
 * so the manifest only needs to provide the ordered list.
 *
 * To refresh after downloading new media, re-run the generator (it runs
 * automatically before `npm run dev` and `npm run build`).
 */

export interface LocalMedia {
  images: string[];
  videos: string[];
  hasMedia: boolean;
}

export function getLocalMedia(): LocalMedia {
  const images = manifest.images ?? [];
  const videos = manifest.videos ?? [];
  return { images, videos, hasMedia: images.length + videos.length > 0 };
}

/** First available real photo, for use as the homepage hero background. */
export function getHeroImage(): string | null {
  return getLocalMedia().images[0] ?? null;
}

/** First available real video, for use as the homepage hero background. */
export function getHeroVideo(): string | null {
  return getLocalMedia().videos[0] ?? null;
}
