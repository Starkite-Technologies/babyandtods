import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: ["@babies-tods/shared"]
};

export default nextConfig;
