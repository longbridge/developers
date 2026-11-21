import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { globSync } from 'glob'
import matter from 'gray-matter'
import type { CollectionEntry } from 'astro:content'
import { resolveLayoutKind, resolveUrl } from '../../packages/utils/src/slug'
import { getLastUpdated } from './last-updated'

/**
 * Sitemap `<lastmod>` per URL, from the git date of the page's source file
 * (src/lib/last-updated.ts).
 *
 * The sitemap integration only sees URLs, and URLs can't be turned back into
 * file paths by string munging: frontmatter `slug` renames many pages (e.g.
 * docs/en/docs/socket/protocol/how-to-parse-push.mdx → /docs/socket/protocol/push).
 * So we read the same files the `docs` collection loads, resolve each one's
 * URL with the same `resolveUrl` the page routes use, and build URL → entry id.
 *
 * Only docs-layout pages under `<locale>/docs/` get a date. Pages whose content
 * doesn't live in their .mdx (homepage, sdk/pricing/skill marketing pages, the
 * API reference rendered from openapi.yaml) are left without `<lastmod>` —
 * no date is better than a wrong one, and we never fall back to the build date.
 */

export interface DocSource {
  /** Collection entry id: path under docs/ without `.mdx`, e.g. `en/docs/cli/index`. */
  id: string
  data: { slug?: string; layout?: unknown; docs_layout?: unknown }
}

const asEntry = (s: DocSource) => s as unknown as CollectionEntry<'docs'>

/** URL path (`/docs/x`, `/zh-CN/docs/x`) → entry id, for pages that can carry a date. */
export function buildUrlToId(sources: readonly DocSource[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const s of sources) {
    if (s.id.split('/')[1] !== 'docs') continue
    if (resolveLayoutKind(asEntry(s)) !== 'docs') continue
    map.set(resolveUrl(asEntry(s)), s.id)
  }
  return map
}

/** Read every docs collection file (same glob as src/content.config.ts). */
export function readDocSources(docsDir: string): DocSource[] {
  return globSync('{en,zh-CN,zh-HK}/**/*.mdx', { cwd: docsDir, posix: true }).map((rel) => ({
    id: rel.replace(/\.mdx$/, ''),
    data: matter(readFileSync(join(docsDir, rel), 'utf8')).data as DocSource['data'],
  }))
}

/** Normalise a sitemap URL to the path form `resolveUrl` produces. */
export function urlPath(url: string): string {
  let p = new URL(url).pathname.replace(/\.html$/, '')
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1)
  return p
}

export function createLastmodResolver(
  urlToId: ReadonlyMap<string, string>,
  dateOf: (id: string) => string | null
): (url: string) => string | undefined {
  return (url) => {
    const id = urlToId.get(urlPath(url))
    return (id && dateOf(id)) || undefined
  }
}

let resolver: ((url: string) => string | undefined) | null = null

/** `<lastmod>` for a sitemap URL, or undefined when there's no real date. */
export function sitemapLastmod(url: string): string | undefined {
  if (!resolver) {
    const docsDir = join(process.cwd(), 'docs')
    resolver = createLastmodResolver(buildUrlToId(readDocSources(docsDir)), getLastUpdated)
  }
  return resolver(url)
}
