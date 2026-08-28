/**
 * Post-build script: reconcile each route to the ONE file shape the production
 * nginx actually serves for its URL prefix — matching the legacy VitePress
 * output exactly, with no duplicate files.
 *
 * Production nginx (websites-nginx, open.longbridge.com, `_release.conf`) routes
 * by prefix, and each prefix resolves exactly one shape:
 *   - /docs, /docs/** (API reference lives under /docs/api/**) → `raw${uri}.html`
 *   - /sdk,  /sdk/**                                           → `raw${uri}.html`
 *        → FLAT file:      `foo.html`
 *   - everything else (catch-all `location /`): /pricing, /skill, locale roots …
 *        → `raw$path/index.html`
 *        → DIRECTORY index: `foo/index.html`
 *   - trailing slash `/foo/` 302-redirects to `/foo`, and `/en/*` 302-redirects
 *     to `/*` (en is the root locale), so those never hit a file.
 * `_common.conf` is a bare proxy_pass with no try_files fallback — the exact file
 * must exist, and only that one is ever read.
 *
 * Astro `build.format:'file'` emits the flat `foo.html` for every route. This
 * script rewrites the catch-all routes to their directory-index shape and drops
 * the now-dead sibling in both directions, so the deployed tree carries one file
 * per route (≈ half the disk of emitting both) while every URL still resolves.
 * It is idempotent and reconciles correctly whether run on fresh Astro output
 * or on a tree that already contains both shapes.
 */

import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'

const distDir = path.resolve('dist')

if (!fs.existsSync(distDir)) {
  console.warn('[copy-routes] dist/ not found — run astro build first')
  process.exit(0)
}

/**
 * Which file shape does nginx serve for this route?
 * FLAT for /docs** and /sdk** (any locale prefix); DIRECTORY for everything else.
 */
function wantsFlat(route: string): boolean {
  const bare = route.replace(/^(zh-CN|zh-HK)\//, '') // strip locale prefix
  const seg0 = bare.split('/')[0]
  return seg0 === 'docs' || seg0 === 'sdk'
}

// Snapshot the page list up front, then reconcile per unique route.
const htmlFiles = globSync('**/*.html', {
  cwd: distDir,
  absolute: false,
  ignore: ['pagefind/**'],
})

// route → which shapes currently exist on disk
const routes = new Map<string, { flat: boolean; dir: boolean }>()
for (const rel of htmlFiles) {
  let route: string
  let shape: 'flat' | 'dir'
  if (path.basename(rel) === 'index.html') {
    const dir = path.dirname(rel)
    route = dir === '.' ? '' : dir
    shape = 'dir'
  } else {
    route = rel.slice(0, -'.html'.length)
    shape = 'flat'
  }
  const entry = routes.get(route) ?? { flat: false, dir: false }
  entry[shape] = true
  routes.set(route, entry)
}

let toDir = 0
let toFlat = 0
let removed = 0

function rmdirIfEmpty(absDir: string): void {
  try {
    if (fs.readdirSync(absDir).length === 0) fs.rmdirSync(absDir)
  } catch {
    /* non-empty or gone — leave it */
  }
}

for (const [route, has] of routes) {
  if (route === '') continue // root index.html — homepage, stays
  if (route === '404') continue // conventional flat error page, stays
  if (route === 'en' || route.startsWith('en/')) continue // dead redirect target

  const flatPath = path.join(distDir, `${route}.html`)
  const dirPath = path.join(distDir, route, 'index.html')

  if (wantsFlat(route)) {
    // Need foo.html; foo/index.html (if any) is dead.
    if (!has.flat && has.dir) {
      fs.copySync(dirPath, flatPath)
      toFlat++
    }
    if (has.dir) {
      fs.removeSync(dirPath)
      removed++
      rmdirIfEmpty(path.join(distDir, route))
    }
  } else {
    // Need foo/index.html; foo.html (if any) is dead.
    if (!has.dir && has.flat) {
      fs.copySync(flatPath, dirPath)
      toDir++
    }
    if (has.flat) {
      fs.removeSync(flatPath)
      removed++
    }
  }
}

console.log(
  `[copy-routes] done — ${toDir} →dir, ${toFlat} →flat, ${removed} dead sibling(s) removed`,
)
