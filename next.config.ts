import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Enables Wrangler-provided bindings (e.g. `getCloudflareContext()`) when
// running `next dev` locally. This is a no-op in production/Workers.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
