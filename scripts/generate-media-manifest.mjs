// Generates lib/media-manifest.json from the files in public/images.
//
// Runs automatically before `next build` (see the "prebuild" npm script).
// At runtime on serverless platforms (e.g. Vercel) the public/ folder isn't
// always readable via fs, so lib/media.ts falls back to this manifest. The
// actual files are still served as static assets by URL.

import { readdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const mediaDir = join(root, "public", "images");
const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const VIDEO_RE = /\.(mp4|mov|webm|m4v)$/i;

let files = [];
try {
  files = readdirSync(mediaDir);
} catch {
  files = [];
}

// Newest first (instaloader/gallery-dl use sortable numeric ids).
const sorted = files.filter((f) => !f.startsWith(".")).sort().reverse();
const toUrl = (f) => `/images/${encodeURIComponent(f)}`;

const manifest = {
  images: sorted.filter((f) => IMAGE_RE.test(f)).map(toUrl),
  videos: sorted.filter((f) => VIDEO_RE.test(f)).map(toUrl),
};

writeFileSync(
  join(root, "lib", "media-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log(
  `media manifest: ${manifest.images.length} images, ${manifest.videos.length} videos`
);
