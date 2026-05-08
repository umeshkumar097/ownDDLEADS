import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone', // Removed to see if it fixes the build artifacts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;
