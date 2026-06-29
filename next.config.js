/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Never bundle the downloaded media into serverless functions — it's served
  // as static assets. Without this the function size blows past Vercel's limit.
  experimental: {
    outputFileTracingExcludes: {
      "*": ["./public/images/**"],
    },
  },
  images: {
    // Allow remote placeholder imagery used across the demo.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

module.exports = nextConfig;
