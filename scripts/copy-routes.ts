/**
 * Post-build script: walks Astro dist/ and for every foo/index.html
 * copies it to foo.html so both paths exist (Nginx fallback contract §10).
 *
 * Astro's build.format:'file' may already emit foo.html directly, but this
 * script is idempotent and safe to run regardless.
 */

import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'

const distDir = path.resolve('dist')

if (!fs.existsSync(distDir)) {
  console.warn('[copy-routes] dist/ not found — run astro build first')
  process.exit(0)
}

const indexFiles = globSync('**/index.html', { cwd: distDir, absolute: false })

let copied = 0
let skipped = 0

for (const rel of indexFiles) {
  // rel is like 'skill/install/index.html'
  const dir = path.dirname(rel) // 'skill/install'
  if (dir === '.') {
    // root index.html — no flat copy needed
    continue
  }

  const src = path.join(distDir, rel)
  const dest = path.join(distDir, `${dir}.html`)

  if (fs.existsSync(dest)) {
    skipped++
    continue
  }

  fs.copySync(src, dest)
  console.log(`[copy-routes] copied: ${rel} → ${dir}.html`)
  copied++
}

console.log(`[copy-routes] done — ${copied} copied, ${skipped} already exist`)
