import { describe, expect, it } from 'vitest'
import {
  OG_IMAGE,
  ORGANIZATION_ID,
  breadcrumbListJsonLd,
  homeJsonLd,
  serializeJsonLd,
  techArticleJsonLd,
  toAbsoluteUrl,
} from './structured-data'

const HOST = 'https://open.longbridge.com'

describe('toAbsoluteUrl', () => {
  it('和 canonical 同一形态：根路径保留斜杠，其他去掉末尾斜杠', () => {
    expect(toAbsoluteUrl(HOST, '/')).toBe(`${HOST}/`)
    expect(toAbsoluteUrl(HOST, '/zh-CN/')).toBe(`${HOST}/zh-CN`)
    expect(toAbsoluteUrl(HOST, '/docs/account')).toBe(`${HOST}/docs/account`)
  })
})

describe('breadcrumbListJsonLd', () => {
  const page = `${HOST}/docs/account/dca/dca-stats`

  it('首页 + 侧边栏祖先 + 当前页，位置从 1 连续编号，最后一项指向本页', () => {
    const ld = breadcrumbListJsonLd(
      [
        { text: 'Home', href: '/' },
        { text: 'Account', href: '/docs/account' },
        { text: 'DCA', href: '/docs/account/dca' },
        { text: 'DCA Stats', href: '/docs/account/dca/dca-stats' },
      ],
      HOST,
      page,
    )
    expect(ld).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${HOST}/` },
        { '@type': 'ListItem', position: 2, name: 'Account', item: `${HOST}/docs/account` },
        { '@type': 'ListItem', position: 3, name: 'DCA', item: `${HOST}/docs/account/dca` },
        { '@type': 'ListItem', position: 4, name: 'DCA Stats', item: page },
      ],
    })
  })

  it('没有链接的中间分组跳过（Google 要求除最后一项外都带 item），位置重新连续编号', () => {
    const ld = breadcrumbListJsonLd(
      [
        { text: '首页', href: '/zh-CN/' },
        { text: '行情', href: undefined },
        { text: '订阅', href: '/zh-CN/docs/quote/subscribe' },
        { text: '订阅行情', href: undefined },
      ],
      HOST,
      `${HOST}/zh-CN/docs/quote/subscribe/subscribe`,
    )
    expect(ld?.itemListElement.map((i) => [i.position, i.name, i.item])).toEqual([
      [1, '首页', `${HOST}/zh-CN`],
      [2, '订阅', `${HOST}/zh-CN/docs/quote/subscribe`],
      [3, '订阅行情', `${HOST}/zh-CN/docs/quote/subscribe/subscribe`],
    ])
  })

  it('分组链接不是站内路径（旧格式对象）时当作没有链接，不报错', () => {
    const legacy = { title: '订阅', slug: '/quote/subscribe' } as unknown as string
    const ld = breadcrumbListJsonLd(
      [
        { text: '首页', href: '/zh-CN/' },
        { text: '订阅', href: legacy },
        { text: '订阅行情', href: '/zh-CN/docs/quote/subscribe/subscribe' },
      ],
      HOST,
      `${HOST}/zh-CN/docs/quote/subscribe/subscribe`,
    )
    expect(ld?.itemListElement.map((i) => i.name)).toEqual(['首页', '订阅行情'])
  })

  it('只剩一项时不输出', () => {
    expect(breadcrumbListJsonLd([{ text: 'Home', href: '/' }], HOST, `${HOST}/`)).toBeNull()
  })
})

describe('techArticleJsonLd', () => {
  it('标题、描述、语言、网址、更新时间齐全；作者和发布方指向长桥组织', () => {
    const ld = techArticleJsonLd({
      headline: 'DCA Stats',
      description: 'Get DCA statistics.',
      locale: 'en',
      url: `${HOST}/docs/account/dca/dca-stats`,
      dateModified: '2026-11-20T10:00:00+08:00',
    })
    expect(ld).toEqual({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: 'DCA Stats',
      description: 'Get DCA statistics.',
      inLanguage: 'en',
      url: `${HOST}/docs/account/dca/dca-stats`,
      mainEntityOfPage: `${HOST}/docs/account/dca/dca-stats`,
      dateModified: '2026-11-20T10:00:00+08:00',
      image: OG_IMAGE,
      author: { '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Longbridge', url: 'https://longbridge.com' },
      publisher: expect.objectContaining({ '@type': 'Organization', '@id': ORGANIZATION_ID, name: 'Longbridge' }),
    })
  })

  it('取不到描述和更新时间时不输出这两个字段', () => {
    const ld = techArticleJsonLd({ headline: '概览', locale: 'zh-HK', url: `${HOST}/zh-HK/docs` })
    expect(ld).not.toHaveProperty('description')
    expect(ld).not.toHaveProperty('dateModified')
    expect(ld.inLanguage).toBe('zh-HK')
  })
})

describe('homeJsonLd', () => {
  it('WebSite 和 Organization 各一段，用 @id 互相引用，网站名与 <title> 品牌一致', () => {
    const [site, org] = homeJsonLd(HOST, 'zh-CN')
    expect(site).toEqual({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${HOST}/#website`,
      name: 'Longbridge Developers',
      url: `${HOST}/`,
      inLanguage: 'zh-CN',
      publisher: { '@id': ORGANIZATION_ID },
    })
    expect(org).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'Longbridge',
      url: 'https://longbridge.com',
      logo: { '@type': 'ImageObject', url: expect.stringMatching(/^https:\/\/.+\.png$/) },
    })
  })
})

describe('serializeJsonLd', () => {
  it('转义 < 和 >，正文里的 </script> 不会提前结束脚本标签，且仍能解析回原对象', () => {
    const data = { headline: 'a </script><script>alert(1)</script> & b' }
    const out = serializeJsonLd(data)
    expect(out).not.toMatch(/<|>/)
    expect(JSON.parse(out)).toEqual(data)
  })
})
