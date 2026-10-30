import type { NextConfig } from "next";

// Hosts the gallery API is allowed to store. `next/image` needs the same list
// at build time, so this is read from the environment during the build.
const galleryHosts = (process.env.GALLERY_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.5'],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      ...galleryHosts.map((hostname) => ({
        protocol: 'https' as const,
        hostname,
      })),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
