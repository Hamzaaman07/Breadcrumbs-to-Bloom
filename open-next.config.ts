import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Adapts the Next.js build output to run as a Cloudflare Worker.
// Defaults are deliberate: this site has no ISR/on-demand revalidation and no
// server-side cache to wire up — pages are either statically prerendered or
// rendered per request. See wrangler.jsonc for the Worker's runtime settings.
export default defineCloudflareConfig();
