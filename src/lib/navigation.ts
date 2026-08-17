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

      // Build the URL
      let link: string
      if (data.slug && typeof data.slug === 'string' && data.slug.startsWith('/')) {
        link = locale === 'en' ? data.slug : `/${locale}${data.slug}`
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
 * Build the full sidebar tree for a given locale by reading the filesystem.
 * Works in both Node.js (vitest) and Astro server contexts.
 */
export function buildSidebar(locale: Locale | string): SidebarNode[] {
  const loc = locale as Locale
  const docsDir = path.join(process.cwd(), 'docs', loc, 'docs')

  let topEntries: fs.Dirent[]
  try {
    topEntries = fs.readdirSync(docsDir, { withFileTypes: true })
  } catch {
    return []
  }

  const nodes: SidebarNode[] = []

  for (const entry of topEntries) {
    if (!entry.isDirectory()) continue
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue

    const absDir = path.join(docsDir, entry.name)
    const relFromDocs = `${loc}/docs/${entry.name}`
    const node = processDir(absDir, loc, relFromDocs)
    if (node) nodes.push(node)
  }

  return sortByPosition(nodes)
}
