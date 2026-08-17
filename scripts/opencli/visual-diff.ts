#!/usr/bin/env bun
/**
 * visual-diff.ts — Pixel-level visual comparison via odiff-bin.
 *
 * Wraps the `odiff` binary (from odiff-bin devDependency) using execSync.
 * Returns pixel difference percentage and path to the diff PNG.
 *
 * Usage:
 *   bun run scripts/opencli/visual-diff.ts <old.png> <new.png> [--diff <diff.png>]
 *   bun run scripts/opencli/visual-diff.ts --help
 *
 * Exit codes:
 *   0   Images are identical or below threshold (default: 0.1%)
 *   1   Visual difference exceeds threshold or tool error
 */

import { execSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createRequire } from "node:module";

const DEFAULT_THRESHOLD_PERCENT = 0.1; // 0.1% pixel diff allowed

export interface VisualDiffResult {
  changed: number;  // % pixel difference (0–100)
  diffPngPath: string;
  pass: boolean;
  error?: string;
}

/** Resolve the odiff binary path from node_modules. */
function resolveOdiffBin(): string {
  // odiff-bin ships the binary at odiff-bin/bin/odiff (linux/mac/win)
  try {
    const require = createRequire(import.meta.url);
    const pkg = require.resolve("odiff-bin/package.json");
    const pkgDir = dirname(pkg);
    // Try common paths: bin/odiff, odiff
    for (const rel of ["bin/odiff", "odiff"]) {
      const candidate = join(pkgDir, rel);
      if (existsSync(candidate)) return candidate;
    }
  } catch {
    // fall through to PATH
  }
  // Fall back to PATH
  return "odiff";
}

/**
 * Run a pixel-level visual diff between two PNG files.
 * Uses odiff-bin binary via execSync.
 *
 * @param oldPng   Path to baseline screenshot
 * @param newPng   Path to candidate screenshot
 * @param diffPng  Path to write the diff overlay PNG
 * @param threshold  % pixel diff to consider a pass (0–100, default 0.1)
 */
export function visualDiff(
  oldPng: string,
  newPng: string,
  diffPng: string,
  threshold = DEFAULT_THRESHOLD_PERCENT,
): VisualDiffResult {
  // Ensure diff output directory exists
  mkdirSync(dirname(resolve(diffPng)), { recursive: true });

  const bin = resolveOdiffBin();
  // odiff CLI: odiff <base> <compare> <diff> [options]
  // --threshold: per-pixel color threshold (0–1 float)
  const cmd = `${JSON.stringify(bin)} ${JSON.stringify(resolve(oldPng))} ${JSON.stringify(resolve(newPng))} ${JSON.stringify(resolve(diffPng))} --threshold 0.1 --antialiasing`;

  let stdout = "";
  let exitCode = 0;

  try {
    stdout = execSync(cmd, { encoding: "utf-8" }).toString();
  } catch (err: unknown) {
    const execErr = err as { stdout?: string; stderr?: string; status?: number };
    stdout = execErr.stdout ?? "";
    exitCode = execErr.status ?? 1;
    // odiff exits 1 when diff found — not a fatal error
    if (exitCode !== 1) {
      return {
        changed: 100,
        diffPngPath: diffPng,
        pass: false,
        error: `odiff failed (exit ${exitCode}): ${execErr.stderr ?? ""}`,
      };
    }
  }

  // Parse odiff output: "Pixels changed: 1234 (0.12%)" or "Images are equal!"
  let changed = 0;

  const equalMatch = /Images are equal/i.test(stdout);
  const percentMatch = stdout.match(/\(([0-9.]+)%\)/);

  if (equalMatch) {
    changed = 0;
  } else if (percentMatch) {
    changed = parseFloat(percentMatch[1]);
  } else if (exitCode === 0) {
    changed = 0;
  } else {
    // Fallback: treat as 100% diff if we can't parse
    changed = 100;
  }

  return {
    changed,
    diffPngPath: diffPng,
    pass: changed <= threshold,
  };
}

// ---- CLI main ----

function printHelp() {
  console.log(`
visual-diff.ts — pixel-level visual comparison between two PNG screenshots.
Wraps odiff-bin binary.

Usage:
  bun run scripts/opencli/visual-diff.ts <old.png> <new.png> [options]
  bun run scripts/opencli/visual-diff.ts --help

Arguments:
  <old.png>           Baseline screenshot (vitepress)
  <new.png>           Candidate screenshot (astro)

Options:
  --diff <path>       Output diff PNG path (default: dist-diff/visual/<slug>.diff.png)
  --threshold <pct>   % pixel difference to pass (default: ${DEFAULT_THRESHOLD_PERCENT})
  --json              Output machine-readable JSON
  --help              Show this help

Exit codes:
  0   Pass (diff ≤ threshold)
  1   Fail (diff > threshold) or odiff error
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const jsonMode = args.includes("--json");
  const diffIdx = args.indexOf("--diff");
  const threshIdx = args.indexOf("--threshold");
  const threshold = threshIdx !== -1 ? parseFloat(args[threshIdx + 1]) : DEFAULT_THRESHOLD_PERCENT;
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length < 2) {
    console.error("Error: two PNG paths required. Run --help for usage.");
    process.exit(1);
  }

  const [oldPng, newPng] = positional;
  const diffPng = diffIdx !== -1 ? args[diffIdx + 1] : `dist-diff/visual/${Date.now()}.diff.png`;

  const result = visualDiff(oldPng, newPng, diffPng, threshold);

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    if (result.error) {
      console.error(`Error: ${result.error}`);
    } else {
      console.log(`Pixel difference: ${result.changed.toFixed(2)}%`);
      console.log(`Threshold: ${threshold}% — ${result.pass ? "PASS" : "FAIL"}`);
      if (!result.pass) {
        console.log(`Diff PNG: ${result.diffPngPath}`);
      }
    }
  }

  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
