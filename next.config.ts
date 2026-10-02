import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    KAKAO_MAP_API_KEY: process.env.KAKAO_MAP_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
