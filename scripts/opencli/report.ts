#!/usr/bin/env bun
/**
 * report.ts — Aggregate diff results into a markdown report.
 *
 * Reads results from previous opencli script runs (URL diff, DOM diff, visual diff,
 * interaction assertions) and produces a combined markdown report.
 *
 * Usage:
 *   bun run scripts/opencli/report.ts [--results-dir <dir>] [--out-dir <dir>]
 *   bun run scripts/opencli/report.ts --help
 *
 * Output:
 *   <out-dir>/report.md  — Markdown summary with pass/fail per route + overall gate
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import type { UrlDiffResult } from "./url-diff.ts";
import type { DomDiffResult } from "./dom-diff.ts";
import type { VisualDiffResult } from "./visual-diff.ts";
import type { InteractionResult } from "./interaction-assertions.ts";

export interface RouteReport {
  url: string;
  slug: string;
  domDiff?: DomDiffResult;
  visualDiff?: VisualDiffResult;
  interactions?: InteractionResult[];
  pass: boolean;
}

export interface FullReport {
  generatedAt: string;
  urlDiff?: UrlDiffResult;
  routes: RouteReport[];
  totals: {
    total: number;
    passed: number;
    failed: number;
  };
  gatePass: boolean;
}

// ---- Helpers ----

function badge(pass: boolean): string {
  return pass ? "✅ PASS" : "❌ FAIL";
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function safeReadJson<T>(path: string): T | undefined {
  if (!existsSync(path)) return undefined;
  try {
    return JSON.parse(readFileSync(path, "utf-8")) as T;
  } catch {
    return undefined;
  }
}

// ---- Core export ----

/**
 * Generate a markdown report from route results and write to outDir/report.md.
 *
 * @param routes   Array of RouteReport (populated from dom/visual/interaction results)
 * @param outDir   Directory to write report.md into
 * @param urlDiff  Optional URL diff result for the preamble gate section
 */
export function writeReport(
  routes: RouteReport[],
  outDir: string,
  urlDiff?: UrlDiffResult,
): FullReport {
  mkdirSync(outDir, { recursive: true });

  const passed = routes.filter((r) => r.pass);
  const failed = routes.filter((r) => !r.pass);
  const urlGate = urlDiff ? urlDiff.same : true;
  const gatePass = urlGate && failed.length === 0;

  const report: FullReport = {
    generatedAt: new Date().toISOString(),
    urlDiff,
    routes,
    totals: { total: routes.length, passed: passed.length, failed: failed.length },
    gatePass,
  };

  // ---- Build markdown ----
  const lines: string[] = [
    "# opencli diff report",
    "",
    `> Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `| Gate | Result |`,
    `|------|--------|`,
    `| URL set A △ B = ∅ | ${badge(urlGate)} |`,
    `| DOM + Visual + Interaction | ${badge(failed.length === 0)} |`,
    `| **Overall** | **${badge(gatePass)}** |`,
    "",
    "## URL Diff",
    "",
  ];

  if (urlDiff) {
    lines.push(`- Old sitemap: ${urlDiff.oldCount} URLs`);
    lines.push(`- New sitemap: ${urlDiff.newCount} URLs`);
    lines.push(`- Symmetric difference: ${badge(urlDiff.same)}`);
    if (!urlDiff.same) {
      if (urlDiff.onlyInOld.length > 0) {
        lines.push("", "### Missing in new (URLs in old only)", "");
        urlDiff.onlyInOld.forEach((u) => lines.push(`- \`${u}\``));
      }
      if (urlDiff.onlyInNew.length > 0) {
        lines.push("", "### Extra in new (URLs not in old)", "");
        urlDiff.onlyInNew.forEach((u) => lines.push(`- \`${u}\``));
      }
    }
  } else {
    lines.push("_URL diff not run._");
  }

  lines.push("", "## Route Results", "");

  if (routes.length === 0) {
    lines.push("_No routes checked._");
  } else {
    lines.push(`${passed.length}/${routes.length} routes passed.`, "");
    lines.push(
      "| URL | DOM | Visual | Interactions | Pass |",
      "|-----|-----|--------|--------------|------|",
    );

    for (const r of routes) {
      const domCell = r.domDiff
        ? `${pct(r.domDiff.score * 100)} ${badge(r.domDiff.pass)}`
        : "_n/a_";
      const vizCell = r.visualDiff
        ? `${pct(r.visualDiff.changed)} ${badge(r.visualDiff.pass)}`
        : "_n/a_";
      const intCell = r.interactions
        ? `${r.interactions.filter((i) => i.passed).length}/${r.interactions.length} ${badge(r.interactions.every((i) => i.passed))}`
        : "_n/a_";
      lines.push(`| \`${r.url}\` | ${domCell} | ${vizCell} | ${intCell} | ${badge(r.pass)} |`);
    }

    if (failed.length > 0) {
      lines.push("", "## Failing Routes", "");
      for (const r of failed) {
        lines.push(`### \`${r.url}\``, "");
        if (r.domDiff && !r.domDiff.pass) {
          lines.push(`**DOM Diff** (score: ${pct(r.domDiff.score * 100)})`, "");
          r.domDiff.issues.forEach((i) => lines.push(`- [${i.type}] ${i.description}`));
          lines.push("");
        }
        if (r.visualDiff && !r.visualDiff.pass) {
          lines.push(
            `**Visual Diff** (diff: ${pct(r.visualDiff.changed)})`,
            `Diff PNG: \`${r.visualDiff.diffPngPath}\``,
            "",
          );
        }
        if (r.interactions) {
          const failedInt = r.interactions.filter((i) => !i.passed);
          if (failedInt.length > 0) {
            lines.push("**Interaction failures**", "");
            failedInt.forEach((i) => lines.push(`- [${i.check}] ${i.detail}`));
            lines.push("");
          }
        }
      }
    }
  }

  lines.push("---", "", "_Generated by `scripts/opencli/report.ts`_");

  const md = lines.join("\n");
  const outPath = join(outDir, "report.md");
  writeFileSync(outPath, md, "utf-8");

  // Also write JSON summary
  writeFileSync(join(outDir, "report.json"), JSON.stringify(report, null, 2));

  return report;
}

/**
 * Load route results from a results directory produced by a T18 run.
 * Expects: <resultsDir>/<slug>/dom-diff.json, visual-diff.json, interactions.json
 */
export function loadResultsDir(resultsDir: string): RouteReport[] {
  if (!existsSync(resultsDir)) return [];

  const slugDirs = readdirSync(resultsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const routes: RouteReport[] = [];

  for (const slug of slugDirs) {
    const dir = join(resultsDir, slug);
    const domDiff = safeReadJson<DomDiffResult>(join(dir, "dom-diff.json"));
    const visualDiff = safeReadJson<VisualDiffResult>(join(dir, "visual-diff.json"));
    const interactions = safeReadJson<InteractionResult[]>(join(dir, "interactions.json"));

    // Derive URL from slug (reverse of urlToSlug)
    const url = `/${slug.replace(/__/g, "/")}`;

    const checks = [
      domDiff ? domDiff.pass : true,
      visualDiff ? visualDiff.pass : true,
      interactions ? interactions.every((i) => i.passed) : true,
    ];
    const pass = checks.every(Boolean);

    routes.push({ url, slug, domDiff, visualDiff, interactions, pass });
  }

  return routes;
}

// ---- CLI main ----

function printHelp() {
  console.log(`
report.ts — aggregate opencli diff results into a markdown report.

Usage:
  bun run scripts/opencli/report.ts [options]
  bun run scripts/opencli/report.ts --help

Options:
  --results-dir <dir>    Directory with per-slug result JSON files (default: dist-diff/results)
  --url-diff <file>      Path to url-diff.json produced by url-diff.ts --json
  --out-dir <dir>        Output directory (default: dist-diff)
  --help                 Show this help

Output:
  <out-dir>/report.md
  <out-dir>/report.json
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  const getArg = (flag: string, def: string): string => {
    const idx = args.indexOf(flag);
    return idx !== -1 && args[idx + 1] ? args[idx + 1] : def;
  };

  const resultsDir = getArg("--results-dir", "dist-diff/results");
  const urlDiffPath = getArg("--url-diff", "dist-diff/url-diff.json");
  const outDir = getArg("--out-dir", "dist-diff");

  const urlDiff = safeReadJson<UrlDiffResult>(urlDiffPath);
  const routes = loadResultsDir(resultsDir);

  console.log(`Loading ${routes.length} route results from ${resultsDir}`);

  const report = writeReport(routes, outDir, urlDiff);

  console.log(`Report written to ${resolve(join(outDir, "report.md"))}`);
  console.log(
    `Overall gate: ${report.gatePass ? "PASS" : "FAIL"} (${report.totals.passed}/${report.totals.total} routes passed)`,
  );

  process.exit(report.gatePass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
