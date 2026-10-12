/**
 * 页面级 SEO 元信息：description 与 title 的来源规则（需求 M-24645944）。
 *
 * description 优先取 frontmatter `description`；没配就从该页自己的正文里取第一段
 * 纯文本兜底。只读本页正文，所以天然不会跨语言回落。
 */

import { composeTitle } from './site-title'

/** Google 摘要约在 155–160 字符处截断，兜底文案按这个长度收口。 */
export const DESCRIPTION_MAX = 155

interface PageMetaData {
  title?: string
  titleTemplate?: string
  seo_title?: string
  description?: string
}

/** 页面 `<title>`：frontmatter `seo_title` 是完整标题，原样使用；否则走品牌后缀规则。 */
export function resolvePageTitle(data: PageMetaData): string {
  return data.seo_title || composeTitle(data.title, data.titleTemplate)
}

/** 页面 meta description；正文也取不到时返回 undefined。 */
export function resolvePageDescription(data: PageMetaData, body: string | undefined): string | undefined {
  const own = data.description?.trim()
  if (own) return own
  const extracted = body ? extractFirstParagraph(body) : ''
  return extracted ? truncate(extracted, DESCRIPTION_MAX) : undefined
}

// 段落开头是这些符号的不算正文：标题、表格、列表、引用、提示块、JSX/HTML、图片、import/export。
const NON_PROSE = /^(#|\||:::|<|>|[-*+]\s|\d+\.\s|!\[|import\s|export\s|\{|```|~~~)/
const MIN_PARAGRAPH = 12

/** 取 MDX 正文里第一段 prose，转成纯文本。 */
export function extractFirstParagraph(body: string): string {
  // 列表里的代码块带缩进，围栏匹配要允许前导空白。
  const withoutCode = body.replace(/^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[^\n]*$/gm, '')
  for (const block of withoutCode.split(/\n\s*\n/)) {
    // 提示块的收尾 `:::` 常紧贴在段落末尾，不单独成段。
    const para = block.replace(/\n[ \t]*:::[ \t]*$/, '').trim()
    // 整段只有粗体的是小标题（如 `**Enhancements**`），不是摘要。
    if (!para || NON_PROSE.test(para) || /^(\*\*|__)[^\n]*\1$/.test(para)) continue
    const text = toPlainText(para)
    // 太短的（如法律文本开头的「Whereas,」）和只有一个链接的段落都不适合当摘要。
    if (weightedLength(text) >= MIN_PARAGRAPH && !/^https?:\/\/\S+$/.test(text)) return text
  }
  return ''
}

/** 中文字符按 2 计，让中英文短段落用同一个阈值。 */
function weightedLength(text: string): number {
  return text.length + (text.match(/[\u3400-\u9fff]/g)?.length ?? 0)
}

function toPlainText(md: string): string {
  return md
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(^|[^\w*])\*(?!\s)(.+?)\*/g, '$1$2')
    .replace(/\s*\{#[^}]+\}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export interface SeoLinks {
  canonical: string
  /** hreflang → URL；只包含真实存在的语言版本，x-default 指向英文版。 */
  alternates: { hreflang: string; href: string }[]
  /** `.md` 发现链接（llms 用），与 canonical 同路径。 */
  markdown: string
}

const HREFLANGS = [
  { hreflang: 'en', prefix: '' },
  { hreflang: 'zh-Hans', prefix: 'zh-CN' },
  { hreflang: 'zh-Hant', prefix: 'zh-HK' },
] as const

/**
 * 由构建时 pathname 推导 canonical 与 hreflang。
 *
 * `build.format:'file'` 下首页 pathname 是 `/index.html`，必须连同 `index` 一起剥掉，
 * 否则 canonical 会落到不存在的 `/index`。`published` 是站内真实存在的页面 URL
 * （`/`、`/docs`、`/zh-CN/docs/x` 形态），用来跳过没有对应译文的语言版本。
 */
export function buildSeoLinks(pathname: string, host: string, published: ReadonlySet<string>): SeoLinks {
  const localePath = pathname
    .replace(/\.html$/, '')
    .replace(/\/+$/, '')
    .replace(/^\//, '')
    .replace(/(^|\/)index$/, '')
  const neutralPath = localePath.replace(/^zh-(CN|HK)(\/|$)/, '')
  const url = (p: string) => (p ? `${host}/${p}` : `${host}/`)
  const join = (prefix: string, p: string) => [prefix, p].filter(Boolean).join('/')

  const alternates: SeoLinks['alternates'] = []
  for (const { hreflang, prefix } of HREFLANGS) {
    const p = join(prefix, neutralPath)
    if (published.has(`/${p}`)) alternates.push({ hreflang, href: url(p) })
  }
  const en = alternates.find((a) => a.hreflang === 'en')
  if (en) alternates.push({ hreflang: 'x-default', href: en.href })

  return {
    canonical: url(localePath),
    alternates,
    markdown: `${host}/${localePath ? `${localePath}.md` : 'index.md'}`,
  }
}

/** 超长时截断：有空格的文本退到最近的词边界，CJK 文本按字符截；末尾补省略号。 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const head = text.slice(0, max)
  const space = head.lastIndexOf(' ')
  const cut = space > max * 0.6 ? head.slice(0, space) : head
  return `${cut.replace(/[\s,，、;；:：.。]+$/, '')}…`
}
