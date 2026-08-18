import type { CollectionEntry } from 'astro:content'
import type { Locale } from './i18n'

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
    if (explicit.startsWith('/')) {
      // Legacy vitepress semantics: for files under `<locale>/docs/**`, an
      // absolute slug is relative to the `/docs` route root. E.g.
      // docs/en/docs/mcp.mdx with `slug: /mcp` → URL `/docs/mcp`, matching
      // the vitepress rewriteMarkdownPath output `/{locale}/docs/{slug}`.
      // For files directly under `<locale>/` (marketing pages sdk.mdx,
      // pricing.mdx, skill.mdx), the slug is site-absolute.
      const inDocs = rest[0] === 'docs'
      return withLocale(locale, inDocs ? joinPath('/docs', explicit) : explicit)
    }
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

/**
 * Decide which layout renders a doc entry.
 *
 * astro-mdx auto-resolves a frontmatter `layout:` value as a module path; the
 * vite preflight (astro.config.ts Rule 1) renames it to `docs_layout:` for that
 * reason. But the content-collection loader reads raw mdx and does NOT go
 * through the preflight, so both keys can appear here — inspect them both.
 *
 * Values mapped:
 * - `api-reference` → api  (Scalar API viewer layout)
 * - `false` or `home` → plain  (marketing full-width, no sidebar)
 * - anything else / absent → docs  (three-column shell with sidebar + TOC)
 */
export function resolveLayoutKind(entry: CollectionEntry<'docs'>): 'docs' | 'api' | 'plain' {
  const meta = entry.data.docs_layout ?? entry.data.layout
  if (meta === 'api-reference') return 'api'
  if (meta === false) return 'plain'
  if (meta === 'home') return 'plain'
  return 'docs'
}
