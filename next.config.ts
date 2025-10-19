import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 部署不需要 output: 'export' 和 basePath
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
