#!/usr/bin/env bun
/**
 * crawl-routes.ts — Parse a sitemap XML and categorize its URLs.
 *
 * Usage:
 *   bun run scripts/opencli/crawl-routes.ts <sitemap.xml>
 *   bun run scripts/opencli/crawl-routes.ts --help
 *
 * Outputs JSON to stdout: { routes: Route[], byCategory: Record<string, Route[]> }
 */

export interface Route {
  url: string;
  category: string;
  locale: string;
  path: string;
}

type Category = "docs" | "api" | "pricing" | "home" | "other";

/**
 * Parse `<loc>` URLs from sitemap XML (flat or sitemapindex).
 * Handles both vitepress `sitemap.xml` and Astro `sitemap-index.xml` formats.
 */
export function parseSitemap(xml: string): string[] {
  const urls: string[] = [];
  // Match all <loc> entries regardless of namespace
  const locRegex = /<loc>(.*?)<\/loc>/g;
  let m: RegExpExecArray | null;
  while ((m = locRegex.exec(xml)) !== null) {
    const raw = m[1].trim();
    if (raw) urls.push(raw);
  }
  return urls;
}

/**
 * Categorize a URL into a broad content category.
 * Strips locale prefix (zh-CN, zh-HK) before matching.
 */
export function categorize(url: string): Category {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }

  // Strip leading locale prefix
  const localePrefix = /^\/(zh-CN|zh-HK)\//;
  const normalized = path.replace(localePrefix, "/");

  if (normalized === "/" || normalized === "") return "home";
  if (normalized.startsWith("/docs/api") || normalized.startsWith("/api"))
    return "api";
  if (normalized.startsWith("/docs/")) return "docs";
  if (normalized.startsWith("/pricing")) return "pricing";
  return "other";
}

/** Derive locale from URL path. */
function extractLocale(url: string): string {
  let path: string;
  try {
    path = new URL(url).pathname;
  } catch {
    path = url;
  }
  if (path.startsWith("/zh-CN")) return "zh-CN";
  if (path.startsWith("/zh-HK")) return "zh-HK";
  return "en";
}

function urlToPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

/** Build a Route array from a list of URLs. */
export function buildRoutes(urls: string[]): Route[] {
  return urls.map((url) => ({
    url,
    category: categorize(url),
    locale: extractLocale(url),
    path: urlToPath(url),
  }));
}

// ---- CLI main ----

function printHelp() {
  console.log(`
crawl-routes.ts — parse a sitemap XML and output categorized routes as JSON.

Usage:
  bun run scripts/opencli/crawl-routes.ts <sitemap.xml> [--pretty]
  bun run scripts/opencli/crawl-routes.ts --help

Arguments:
  <sitemap.xml>   Path to sitemap file (flat or sitemapindex format)
  --pretty        Pretty-print JSON output
  --help          Show this help

Output (JSON):
  { routes: Route[], byCategory: Record<string, Route[]>, total: number }
`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const pretty = args.includes("--pretty");
  const sitemapPath = args.find((a) => !a.startsWith("--"));

  if (!sitemapPath) {
    console.error("Error: no sitemap path provided.");
    process.exit(1);
  }

  const xml = await Bun.file(sitemapPath).text();
  const urls = parseSitemap(xml);
  const routes = buildRoutes(urls);

  const byCategory: Record<string, Route[]> = {};
  for (const r of routes) {
    (byCategory[r.category] ??= []).push(r);
  }

  const output = { total: routes.length, routes, byCategory };
  console.log(pretty ? JSON.stringify(output, null, 2) : JSON.stringify(output));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
