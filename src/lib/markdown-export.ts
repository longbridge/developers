/**
 * 文档页的 Markdown 版（`/docs/<path>.md`，llms.txt 列出的给 AI 读的那份）。
 *
 * 原来两个 `.md` 路由直接返回 mdx 正文：没有页面标题，`<SDKLinks>`、`<QuotePermission>`
 * 只剩组件标签，AI 读不到接口对应的 SDK 方法和所需行情权限。这里统一补齐：
 * - 正文（去掉代码块和命令行块）没有一级标题时，开头补 `# <frontmatter title>`；
 * - `<SDKLinks … />` 展开成 SDK 方法名和各语言 SDK 参考文档链接，网址规则与网页组件共用；
 * - `<QuotePermission … />` 换成所需行情权限说明，文字取自 quote-permissions.yaml，与网页组件一致。
 * 代码块和行内代码里的组件示例（如写作规范页）原样保留。`<CliCommand>`、`:::` 提示块不处理。
 */

import type { Locale } from '@longbridge/openapi-utils'
import { resolveSdkLinks } from '@longbridge/openapi-ui/sdk-links'
import { quotePermissionCallout } from '@longbridge/openapi-api-reference/markdown'

export interface MarkdownExportInput {
  title?: string
  body: string
  locale: Locale
}

/** 生成文档页 `.md` 的完整文本。 */
export function renderMarkdownExport({ title, body, locale }: MarkdownExportInput): string {
  const expanded = mapOutsideCode(body, (text) => expandComponents(text, locale))
  const heading = title?.trim()
  if (!heading || hasH1(body)) return expanded
  return `# ${heading}\n\n${expanded.replace(/^\s+/, '')}`
}

// 围栏代码块（列表里的代码块带缩进，允许前导空白）。
const FENCE = /^[ \t]*(```|~~~)[\s\S]*?^[ \t]*\1[^\n]*$/gm
// 命令行块里的 `# 注释` 不是标题。
const CLI_BLOCK = /<CliCommand>[\s\S]*?<\/CliCommand>/g

/** 去掉代码块和命令行块后，正文有没有 `# ` 一级标题（或 `<h1`）。 */
export function hasH1(body: string): boolean {
  const prose = body.replace(FENCE, '').replace(CLI_BLOCK, '')
  return /^#[ \t]+\S/m.test(prose) || /^<h1[\s>]/im.test(prose)
}

/** 只对围栏代码块以外的部分做替换。 */
function mapOutsideCode(body: string, fn: (text: string) => string): string {
  let out = ''
  let last = 0
  for (const m of body.matchAll(FENCE)) {
    out += fn(body.slice(last, m.index)) + m[0]
    last = m.index + m[0].length
  }
  return out + fn(body.slice(last))
}

// 行内代码（不跨行）原样保留；自闭合的 SDKLinks、QuotePermission 展开。
const TOKEN = /(`+)[^\n]*?\1|<(SDKLinks|QuotePermission)\b([^>]*?)\/>/g

function expandComponents(text: string, locale: Locale): string {
  return text.replace(TOKEN, (match, tick: string | undefined, tag: string, rawAttrs: string) => {
    if (tick) return match
    const attrs = parseAttrs(rawAttrs)
    if (tag === 'SDKLinks') return sdkLinksMarkdown(attrs, locale) ?? match
    return quotePermissionCallout(
      { command: str(attrs.command), level: str(attrs.level), market: str(attrs.market) },
      // 组件上显式写了 locale 时以它为准，和网页 bindLocale 的行为一致。
      (str(attrs.locale) as Locale | undefined) ?? locale
    ).trimEnd()
  })
}

type AttrValue = string | boolean | number

/** 解析 JSX 属性：`a="x"`、`a='x'`、`a={false}`、布尔属性 `hideGo`、Vue 写法 `:title="false"`。 */
export function parseAttrs(raw: string): Record<string, AttrValue> {
  const attrs: Record<string, AttrValue> = {}
  for (const m of raw.matchAll(/(:?)([A-Za-z_][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\}))?/g)) {
    const [, bind, name, dq, sq, expr] = m
    const quoted = dq ?? sq
    if (quoted === undefined && expr === undefined) attrs[name] = true
    else if (expr !== undefined || bind) attrs[name] = evalLiteral(expr ?? quoted ?? '')
    else attrs[name] = quoted ?? ''
  }
  return attrs
}

function evalLiteral(expr: string): AttrValue {
  const v = expr.trim()
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(v)) return Number(v)
  const q = v.match(/^(["'`])([\s\S]*)\1$/)
  return q ? q[2] : v
}

const str = (v: AttrValue | undefined): string | undefined => (typeof v === 'string' && v ? v : undefined)

const SDK_METHOD_LABEL: Record<Locale, string> = {
  en: 'SDK method: ',
  'zh-CN': 'SDK 方法：',
  'zh-HK': 'SDK 方法：',
}

/** `<SDKLinks>` 的 Markdown：可选小标题（同网页，默认「SDK Links」）+ 方法名 + 各语言链接。 */
function sdkLinksMarkdown(attrs: Record<string, AttrValue>, locale: Locale): string | undefined {
  const method = str(attrs.method)
  if (!method) return undefined
  const links = resolveSdkLinks({
    module: str(attrs.module),
    klass: str(attrs.klass),
    method,
    go: str(attrs.go),
    java: str(attrs.java),
    hideGo: attrs.hideGo === true,
  })
  const title = attrs.title === false ? '' : attrs.title === true || attrs.title === undefined ? 'SDK Links' : String(attrs.title)
  const level = typeof attrs.level === 'number' ? attrs.level : Number(attrs.level ?? 2) || 2
  const lines: string[] = []
  if (title) lines.push(`${'#'.repeat(Math.min(Math.max(level, 2), 6))} ${title}`, '')
  lines.push(`${SDK_METHOD_LABEL[locale] ?? SDK_METHOD_LABEL.en}\`${method}\``, '')
  for (const link of links) lines.push(`- ${link.title}: [${link.label}](${link.url})`)
  return lines.join('\n')
}
