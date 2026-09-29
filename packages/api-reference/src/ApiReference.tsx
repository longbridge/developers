/**
 * ApiReference.tsx
 * Full CSR React port of ApiReference.vue (1370-line Vue SFC).
 * Handles sidebar navigation, URL routing (?op= / ?page=), endpoint detail,
 * page content, param sections, and code panel.
 */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { t } from '@longbridge/openapi-utils'
import type { Locale } from '@longbridge/openapi-utils'
import {
  parseSpec,
  localizeDocLinks,
  epId,
  buildCurl,
  buildResponseExample,
  endpointResponseExamples,
  pickLocale,
  PAGE_ICONS,
  type EndpointItem,
  type PageItem,
  type CodeBlock,
  type Section,
  type XParameter,
  type TagGroup,
  type SubGroup,
  type WsGroupData,
  type WsCommandItem,
} from './openapi-loader'
import { DOCS_ORDER, LEAF_FALLBACK } from './docs-order'
import { CodePanel, CodeTabs, CodeDropdown, highlightCode } from './CodeSample'
import { QuotePermission } from './QuotePermission'
import { EnvProvider } from './EnvContext'
import { EndpointUrlBar, CopyPageMenu } from './EndpointUrlBar'
import { RequestPanel } from './RequestPanel'
import { ResponsePanel } from './ResponsePanel'
import { AuthTable, AuthModeSelect } from './AuthTable'
import type { ApiResponse } from '@longbridge/openapi-tryit'
import { CliCommand } from '@longbridge/openapi-ui'
import MarkdownIt from 'markdown-it'
import container from 'markdown-it-container'

// ── markdown-it setup ─────────────────────────────────────────────────────────

const _md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: false,
  // Syntax-highlight fenced code blocks in x-page markdown with the same
  // highlighter the CodeTabs/CodePanel use, so page code matches endpoint code.
  highlight: (str, lang) => highlightCode(str, (lang || '').toLowerCase()),
})

// `:::type Title` admonitions → docs-style callout boxes (same DOM/CSS as the
// docs remark-callout output: `.callout.callout-<type>` + `.callout-title`).
const CALLOUT_TYPES = ['tip', 'warning', 'danger', 'info', 'note', 'caution', 'success']
for (const type of CALLOUT_TYPES) {
  // markdown-it-container ships types for a different @types/markdown-it build,
  // so its plugin signature doesn't unify with our MarkdownIt instance — cast.
  _md.use(container as unknown as Parameters<(typeof _md)['use']>[0], type, {
    render(tokens: any[], idx: number) {
      const token = tokens[idx]
      if (token.nesting === 1) {
        const raw = token.info.trim().slice(type.length).trim()
        const title = raw || type.charAt(0).toUpperCase() + type.slice(1)
        return `<div class="callout callout-${type}" role="note" data-lbus-component="callout-${type}">\n<p class="callout-title">${_md.utils.escapeHtml(title)}</p>\n`
      }
      return '</div>\n'
    },
  })
}

// Slug for heading anchors — keeps unicode letters/digits (so Chinese headings
// get stable ids), strips inline markdown marks. Shared by the heading-id rule
// and the sidebar section extractor so their ids match.
export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[`*_~]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  )
}

// Give every heading a stable `id` so sidebar section links can scroll to it.
_md.core.ruler.push('heading_ids', (state) => {
  const seen: Record<string, number> = {}
  const tokens = state.tokens
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'heading_open') continue
    const inline = tokens[i + 1]
    const text = inline && inline.content ? inline.content : ''
    let slug = slugify(text)
    if (seen[slug]) slug = `${slug}-${seen[slug]++}`
    else seen[slug] = 1
    tokens[i].attrSet('id', slug)
  }
})

// Patch link_open to add target="_blank" for external links
const _defLinkOpen = _md.renderer.rules.link_open
_md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  const hrefIdx = token.attrIndex('href')
  const href = hrefIdx >= 0 ? token.attrs![hrefIdx][1] : ''
  if (href && (href.startsWith('http') || href.startsWith('//'))) {
    token.attrPush(['target', '_blank'])
    token.attrPush(['rel', 'noopener noreferrer'])
  }
  return _defLinkOpen ? _defLinkOpen(tokens, idx, options, env, self) : self.renderToken(tokens, idx, options)
}

function renderMd(markdown: string, localePrefix: string): string {
  const localized = localizeDocLinks(markdown, localePrefix)
  return _md.render(localized)
}

// ── Locale prefix map ─────────────────────────────────────────────────────────

const LOCALE_PREFIX: Record<Locale, string> = {
  en: '',
  'zh-CN': '/zh-CN',
  'zh-HK': '/zh-HK',
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ApiReferenceProps {
  rawYaml: string
  locale: Locale
}

// ── Build sections for an endpoint ───────────────────────────────────────────

const PARAM_TITLE: Record<Locale, string> = { en: 'Parameters', 'zh-CN': '参数', 'zh-HK': '參數' }
const PARAM_NOTE: Record<Locale, string> = {
  en: 'SDK method parameters.',
  'zh-CN': 'SDK 方法参数。',
  'zh-HK': 'SDK 方法參數。',
}

// Docs-model section labels (trilingual).
const L = {
  request: { en: 'Request', 'zh-CN': '请求', 'zh-HK': '請求' },
  pathParams: { en: 'Path parameters', 'zh-CN': '路径参数', 'zh-HK': '路徑參數' },
  queryParams: { en: 'Query parameters', 'zh-CN': '查询参数', 'zh-HK': '查詢參數' },
  requestBody: { en: 'Request body', 'zh-CN': '请求体', 'zh-HK': '請求體' },
  response: { en: 'Response', 'zh-CN': '响应', 'zh-HK': '響應' },
  responseProps: { en: 'Response properties', 'zh-CN': '响应字段', 'zh-HK': '響應欄位' },
  responseJson: { en: 'Response JSON example', 'zh-CN': '响应 JSON 示例', 'zh-HK': '響應 JSON 示例' },
  errorCode: { en: 'Error code', 'zh-CN': '错误码', 'zh-HK': '錯誤碼' },
  name: { en: 'Name', 'zh-CN': '名称', 'zh-HK': '名稱' },
  type: { en: 'Type', 'zh-CN': '类型', 'zh-HK': '類型' },
  required: { en: 'Required', 'zh-CN': '必填', 'zh-HK': '必填' },
  description: { en: 'Description', 'zh-CN': '说明', 'zh-HK': '說明' },
  errorCodeBody: {
    en: 'See the ',
    'zh-CN': '参见',
    'zh-HK': '參見',
  },
  errorCodeLink: { en: 'Error Codes', 'zh-CN': '错误码文档', 'zh-HK': '錯誤碼文檔' },
  apiKeyNoteBody: {
    en: 'Shown with OAuth (Bearer). For API-Key auth, sign the request — see ',
    'zh-CN': '示例使用 OAuth（Bearer）。如用 API Key 鉴权，请对请求签名 —— 见',
    'zh-HK': '示例使用 OAuth（Bearer）。如用 API Key 鑑權，請對請求簽名 —— 見',
  },
  authorization: { en: 'Authorization', 'zh-CN': '鉴权', 'zh-HK': '鑑權' },
  authorizationDesc: {
    en: 'Access token issued for the account, sent as `Authorization: Bearer <access_token>`.',
    'zh-CN': '账户签发的 access token，通过 `Authorization: Bearer <access_token>` 发送。',
    'zh-HK': '帳戶簽發的 access token，通過 `Authorization: Bearer <access_token>` 發送。',
  },
  tryIt: { en: 'Try it', 'zh-CN': 'Try it', 'zh-HK': 'Try it' },
  close: { en: 'Close', 'zh-CN': '关闭', 'zh-HK': '關閉' },
  menu: { en: 'Menu', 'zh-CN': '菜单', 'zh-HK': '選單' },
} as const

type RowVM = { name: string; type: string; required: boolean; description: string }
function rowsFrom(xs: XParameter[] | undefined, locale: Locale): RowVM[] {
  return (xs ?? []).map((p) => ({
    name: p.name,
    type: p.type ?? 'string',
    required: !!p.required,
    description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
  }))
}

// Plain table — rendered inside `article.docs-content`, so it inherits the
// exact docs table styling.
function ParamTable({ rows, locale }: { rows: RowVM[]; locale: Locale }) {
  if (!rows.length) return null
  return (
    <table className="api-fields">
      <thead>
        <tr>
          <th>{L.name[locale]}</th>
          <th>{L.type[locale]}</th>
          <th>{L.required[locale]}</th>
          <th>{L.description[locale]}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={`${row.name}-${i}`}>
            <td>
              <code>{row.name}</code>
            </td>
            <td>{row.type}</td>
            <td>{row.required ? t(locale, 'api.param.required') : t(locale, 'api.param.optional')}</td>
            <td>{row.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// Breadcrumb — replicates src/components/shell/Breadcrumb.tsx so the DOM/styling
// matches docs (`.docs-content [data-lbus-component="breadcrumb"]`).
function DocsBreadcrumb({ items, locale }: { items: { text: string; href?: string }[]; locale: Locale }) {
  const homeHref = locale === 'en' ? '/' : `/${locale}/`
  const all = [{ text: t(locale, 'breadcrumb.home'), href: homeHref }, ...items]
  return (
    <nav aria-label="Breadcrumb" data-lbus-component="breadcrumb">
      <ol
        className="flex flex-wrap items-center gap-2 p-0 m-0 list-none text-sm text-[color:var(--lb-fg-2)]"
        role="list">
        {all.map((item, index) => {
          const isLast = index === all.length - 1
          return (
            <li key={`${item.text}-${index}`} className="inline-flex items-center gap-2">
              {item.href && !isLast ? (
                <a href={item.href} className="text-inherit no-underline hover:text-[color:var(--lbus-c-text)]">
                  {item.text}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-semibold text-[color:var(--lbus-c-text)]' : undefined}>
                  {item.text}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-[color:var(--lb-fg-3)]">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Slim doc footer — replicates src/components/shell/DocFooter.astro (styled by
// `.docs-doc-footer` in docs.css). Rendered inside `.docs-inner` like docs.
function DocFooterRow({ locale }: { locale: Locale }) {
  const lp = (p: string) => (locale === 'en' ? p : `/${locale}${p}`)
  const sgBase = locale === 'en' ? 'https://longbridge.com/sg' : 'https://longbridge.com/sg/zh-CN'
  const left = [
    { label: 'Longbridge', href: 'https://longbridge.com', ext: true },
    { label: t(locale, 'footer.download'), href: 'https://longbridge.com/download', ext: true },
    { label: t(locale, 'footer.terms'), href: `${sgBase}/support/topics/us-trade/user-agreement`, ext: true },
    { label: t(locale, 'footer.privacy'), href: `${sgBase}/support/topics/Other/privacy-policy`, ext: true },
  ]
  const right = [
    { label: 'SDK', href: lp('/sdk') },
    { label: 'MCP', href: lp('/docs/mcp') },
    {
      label: 'ChatGPT App',
      href: 'https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef',
      ext: true,
    },
    { label: 'Claude Connector', href: 'https://claude.ai/directory/connectors/longbridge', ext: true },
    { label: 'CLI', href: lp('/docs/cli') },
    { label: 'LLM', href: lp('/docs/llm') },
    { label: t(locale, 'footer.assets'), href: lp('/docs/assets') },
    { label: 'Navi', href: 'https://navi-lang.org', ext: true },
    { label: t(locale, 'footer.feedback'), href: 'https://github.com/longbridge/developers/issues', ext: true },
  ]
  const ext = (e?: boolean) => (e ? { target: '_blank', rel: 'noreferrer' } : {})
  return (
    <footer className="docs-doc-footer" data-lbus-component="docs-footer">
      <div className="docs-doc-footer__group">
        {left.map((l) => (
          <a key={l.label} href={l.href} {...ext(l.ext)}>
            {l.label}
          </a>
        ))}
      </div>
      <div className="docs-doc-footer__group">
        {right.map((l) => (
          <a key={l.label} href={l.href} {...ext(l.ext)}>
            {l.label}
          </a>
        ))}
        <a
          className="docs-doc-footer__github"
          href="https://github.com/longbridge"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
            aria-hidden="true">
            <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z" />
          </svg>
        </a>
      </div>
    </footer>
  )
}

// Drop the leading CRUD/read verb from an endpoint name — the HTTP method badge
// already conveys the action, so "Query Signals" → "Signals", "Get Signal
// Detail" → "Signal Detail", "更新定投" → "定投". Falls back to the original if
// stripping would leave nothing.
const VERB_EN =
  /^(Query|List|Get|Fetch|Retrieve|Return|Show|Create|Add|New|Update|Modify|Set|Replace|Delete|Remove|Cancel|Submit|Estimate|Calculate|Calc|Check|Search|Pin|Unpin|Enable|Disable|Suspend|Restart|Toggle|Download|Export|Register|Bind|Subscribe|Unsubscribe|Apply)\s+/i
const VERB_ZH =
  /^(查询|获取|列出|返回|显示|创建|新建|新增|更新|修改|设置|替换|删除|移除|取消|提交|估算|计算|校验|检查|搜索|置顶|启用|禁用|暂停|重启|切换|下载|导出|注册|绑定|订阅|退订|应用)/
// Move a leading market qualifier to a parenthetical suffix, so the topic reads
// first: "US Crypto Overview" → "Crypto Overview (US)", "美股加密货币概览" →
// "加密货币概览（美股）".
const MARKET_EN = /^(US|HK|SG|CN|A-Share)\s+(.+)$/
const MARKET_ZH = /^(美股|港股|A股|新加坡)(.+)$/
function marketToSuffix(name: string): string {
  const mEn = MARKET_EN.exec(name)
  if (mEn) return `${mEn[2]} (${mEn[1]})`
  const mZh = MARKET_ZH.exec(name)
  if (mZh) return `${mZh[2]}（${mZh[1]}）`
  return name
}
// Drop a "Push · " / "推送 · " prefix (the WS badge already marks it as push) and
// a redundant "Warrant" / "权证" prefix (already under the Warrants group).
function stripRedundantPrefix(name: string): string {
  return name
    .replace(/^(Push|推送|推播)\s*[·:]\s*/, '')
    .replace(/^(Warrant|权证|權證|轮证|輪證)\s*/, '')
}
function stripLeadingVerb(name: string): string {
  const n = stripRedundantPrefix(name)
  const re = /^[㐀-鿿]/.test(n) ? VERB_ZH : VERB_EN
  const stripped = n.replace(re, '').trim()
  return marketToSuffix(stripped.length > 0 ? stripped : n)
}
// WS command names keep their leading verb — Subscribe / Unsubscribe / 订阅 / 取消
// are the meaning, not noise — so only strip the push/warrant prefix + market.
function wsLeafName(name: string): string {
  return marketToSuffix(stripRedundantPrefix(name))
}

// Icons for the top-level groups, matching the CLI docs category icons (lucide),
// so the API Reference sidebar reads like the CLI sidebar.
const ICO = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`
const GROUP_ICONS: Record<string, string> = {
  Quote: ICO('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>'),
  Fundamental: ICO('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>'),
  Market: ICO('<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>'),
  Screener: ICO('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'),
  Trade: ICO('<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'),
  Account: ICO('<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
  'AI Agent': ICO('<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>'),
  'News & Contents': ICO('<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>'),
}

// Subgroup order from the docs guide subfolder positions
// (docs/{lang}/docs/<group>/<sub>/_category_.json). WS protocol groups map onto
// their docs subfolder (Subscription → "Subscribe"); anything unlisted sorts last.
const DOCS_SUB_ORDER: Record<string, number> = {
  Subscribe: 2,
  Stocks: 3,
  Options: 4,
  Warrants: 5,
  Analytics: 7,
  Watchlist: 9,
  Fundamentals: 1,
  'Market Data': 2,
  'Market Status': 4,
  'Financial Calendar': 6,
  Order: 3,
  'Grid Trading': 3.5,
  Execution: 4,
  Assets: 5,
  Portfolio: 1,
  Alerts: 2,
  DCA: 3,
  News: 1,
  Topics: 2,
  Sharelist: 3,
  Workspace: 0,
  Conversation: 1,
}
const subRank = (name: string) =>
  name in DOCS_SUB_ORDER ? DOCS_SUB_ORDER[name] : Number.MAX_SAFE_INTEGER

// Sidebar item class strings — identical to the docs Sidebar (SidebarItem.tsx)
// so they share Tailwind output and render pixel-identically.
const NAV_LEAF =
  'flex items-center w-full text-left bg-transparent border-0 cursor-pointer rounded-lg py-1 px-2 text-[14px] leading-6 no-underline'
const NAV_LEAF_ACTIVE =
  'bg-[color-mix(in_oklab,var(--lb-brand)_10%,transparent)] text-[color:var(--lb-brand)] font-medium'
const NAV_LEAF_IDLE = 'text-[color:var(--lb-fg-2)] hover:text-[color:var(--lb-brand)]'

function Caret({ open }: { open: boolean }) {
  return (
    <span
      className="ml-auto inline-flex items-center justify-center shrink-0 text-[color:var(--lb-fg-3)]"
      aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  )
}

/** Render a flat list of endpoint leaves (shared by groups and subgroups). */
function EndpointLeaves({
  endpoints,
  activeOp,
  onSelect,
  locale,
}: {
  endpoints: EndpointItem[]
  activeOp: string | null
  onSelect: (id: string) => void
  locale: Locale
}) {
  return (
    <>
      {endpoints.map((ep) => {
        const id = epId(ep)
        const active = activeOp === id
        const summary = stripLeadingVerb(
          pickLocale(
            ep.operation.summary,
            ep.operation['x-summary-zh'],
            ep.operation['x-summary-zh-hk'],
            locale
          )
        )
        return (
          <li key={id} className="list-none">
            <button
              type="button"
              onClick={() => onSelect(id)}
              aria-current={active ? 'page' : undefined}
              className={`${NAV_LEAF} ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
              <span className={`nav-method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
              <span className="flex-1 min-w-0 truncate">{summary}</span>
            </button>
          </li>
        )
      })}
    </>
  )
}

/** A docs subsection: a nested collapsible level between group and endpoints. */
function ApiSidebarSubGroup({
  sub,
  activeOp,
  activeWs,
  onSelect,
  onWs,
  locale,
  forceOpen,
}: {
  sub: SubGroup
  activeOp: string | null
  activeWs: string | null
  onSelect: (id: string) => void
  onWs: (id: string) => void
  locale: Locale
  forceOpen: boolean
}) {
  const hasActive =
    sub.endpoints.some((ep) => epId(ep) === activeOp) ||
    !!sub.wsCommands?.some((c) => c.id === activeWs)
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen || open || hasActive
  const label = pickLocale(sub.name, sub.nameZh, sub.nameZhHk, locale)
  return (
    <li data-lbus-component="sidebar-subgroup" className="list-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
        className="group flex items-center w-full bg-transparent border-0 cursor-pointer text-left rounded-lg pl-3 pr-2 py-1 text-[13px] leading-6">
        <span className="flex-1 min-w-0 truncate font-semibold text-[color:var(--lb-fg-2)] group-hover:text-[color:var(--lb-brand)]">
          {label}
        </span>
        <Caret open={isOpen} />
      </button>
      {isOpen && (
        <ul className="list-none py-0 m-0 pl-2 flex flex-col gap-[2px]" role="list">
          {[
            ...sub.endpoints.map((ep) => {
              const id = epId(ep)
              const active = activeOp === id
              return {
                ord: DOCS_ORDER[id] ?? LEAF_FALLBACK,
                node: (
                  <li key={`e:${id}`} className="list-none">
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      aria-current={active ? 'page' : undefined}
                      className={`${NAV_LEAF} ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
                      <span className={`nav-method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
                      <span className="flex-1 min-w-0 truncate">
                        {stripLeadingVerb(
                          pickLocale(ep.operation.summary, ep.operation['x-summary-zh'], ep.operation['x-summary-zh-hk'], locale)
                        )}
                      </span>
                    </button>
                  </li>
                ),
              }
            }),
            ...(sub.wsCommands ?? []).map((c) => {
              const active = activeWs === c.id
              return {
                ord: DOCS_ORDER[c.id] ?? LEAF_FALLBACK,
                node: (
                  <li key={`w:${c.id}`} className="list-none">
                    <button
                      type="button"
                      onClick={() => onWs(c.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`${NAV_LEAF} ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
                      <span className="nav-method method-ws">WS</span>
                      <span className="flex-1 min-w-0 truncate">
                        {wsLeafName(pickLocale(c.name, c.nameZh, c.nameZhHk, locale))}
                      </span>
                    </button>
                  </li>
                ),
              }
            }),
          ]
            .sort((a, b) => a.ord - b.ord)
            .map((x) => x.node)}
        </ul>
      )}
    </li>
  )
}

function ApiSidebarGroup({
  group,
  wsGroups,
  activeOp,
  activeWs,
  onSelect,
  onWs,
  locale,
  forceOpen,
}: {
  group: TagGroup
  wsGroups: WsGroupData[]
  activeOp: string | null
  activeWs: string | null
  onSelect: (id: string) => void
  onWs: (id: string) => void
  locale: Locale
  forceOpen: boolean
}) {
  const hasActive =
    group.endpoints.some((ep) => epId(ep) === activeOp) ||
    group.subgroups.some(
      (sg) =>
        sg.endpoints.some((ep) => epId(ep) === activeOp) ||
        !!sg.wsCommands?.some((c) => c.id === activeWs)
    )
  const [open, setOpen] = useState(true)
  const isOpen = forceOpen || open || hasActive
  const label = pickLocale(group.name, group.nameZh, group.nameZhHk, locale)
  return (
    <li data-lbus-component="sidebar-group" className="list-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
        className="group flex items-center gap-2 w-full bg-transparent border-0 cursor-pointer text-left rounded-lg px-2 py-1 text-[14px] leading-6">
        <span
          className="nav-ico inline-flex items-center justify-center shrink-0 w-4 text-[color:var(--lb-fg-3)]"
          aria-hidden="true"
          dangerouslySetInnerHTML={GROUP_ICONS[group.name] ? { __html: GROUP_ICONS[group.name] } : undefined}
        />
        <span className="flex-1 min-w-0 truncate font-bold text-[color:var(--lb-fg-1)] group-hover:text-[color:var(--lb-brand)]">
          {label}
        </span>
        <Caret open={isOpen} />
      </button>
      {isOpen && (
        <ul className="list-none py-0 m-0 flex flex-col gap-[2px]" role="list">
          <EndpointLeaves endpoints={group.endpoints} activeOp={activeOp} onSelect={onSelect} locale={locale} />
          {[
            ...group.subgroups.map((sg) => ({
              rank: subRank(sg.name),
              node: (
                <ApiSidebarSubGroup
                  key={`s:${sg.name}`}
                  sub={sg}
                  activeOp={activeOp}
                  activeWs={activeWs}
                  onSelect={onSelect}
                  onWs={onWs}
                  locale={locale}
                  forceOpen={forceOpen}
                />
              ),
            })),
            ...wsGroups.map((wg) => ({
              rank: subRank(wg.name),
              node: <WsSidebarGroup key={`w:${wg.name}`} group={wg} activeWs={activeWs} onSelect={onWs} locale={locale} forceOpen={forceOpen} />,
            })),
          ]
            .sort((a, b) => a.rank - b.rank)
            .map((x) => x.node)}
        </ul>
      )}
    </li>
  )
}

// WebSocket quote functions — a sidebar group alongside the HTTP endpoint
// groups. Each command opens its own detail view (/docs/api/<id>).
function WsSidebarGroup({
  group,
  activeWs,
  onSelect,
  locale,
  forceOpen = false,
}: {
  group: WsGroupData
  activeWs: string | null
  onSelect: (id: string) => void
  locale: Locale
  forceOpen?: boolean
}) {
  const hasActive = group.commands.some((c) => c.id === activeWs)
  const [open, setOpen] = useState(false)
  const isOpen = forceOpen || open || hasActive
  const label = pickLocale(group.name, group.nameZh, group.nameZhHk, locale)
  return (
    <li data-lbus-component="sidebar-subgroup" className="list-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
        className="group flex items-center w-full bg-transparent border-0 cursor-pointer text-left rounded-lg pl-3 pr-2 py-1 text-[13px] leading-6">
        <span className="flex-1 min-w-0 truncate font-semibold text-[color:var(--lb-fg-2)] group-hover:text-[color:var(--lb-brand)]">
          {label}
        </span>
        <Caret open={isOpen} />
      </button>
      {isOpen && (
        <ul className="list-none py-0 m-0 pl-2 flex flex-col gap-[2px]" role="list">
          {group.commands.map((c) => {
            const active = activeWs === c.id
            return (
              <li key={c.id} className="list-none">
                <button
                  type="button"
                  onClick={() => onSelect(c.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`${NAV_LEAF} ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
                  <span className="nav-method method-ws">WS</span>
                  <span className="flex-1 min-w-0 truncate">{pickLocale(c.name, c.nameZh, c.nameZhHk, locale)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

const L_WS = {
  request: { en: 'Request', 'zh-CN': '请求', 'zh-HK': '請求' },
  push: { en: 'Push', 'zh-CN': '推送', 'zh-HK': '推送' },
  callExample: { en: 'Call example', 'zh-CN': '调用示例', 'zh-HK': '調用示例' },
  example: { en: 'Example', 'zh-CN': '示例', 'zh-HK': '示例' },
  responseExample: { en: 'Response example', 'zh-CN': '响应示例', 'zh-HK': '響應示例' },
  pushExample: { en: 'Push example', 'zh-CN': '推送示例', 'zh-HK': '推送示例' },
  reqParams: { en: 'Request parameters', 'zh-CN': '请求参数', 'zh-HK': '請求參數' },
  respFields: { en: 'Response fields', 'zh-CN': '响应字段', 'zh-HK': '響應欄位' },
  pushFields: { en: 'Push fields', 'zh-CN': '推送字段', 'zh-HK': '推送欄位' },
} as const

function wsBlocks(cmd: WsCommandItem): CodeBlock[] {
  return cmd.requestExamples.map((s) => ({ lang: s.lang.toLowerCase(), code: s.source, label: s.label }))
}

/** WebSocket command — center column (mirrors the endpoint detail: title, a
 *  method/URL-style bar, then description). Call example + response live in the
 *  right rail (WsRail), exactly like an HTTP endpoint. */
function WsDetail({ cmd, tag, locale, localePrefix, onOpenRail }: { cmd: WsCommandItem; tag: string; locale: Locale; localePrefix: string; onOpenRail?: () => void }) {
  const title = pickLocale(cmd.name, cmd.nameZh, cmd.nameZhHk, locale)
  const desc = pickLocale(cmd.description, cmd.descriptionZh, cmd.descriptionZhHk, locale)
  return (
    <>
      {tag && <p className="ep-tag">{tag}</p>}
      <div className="ep-titlebar">
        <h1 className="ep-title">{title}</h1>
        <CopyPageMenu operationId={cmd.id} localePrefix={localePrefix} locale={locale} />
      </div>
      <div className="ep-urlbar" data-lbus-component="ws-bar">
        <span className="ep-method-badge method-ws">WS</span>
        <code className="ep-urlbar-url">
          {(cmd.direction === 'push' ? L_WS.push : L_WS.request)[locale]}
          {cmd.cmd != null ? ` · cmd ${cmd.cmd}` : ''}
        </code>
        {onOpenRail && (
          <button type="button" className="ep-urlbar-tryit" onClick={onOpenRail}>
            {L_WS.example[locale]}
          </button>
        )}
      </div>
      {desc && <div className="prose vp-doc" dangerouslySetInnerHTML={{ __html: renderMd(desc, localePrefix) }} />}
      {cmd.quoteCommand && (
        <section className="api-section">
          <QuotePermission command={cmd.quoteCommand} locale={locale} />
        </section>
      )}
      {cmd.fields && cmd.fields.length > 0 && (
        <section className="api-section">
          <h2>{L_WS.reqParams[locale]}</h2>
          <ParamTable rows={rowsFrom(cmd.fields, locale)} locale={locale} />
        </section>
      )}
      {cmd.responseFields && cmd.responseFields.length > 0 && (
        <section className="api-section">
          <h2>{(cmd.direction === 'push' ? L_WS.pushFields : L_WS.respFields)[locale]}</h2>
          <ParamTable rows={rowsFrom(cmd.responseFields, locale)} locale={locale} />
        </section>
      )}
      {cmd.responseExample && (
        <section className="api-section">
          <h3>{L.responseJson[locale]}</h3>
          <CodeTabs
            blocks={[{ label: 'JSON', lang: 'json', code: cmd.responseExample.trim() }]}
            labelCopy={t(locale, 'api.copy')}
            labelCopied={t(locale, 'api.copied')}
          />
        </section>
      )}
    </>
  )
}

/** WebSocket command — right rail: call example (SDK, language dropdown) + a
 *  response/push JSON card. Mirrors the endpoint rail (RequestPanel/ResponsePanel). */
function WsRail({ cmd, locale, labelCopy, labelCopied, open, onClose }: { cmd: WsCommandItem; locale: Locale; labelCopy: string; labelCopied: string; open: boolean; onClose: () => void }) {
  const blocks = wsBlocks(cmd)
  return (
    <>
    <div
      className={`api-rail-scrim${open ? ' open' : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <aside className={`api-rail${open ? ' open' : ''}`} data-lbus-component="ws-rail">
      <button
        type="button"
        className="api-rail-close"
        aria-label={L.close[locale]}
        onClick={onClose}>
        ✕
      </button>
      {blocks.length > 0 && (
        <section className="api-rail-card">
          <div className="api-rail-head">
            <span className="api-rail-title">{L_WS.callExample[locale]}</span>
          </div>
          <CodeDropdown blocks={blocks} labelCopy={labelCopy} labelCopied={labelCopied} />
        </section>
      )}
      {cmd.responseExample && (
        <section className="api-rail-card">
          <div className="api-rail-head">
            <span className="api-rail-title">{(cmd.direction === 'push' ? L_WS.pushExample : L_WS.responseExample)[locale]}</span>
          </div>
          <pre className="code-pre ws-response">
            <code dangerouslySetInnerHTML={{ __html: highlightCode(cmd.responseExample.trim(), 'json') }} />
          </pre>
        </section>
      )}
    </aside>
    </>
  )
}

function buildSections(ep: EndpointItem, locale: Locale): Section[] {
  const sections: Section[] = []

  // Auth section — always shown
  const authSection: Section = {
    key: 'authorizations',
    title: t(locale, 'api.sections.authorizations'),
    params: [
      {
        name: 'Authorization',
        type: 'string',
        location: 'header',
        required: true,
        description: 'Bearer <token>',
      },
    ],
  }
  sections.push(authSection)

  // Preferred: a single flat "Parameters" table (docs `## Parameters`).
  const xp = ep.operation['x-parameters']
  if (xp?.length) {
    sections.push({
      key: 'parameters',
      title: PARAM_TITLE[locale] ?? 'Parameters',
      note: PARAM_NOTE[locale],
      params: xp.map((p) => ({
        name: p.name,
        type: p.type ?? 'string',
        location: '',
        required: !!p.required,
        description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
      })),
    })
    return sections
  }

  // Path params
  const pathParams = (ep.operation.parameters ?? []).filter((p) => p.in === 'path')
  if (pathParams.length) {
    sections.push({
      key: 'pathParams',
      title: t(locale, 'api.sections.pathParams'),
      params: pathParams.map((p) => ({
        name: p.name,
        type: p.schema?.type ?? 'string',
        location: 'path',
        required: p.required ?? false,
        description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
      })),
    })
  }

  // Query params
  const queryParams = (ep.operation.parameters ?? []).filter((p) => p.in === 'query')
  if (queryParams.length) {
    sections.push({
      key: 'queryParams',
      title: t(locale, 'api.sections.queryParams'),
      params: queryParams.map((p) => ({
        name: p.name,
        type: p.schema?.type ?? 'string',
        location: 'query',
        required: p.required ?? false,
        description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
      })),
    })
  }

  // Request body
  const schema = ep.operation.requestBody?.content?.['application/json']?.schema
  if (schema) {
    const props = schema.properties ?? {}
    const required: string[] = schema.required ?? []
    const bodyParams = Object.entries(props).map(([name, v]: [string, any]) => ({
      name,
      type: v.type ?? 'object',
      location: 'body',
      required: required.includes(name),
      description: pickLocale(v.description, v['x-description-zh'], v['x-description-zh-hk'], locale),
    }))
    sections.push({
      key: 'body',
      title: t(locale, 'api.sections.body'),
      params: bodyParams,
      fallback: bodyParams.length === 0,
    })
  }

  // Response (200)
  const resp200 = ep.operation.responses?.['200']
  if (resp200) {
    const respSchema = resp200.content?.['application/json']?.schema
    const respProps = respSchema?.properties ?? {}
    const responseParams = Object.entries(respProps).map(([name, v]: [string, any]) => ({
      name,
      type: v.type ?? 'object',
      location: 'response',
      required: false,
      description: pickLocale(v.description, v['x-description-zh'], v['x-description-zh-hk'], locale),
    }))
    sections.push({
      key: 'response',
      title: t(locale, 'api.sections.response'),
      params: responseParams,
    })
  }

  return sections
}

// ── Build code blocks for an endpoint ────────────────────────────────────────

function buildCodeBlocks(ep: EndpointItem, serverUrl: string, locale: Locale): CodeBlock[] {
  const blocks: CodeBlock[] = []

  // Request example = the real HTTP call to the path (curl), not SDK code.
  // WebSocket operations have no HTTP request line.
  if (ep.method !== 'WEBSOCKET') {
    blocks.push({
      lang: 'bash',
      code: buildCurl(ep, serverUrl),
      label: t(locale, 'api.code.request'),
    })
  }

  // Response example
  const respEx = buildResponseExample(ep)
  if (respEx) {
    blocks.push({
      lang: 'json',
      code: respEx,
      label: t(locale, 'api.code.response'),
    })
  }

  return blocks
}

/** Extract the CLI sample (rendered as its own block, docs-style). */
function cliSample(ep: EndpointItem | null): string {
  if (!ep) return ''
  const s = ep.operation['x-codeSamples']?.find((x) => x.label === 'CLI' || x.lang.toLowerCase() === 'shell')
  return s?.source ?? ''
}

// ── Main component ────────────────────────────────────────────────────────────

export function ApiReference({ rawYaml, locale }: ApiReferenceProps) {
  const localePrefix = LOCALE_PREFIX[locale] ?? ''

  // Parse spec once
  const { groups, pages, wsGroups, serverUrl } = useMemo(() => parseSpec(rawYaml), [rawYaml])

  // Every WS command id (merged into subgroups + standalone groups) so path-based
  // routing (/docs/api/<id>) can tell a WS command from a REST operationId.
  const wsIdSet = useMemo(() => {
    const s = new Set<string>()
    for (const g of groups) for (const sg of g.subgroups) for (const c of sg.wsCommands ?? []) s.add(c.id)
    for (const g of wsGroups) for (const c of g.commands) s.add(c.id)
    return s
  }, [groups, wsGroups])

  // ── URL state ─────────────────────────────────────────────────────────────
  // Canonical URLs are path-based: `/docs/api/<operationId>` (locale-prefixed).
  // The legacy `?op=` / `?page=` query form is still honored for old links.
  const apiBase = `${localePrefix}/docs/api`
  const getRoute = () => {
    if (typeof window === 'undefined') return { op: null, page: null, ws: null }
    const path = window.location.pathname.replace(/\/+$/, '')
    if (path.startsWith(apiBase + '/')) {
      const seg = path.slice(apiBase.length + 1)
      if (seg && !seg.includes('/')) {
        const id = decodeURIComponent(seg)
        // A path segment is a WS command when it matches a known ws id, else an
        // endpoint operationId.
        return wsIdSet.has(id)
          ? { op: null, page: null, ws: id }
          : { op: id, page: null, ws: null }
      }
    }
    const p = new URLSearchParams(window.location.search)
    return { op: p.get('op'), page: p.get('page'), ws: p.get('ws') }
  }
  // With no explicit route, /docs/api lands on the Overview page (no separate
  // "API Reference" intro screen).
  const resolvePage = (q: { op: string | null; page: string | null; ws: string | null }) =>
    q.page ?? (!q.op && !q.ws ? 'overview' : null)

  const [activeOp, setActiveOp] = useState<string | null>(() => getRoute().op)
  const [activePage, setActivePage] = useState<string | null>(() => resolvePage(getRoute()))
  const [activeWs, setActiveWs] = useState<string | null>(() => getRoute().ws)

  // Listen for popstate
  useEffect(() => {
    function onPop() {
      const q = getRoute()
      setActiveOp(q.op)
      setActivePage(resolvePage(q))
      setActiveWs(q.ws)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Navigate to endpoint → /docs/api/<id>
  // Scroll the content back to the top on navigation, like a fresh page load.
  const scrollTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  // Narrow-screen (<lg) only: the left nav is an off-canvas drawer.
  const [navOpen, setNavOpen] = useState(false)

  const selectEndpoint = useCallback(
    (id: string) => {
      window.history.pushState({}, '', `${apiBase}/${id}`)
      setActiveOp(id)
      setActivePage(null)
      setActiveWs(null)
      setNavOpen(false)
      scrollTop()
    },
    [apiBase]
  )

  // Navigate to page → /docs/api?page=<id> (pages stay on the query form)
  const selectPage = useCallback(
    (id: string) => {
      window.history.pushState({}, '', `${apiBase}?page=${id}`)
      setActivePage(id)
      setActiveOp(null)
      setActiveWs(null)
      setNavOpen(false)
      scrollTop()
    },
    [apiBase]
  )

  // Navigate to a WebSocket command → /docs/api/<id> (path-based, like endpoints;
  // getRoute resolves the segment to a WS command via wsIdSet).
  const selectWs = useCallback(
    (id: string) => {
      window.history.pushState({}, '', `${apiBase}/${id}`)
      setActiveWs(id)
      setActiveOp(null)
      setActivePage(null)
      setNavOpen(false)
      scrollTop()
    },
    [apiBase]
  )

  // ── Search ────────────────────────────────────────────────────────────────
  // The nav filter is driven by the global header search; no in-sidebar box.
  const [query] = useState('')
  const rootRef = useRef<HTMLDivElement>(null)

  // Add a copy button to each x-page markdown code block (rendered as raw HTML,
  // so enhanced imperatively rather than via a React component).
  const copyLabel = t(locale, 'api.copy')
  const copiedLabel = t(locale, 'api.copied')
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // Icon-only copy button, matching the reference's other code blocks.
    const COPY_SVG =
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
    const CHECK_SVG =
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>'
    const pres = root.querySelectorAll<HTMLElement>('.api-page-md pre')
    const cleanups: Array<() => void> = []
    pres.forEach((pre) => {
      if (pre.querySelector('.page-copy-btn')) return
      pre.style.position = 'relative'
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'page-copy-btn'
      btn.innerHTML = COPY_SVG
      btn.setAttribute('aria-label', copyLabel)
      btn.title = copyLabel
      const onClick = () => {
        const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = CHECK_SVG
          btn.setAttribute('aria-label', copiedLabel)
          btn.title = copiedLabel
          window.setTimeout(() => {
            btn.innerHTML = COPY_SVG
            btn.setAttribute('aria-label', copyLabel)
            btn.title = copyLabel
          }, 1500)
        })
      }
      btn.addEventListener('click', onClick)
      pre.appendChild(btn)
      cleanups.push(() => btn.remove())
    })
    return () => cleanups.forEach((c) => c())
  }, [activePage, locale, copyLabel, copiedLabel])

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    const matchEp = (ep: EndpointItem) => {
      const op = ep.operation
      const summary = (op.summary ?? '') + ' ' + (op['x-summary-zh'] ?? '') + ' ' + (op['x-summary-zh-hk'] ?? '')
      return (
        ep.path.toLowerCase().includes(q) ||
        summary.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        (op.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
      )
    }
    return groups
      .map((g) => ({
        ...g,
        endpoints: g.endpoints.filter(matchEp),
        subgroups: g.subgroups
          .map((sg) => ({ ...sg, endpoints: sg.endpoints.filter(matchEp) }))
          .filter((sg) => sg.endpoints.length > 0),
      }))
      .filter((g) => g.endpoints.length > 0 || g.subgroups.length > 0)
  }, [groups, query])

  // ── Find active endpoint / page ───────────────────────────────────────────
  const activeEndpoint = useMemo<EndpointItem | null>(() => {
    if (!activeOp) return null
    for (const g of groups) {
      const found =
        g.endpoints.find((ep) => epId(ep) === activeOp) ??
        g.subgroups.flatMap((sg) => sg.endpoints).find((ep) => epId(ep) === activeOp)
      if (found) return found
    }
    return null
  }, [groups, activeOp])

  const activePg = useMemo<PageItem | null>(() => {
    if (!activePage) return null
    return pages.find((p) => p.id === activePage) ?? null
  }, [pages, activePage])

  // ── Derive data for active endpoint ──────────────────────────────────────
  const epSections = useMemo<Section[]>(
    () => (activeEndpoint ? buildSections(activeEndpoint, locale) : []),
    [activeEndpoint, locale]
  )

  // Docs-model data (new endpoints authored with x-request-examples)
  const isDocsModel = !!activeEndpoint?.operation['x-request-examples']
  const xparams = activeEndpoint?.operation['x-parameters']
  const epPathParams = useMemo(
    () =>
      rowsFrom(
        (xparams ?? []).filter((p) => p.in === 'path'),
        locale
      ),
    [xparams, locale]
  )
  const epQueryParams = useMemo(
    () =>
      rowsFrom(
        (xparams ?? []).filter((p) => p.in === 'query'),
        locale
      ),
    [xparams, locale]
  )
  const epBodyParams = useMemo(
    () =>
      rowsFrom(
        (xparams ?? []).filter((p) => p.in === 'body'),
        locale
      ),
    [xparams, locale]
  )
  const hasParams = epPathParams.length + epQueryParams.length + epBodyParams.length > 0
  const epRespProps = useMemo(
    () => rowsFrom(activeEndpoint?.operation['x-response-properties'], locale),
    [activeEndpoint, locale]
  )
  // Fallback response JSON example, shown when an endpoint documents no response
  // fields so every endpoint still has a Response section.
  const epRespExample = useMemo(
    () => (activeEndpoint ? buildResponseExample(activeEndpoint) : null),
    [activeEndpoint]
  )

  // Authored OAuth (Bearer) request samples for the right rail's OAuth mode.
  const epReqExamples = useMemo<CodeBlock[]>(
    () =>
      (activeEndpoint?.operation['x-request-examples'] ?? []).map((s) => ({
        lang: s.lang.toLowerCase(),
        code: s.source,
        label: s.label,
      })),
    [activeEndpoint]
  )

  const epCodeBlocks = useMemo<CodeBlock[]>(
    () => (activeEndpoint ? buildCodeBlocks(activeEndpoint, serverUrl, locale) : []),
    [activeEndpoint, serverUrl, locale]
  )

  const epProse = useMemo<string>(() => {
    if (!activeEndpoint) return ''
    const op = activeEndpoint.operation
    const raw = pickLocale(op.description, op['x-description-zh'], op['x-description-zh-hk'], locale)
    // Render the full description (prose + embedded code blocks such as
    // protobuf) so WebSocket / quote message schemas show inline, matching the
    // docs page style.
    return raw ? renderMd(raw, localePrefix) : ''
  }, [activeEndpoint, locale, localePrefix])

  const epCli = useMemo(() => cliSample(activeEndpoint), [activeEndpoint])

  const epTag = useMemo<string>(() => {
    if (!activeEndpoint) return ''
    const tag = activeEndpoint.operation.tags?.[0] ?? ''
    // find localized name from groups
    const grp = groups.find((g) => g.name === tag)
    return pickLocale(tag, grp?.nameZh, grp?.nameZhHk, locale)
  }, [activeEndpoint, groups, locale])

  // ── Page content ──────────────────────────────────────────────────────────
  // Page markdown, split at the [[SIGNING_TABS]] marker so a CodeTabs component
  // can be injected in the middle (Authentication page signing implementations).
  const pageParts = useMemo(() => {
    if (!activePg) return { before: '', after: '' }
    const raw = pickLocale(activePg.content, activePg.contentZh, activePg.contentZhHk, locale)
    const [before, after = ''] = raw.split('[[SIGNING_TABS]]')
    return {
      before: before ? renderMd(before, localePrefix) : '',
      after: after ? renderMd(after, localePrefix) : '',
    }
  }, [activePg, locale, localePrefix])

  // The active WebSocket command (detail view) + its group, if any.
  const activeWsCmd = useMemo<WsCommandItem | null>(() => {
    if (!activeWs) return null
    for (const g of wsGroups) {
      const c = g.commands.find((x) => x.id === activeWs)
      if (c) return c
    }
    // WS commands merged into topical subgroups live on the tag groups.
    for (const g of groups) {
      for (const s of g.subgroups) {
        const c = s.wsCommands?.find((x) => x.id === activeWs)
        if (c) return c
      }
    }
    return null
  }, [activeWs, wsGroups, groups])
  const activeWsGroup = useMemo<WsGroupData | null>(() => {
    if (!activeWs) return null
    const g0 = wsGroups.find((g) => g.commands.some((c) => c.id === activeWs))
    if (g0) return g0
    for (const g of groups) {
      for (const s of g.subgroups) {
        if (s.wsCommands?.some((c) => c.id === activeWs))
          return { name: s.name, nameZh: s.nameZh, nameZhHk: s.nameZhHk, tag: g.name, commands: s.wsCommands }
      }
    }
    return null
  }, [activeWs, wsGroups, groups])
  // Top-level group label for the WS eyebrow/breadcrumb (mirrors epTag for REST).
  const wsTag = useMemo<string>(() => {
    if (!activeWsGroup) return ''
    const tag = activeWsGroup.tag ?? activeWsGroup.name
    const grp = groups.find((g) => g.name === tag)
    return pickLocale(tag, grp?.nameZh, grp?.nameZhHk, locale)
  }, [activeWsGroup, groups, locale])

  // Live TryIt response for the right-rail Response panel; cleared per endpoint.
  const [liveResp, setLiveResp] = useState<ApiResponse | null>(null)
  // Narrow-screen only: the request rail becomes an on-demand drawer.
  const [railOpen, setRailOpen] = useState(false)
  useEffect(() => {
    setLiveResp(null)
    setRailOpen(false)
  }, [activeOp, activeWs])
  useEffect(() => {
    if (!railOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRailOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [railOpen])
  useEffect(() => {
    if (!navOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navOpen])
  // Narrow-screen reveal bar: slides down once scrolled (mirrors docs LocalNav).
  const [navRevealed, setNavRevealed] = useState(false)
  useEffect(() => {
    const onScroll = () => setNavRevealed(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  const showWs = !!activeWsCmd
  const showPage = !!activePg && !showWs
  const showEndpoint = !!activeEndpoint && !showWs

  // Breadcrumb trail (Home is prepended by DocsBreadcrumb).
  const crumbs: { text: string; href?: string }[] =
    showWs && activeWsCmd && activeWsGroup
      ? [
          ...(wsTag ? [{ text: wsTag }] : []),
          { text: pickLocale(activeWsCmd.name, activeWsCmd.nameZh, activeWsCmd.nameZhHk, locale) },
        ]
      : showEndpoint && activeEndpoint
        ? [
            ...(epTag ? [{ text: epTag }] : []),
            {
              text: stripLeadingVerb(
                pickLocale(
                  activeEndpoint.operation.summary,
                  activeEndpoint.operation['x-summary-zh'],
                  activeEndpoint.operation['x-summary-zh-hk'],
                  locale
                )
              ),
            },
          ]
        : activePg
          ? [{ text: pickLocale(activePg.title, activePg.titleZh, activePg.titleZhHk, locale) }]
          : []

  return (
    <EnvProvider>
    <div ref={rootRef} data-lbus-component="api-reference" className="docs-layout">
      {/* Narrow-screen nav — same mechanism as docs/cli pages: a reveal bar that
          slides down on scroll with a "菜单" toggle, a slide-in sidebar drawer and
          a backdrop. (Re-created here rather than importing the app shell, which
          this package can't depend on; markup/behaviour mirror LocalNav/Sidebar/
          Backdrop.) */}
      <div
        className="lg:hidden fixed left-0 right-0 top-[60px] z-20 transition-transform duration-200 will-change-transform"
        style={{ transform: navRevealed ? 'translateY(0)' : 'translateY(-100%)', pointerEvents: navRevealed ? 'auto' : 'none' }}
        data-lbus-component="local-nav">
        <div className="flex items-center h-12 px-4 bg-[var(--lb-bg-1)] border-b border-[color:var(--lb-stroke)]">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-[12px] font-medium text-[color:var(--lb-fg-3)] hover:text-[color:var(--lb-fg-1)]"
            aria-label={L.menu[locale]}
            aria-expanded={navOpen}
            onClick={() => setNavOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {L.menu[locale]}
          </button>
        </div>
      </div>
      {navOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          data-lbus-component="backdrop"
          aria-hidden="true"
          onClick={() => setNavOpen(false)}
        />
      )}
      {/* ── Sidebar (docs sidebar DOM) ── */}
      <aside
        data-lbus-component="sidebar"
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-[color:var(--lb-stroke)] bg-[var(--lbus-c-bg)] px-6 py-6 transition-transform duration-200 ${navOpen ? 'translate-x-0' : '-translate-x-full'} lg:sticky lg:top-[60px] lg:z-auto lg:inset-y-auto lg:h-[calc(100vh-60px)] lg:translate-x-0`}
        aria-label="API navigation">
        <nav aria-label="API navigation">
          {/* Static pages — a bare (header-less) group, like docs Overview/Getting Started */}
          {pages.length > 0 && (
            <ul className="list-none p-0 m-0 flex flex-col gap-[2px]" role="list">
              {pages.map((pg) => {
                const active = activePage === pg.id
                const icon = pg.icon ? PAGE_ICONS[pg.icon] : undefined
                return (
                  <li key={pg.id} className="list-none">
                    <button
                      type="button"
                      onClick={() => selectPage(pg.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`${NAV_LEAF} gap-2 ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
                      <span
                        className="nav-ico inline-flex items-center justify-center shrink-0 w-4 text-[color:var(--lb-fg-3)]"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={icon ? { __html: icon } : undefined}
                      />
                      <span className="flex-1 min-w-0 truncate">
                        {pickLocale(pg.title, pg.titleZh, pg.titleZhHk, locale)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {/* Tag groups — each a collapsible section separated by a divider. WS
              command groups are merged into the tag they belong to (x-tag). */}
          {filteredGroups.map((g) => (
            <div key={g.name} className="border-t border-[color:var(--app-card-stroke)] mt-[10px] pt-[10px]">
              <ul className="list-none p-0 m-0 flex flex-col gap-[2px]" role="list">
                <ApiSidebarGroup
                  group={g}
                  wsGroups={wsGroups.filter((w) => w.tag === g.name)}
                  activeOp={activeOp}
                  activeWs={activeWs}
                  onSelect={selectEndpoint}
                  onWs={selectWs}
                  locale={locale}
                  forceOpen={!!query.trim()}
                />
              </ul>
            </div>
          ))}
          {/* WS groups whose tag has no matching HTTP group (fallback) */}
          {wsGroups.filter((w) => !filteredGroups.some((g) => g.name === w.tag)).length > 0 && (
            <div className="border-t border-[color:var(--app-card-stroke)] mt-[10px] pt-[10px]">
              <ul className="list-none p-0 m-0 flex flex-col gap-[2px]" role="list">
                {wsGroups
                  .filter((w) => !filteredGroups.some((g) => g.name === w.tag))
                  .map((wg) => (
                    <WsSidebarGroup key={wg.name} group={wg} activeWs={activeWs} onSelect={selectWs} locale={locale} forceOpen={!!query.trim()} />
                  ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>

      <div className="docs-body">
        <div className="docs-inner">
          <div className={`docs-main${(showEndpoint && isDocsModel) || showWs ? ' has-rail' : ''}`}>
            <article className="docs-content">
              <DocsBreadcrumb items={crumbs} locale={locale} />
              {/* ── WebSocket command detail (center) ── */}
              {showWs && activeWsCmd && (
                <WsDetail cmd={activeWsCmd} tag={wsTag} locale={locale} localePrefix={localePrefix} onOpenRail={() => setRailOpen(true)} />
              )}
              {/* ── Page content ── */}
              {showPage && activePg && (
                <>
                  {/* Inject the page title as H1 only when the body has none (mirrors DocsLayout). */}
                  {!/<h1[ >]/.test(pageParts.before) && (
                    <h1 className="ep-title">
                      {pickLocale(activePg.title, activePg.titleZh, activePg.titleZhHk, locale)}
                    </h1>
                  )}
                  <div className="api-page-md" dangerouslySetInnerHTML={{ __html: pageParts.before }} />
                  {activePg.codeTabs?.length ? (
                    <div className="api-page-codetabs">
                      <CodeTabs
                        blocks={activePg.codeTabs.map((s) => ({
                          lang: s.lang.toLowerCase(),
                          code: s.source,
                          label: s.label,
                        }))}
                        labelCopy={t(locale, 'api.copy')}
                        labelCopied={t(locale, 'api.copied')}
                      />
                    </div>
                  ) : null}
                  {pageParts.after && (
                    <div className="api-page-md" dangerouslySetInnerHTML={{ __html: pageParts.after }} />
                  )}
                </>
              )}

              {/* ── Endpoint detail ── */}
              {showEndpoint && activeEndpoint && (
                <>
                  {epTag && <p className="ep-tag">{epTag}</p>}
                  <div className="ep-titlebar">
                    <h1 className="ep-title">
                      {stripLeadingVerb(
                        pickLocale(
                          activeEndpoint.operation.summary,
                          activeEndpoint.operation['x-summary-zh'],
                          activeEndpoint.operation['x-summary-zh-hk'],
                          locale
                        )
                      )}
                    </h1>
                    <CopyPageMenu
                      operationId={activeEndpoint.operation.operationId}
                      localePrefix={localePrefix}
                      locale={locale}
                    />
                  </div>

                  {/* URL bar: method + full URL + copy URL + (narrow-only) Try it */}
                  <EndpointUrlBar
                    method={activeEndpoint.method}
                    path={activeEndpoint.path}
                    locale={locale}
                    onTryIt={isDocsModel ? () => setRailOpen(true) : undefined}
                    tryItLabel={L.tryIt[locale]}
                  />

                  {/* Authorization — prerequisite for calling the endpoint, kept near the top */}
                  <section className="api-section">
                    <div className="api-auth-head">
                      <h2>{L.authorization[locale]}</h2>
                      <AuthModeSelect locale={locale} />
                    </div>
                    <AuthTable locale={locale} />
                  </section>

                  {/* Permission (quote permission) — endpoint-specific, stays near the top */}
                  {(activeEndpoint.operation['x-quote-command'] ||
                    activeEndpoint.operation['x-quote-level'] ||
                    activeEndpoint.operation['x-quote-market']) && (
                    <section className="api-section">
                      <QuotePermission
                        command={activeEndpoint.operation['x-quote-command']}
                        level={activeEndpoint.operation['x-quote-level']}
                        market={activeEndpoint.operation['x-quote-market']}
                        locale={locale}
                      />
                    </section>
                  )}

                  {/* Prose description */}
                  {epProse && <div className="prose vp-doc" dangerouslySetInnerHTML={{ __html: epProse }} />}

                  {/* CLI — reuse the docs CliCommand card for pixel parity */}
                  {epCli && <CliCommand code={epCli} locale={locale} />}

                  {isDocsModel ? (
                    <>
                      {/* ── Request ── */}
                      <h2 id="request">{L.request[locale]}</h2>

                      {hasParams ? (
                        <div id="parameters">
                          {epPathParams.length > 0 && (
                            <section className="api-section">
                              <h3>{L.pathParams[locale]}</h3>
                              <ParamTable rows={epPathParams} locale={locale} />
                            </section>
                          )}
                          {epQueryParams.length > 0 && (
                            <section className="api-section">
                              <h3>{L.queryParams[locale]}</h3>
                              <ParamTable rows={epQueryParams} locale={locale} />
                            </section>
                          )}
                          {epBodyParams.length > 0 && (
                            <section className="api-section">
                              <h3>{L.requestBody[locale]}</h3>
                              <ParamTable rows={epBodyParams} locale={locale} />
                            </section>
                          )}
                        </div>
                      ) : (
                        <p className="param-fallback">{t(locale, 'api.fallback')}</p>
                      )}

                      {/* Request Example + Response JSON now render in the right rail. */}

                      {/* ── Response ── field table (when documented) + JSON example */}
                      {(epRespProps.length > 0 || epRespExample) && (
                        <>
                          <h2 id="response">{L.response[locale]}</h2>
                          {epRespProps.length > 0 && (
                            <section id="response-properties" className="api-section">
                              <h3>{L.responseProps[locale]}</h3>
                              <ParamTable rows={epRespProps} locale={locale} />
                            </section>
                          )}
                          {epRespExample && (
                            <section className="api-section api-section--code">
                              <h3>{L.responseJson[locale]}</h3>
                              <CodeTabs
                                blocks={[{ label: 'JSON', lang: 'json', code: epRespExample }]}
                                labelCopy={t(locale, 'api.copy')}
                                labelCopied={t(locale, 'api.copied')}
                              />
                            </section>
                          )}
                        </>
                      )}

                      {/* ── Error Code ── */}
                      <h2 id="error-code">{L.errorCode[locale]}</h2>
                      <p className="error-code-note">
                        {L.errorCodeBody[locale]}
                        <a href={`${localePrefix}/docs/error-codes`}>{L.errorCodeLink[locale]}</a>
                        {locale === 'en' ? ' page for the full list of error codes.' : '。'}
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Legacy scalar rendering (un-migrated ops) */}
                      {epSections.map((section) => (
                        <section key={section.key} className="api-section">
                          <h2>{section.title}</h2>
                          {section.note && <p className="section-note">{section.note}</p>}
                          {section.params.length === 0 ? (
                            <p className="param-fallback">{t(locale, 'api.fallback')}</p>
                          ) : (
                            <ParamTable rows={section.params} locale={locale} />
                          )}
                        </section>
                      ))}
                      {epCodeBlocks.length > 0 && (
                        <section className="api-section api-section--code">
                          <CodePanel
                            blocks={epCodeBlocks}
                            labelCopy={t(locale, 'api.copy')}
                            labelCopied={t(locale, 'api.copied')}
                          />
                        </section>
                      )}
                    </>
                  )}

                </>
              )}
            </article>

            {/* Right rail: WebSocket call example + response/push */}
            {showWs && activeWsCmd && (
              <WsRail
                cmd={activeWsCmd}
                locale={locale}
                labelCopy={t(locale, 'api.copy')}
                labelCopied={t(locale, 'api.copied')}
                open={railOpen}
                onClose={() => setRailOpen(false)}
              />
            )}

            {/* Right rail: Request + Response panels (TryIt debugger). Beside the
                content on wide screens; a right-side drawer on narrow ones. */}
            {showEndpoint && isDocsModel && activeEndpoint && (
              <>
                <div
                  className={`api-rail-scrim${railOpen ? ' open' : ''}`}
                  onClick={() => setRailOpen(false)}
                  aria-hidden="true"
                />
                <aside
                  className={`api-rail${railOpen ? ' open' : ''}`}
                  data-lbus-component="api-rail">
                  <button
                    type="button"
                    className="api-rail-close"
                    aria-label={L.close[locale]}
                    onClick={() => setRailOpen(false)}>
                    ✕
                  </button>
                  <RequestPanel
                    method={activeEndpoint.method}
                    path={activeEndpoint.path}
                    xparams={activeEndpoint.operation['x-parameters'] ?? []}
                    oauthBlocks={epReqExamples}
                    locale={locale}
                    onResponse={setLiveResp}
                    labelCopy={t(locale, 'api.copy')}
                    labelCopied={t(locale, 'api.copied')}
                  />
                  <ResponsePanel
                    examples={endpointResponseExamples(activeEndpoint)}
                    live={liveResp}
                    locale={locale}
                  />
                </aside>
              </>
            )}
          </div>
          <DocFooterRow locale={locale} />
        </div>
      </div>
    </div>
    </EnvProvider>
  )
}
