import { describe, expect, it } from 'vitest'
import { buildSeoLinks, resolvePageDescription, resolvePageTitle } from './page-meta'

const HOST = 'https://open.longbridge.com'
const PUBLISHED = new Set(['/', '/zh-CN', '/zh-HK', '/docs', '/zh-CN/docs', '/zh-HK/docs', '/docs/style-guide'])

describe('buildSeoLinks', () => {
  it('首页（file 产物 /index.html）canonical 指向根路径，四条 hreflang 齐全', () => {
    const seo = buildSeoLinks('/index.html', HOST, PUBLISHED)
    expect(seo.canonical).toBe(`${HOST}/`)
    expect(seo.alternates).toEqual([
      { hreflang: 'en', href: `${HOST}/` },
      { hreflang: 'zh-Hans', href: `${HOST}/zh-CN` },
      { hreflang: 'zh-Hant', href: `${HOST}/zh-HK` },
      { hreflang: 'x-default', href: `${HOST}/` },
    ])
    expect(seo.markdown).toBe(`${HOST}/index.md`)
  })

  it('中文首页 canonical 自指，hreflang 与英文首页互指同一组地址', () => {
    const en = buildSeoLinks('/index.html', HOST, PUBLISHED)
    for (const pathname of ['/zh-CN.html', '/zh-CN/index.html', '/zh-CN']) {
      const zh = buildSeoLinks(pathname, HOST, PUBLISHED)
      expect(zh.canonical).toBe(`${HOST}/zh-CN`)
      expect(zh.alternates).toEqual(en.alternates)
    }
  })

  it('文档页输出与现网一致的 canonical 和 hreflang，并补 x-default', () => {
    const seo = buildSeoLinks('/zh-HK/docs.html', HOST, PUBLISHED)
    expect(seo.canonical).toBe(`${HOST}/zh-HK/docs`)
    expect(seo.alternates.map((a) => [a.hreflang, a.href])).toEqual([
      ['en', `${HOST}/docs`],
      ['zh-Hans', `${HOST}/zh-CN/docs`],
      ['zh-Hant', `${HOST}/zh-HK/docs`],
      ['x-default', `${HOST}/docs`],
    ])
    expect(seo.markdown).toBe(`${HOST}/zh-HK/docs.md`)
  })

  it('只有英文版的页面不声明不存在的中文版本', () => {
    const seo = buildSeoLinks('/docs/style-guide.html', HOST, PUBLISHED)
    expect(seo.alternates.map((a) => a.hreflang)).toEqual(['en', 'x-default'])
  })
})

describe('resolvePageTitle', () => {
  it('配置了 seo_title 时原样作为完整标题', () => {
    expect(resolvePageTitle({ title: 'MCP', seo_title: 'Longbridge MCP Server' })).toBe('Longbridge MCP Server')
  })

  it('未配置时保持「页面名 | Longbridge Developers」', () => {
    expect(resolvePageTitle({ title: 'MCP' })).toBe('MCP | Longbridge Developers')
  })
})

describe('resolvePageDescription', () => {
  it('优先使用 frontmatter description', () => {
    expect(resolvePageDescription({ description: ' Own text. ' }, 'Body paragraph.')).toBe('Own text.')
  })

  it('兜底取正文第一段纯文本，跳过标题、提示块和代码', () => {
    const body = [
      '# Longbridge MCP Service',
      '',
      '```bash',
      'echo hi',
      '```',
      '',
      'Longbridge provides a **hosted** MCP service for [market data](https://longbridge.com/markets) via `mcp`.',
      '',
      ':::tip MCP endpoint',
      'x',
      ':::',
    ].join('\n')
    expect(resolvePageDescription({}, body)).toBe(
      'Longbridge provides a hosted MCP service for market data via mcp.',
    )
  })

  it('跳过缩进代码块、只有链接的段落和过短段落', () => {
    const body = ['- item', '  ```', '  code', '  ```', '', 'Whereas,', '', 'https://open.longbridge.com/sdk', '', 'The real summary sentence.'].join('\n')
    expect(resolvePageDescription({}, body)).toBe('The real summary sentence.')
  })

  it('去掉紧贴段尾的提示块收尾 :::，跳过只有粗体的小标题段', () => {
    const body = ['**Enhancements**', '', ':::tip', 'Inside tip text here.', ':::', '', 'The documentation in this chapter.', ':::'].join('\n')
    expect(resolvePageDescription({}, body)).toBe('The documentation in this chapter.')
  })

  it('超长英文在词边界截断到约 155 字符并补省略号', () => {
    const desc = resolvePageDescription({}, 'word '.repeat(60))!
    expect(desc.length).toBeLessThanOrEqual(156)
    expect(desc.endsWith('word…')).toBe(true)
  })

  it('超长中文按字符截断', () => {
    const desc = resolvePageDescription({}, '长桥'.repeat(100))!
    expect(desc).toBe(`${'长桥'.repeat(100).slice(0, 155)}…`)
  })

  it('正文没有可用段落时返回 undefined', () => {
    expect(resolvePageDescription({}, '<NewHomePage/>')).toBeUndefined()
  })
})
