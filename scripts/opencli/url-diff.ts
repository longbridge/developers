#!/usr/bin/env bun
/**
 * url-diff.ts — Compute symmetric difference between two sitemap URL sets.
 *
 * Usage:
 *   bun run scripts/opencli/url-diff.ts <old-sitemap.xml> <new-sitemap.xml>
 *   bun run scripts/opencli/url-diff.ts --help
 *
 * Exit codes:
 *   0 — URL sets are identical (A △ B = ∅) — hard gate passes
 *   1 — Sets differ; reports added/removed URLs to stdout
 *
 * This is the T18 URL gate:
 *   spec §5.5 / §9.2 require URL set A △ B = ∅ before promotion.
 */

import { parseSitemap } from "./crawl-routes.ts";

function printHelp() {
  console.log(`
url-diff.ts — compute symmetric difference between two sitemap URL sets.

Usage:
  bun run scripts/opencli/url-diff.ts <old-sitemap.xml> <new-sitemap.xml> [options]
  bun run scripts/opencli/url-diff.ts --help

Arguments:
  <old-sitemap.xml>   Baseline sitemap (e.g. vitepress dist/sitemap.xml)
  <new-sitemap.xml>   Candidate sitemap (e.g. astro dist/sitemap-index.xml)

Options:
  --json     Output machine-readable JSON instead of human-readable text
  --help     Show this help

Exit codes:
  0   URL sets match (A △ B = ∅) — T18 URL hard gate passes
  1   Mismatch detected — inspect output for added/removed URLs
`);
}

/** Normalize a URL for comparison: strip trailing slash, lowercase origin. */
function normalizeUrl(url: string): string {
  try {
    const u = new URL(url);
    // Normalize to no-trailing-slash path, lowercased origin
    let path = u.pathname.replace(/\/$/, "") || "/";
    return u.origin.toLowerCase() + path;
  } catch {
    return url.trim().replace(/\/$/, "");
  }
}

/** Strip origin so we compare only paths — handles baseline/candidate origin mismatch. */
function pathOnly(url: string): string {
  try {
    return new URL(url).pathname.replace(/\/$/, "") || "/";
  } catch {
    return url.trim().replace(/\/$/, "");
  }
}

export interface UrlDiffResult {
  same: boolean;
  oldCount: number;
  newCount: number;
  onlyInOld: string[];
  onlyInNew: string[];
}

/**
 * Compare two sets of URLs (from parsed sitemaps).
 * Comparison is path-only (ignores origin differences between vitepress / astro dev).
 */
export function diffUrls(oldUrls: string[], newUrls: string[]): UrlDiffResult {
  const oldPaths = new Set(oldUrls.map(pathOnly));
  const newPaths = new Set(newUrls.map(pathOnly));

  const onlyInOld = [...oldPaths].filter((p) => !newPaths.has(p)).sort();
  const onlyInNew = [...newPaths].filter((p) => !oldPaths.has(p)).sort();

  return {
    same: onlyInOld.length === 0 && onlyInNew.length === 0,
    oldCount: oldPaths.size,
    newCount: newPaths.size,
    onlyInOld,
    onlyInNew,
  };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const jsonMode = args.includes("--json");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length < 2) {
    console.error("Error: two sitemap paths required. Run with --help for usage.");
    process.exit(1);
  }

  const [oldPath, newPath] = positional;

  let oldXml: string;
  let newXml: string;
  try {
    oldXml = await Bun.file(oldPath).text();
  } catch {
    console.error(`Error: cannot read old sitemap: ${oldPath}`);
    process.exit(1);
  }
  try {
    newXml = await Bun.file(newPath).text();
  } catch {
    console.error(`Error: cannot read new sitemap: ${newPath}`);
    process.exit(1);
  }

  const oldUrls = parseSitemap(oldXml);
  const newUrls = parseSitemap(newXml);
  const result = diffUrls(oldUrls, newUrls);

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`Old sitemap: ${oldUrls.length} URLs`);
    console.log(`New sitemap: ${newUrls.length} URLs`);
    if (result.same) {
      console.log("✓ URL sets match — A △ B = ∅");
    } else {
      if (result.onlyInOld.length > 0) {
        console.log(`\nMissing in new (${result.onlyInOld.length} URLs):`);
        result.onlyInOld.forEach((u) => console.log(`  - ${u}`));
      }
      if (result.onlyInNew.length > 0) {
        console.log(`\nExtra in new (${result.onlyInNew.length} URLs):`);
        result.onlyInNew.forEach((u) => console.log(`  + ${u}`));
      }
      console.log(`\n✗ URL mismatch — T18 gate fails`);
    }
  }

  process.exit(result.same ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
