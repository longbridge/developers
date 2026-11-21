import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildUrlToId, createLastmodResolver, readDocSources, urlPath, type DocSource } from './sitemap-lastmod'

const HOST = 'https://open.longbridge.com'

const SOURCES: DocSource[] = [
  { id: 'en/index', data: { layout: false } },
  { id: 'en/sdk', data: {} },
  { id: 'en/docs/index', data: {} },
  { id: 'en/docs/api', data: { layout: 'api-reference' } },
  { id: 'en/docs/cli/orders/exchange-rate', data: {} },
  { id: 'en/docs/socket/protocol/how-to-parse-push', data: { slug: '/socket/protocol/push' } },
  { id: 'zh-CN/docs/socket/protocol/how-to-parse-push', data: { slug: '/socket/protocol/push' } },
  { id: 'zh-HK/docs/cli/index', data: {} },
]

const DATES: Record<string, string> = {
  'en/index': '2026-11-20T00:00:00+08:00',
  'en/sdk': '2026-11-20T00:00:00+08:00',
  'en/docs/index': '2026-09-01T00:00:00+08:00',
  'en/docs/api': '2026-11-20T00:00:00+08:00',
  'en/docs/cli/orders/exchange-rate': '2026-11-09T10:00:00+08:00',
  'en/docs/socket/protocol/how-to-parse-push': '2026-10-22T09:30:00+08:00',
  'zh-CN/docs/socket/protocol/how-to-parse-push': '2026-10-23T09:30:00+08:00',
}

const lastmod = createLastmodResolver(buildUrlToId(SOURCES), (id) => DATES[id] ?? null)

describe('urlPath', () => {
  it('去掉域名、尾斜杠和 .html', () => {
    expect(urlPath(`${HOST}/docs/cli/`)).toBe('/docs/cli')
    expect(urlPath(`${HOST}/docs/cli.html`)).toBe('/docs/cli')
    expect(urlPath(`${HOST}/`)).toBe('/')
  })
})

describe('sitemap lastmod', () => {
  it('普通 .mdx 文档页按文件路径对上日期', () => {
    expect(lastmod(`${HOST}/docs/cli/orders/exchange-rate`)).toBe('2026-11-09T10:00:00+08:00')
  })

  it('frontmatter slug 指定的网址对到真正的源文件', () => {
    expect(lastmod(`${HOST}/docs/socket/protocol/push`)).toBe('2026-10-22T09:30:00+08:00')
    expect(lastmod(`${HOST}/zh-CN/docs/socket/protocol/push`)).toBe('2026-10-23T09:30:00+08:00')
    // 按网址拼出来的文件名不存在，不能误配
    expect(lastmod(`${HOST}/docs/socket/protocol/how-to-parse-push`)).toBeUndefined()
  })

  it('index.mdx 对应目录网址', () => {
    expect(lastmod(`${HOST}/docs`)).toBe('2026-09-01T00:00:00+08:00')
  })

  it('取不到日期的不写', () => {
    // 源文件没有提交记录
    expect(lastmod(`${HOST}/zh-HK/docs/cli`)).toBeUndefined()
    // API Reference：/docs/api 是 api-reference 布局，/docs/api/<op> 由 openapi.yaml 生成
    expect(lastmod(`${HOST}/docs/api`)).toBeUndefined()
    expect(lastmod(`${HOST}/docs/api/get-quote`)).toBeUndefined()
    // 首页、营销页内容不在 .mdx 里
    expect(lastmod(`${HOST}/`)).toBeUndefined()
    expect(lastmod(`${HOST}/sdk`)).toBeUndefined()
  })

  it('git 历史为空（浅克隆）时一条都不写', () => {
    const none = createLastmodResolver(buildUrlToId(SOURCES), () => null)
    expect(none(`${HOST}/docs/cli/orders/exchange-rate`)).toBeUndefined()
  })
})

describe('readDocSources（仓库真实文档）', () => {
  const urlToId = buildUrlToId(readDocSources(join(process.cwd(), 'docs')))

  it('slug 改过网址的页面三种语言都能对上源文件', () => {
    expect(urlToId.get('/docs/socket/protocol/push')).toBe('en/docs/socket/protocol/how-to-parse-push')
    expect(urlToId.get('/zh-CN/docs/socket/protocol/push')).toBe('zh-CN/docs/socket/protocol/how-to-parse-push')
    expect(urlToId.get('/zh-HK/docs/socket/protocol/push')).toBe('zh-HK/docs/socket/protocol/how-to-parse-push')
  })

  it('不含 API Reference 和首页', () => {
    expect(urlToId.has('/docs/api')).toBe(false)
    expect(urlToId.has('/')).toBe(false)
  })
})
