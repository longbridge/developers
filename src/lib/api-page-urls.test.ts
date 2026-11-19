import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { apiPageUrls } from './api-page-urls'
import { buildSeoLinks } from './page-meta'

const HOST = 'https://open.longbridge.com'
const raw = readFileSync(fileURLToPath(new URL('../../openapi.yaml', import.meta.url)), 'utf8')
const urls = apiPageUrls(raw)

describe('apiPageUrls', () => {
  it('三种语言各一份，和 /docs/api/[op] 路由一致', () => {
    const en = urls.filter((u) => u.startsWith('/docs/api/'))
    expect(en.length).toBeGreaterThan(0)
    expect(urls.filter((u) => u.startsWith('/zh-CN/docs/api/')).length).toBe(en.length)
    expect(urls.filter((u) => u.startsWith('/zh-HK/docs/api/')).length).toBe(en.length)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('API 单页拿到三语 hreflang 和 x-default，三个语言版本互指同一组地址', () => {
    const published = new Set(urls)
    const en = buildSeoLinks('/docs/api/top_movers.html', HOST, published)
    expect(en.canonical).toBe(`${HOST}/docs/api/top_movers`)
    expect(en.alternates.map((a) => [a.hreflang, a.href])).toEqual([
      ['en', `${HOST}/docs/api/top_movers`],
      ['zh-Hans', `${HOST}/zh-CN/docs/api/top_movers`],
      ['zh-Hant', `${HOST}/zh-HK/docs/api/top_movers`],
      ['x-default', `${HOST}/docs/api/top_movers`],
    ])
    const hk = buildSeoLinks('/zh-HK/docs/api/top_movers.html', HOST, published)
    expect(hk.canonical).toBe(`${HOST}/zh-HK/docs/api/top_movers`)
    expect(hk.alternates).toEqual(en.alternates)
  })
})
