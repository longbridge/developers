#!/usr/bin/env bun
import { readdirSync, statSync, readFileSync, writeFileSync, renameSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOTS = ['docs/en', 'docs/zh-CN', 'docs/zh-HK']

function walk(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const s = statSync(p)
    if (s.isDirectory()) out.push(...walk(p))
    else if (name.endsWith('.md')) out.push(p)
  }
  return out
}

/** Escape sequences that mdx would misinterpret as JSX. */
function escapeForMdx(src: string): string {
  const lines = src.split('\n')
  let inCode = false
  let inFrontmatter = false
  let fmSeen = 0
  return lines.map((line) => {
    if (line.trim() === '---') {
      if (!inCode) { inFrontmatter = fmSeen === 0; fmSeen++; if (fmSeen === 2) inFrontmatter = false }
      return line
    }
    if (line.match(/^```/)) { inCode = !inCode; return line }
    if (inCode || inFrontmatter) return line
    // <foo@bar.com> autolink → escape
    line = line.replace(/<([^\s<>@]+@[^\s<>]+\.[^\s<>]+)>/g, '&lt;$1&gt;')
    // bare `{` outside code that mdx would treat as JSX expression → escape
    // (only if line has no other JSX-y token)
    // — heuristic: only escape lines that are pure prose with a bare {word}
    line = line.replace(/\{([A-Za-z_$][A-Za-z0-9_$]*)\}/g, (m, w) => {
      // don't touch already-escaped or React-looking
      if (line.includes('<') || line.includes('```')) return m
      return `\\{${w}\\}`
    })
    return line
  }).join('\n')
}

let changed = 0
for (const root of ROOTS) {
  for (const p of walk(root)) {
    const raw = readFileSync(p, 'utf-8')
    const escaped = escapeForMdx(raw)
    const dst = p.replace(/\.md$/, '.mdx')
    if (escaped !== raw) writeFileSync(p, escaped)
    // git mv equivalent via renameSync (git detects rename)
    renameSync(p, dst)
    console.log(`ok ${relative(process.cwd(), dst)}`)
    changed++
  }
}
console.log(`\nconverted ${changed} files`)
