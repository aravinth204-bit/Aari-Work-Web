import type { NextConfig } from "next";

// Hosts the gallery API is allowed to store. `next/image` needs the same list
// at build time, so this is read from the environment during the build.
const galleryHosts = (process.env.GALLERY_IMAGE_HOSTS ?? "")
  .split(",")
  .map((host) => host.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.1.5'],
  images: {
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
};

export default nextConfig;
