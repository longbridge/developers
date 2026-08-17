/**
 * Post-build script: walks dist/**\/*.md files emitted by Astro endpoint
 * pages (T14 llm-markdown endpoints) and normalises them:
 *   - trims trailing whitespace from each line
 *   - ensures a single trailing newline at end of file
 *
 * Source docs/.md files are NOT touched — only dist/ artifacts.
 */

import fs from 'fs'
import path from 'path'
import { globSync } from 'glob'

const distDir = path.resolve('dist')

if (!fs.existsSync(distDir)) {
  console.warn('[normalize_md] dist/ not found — run astro build first')
  process.exit(0)
}

const mdFiles = globSync('**/*.md', { cwd: distDir, absolute: true })

let processed = 0

for (const file of mdFiles) {
  const raw = fs.readFileSync(file, 'utf-8')
  const normalised =
    raw
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .replace(/\n*$/, '\n') // single trailing newline

  if (normalised !== raw) {
    fs.writeFileSync(file, normalised, 'utf-8')
    console.log(`[normalize_md] normalised: ${path.relative(distDir, file)}`)
    processed++
  }
}

console.log(`[normalize_md] done — ${processed} file(s) updated, ${mdFiles.length - processed} already clean`)
