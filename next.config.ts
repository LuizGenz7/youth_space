import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  serverExternalPackages: [
    "firebase-admin",
    "jwks-rsa",
    "jose",
  ],

  allowedDevOrigins: ["192.168.45.178"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.bbcchildreninneed.co.uk",
      },
      {
        protocol: "https",
        hostname: "bongohive.co.zm",
      },
    ],
  },
};

export default nextConfig;