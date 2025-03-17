import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  enabled: process.env.ANALYZE === 'true',
  swcMinify: true,
  images: {
    domains: ['bpc-pos.s3.ap-southeast-1.amazonaws.com'],
  },
};

export default nextConfig;
