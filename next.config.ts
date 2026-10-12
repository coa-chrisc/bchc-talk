import type { NextConfig } from "next";

/**
 * The path the deck is served under: empty for `npm run dev`, "/bchc-talk"
 * for the GitHub Pages build (.github/workflows/pages.yml sets it).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // A static site in out/: GitHub Pages serves files and runs no server.
  output: "export",
  basePath,
  // Each page is written as a folder's index.html (out/notes/index.html), which Pages serves at /notes/.
  trailingSlash: true,
  // No image server on Pages: images are served as the files in public/.
  images: { unoptimized: true },
  // Inlined into the client bundle, so src/lib/base-path.ts reads the same value even when it is unset.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
