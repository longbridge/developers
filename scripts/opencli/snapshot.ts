#!/usr/bin/env bun
/**
 * snapshot.ts — Reference implementation for per-URL HTML + screenshot capture.
 *
 * ⚠ REFERENCE IMPLEMENTATION — This script documents what a T18 MCP-driven
 * caller should do, but does NOT directly invoke chrome-devtools MCP tools.
 * The canonical agent flow uses `mcp__chrome-devtools__*` tools directly.
 * See README.md §"MCP-Driven Canonical Flow" for the authoritative invocation shape.
 *
 * Usage (standalone Bun mode — fetches HTML only, no screenshots):
 *   bun run scripts/opencli/snapshot.ts <baseUrl> <routesJson> [--out-dir <dir>]
 *   bun run scripts/opencli/snapshot.ts --help
 *
 * In standalone mode this script uses `fetch()` to capture raw HTML.
 * For pixel-accurate screenshots, the T18 agent invokes mcp__chrome-devtools__*
 * tools directly and passes the resulting files to snapshot's output directory.
 *
 * Output directory layout (per call):
 *   <outDir>/
 *     <slug>.html        — raw HTML body
 *     <slug>.png         — screenshot (only if captured via MCP; empty otherwise)
 *     manifest.json      — { url, slug, htmlPath, pngPath, capturedAt }[]
 */

import { join, dirname } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";

export interface SnapshotManifestEntry {
  url: string;
  slug: string;
  htmlPath: string;
  pngPath: string | null;
  capturedAt: string;
}

/** Derive a filesystem-safe slug from a URL path. */
export function urlToSlug(url: string): string {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }
  return path
    .replace(/^\//, "")
    .replace(/\//g, "__")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "index";
}

/**
 * Capture HTML for a single URL via fetch().
 * In MCP-driven mode the agent captures via navigate_page + get_document instead.
 *
 * MCP equivalent (T18 agent):
 *   await mcp__chrome-devtools__navigate_page({ type: "url", url })
 *   const snap = await mcp__chrome-devtools__take_screenshot({ filePath: pngPath })
 *   const html = await mcp__chrome-devtools__evaluate_script({
 *     function: "() => document.documentElement.outerHTML"
 *   })
 */
export async function captureHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "opencli/snapshot 1.0 (+bun)" },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  return res.text();
}

/**
 * Snapshot a list of routes into outDir.
 * Screenshots are NOT captured here — MCP agent writes them to outDir/<slug>.png separately.
 */
export async function snapshotRoutes(
  baseUrl: string,
  routes: Array<{ url: string }>,
  outDir: string,
): Promise<SnapshotManifestEntry[]> {
  mkdirSync(outDir, { recursive: true });
  const manifest: SnapshotManifestEntry[] = [];

  for (const route of routes) {
    const url = route.url.startsWith("http")
      ? route.url
      : new URL(route.url, baseUrl).toString();
    const slug = urlToSlug(url);
    const htmlPath = join(outDir, `${slug}.html`);
    const pngPath = join(outDir, `${slug}.png`);

    try {
      const html = await captureHtml(url);
      writeFileSync(htmlPath, html, "utf-8");
      // PNG is not captured in standalone mode; MCP agent fills it separately.
      manifest.push({
        url,
        slug,
        htmlPath,
        pngPath: null, // populated by MCP agent; see README.md
        capturedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn(`[snapshot] skipped ${url}: ${(err as Error).message}`);
    }
  }

  writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
  return manifest;
}

// ---- CLI main ----

function printHelp() {
  console.log(`
snapshot.ts — capture HTML (and optionally screenshots) for a list of routes.

NOTE: This is a reference implementation. For pixel-accurate screenshots,
use T18's MCP-driven flow (see README.md §"MCP-Driven Canonical Flow").

Usage:
  bun run scripts/opencli/snapshot.ts <baseUrl> <routesJson> [options]
  bun run scripts/opencli/snapshot.ts --help

Arguments:
  <baseUrl>       Base URL for resolving relative routes (e.g. http://localhost:5173)
  <routesJson>    Path to JSON file with { routes: [{ url }] } (from crawl-routes.ts)

Options:
  --out-dir <dir>  Output directory (default: dist-diff/snapshots)
  --help           Show this help
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const positional = args.filter((a) => !a.startsWith("--"));
  const outDirIdx = args.indexOf("--out-dir");
  const outDir = outDirIdx !== -1 ? args[outDirIdx + 1] : "dist-diff/snapshots";

  if (positional.length < 2) {
    console.error("Error: baseUrl and routesJson are required. Run --help for usage.");
    process.exit(1);
  }

  const [baseUrl, routesJsonPath] = positional;
  const routesJson = JSON.parse(await Bun.file(routesJsonPath).text());
  const routes: Array<{ url: string }> = routesJson.routes ?? routesJson;

  console.log(`Snapshotting ${routes.length} routes from ${baseUrl} → ${outDir}`);
  const manifest = await snapshotRoutes(baseUrl, routes, outDir);
  console.log(`Done. ${manifest.length} snapshots written to ${outDir}/manifest.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
