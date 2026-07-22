import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
      },
    ],
  },
  // allowedDevOrigins: ['192.168.18.13']
}

export default nextConfig
