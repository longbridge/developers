/**
 * schema.org 结构化数据（JSON-LD）：文档页的面包屑和技术文章，首页的网站和组织。
 *
 * 只用页面上已经有的数据（面包屑、标题、描述、git 更新时间），不新增取数。
 * 组织信息和 longbridge.com 首页的 Organization 保持同一个 @id、名称和标志，
 * 让搜索引擎把两个站认成同一家公司。
 *
 * 参考：
 * - https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
 * - https://developers.google.com/search/docs/appearance/structured-data/article
 * - https://developers.google.com/search/docs/appearance/site-names
 * - https://developers.google.com/search/docs/appearance/structured-data/organization
 * - https://schema.org/TechArticle 、https://schema.org/BreadcrumbList
 */

import { SITE_TITLE } from './site-title'

const SCHEMA = 'https://schema.org'

export const ORGANIZATION_ID = 'https://longbridge.com/#organization'
const ORGANIZATION_NAME = 'Longbridge'
const ORGANIZATION_URL = 'https://longbridge.com'
const ORGANIZATION_LOGO = 'https://assets.wbrks.com/assets/logo/logo1.png'

/** 全站分享图，og/twitter 和文章结构化数据共用。 */
export const OG_IMAGE = 'https://assets.lbctrl.com/uploads/b510b04f-9238-4fe0-b39d-11e076876ac1/longbridge-og.png'

const organizationRef = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: ORGANIZATION_NAME,
  url: ORGANIZATION_URL,
} as const

const organization = {
  ...organizationRef,
  logo: { '@type': 'ImageObject', url: ORGANIZATION_LOGO },
} as const

/** 站内路径转绝对地址，形态和 canonical 一致：根路径带斜杠，其他去掉末尾斜杠。 */
export function toAbsoluteUrl(host: string, href: string): string {
  const path = href.replace(/\/+$/, '')
  return path ? `${host}${path}` : `${host}/`
}

function isSitePath(href: unknown): href is string {
  return typeof href === 'string' && href.startsWith('/')
}

export interface Crumb {
  text: string
  href?: string
}

/**
 * 面包屑：和页面上显示的面包屑同一份数据。没有链接的中间分组跳过（Google 要求除最后一项外
 * 每项都有 item），最后一项是当前页，item 用 canonical。少于两项时没有意义，返回 null。
 */
export function breadcrumbListJsonLd(crumbs: Crumb[], host: string, pageUrl: string) {
  const items = crumbs.flatMap((c, i) => {
    const isLast = i === crumbs.length - 1
    if (isLast) return [{ name: c.text, item: pageUrl }]
    // 侧边栏分组的 link 来自 _category_.json，个别是旧格式的对象（如简体 quote/subscribe 的
    // { title, slug }），不是站内路径，按没有链接处理。
    return isSitePath(c.href) ? [{ name: c.text, item: toAbsoluteUrl(host, c.href) }] : []
  })
  if (items.length < 2) return null
  return {
    '@context': SCHEMA,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, ...it })),
  }
}

export interface TechArticleInput {
  headline: string
  description?: string
  locale: string
  url: string
  /** ISO 8601，带时区；取不到时不输出。 */
  dateModified?: string | null
}

export function techArticleJsonLd(input: TechArticleInput) {
  const { headline, description, locale, url, dateModified } = input
  return {
    '@context': SCHEMA,
    '@type': 'TechArticle',
    headline,
    ...(description ? { description } : {}),
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    ...(dateModified ? { dateModified } : {}),
    image: OG_IMAGE,
    author: organizationRef,
    publisher: organization,
  }
}

/**
 * 首页：WebSite（网站名用 <title> 里的品牌）和 Organization，各输出一段，用 @id 互相引用。
 * 分两段而不是一个 @graph，方便常见校验工具逐段识别类型。
 */
export function homeJsonLd(host: string, locale: string) {
  return [
    {
      '@context': SCHEMA,
      '@type': 'WebSite',
      '@id': `${host}/#website`,
      name: SITE_TITLE,
      url: `${host}/`,
      inLanguage: locale,
      publisher: { '@id': ORGANIZATION_ID },
    },
    { '@context': SCHEMA, ...organization },
  ]
}

/**
 * 写进 <script type="application/ld+json"> 的文本。转义 < > &，标题或描述里出现
 * `</script>` 也不会提前结束标签；转义后仍是合法 JSON。
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
}
