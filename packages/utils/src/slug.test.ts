import { describe, it, expect } from 'vitest'
import { resolveUrl, resolveLocale } from './slug'
import type { CollectionEntry } from 'astro:content'

function mock(id: string, slug?: string): CollectionEntry<'docs'> {
  return {
    id,
    slug: id,
    body: '',
    collection: 'docs',
    data: { title: 't', slug } as any,
    render: async () => ({ Content: null, headings: [], remarkPluginFrontmatter: {} }),
  } as unknown as CollectionEntry<'docs'>
}

describe('resolveLocale', () => {
  it('en/... → en', () => expect(resolveLocale(mock('en/index.mdx'))).toBe('en'))
  it('zh-CN/... → zh-CN', () => expect(resolveLocale(mock('zh-CN/index.mdx'))).toBe('zh-CN'))
  it('zh-HK/... → zh-HK', () => expect(resolveLocale(mock('zh-HK/docs/quote.mdx'))).toBe('zh-HK'))
})

describe('resolveUrl (no explicit slug)', () => {
  it('en/index.mdx → /', () => expect(resolveUrl(mock('en/index.mdx'))).toBe('/'))
  it('en/docs/quote/pull/static.mdx → /docs/quote/pull/static', () =>
    expect(resolveUrl(mock('en/docs/quote/pull/static.mdx'))).toBe('/docs/quote/pull/static'))
  it('en/pricing/index.mdx → /pricing', () =>
    expect(resolveUrl(mock('en/pricing/index.mdx'))).toBe('/pricing'))
  it('zh-CN/docs/quote/pull/static.mdx → /zh-CN/docs/quote/pull/static', () =>
    expect(resolveUrl(mock('zh-CN/docs/quote/pull/static.mdx'))).toBe('/zh-CN/docs/quote/pull/static'))
  it('zh-HK/index.mdx → /zh-HK', () =>
    expect(resolveUrl(mock('zh-HK/index.mdx'))).toBe('/zh-HK'))
  it('en/sdk.mdx → /sdk', () => expect(resolveUrl(mock('en/sdk.mdx'))).toBe('/sdk'))
})

describe('resolveUrl (explicit slug)', () => {
  // Legacy vitepress semantics (Sprint 1.5 T3): for files under `<locale>/docs/**`
  // an absolute slug is `/docs`-relative, not site-absolute.
  it('absolute slug under docs/ gets /docs prefix', () =>
    expect(resolveUrl(mock('en/docs/anything.mdx', '/quote/pull/static'))).toBe('/docs/quote/pull/static'))
  it('absolute slug in zh-CN docs/ preserves locale + /docs prefix', () =>
    expect(resolveUrl(mock('zh-CN/docs/x.mdx', '/api'))).toBe('/zh-CN/docs/api'))
  // Files directly under `<locale>/` (marketing pages sdk / pricing / skill)
  // treat an absolute slug as site-absolute.
  it('absolute slug in marketing (top-level) file stays site-absolute', () =>
    expect(resolveUrl(mock('en/marketing.mdx', '/custom'))).toBe('/custom'))
  it('relative slug is dir-relative', () =>
    expect(resolveUrl(mock('en/docs/quote/index.mdx', 'pull/static'))).toBe('/docs/quote/pull/static'))
})

describe('resolveUrl (edge cases)', () => {
  it('strips trailing slash', () => expect(resolveUrl(mock('en/foo/index.mdx'))).toBe('/foo'))
  it('handles nested index', () => expect(resolveUrl(mock('en/a/b/index.mdx'))).toBe('/a/b'))
})
