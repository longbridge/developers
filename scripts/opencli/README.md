# opencli — openapi-website A/B diff toolkit

Verification toolkit for the VitePress → Astro migration. Provides 5 layers of
UX-equivalence checks between the old VitePress site (A) and the new Astro site (B).

## Quick-start

```bash
# 1. Parse sitemaps and diff URL sets
bun run scripts/opencli/crawl-routes.ts dist/old/sitemap.xml --pretty > routes-old.json
bun run scripts/opencli/crawl-routes.ts dist/new/sitemap-index.xml --pretty > routes-new.json
bun run scripts/opencli/url-diff.ts dist/old/sitemap.xml dist/new/sitemap-index.xml

# 2. Snapshot HTML (standalone fetch mode — screenshots require MCP agent)
bun run scripts/opencli/snapshot.ts http://localhost:4321 routes-new.json --out-dir dist-diff/snapshots/new
bun run scripts/opencli/snapshot.ts http://localhost:5173 routes-old.json --out-dir dist-diff/snapshots/old

# 3. DOM structural diff for a single route
bun run scripts/opencli/dom-diff.ts dist-diff/snapshots/old/index.html dist-diff/snapshots/new/index.html

# 4. Visual pixel diff (requires screenshots captured by MCP agent)
bun run scripts/opencli/visual-diff.ts dist-diff/snapshots/old/index.png dist-diff/snapshots/new/index.png --diff dist-diff/visual/index.diff.png

# 5. Aggregate report
bun run scripts/opencli/report.ts --results-dir dist-diff/results --out-dir dist-diff
```

---

## Architecture — 5 Layers

### Layer 1: URL set equivalence (`url-diff.ts`)

Hard gate for Task 18. The Astro site must serve exactly the same URL paths as the
VitePress site; no additions, no removals.

- Parses both sitemaps via `crawl-routes.ts` (`parseSitemap`)
- Strips origin; compares path-only to avoid false negatives from different hosts
- Exit 0 if A △ B = ∅ (symmetric difference is empty)
- Exit 1 if any mismatch; prints `onlyInOld` and `onlyInNew` lists

Handles both flat `sitemap.xml` and Astro's `sitemap-index.xml` (sitemapindex) formats.

### Layer 2: HTML capture (`snapshot.ts`)

Fetches the raw HTML for each URL and writes it to a per-slug file.

- Standalone mode: `fetch()` for HTML only (no screenshots)
- MCP-driven mode: agent uses `mcp__chrome-devtools__navigate_page` + `evaluate_script`
  to capture live-rendered HTML and `take_screenshot` for PNGs
- Output: `<outDir>/<slug>.html`, `manifest.json`

See §"MCP-Driven Canonical Flow" below for the authoritative agent script.

### Layer 3: DOM structural diff (`dom-diff.ts`)

Compares page structure using `node-html-parser` (pure JS, Bun-compatible).

Normalizes before comparison:
- Strips `data-astro-*` attributes (build-time Astro annotations)
- Removes Astro hash class suffixes (`astro-XXXXXX`)

Metrics (weighted composite score, threshold 0.95):
| Metric | Weight | Method |
|--------|--------|--------|
| Heading sequence (`h1`–`h6`) | 40% | LCS-based sequence similarity |
| Internal link set | 30% | Jaccard similarity |
| Code block count | 15% | ratio min/max |
| `data-lbus-component` values | 15% | Jaccard similarity |

### Layer 4: Visual pixel diff (`visual-diff.ts`)

Wraps `odiff` binary from the `odiff-bin` devDependency.

- Default threshold: 0.1% pixel difference
- Writes diff overlay PNG for any failing pair
- Resolves binary via `createRequire('odiff-bin/package.json')`, falls back to `PATH`

Screenshots must be captured at the same viewport (1280 × 800 recommended) by the
MCP agent before running this script.

### Layer 5: Interaction assertions (`interaction-assertions.ts`)

Reference implementation documenting 6 UI checks. The T18 MCP agent executes these
using `mcp__chrome-devtools__*` tools and passes results to the exported functions.

| Check | What is verified |
|-------|-----------------|
| `assertThemeToggle` | Clicking theme button changes `dataset.mode` |
| `assertLanguageSwitcher` | Switching locale navigates to correct path prefix |
| `assertSearchDialog` | Cmd+K opens dialog; typing returns results |
| `assertSidebarCollapse` | Collapse button hides sidebar nav |
| `assertCodeCopy` | Copy button writes code content to clipboard |
| `assertComponentPresence` | `data-lbus-component` values present on page |

---

## MCP-Driven Canonical Flow

The T18 agent executes the following steps for each route using the
`mcp__chrome-devtools__*` tools. This is the authoritative flow; the standalone
Bun scripts in this directory are reference implementations only.

```
# Per-route agent script (pseudocode — T18 agent executes this inline)

for each url in routes:
  slug = urlToSlug(url)

  # --- Capture OLD (VitePress) ---
  mcp__chrome-devtools__navigate_page({ type: "url", url: OLD_BASE + path })
  mcp__chrome-devtools__take_screenshot({ filePath: `dist-diff/old/${slug}.png` })
  oldHtml = mcp__chrome-devtools__evaluate_script({
    function: "() => document.documentElement.outerHTML"
  })
  write(oldHtml, `dist-diff/old/${slug}.html`)

  # --- Capture NEW (Astro) ---
  mcp__chrome-devtools__navigate_page({ type: "url", url: NEW_BASE + path })
  mcp__chrome-devtools__take_screenshot({ filePath: `dist-diff/new/${slug}.png` })
  newHtml = mcp__chrome-devtools__evaluate_script({
    function: "() => document.documentElement.outerHTML"
  })
  write(newHtml, `dist-diff/new/${slug}.html`)

  # --- DOM diff ---
  domResult = domSimilarity(oldHtml, newHtml)    # from dom-diff.ts
  write(domResult, `dist-diff/results/${slug}/dom-diff.json`)

  # --- Visual diff ---
  vizResult = visualDiff(
    `dist-diff/old/${slug}.png`,
    `dist-diff/new/${slug}.png`,
    `dist-diff/visual/${slug}.diff.png`
  )
  write(vizResult, `dist-diff/results/${slug}/visual-diff.json`)

  # --- Interaction assertions ---
  # Theme toggle:
  mcp__chrome-devtools__navigate_page({ type: "url", url: NEW_BASE + path })
  initialMode = mcp__chrome-devtools__evaluate_script({
    function: "() => document.documentElement.dataset.mode"
  })
  themeToggleUid = /* uid from take_snapshot() */
  mcp__chrome-devtools__click({ uid: themeToggleUid })
  afterMode = mcp__chrome-devtools__evaluate_script({
    function: "() => document.documentElement.dataset.mode"
  })
  themeResult = assertThemeToggle(initialMode, afterMode)

  # Search dialog:
  mcp__chrome-devtools__press_key({ key: "Meta+k" })
  snapshot = mcp__chrome-devtools__take_snapshot()
  dialogVisible = snapshot.includes('[role=dialog]')
  inputUid = /* uid from snapshot */
  mcp__chrome-devtools__fill({ uid: inputUid, value: "quote" })
  snapshot2 = mcp__chrome-devtools__take_snapshot()
  resultCount = snapshot2.count('[role=option]')
  searchResult = assertSearchDialog(dialogVisible, resultCount)

  # ... (sidebar, code copy, component presence analogously)

  interactions = [themeResult, searchResult, ...]
  write(interactions, `dist-diff/results/${slug}/interactions.json`)

# --- Aggregate report ---
bun run scripts/opencli/report.ts
```

---

## Script reference

| Script | Exports | CLI |
|--------|---------|-----|
| `crawl-routes.ts` | `parseSitemap`, `categorize`, `buildRoutes`, `Route` | `<sitemap.xml> [--pretty]` |
| `url-diff.ts` | `diffUrls`, `UrlDiffResult` | `<old.xml> <new.xml> [--json]` |
| `snapshot.ts` | `snapshotRoutes`, `captureHtml`, `urlToSlug` | `<baseUrl> <routes.json> [--out-dir]` |
| `dom-diff.ts` | `domSimilarity`, `DomDiffResult`, `DomDiffIssue` | `<old.html> <new.html> [--threshold] [--json]` |
| `visual-diff.ts` | `visualDiff`, `VisualDiffResult` | `<old.png> <new.png> [--diff] [--threshold] [--json]` |
| `interaction-assertions.ts` | `assert*` functions, `InteractionResult` | `--help` |
| `report.ts` | `writeReport`, `loadResultsDir`, `FullReport` | `[--results-dir] [--url-diff] [--out-dir]` |

---

## Output directory layout

```
dist-diff/
  old/                    # VitePress snapshots (HTML + PNG)
    index.html
    index.png
    manifest.json
  new/                    # Astro snapshots (HTML + PNG)
    index.html
    index.png
    manifest.json
  visual/                 # Diff overlay PNGs
    index.diff.png
  results/                # Per-slug JSON results
    index/
      dom-diff.json
      visual-diff.json
      interactions.json
  url-diff.json           # URL diff result (from url-diff.ts --json)
  report.md               # Human-readable markdown report
  report.json             # Machine-readable full report
```

---

## Pass criteria (T18 hard gates)

1. `url-diff.ts` exits 0 — A △ B = ∅
2. All routes: `domSimilarity` score ≥ 0.95
3. All routes: `visualDiff` changed ≤ 0.1%
4. All routes: all 6 interaction assertions pass
