import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // remind me to remove this in production
  images: {
  remotePatterns: [
  {
    protocol: "https",
    hostname: "**",
  },
  ]
  },
  /* config options here */
};

export default nextConfig;
