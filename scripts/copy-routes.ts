/**
 * Post-build script: make every route resolvable as BOTH `foo.html` and
 * `foo/index.html` (Nginx fallback contract §10).
 *
 * The production nginx (websites-nginx, open.longbridge.com) serves different
 * shapes depending on the location:
 *   - /docs/*, /sdk*        → `raw${uri}.html`         (flat file)
 *   - catch-all `location /` → `raw$path/index.html`   (directory index)
 * and _common.conf is a bare proxy_pass with no try_files/error_page fallback.
 *
 * Astro `build.format:'file'` only emits the flat `foo.html`, so the catch-all
 * pages (home locale roots, /skill, /pricing, …) would 404. This script
 * synthesises the missing variant in BOTH directions so either lookup resolves:
 *   - `foo.html`        → also write `foo/index.html`
 *   - `foo/index.html`  → also write `foo.html`
 * It is idempotent (skips whatever already exists) regardless of build.format.
 */

import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'

const distDir = path.resolve('dist')

if (!fs.existsSync(distDir)) {
  console.warn('[copy-routes] dist/ not found — run astro build first')
  process.exit(0)
}

// Snapshot the page list up front so newly-created files are not re-processed.
const htmlFiles = globSync('**/*.html', {
  cwd: distDir,
  absolute: false,
  ignore: ['pagefind/**'],
})

let flatToDir = 0
let dirToFlat = 0
let skipped = 0

for (const rel of htmlFiles) {
  if (path.basename(rel) === 'index.html') {
    // foo/index.html → foo.html
    const dir = path.dirname(rel)
    if (dir === '.') continue // root index.html — no flat variant
    const dest = path.join(distDir, `${dir}.html`)
    if (fs.existsSync(dest)) {
      skipped++
      continue
    }
    fs.copySync(path.join(distDir, rel), dest)
    dirToFlat++
  } else {
    // foo.html → foo/index.html
    const flat = rel.replace(/\.html$/, '')
    const dest = path.join(distDir, flat, 'index.html')
    if (fs.existsSync(dest)) {
      skipped++
      continue
    }
    fs.copySync(path.join(distDir, rel), dest)
    flatToDir++
  }
}

console.log(
  `[copy-routes] done — ${flatToDir} flat→dir, ${dirToFlat} dir→flat, ${skipped} already existed`,
)
