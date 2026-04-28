/**
 * Post-build script: copies directory-based routes to flat file routes.
 *
 * The deployment server handles .html differently from .md:
 *   - .html: /skill/install resolves to either install.html or install/index.html
 *   - .md:   no such redirect; install.md and install/index.md are distinct paths
 *
 * This script ensures both locations exist for each target route.
 */

import fs from 'fs-extra'
import path from 'path'

const distDir = path.resolve('docs/.vitepress/dist')

// Each entry: copy `dir/index.ext` → `dir.ext` (so both paths exist)
const routes = ['skill/install', 'docs/cli', 'zh-CN/docs/cli', 'zh-HK/docs/cli']

const exts = ['.html', '.md']

for (const route of routes) {
  for (const ext of exts) {
    const src = path.join(distDir, route, `index${ext}`)
    const dest = path.join(distDir, `${route}${ext}`)

    if (!fs.existsSync(src)) {
      console.warn(`[copy-routes] source not found, skipping: ${src}`)
      continue
    }

    fs.copySync(src, dest)
    console.log(`[copy-routes] copied: ${route}/index${ext} → ${route}${ext}`)
  }
}
