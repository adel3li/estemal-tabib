import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // cacheComponents / partialPrefetching are OFF on purpose: with them on,
  // pages hang on the Cloudflare Workers runtime (see DECISIONS.md #2).
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

// Lets `next dev` read Cloudflare bindings (env vars, later R2) locally.
initOpenNextCloudflareForDev();
