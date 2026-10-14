import fs from 'node:fs'
import path from 'node:path'

/**
 * Maps a CLI subcommand → its CLI usage-doc URL, so a `<CliCommand>` block's
 * "CLI Usage Docs" (book) icon can deep-link to the exact command page (e.g.
 * `longbridge financial-report …` → /docs/cli/fundamentals/financial-report),
 * matching the legacy site instead of the generic /docs/cli.
 *
 * The CLI docs live at docs/{locale}/docs/cli/<category>/<subcommand>.mdx with
 * no slug override, so the URL is path-derived. Built once per locale from the
 * filesystem and memoised (like last-updated.ts). Unknown subcommands return
 * null and the component falls back to /docs/cli.
 */
const cache = new Map<string, Map<string, string>>()

function buildMap(locale: string): Map<string, string> {
  const map = new Map<string, string>()
  const root = path.join(process.cwd(), 'docs', locale, 'docs', 'cli')

  const walk = (dir: string) => {
    let entries: fs.Dirent[]
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const e of entries) {
      if (e.name.startsWith('_') || e.name.startsWith('.')) continue
      const abs = path.join(dir, e.name)
      if (e.isDirectory()) {
        walk(abs)
      } else if (e.isFile() && e.name.endsWith('.mdx') && e.name !== 'index.mdx') {
        const sub = e.name.replace(/\.mdx$/, '')
        const relFromCli = path.relative(root, abs).replace(/\.mdx$/, '') // e.g. "fundamentals/financial-report"
        const url = `${locale === 'en' ? '' : `/${locale}`}/docs/cli/${relFromCli}`
        // First writer wins — if the same subcommand exists in two categories,
        // keep the first (rare; deterministic by readdir order).
        if (!map.has(sub)) map.set(sub, url)
      }
    }
  }

  walk(root)
  return map
}

/** CLI usage-doc URL for a subcommand in a locale, or null if none exists. */
export function getCliDocHref(subcommand: string, locale = 'en'): string | null {
  if (!cache.has(locale)) cache.set(locale, buildMap(locale))
  return cache.get(locale)!.get(subcommand) ?? null
}
