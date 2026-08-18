import { describe, it, expect, vi, afterEach } from 'vitest'
import { includedInRegion, currentRegion } from './region'

describe('includedInRegion', () => {
  it('global region always returns true', () => {
    expect(includedInRegion('/docs/cli', 'global')).toBe(true)
    expect(includedInRegion('/zh-CN/docs/cli', 'global')).toBe(true)
    expect(includedInRegion('/some/unknown/path', 'global')).toBe(true)
  })

  it('cn region includes only allowlisted pages', () => {
    // CLI page is in includePages for cn
    expect(includedInRegion('/docs/cli', 'cn')).toBe(true)
    // MCP page is in includePages for cn
    expect(includedInRegion('/docs/mcp', 'cn')).toBe(true)
    // Home page is NOT in includePages for cn
    expect(includedInRegion('/', 'cn')).toBe(false)
    // API docs are NOT in includePages for cn
    expect(includedInRegion('/docs/api', 'cn')).toBe(false)
    // Locale-prefixed versions follow the same rules
    expect(includedInRegion('/zh-CN/docs/cli', 'cn')).toBe(true)
    expect(includedInRegion('/zh-HK/docs/cli', 'cn')).toBe(true)
  })

  it('hk region includes all pages (no config defined)', () => {
    // 'hk' has no config in region.config.ts → defaults to include everything
    expect(includedInRegion('/docs/cli', 'hk')).toBe(true)
    expect(includedInRegion('/', 'hk')).toBe(true)
  })
})

describe('currentRegion', () => {
  afterEach(() => {
    // Reset import.meta.env.PUBLIC_REGION between tests
    vi.unstubAllEnvs()
  })

  it('returns global when PUBLIC_REGION is not set', () => {
    vi.stubEnv('PUBLIC_REGION', '')
    expect(currentRegion()).toBe('global')
  })

  it('returns cn when PUBLIC_REGION is cn', () => {
    vi.stubEnv('PUBLIC_REGION', 'cn')
    expect(currentRegion()).toBe('cn')
  })
})
