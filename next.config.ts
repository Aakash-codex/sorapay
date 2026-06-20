import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sorapay",
  assetPrefix: "/sorapay",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
