import { describe, it, expect } from 'vitest'
import { buildSidebar, resolveSidebarScope } from './navigation'

describe('buildSidebar', () => {
  it('returns a non-empty array for en', () => {
    const sidebar = buildSidebar('en')
    expect(sidebar.length).toBeGreaterThan(0)
  })

  it('zh-CN top-level count matches en', () => {
    const en = buildSidebar('en')
    const zhCN = buildSidebar('zh-CN')
    expect(zhCN.length).toBe(en.length)
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
