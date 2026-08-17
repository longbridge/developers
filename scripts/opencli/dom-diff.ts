#!/usr/bin/env bun
/**
 * dom-diff.ts — Structural DOM comparison between old and new page HTML.
 *
 * Uses node-html-parser (Bun-compatible; no native deps).
 * Compares heading sequence, internal link set, code block count, and
 * data-lbus-component values. Passes if Jaccard similarity ≥ 0.95.
 *
 * Usage:
 *   bun run scripts/opencli/dom-diff.ts <old.html> <new.html> [options]
 *   bun run scripts/opencli/dom-diff.ts --help
 *
 * Exit codes:
 *   0   similarity ≥ threshold (pass)
 *   1   similarity below threshold (fail)
 */

import { parse, type HTMLElement } from "node-html-parser";

export const DEFAULT_THRESHOLD = 0.95;

export interface DomDiffIssue {
  type: "heading" | "links" | "codeblocks" | "components";
  description: string;
  similarity: number;
}

export interface DomDiffResult {
  score: number;
  pass: boolean;
  issues: DomDiffIssue[];
  details: {
    headings: { old: string[]; new: string[]; jaccard: number };
    links: { old: string[]; new: string[]; jaccard: number };
    codeBlocks: { old: number; new: number };
    components: { old: string[]; new: string[]; jaccard: number };
  };
}

// ---- Normalization helpers ----

/** Strip data-astro-* attributes and normalize class hash suffixes. */
function standardizeHtml(root: HTMLElement): void {
  const all = root.querySelectorAll("*");
  for (const el of all) {
    // Remove Astro-specific attributes that differ between builds
    for (const attr of Object.keys(el.attributes)) {
      if (attr.startsWith("data-astro-")) el.removeAttribute(attr);
    }
    // Normalize class: strip Astro hash suffixes like "astro-XXXX"
    const cls = el.getAttribute("class");
    if (cls) {
      const normalized = cls
        .split(/\s+/)
        .filter((c) => !/^astro-[A-Z0-9]{6,}$/.test(c))
        .join(" ")
        .trim();
      if (normalized) el.setAttribute("class", normalized);
      else el.removeAttribute("class");
    }
  }
}

/** Extract main content element or fall back to body. */
function getContent(root: HTMLElement): HTMLElement {
  return (root.querySelector("main") ?? root.querySelector("body") ?? root) as HTMLElement;
}

/** Extract heading sequence with text content (h1-h6). */
function extractHeadings(content: HTMLElement): string[] {
  return content
    .querySelectorAll("h1,h2,h3,h4,h5,h6")
    .map((h) => `${h.tagName}:${h.text.replace(/\s+/g, " ").trim()}`);
}

/** Extract internal link href values. */
function extractInternalLinks(content: HTMLElement, baseOrigin?: string): string[] {
  return content
    .querySelectorAll("a[href]")
    .map((a) => a.getAttribute("href") ?? "")
    .filter((href) => {
      if (!href) return false;
      if (href.startsWith("#")) return false;
      if (href.startsWith("/")) return true;
      if (baseOrigin && href.startsWith(baseOrigin)) return true;
      return !href.startsWith("http"); // relative
    })
    .map((href) => href.replace(/\/$/, "") || "/");
}

/** Count code blocks (pre > code or code[class*="language-"]). */
function countCodeBlocks(content: HTMLElement): number {
  const preCode = content.querySelectorAll("pre code").length;
  const langCode = content.querySelectorAll("code[class]").length;
  return Math.max(preCode, langCode);
}

/** Extract data-lbus-component values. */
function extractComponents(content: HTMLElement): string[] {
  return content
    .querySelectorAll("[data-lbus-component]")
    .map((el) => el.getAttribute("data-lbus-component") ?? "")
    .filter(Boolean);
}

// ---- Jaccard similarity ----

function jaccardSets(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 1 : intersection / union;
}

/** Sequence similarity: ordered (LCS-based proportion). */
function sequenceSimilarity(a: string[], b: string[]): number {
  if (a.length === 0 && b.length === 0) return 1;
  // LCS length via DP
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const lcs = dp[m][n];
  return (2 * lcs) / (m + n);
}

// ---- Main export ----

/**
 * Compare two page HTML strings structurally.
 * Returns a score (0–1) and detailed issues list.
 */
export function domSimilarity(
  oldHtml: string,
  newHtml: string,
  threshold = DEFAULT_THRESHOLD,
): DomDiffResult {
  const oldRoot = parse(oldHtml);
  const newRoot = parse(newHtml);

  standardizeHtml(oldRoot);
  standardizeHtml(newRoot);

  const oldContent = getContent(oldRoot);
  const newContent = getContent(newRoot);

  const oldHeadings = extractHeadings(oldContent);
  const newHeadings = extractHeadings(newContent);
  const headingJaccard = sequenceSimilarity(oldHeadings, newHeadings);

  const oldLinks = extractInternalLinks(oldContent);
  const newLinks = extractInternalLinks(newContent);
  const linkJaccard = jaccardSets(oldLinks, newLinks);

  const oldCodeCount = countCodeBlocks(oldContent);
  const newCodeCount = countCodeBlocks(newContent);
  const codeRatio =
    oldCodeCount === 0 && newCodeCount === 0
      ? 1
      : oldCodeCount === 0 || newCodeCount === 0
        ? 0
        : Math.min(oldCodeCount, newCodeCount) / Math.max(oldCodeCount, newCodeCount);

  const oldComponents = extractComponents(oldContent);
  const newComponents = extractComponents(newContent);
  const componentJaccard = jaccardSets(oldComponents, newComponents);

  // Composite score: weighted average
  const score =
    headingJaccard * 0.4 +
    linkJaccard * 0.3 +
    codeRatio * 0.15 +
    componentJaccard * 0.15;

  const issues: DomDiffIssue[] = [];

  if (headingJaccard < threshold) {
    issues.push({
      type: "heading",
      description: `Heading sequence mismatch: ${oldHeadings.length} old vs ${newHeadings.length} new`,
      similarity: headingJaccard,
    });
  }
  if (linkJaccard < threshold) {
    issues.push({
      type: "links",
      description: `Internal link set mismatch: ${oldLinks.length} old vs ${newLinks.length} new`,
      similarity: linkJaccard,
    });
  }
  if (codeRatio < threshold) {
    issues.push({
      type: "codeblocks",
      description: `Code block count mismatch: ${oldCodeCount} old vs ${newCodeCount} new`,
      similarity: codeRatio,
    });
  }
  if (componentJaccard < threshold) {
    issues.push({
      type: "components",
      description: `data-lbus-component mismatch: [${oldComponents.join(",")}] vs [${newComponents.join(",")}]`,
      similarity: componentJaccard,
    });
  }

  return {
    score,
    pass: score >= threshold,
    issues,
    details: {
      headings: { old: oldHeadings, new: newHeadings, jaccard: headingJaccard },
      links: { old: oldLinks, new: newLinks, jaccard: linkJaccard },
      codeBlocks: { old: oldCodeCount, new: newCodeCount },
      components: { old: oldComponents, new: newComponents, jaccard: componentJaccard },
    },
  };
}

// ---- CLI main ----

function printHelp() {
  console.log(`
dom-diff.ts — structural DOM comparison between two page HTML files.

Usage:
  bun run scripts/opencli/dom-diff.ts <old.html> <new.html> [options]
  bun run scripts/opencli/dom-diff.ts --help

Arguments:
  <old.html>         Baseline HTML snapshot (vitepress)
  <new.html>         Candidate HTML snapshot (astro)

Options:
  --threshold <n>    Jaccard pass threshold 0–1 (default: ${DEFAULT_THRESHOLD})
  --json             Output machine-readable JSON
  --help             Show this help

Exit codes:
  0   Pass (score ≥ threshold)
  1   Fail (score < threshold)
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.length === 0) {
    printHelp();
    process.exit(0);
  }

  const jsonMode = args.includes("--json");
  const threshIdx = args.indexOf("--threshold");
  const threshold = threshIdx !== -1 ? parseFloat(args[threshIdx + 1]) : DEFAULT_THRESHOLD;
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length < 2) {
    console.error("Error: two HTML file paths required. Run --help for usage.");
    process.exit(1);
  }

  const [oldPath, newPath] = positional;
  const oldHtml = await Bun.file(oldPath).text();
  const newHtml = await Bun.file(newPath).text();

  const result = domSimilarity(oldHtml, newHtml, threshold);

  if (jsonMode) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`DOM similarity score: ${(result.score * 100).toFixed(1)}%`);
    console.log(`Threshold: ${(threshold * 100).toFixed(0)}% — ${result.pass ? "PASS" : "FAIL"}`);
    if (result.issues.length > 0) {
      console.log("\nIssues:");
      for (const issue of result.issues) {
        console.log(`  [${issue.type}] ${issue.description} (similarity: ${(issue.similarity * 100).toFixed(1)}%)`);
      }
    }
  }

  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
