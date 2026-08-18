import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale } from './i18n'

export interface SidebarNode {
  label: string
  link?: string
  icon?: string
  position: number
  collapsed: boolean
  items?: SidebarNode[]
}

interface CategoryConfig {
  position?: number
  label?: string
  icon?: string
  collapsible?: boolean
  collapsed?: boolean
  link?: string | null
  indexLink?: string
}

/**
 * Read _category_.json for a locale-scoped directory.
 * @param dir - relative to docs/, e.g. "en/docs/quote"
 */
export function readCategory(dir: string): CategoryConfig | null {
  const categoryPath = path.join(process.cwd(), 'docs', dir, '_category_.json')
  try {
    if (fs.existsSync(categoryPath)) {
      const content = fs.readFileSync(categoryPath, 'utf-8')
      return JSON.parse(content) as CategoryConfig
    }
  } catch {
    // ignore parse errors
  }
  return null
}

function sortByPosition(items: SidebarNode[]): SidebarNode[] {
  return items.sort((a, b) => a.position - b.position)
}

function urlFromAbsPath(absPath: string, locale: Locale): string {
  // absPath is inside docs/{locale}/docs/...
  // e.g. /project/docs/en/docs/quote/pull/static.mdx
  // → strip docs/{locale} prefix, remove .mdx, collapse index
  const docsRoot = path.join(process.cwd(), 'docs')
  let rel = path.relative(docsRoot, absPath) // e.g. en/docs/quote/pull/static.mdx
  rel = rel.replace(/\.mdx$/, '') // strip ext
  // strip locale prefix
  const parts = rel.split('/')
  const localePrefix = parts[0] // 'en', 'zh-CN', etc.
  const rest = parts.slice(1) // ['docs', 'quote', ...]
  // collapse trailing index
  if (rest[rest.length - 1] === 'index') {
    rest.pop()
  }
  const slug = '/' + rest.join('/')
  if (localePrefix === 'en') {
    return slug
  }
  return `/${locale}${slug}`
}

function processDir(absDir: string, locale: Locale, relFromDocs: string): SidebarNode | null {
  const cat = readCategory(relFromDocs)
  if (!cat) return null

  const label = cat.label ?? path.basename(absDir)
  const position = cat.position ?? 999
  const collapsed = cat.collapsed ?? true
  const icon = cat.icon
  const link = cat.link ?? undefined

  const items = buildItems(absDir, locale, relFromDocs)

  const node: SidebarNode = {
    label,
    icon,
    position,
    collapsed,
    items: items.length > 0 ? items : undefined,
  }
  if (link) node.link = link

  return node
}

function buildItems(absDir: string, locale: Locale, relFromDocs: string): SidebarNode[] {
  let entries: fs.Dirent[]
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true })
  } catch {
    return []
  }

  const nodes: SidebarNode[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    const absEntry = path.join(absDir, entry.name)
    const relEntry = `${relFromDocs}/${entry.name}`

    if (entry.isDirectory()) {
      const node = processDir(absEntry, locale, relEntry)
      if (node) nodes.push(node)
    } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
      // skip index.mdx — it becomes the directory link if needed
      if (entry.name === 'index.mdx') continue

      let fileContent: string
      try {
        fileContent = fs.readFileSync(absEntry, 'utf-8')
      } catch {
        continue
      }
      const { data } = matter(fileContent)
      const label: string = data.sidebar_label ?? data.title ?? entry.name.replace(/\.mdx$/, '')
      const position: number = data.sidebar_position ?? 999
      const icon: string | undefined = data.sidebar_icon

      // Build the URL. Legacy vitepress absolute slug in a file under
      // docs/{locale}/docs/** is `/docs`-relative (see @lib/slug), so
      // apply the same convention here to keep sidebar links matching the
      // rendered URLs.
      let link: string
      if (data.slug && typeof data.slug === 'string' && data.slug.startsWith('/')) {
        // Match `${locale}/docs` (top-level docs dir) OR `${locale}/docs/…`.
        const inDocs =
          relFromDocs === `${locale}/docs` ||
          relFromDocs.startsWith(`${locale}/docs/`)
        const prefixed = inDocs ? `/docs${data.slug}` : data.slug
        link = locale === 'en' ? prefixed : `/${locale}${prefixed}`
      } else {
        link = urlFromAbsPath(absEntry, locale)
      }

      const node: SidebarNode = { label, link, position, collapsed: false }
      if (icon) node.icon = icon
      nodes.push(node)
    }
  }

  return sortByPosition(nodes)
}

/**
 * Sidebar scoping — legacy vitepress emits two distinct sidebars (see
 * openapi-website/docs/.vitepress/locales/en/sidebar.ts):
 *   `/docs/cli` → cli-only tree from docs/{locale}/docs/cli/**
 *   `/docs`    → full tree from docs/{locale}/docs/** excluding cli/
 *
 * Astro layout callers pass a `scope` derived from pathname to
 * `buildSidebar` so users navigating under /docs/cli see the CLI
 * sub-tree instead of the whole docs tree.
 */
export type SidebarScope = 'docs' | 'cli'

export function resolveSidebarScope(pathname: string): SidebarScope {
  // Strip locale prefix if present so `/zh-CN/docs/cli/foo` still resolves.
  const stripped = pathname.replace(/^\/(zh-CN|zh-HK)(?=\/|$)/, '')
  return stripped.startsWith('/docs/cli') ? 'cli' : 'docs'
}

/**
 * Build the sidebar tree for a given locale by reading the filesystem.
 * When `scope` is 'cli', reads docs/{locale}/docs/cli/**. When 'docs'
 * (default), reads docs/{locale}/docs/** with the `cli/` sub-directory
 * excluded so it doesn't leak into the main docs sidebar.
 * Works in both Node.js (vitest) and Astro server contexts.
 */
export function buildSidebar(
  locale: Locale | string,
  scope: SidebarScope = 'docs',
): SidebarNode[] {
  const loc = locale as Locale
  const rootDir = scope === 'cli'
    ? path.join(process.cwd(), 'docs', loc, 'docs', 'cli')
    : path.join(process.cwd(), 'docs', loc, 'docs')
  const rootRel = scope === 'cli' ? `${loc}/docs/cli` : `${loc}/docs`

  // Delegate to buildItems so top-level mdx files (e.g. cli/install.mdx,
  // cli/tui.mdx, cli/release-notes.mdx) become flat sidebar items alongside
  // the nested category groups — matching legacy vitepress genMarkdowDocs.
  const nodes = buildItems(rootDir, loc, rootRel)

  // scope='docs' must exclude the cli/ subtree — cli has its own sidebar.
  const filtered = scope === 'docs'
    ? nodes.filter((n) => n.label !== 'CLI' && !(n.link ?? '').startsWith('/docs/cli'))
    : nodes

  return sortByPosition(filtered)
}

export function flatSidebar(sidebar: SidebarNode[]): SidebarNode[] {
  const result: SidebarNode[] = []
  function walk(nodes: SidebarNode[]) {
    for (const node of nodes) {
      if (node.link) result.push(node)
      if (node.items) walk(node.items)
    }
  }
  walk(sidebar)
  return result
}

export function getPrevNext(
  sidebar: SidebarNode[],
  currentPath: string,
): { prev: SidebarNode | null; next: SidebarNode | null } {
  const flat = flatSidebar(sidebar)
  const idx = flat.findIndex((n) => n.link === currentPath)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? (flat[idx - 1] ?? null) : null,
    next: idx < flat.length - 1 ? (flat[idx + 1] ?? null) : null,
  }
}
