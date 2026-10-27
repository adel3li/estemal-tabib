import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Phase 1: no incremental cache binding (keeps us on the free plan with zero
// extra resources). Revisit when listing pages use ISR.
export default defineCloudflareConfig();
