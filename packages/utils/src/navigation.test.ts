import { describe, it, expect } from 'vitest'
import { buildSidebar } from './navigation'

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
