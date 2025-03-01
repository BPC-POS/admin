import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  enabled: process.env.ANALYZE === 'true',
};

export default nextConfig;
