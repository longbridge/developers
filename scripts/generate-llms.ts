/**
 * generate-llms — no-op (handled by Astro endpoints).
 *
 * llms.txt and llms-full.txt are emitted at build time by:
 *   src/pages/llms.txt.ts
 *   src/pages/llms-full.txt.ts
 *
 * This script is retained as a named entry point for backward-compatible
 * package.json scripts but performs no work.
 */

console.log('[generate-llms] llms.txt and llms-full.txt are handled by Astro build endpoints — nothing to do.')
