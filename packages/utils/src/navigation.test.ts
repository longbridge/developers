import { describe, it, expect } from 'vitest'
import { buildSidebar, resolveSidebarScope, type SidebarNode } from './navigation'

describe('buildSidebar', () => {
  it('returns a non-empty array for en', () => {
    const sidebar = buildSidebar('en')
    expect(sidebar.length).toBeGreaterThan(0)
  })

  // en is the source of truth: zh-CN / zh-HK follow it, and en may legitimately
  // carry sections the translations don't (docs/en/docs/style-guide is EN-only).
  // So the invariant is containment, not equal counts — a translated section with
  // no en counterpart means a page was added to one locale only, or a slug drifted.
  //
  // Identity is the first page a node leads to, locale prefix stripped: labels are
  // translated, and most top-level nodes are directories with no `link` of their own.
  const sectionKey = (node: SidebarNode, locale: string): string => {
    const firstLink = (n: SidebarNode): string | undefined =>
      n.link ?? n.items?.reduce<string | undefined>((found, child) => found ?? firstLink(child), undefined)
    return (firstLink(node) ?? '').replace(new RegExp(`^/${locale}`), '')
  }

  it.each(['zh-CN', 'zh-HK'] as const)('%s top-level sections all exist in en', (locale) => {
    const enKeys = new Set(buildSidebar('en').map((n) => sectionKey(n, 'en')))
    const translated = buildSidebar(locale).map((n) => ({ label: n.label, key: sectionKey(n, locale) }))

    // Guard against the assertion going vacuous: every node must resolve to a page.
    expect(translated.filter((n) => n.key === '')).toEqual([])
    expect(translated.filter((n) => !enKeys.has(n.key))).toEqual([])
  })

  it('nodes are sorted by position ascending', () => {
    const sidebar = buildSidebar('en')
    for (let i = 1; i < sidebar.length; i++) {
      expect(sidebar[i].position).toBeGreaterThanOrEqual(sidebar[i - 1].position)
    }
  })
})

describe('mcp sidebar scope', () => {
  it('resolves /docs/mcp paths to the mcp scope', () => {
    expect(resolveSidebarScope('/docs/mcp')).toBe('mcp')
    expect(resolveSidebarScope('/zh-CN/docs/mcp/setup')).toBe('mcp')
    expect(resolveSidebarScope('/docs/mcpx')).toBe('docs')
  })

  it('builds the mcp tree and keeps it out of the docs tree', () => {
    const mcp = buildSidebar('en', 'mcp')
    expect(mcp[0].link).toBe('/docs/mcp')
    expect(mcp.every((n) => (n.link ?? '').startsWith('/docs/mcp'))).toBe(true)
    const docs = buildSidebar('en')
    expect(docs.some((n) => (n.link ?? '').startsWith('/docs/mcp'))).toBe(false)
  })
})
