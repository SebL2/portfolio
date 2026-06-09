import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (no Node server available).
  output: "export",
  // next/image's default optimizer needs a server; disable it for the static export.
  images: { unoptimized: true },
};

export default nextConfig;
