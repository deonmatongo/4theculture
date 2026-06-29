import fs from "fs";
import path from "path";
import manifest from "./media-manifest.json";

/**
 * Reads downloaded Instagram media from /public/images at request time
 * (server-only). Returns web-servable URLs like "/images/<file>".
 *
 * Until the download script has been run the folder is empty, so callers
 * should fall back to placeholder imagery when both lists are empty.
 */

const MEDIA_DIR = path.join(process.cwd(), "public", "images");
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const VIDEO_RE = /\.(mp4|mov|webm|m4v)$/i;

export interface LocalMedia {
  images: string[];
  videos: string[];
  hasMedia: boolean;
}

function toUrl(file: string): string {
  // Encode each segment so shortcodes / spaces survive in the URL.
  return `/images/${encodeURIComponent(file)}`;
}

export function getLocalMedia(): LocalMedia {
  let files: string[] = [];
  try {
    files = fs.readdirSync(MEDIA_DIR);
  } catch {
    // Folder missing — treat as empty.
    files = [];
  }

  // Newest first: filenames carry sortable numeric ids, so a reverse
  // lexicographic sort puts the most recent posts on top.
  const sorted = files.filter((f) => !f.startsWith(".")).sort().reverse();

  let images = sorted.filter((f) => IMAGE_RE.test(f)).map(toUrl);
  let videos = sorted.filter((f) => VIDEO_RE.test(f)).map(toUrl);

  // Fallback to the build-time manifest when fs can't see public/images
  // (e.g. serverless runtime on Vercel). The files themselves are still
  // served statically by URL, so these paths resolve fine.
  if (images.length + videos.length === 0) {
    images = manifest.images ?? [];
    videos = manifest.videos ?? [];
  }

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
