import type { NextConfig } from "next";

// Served from https://SebL2.github.io/portfolio/ in production, so all routes and
// assets live under this subpath. Empty in local dev. Single source of truth — the
// same value is read by client code that builds raw asset URLs (e.g. climb frames).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export for GitHub Pages (no Node server available).
  output: "export",
  basePath,
  // next/image's default optimizer needs a server; disable it for the static export.
  images: { unoptimized: true },
};

export default nextConfig;
