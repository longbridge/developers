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
  /** True for nodes derived from a directory (a category), false/absent for
   *  nodes derived from a single .mdx file. Lets the sidebar render a
   *  childless category (e.g. cli/ipo/, which has only index.mdx) as a bold
   *  top-level header link rather than a muted leaf. */
  isSection?: boolean
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
  let link = cat.link ?? undefined

  const items = buildItems(absDir, locale, relFromDocs)

  // A category folder whose only page is index.mdx (no child pages to expand,
  // e.g. cli/ipo/) has no items — surface it as a clickable link to that
  // index instead of a dead, unclickable node.
  if (!link && items.length === 0) {
    const indexPath = path.join(absDir, 'index.mdx')
    if (fs.existsSync(indexPath)) {
      link = urlFromAbsPath(indexPath, locale)
    }
  }

  const node: SidebarNode = {
    label,
    icon,
    position,
    collapsed,
    items: items.length > 0 ? items : undefined,
    isSection: true,
  }
  if (link) node.link = link

  return node
}

function buildItems(
  absDir: string,
  locale: Locale,
  relFromDocs: string,
  includeIndex = false,
): SidebarNode[] {
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
      // Nested index.mdx becomes the directory link (via _category_.json), so
      // skip it here. The ROOT index.mdx has no parent category to absorb it,
      // so `includeIndex` (set only by buildSidebar's root call) keeps it as a
      // top-level page — the legacy "Overview" (/docs) entry.
      if (entry.name === 'index.mdx' && !includeIndex) continue

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
      } else if (data.slug && typeof data.slug === 'string') {
        // Relative slug (no leading `/`): keep the file's DIRECTORY and use the
        // slug as the last path segment, replacing the filename. Must mirror
        // resolveUrl (slug.ts) exactly, or the sidebar/prev-next/breadcrumb
        // link won't match the page's real route — e.g. financial_report.mdx
        // with `slug: financial-report` routes to `…/financial-report` but the
        // filename-derived link would be `…/financial_report` (404).
        const dir = relFromDocs.split('/').slice(1).join('/') // strip locale seg
        const rel = ('/' + dir + '/' + data.slug).replace(/\/{2,}/g, '/')
        link = locale === 'en' ? rel : `/${locale}${rel}`
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
  // includeIndex=true keeps the root index.mdx as the top-level "Overview"
  // link (its sidebar_position -999 sorts it first).
  const nodes = buildItems(rootDir, loc, rootRel, true)

  // scope='docs' must exclude the cli/ subtree — cli has its own sidebar.
  const filtered = scope === 'docs'
    ? nodes.filter(
        (n) =>
          n.label !== 'CLI' &&
          !(n.link ?? '').startsWith('/docs/cli') &&
          // MCP has its own top-nav tab (like CLI); keep it out of the docs sidebar.
          n.label !== 'MCP' &&
          (n.link ?? '') !== '/docs/mcp',
      )
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

/**
 * Walk the sidebar tree to find the ancestor chain of a pathname.
 * Returns [{group}, ..., {current}] excluding the sitewide Home crumb
 * (the Breadcrumb component prepends Home itself). Returns [] when the
 * pathname is not reachable from the sidebar (e.g. marketing pages).
 */
export function findBreadcrumbTrail(
  sidebar: SidebarNode[],
  pathname: string,
): { text: string; href?: string }[] {
  const trail: { text: string; href?: string }[] = []
  function walk(nodes: SidebarNode[]): boolean {
    for (const node of nodes) {
      const nodeLink = node.link ?? ''
      if (nodeLink && nodeLink === pathname) {
        trail.push({ text: node.label, href: nodeLink })
        return true
      }
      if (node.items && node.items.length) {
        trail.push({ text: node.label, href: nodeLink || undefined })
        if (walk(node.items)) return true
        trail.pop()
      }
    }
    return false
  }
  walk(sidebar)
  return trail
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
