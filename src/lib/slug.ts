import type { CollectionEntry } from 'astro:content'

export type Locale = 'en' | 'zh-CN' | 'zh-HK'

/** en/index.mdx → 'en'; zh-CN/docs/foo.mdx → 'zh-CN'; etc. */
export function resolveLocale(entry: CollectionEntry<'docs'>): Locale {
  const seg = entry.id.split('/')[0]
  return seg === 'zh-CN' || seg === 'zh-HK' ? seg : 'en'
}

/**
 * Equivalent to vitepress rewriteMarkdownPath.
 * - en/**: strip 'en/' prefix
 * - zh-CN/**, zh-HK/**: keep locale prefix
 * - index.mdx → directory
 * - frontmatter `slug`: absolute (/foo) replaces, relative (foo) is dir-relative
 */
export function resolveUrl(entry: CollectionEntry<'docs'>): string {
  const rel = entry.id.replace(/\.mdx$/, '')
  const parts = rel.split('/')
  const locale = resolveLocale(entry)
  const rest = locale === 'en' ? parts.slice(1) : parts.slice(1) // rest of path minus locale segment
  const dir = rest.slice(0, -1).join('/')
  const base = rest[rest.length - 1]

  const explicit = entry.data.slug
  if (explicit) {
    if (explicit.startsWith('/')) return withLocale(locale, explicit)
    return withLocale(locale, joinPath('/', dir, explicit))
  }
  const path = base === 'index'
    ? joinPath('/', dir)
    : joinPath('/', dir, base)
  return withLocale(locale, path)
}

function withLocale(locale: Locale, path: string): string {
  if (locale === 'en') return normalize(path)
  return normalize(`/${locale}${path}`)
}

function joinPath(...segs: string[]): string {
  return segs.filter(Boolean).join('/').replace(/\/+/g, '/')
}

function normalize(path: string): string {
  const p = path.replace(/\/+/g, '/')
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1)
  return p || '/'
}
