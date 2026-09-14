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
  formatPath,
  epId,
  buildCurl,
  buildResponseExample,
  pickLocale,
  PAGE_ICONS,
  type EndpointItem,
  type PageItem,
  type CodeBlock,
  type Section,
  type XParameter,
  type TagGroup,
  type SubGroup,
} from './openapi-loader'
import { CodePanel, CodeTabs, highlightCode } from './CodeSample'
import { QuotePermission } from './QuotePermission'
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
  _md.use(container, type, {
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
  parameters: { en: 'Parameters', 'zh-CN': '参数', 'zh-HK': '參數' },
  pathParams: { en: 'Path Parameters', 'zh-CN': '路径参数', 'zh-HK': '路徑參數' },
  queryParams: { en: 'Query Parameters', 'zh-CN': '查询参数', 'zh-HK': '查詢參數' },
  requestBody: { en: 'Request Body', 'zh-CN': '请求体', 'zh-HK': '請求體' },
  requestExample: { en: 'Request Example', 'zh-CN': '请求示例', 'zh-HK': '請求示例' },
  response: { en: 'Response', 'zh-CN': '响应', 'zh-HK': '響應' },
  responseProps: { en: 'Response Properties', 'zh-CN': '响应字段', 'zh-HK': '響應欄位' },
  responseJson: { en: 'Response JSON Example', 'zh-CN': '响应 JSON 示例', 'zh-HK': '響應 JSON 示例' },
  errorCode: { en: 'Error Code', 'zh-CN': '错误码', 'zh-HK': '錯誤碼' },
  onThisPage: { en: 'On this page', 'zh-CN': '本页目录', 'zh-HK': '本頁目錄' },
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
  authLink: { en: 'Authentication', 'zh-CN': '鉴权', 'zh-HK': '鑑權' },
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
        const summary = pickLocale(
          ep.operation.summary,
          ep.operation['x-summary-zh'],
          ep.operation['x-summary-zh-hk'],
          locale
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
  onSelect,
  locale,
  forceOpen,
}: {
  sub: SubGroup
  activeOp: string | null
  onSelect: (id: string) => void
  locale: Locale
  forceOpen: boolean
}) {
  const hasActive = sub.endpoints.some((ep) => epId(ep) === activeOp)
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
          <EndpointLeaves endpoints={sub.endpoints} activeOp={activeOp} onSelect={onSelect} locale={locale} />
        </ul>
      )}
    </li>
  )
}

function ApiSidebarGroup({
  group,
  activeOp,
  onSelect,
  locale,
  forceOpen,
}: {
  group: TagGroup
  activeOp: string | null
  onSelect: (id: string) => void
  locale: Locale
  forceOpen: boolean
}) {
  const hasActive =
    group.endpoints.some((ep) => epId(ep) === activeOp) ||
    group.subgroups.some((sg) => sg.endpoints.some((ep) => epId(ep) === activeOp))
  const [open, setOpen] = useState(true)
  const isOpen = forceOpen || open || hasActive
  const label = pickLocale(group.name, group.nameZh, group.nameZhHk, locale)
  return (
    <li data-lbus-component="sidebar-group" className="list-none">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={isOpen}
        className="group flex items-center w-full bg-transparent border-0 cursor-pointer text-left rounded-lg px-2 py-1 text-[14px] leading-6">
        <span className="flex-1 min-w-0 truncate font-bold text-[color:var(--lb-fg-1)] group-hover:text-[color:var(--lb-brand)]">
          {label}
        </span>
        <Caret open={isOpen} />
      </button>
      {isOpen && (
        <ul className="list-none py-0 m-0 flex flex-col gap-[2px]" role="list">
          <EndpointLeaves endpoints={group.endpoints} activeOp={activeOp} onSelect={onSelect} locale={locale} />
          {group.subgroups.map((sg) => (
            <ApiSidebarSubGroup
              key={sg.name}
              sub={sg}
              activeOp={activeOp}
              onSelect={onSelect}
              locale={locale}
              forceOpen={forceOpen}
            />
          ))}
        </ul>
      )}
    </li>
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
  const { groups, pages, serverUrl } = useMemo(() => parseSpec(rawYaml), [rawYaml])

  // ── URL state ─────────────────────────────────────────────────────────────
  // Canonical URLs are path-based: `/docs/api/<operationId>` (locale-prefixed).
  // The legacy `?op=` / `?page=` query form is still honored for old links.
  const apiBase = `${localePrefix}/docs/api`
  const getRoute = () => {
    if (typeof window === 'undefined') return { op: null, page: null }
    const path = window.location.pathname.replace(/\/+$/, '')
    if (path.startsWith(apiBase + '/')) {
      const seg = path.slice(apiBase.length + 1)
      if (seg && !seg.includes('/')) return { op: decodeURIComponent(seg), page: null }
    }
    const p = new URLSearchParams(window.location.search)
    return { op: p.get('op'), page: p.get('page') }
  }

  const [activeOp, setActiveOp] = useState<string | null>(() => getRoute().op)
  const [activePage, setActivePage] = useState<string | null>(() => getRoute().page)

  // Listen for popstate
  useEffect(() => {
    function onPop() {
      const q = getRoute()
      setActiveOp(q.op)
      setActivePage(q.page)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Navigate to endpoint → /docs/api/<id>
  const selectEndpoint = useCallback(
    (id: string) => {
      window.history.pushState({}, '', `${apiBase}/${id}`)
      setActiveOp(id)
      setActivePage(null)
    },
    [apiBase]
  )

  // Navigate to page → /docs/api?page=<id> (pages stay on the query form)
  const selectPage = useCallback(
    (id: string) => {
      window.history.pushState({}, '', `${apiBase}?page=${id}`)
      setActivePage(id)
      setActiveOp(null)
    },
    [apiBase]
  )

  // ── Search ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Add a copy button to each x-page markdown code block (rendered as raw HTML,
  // so enhanced imperatively rather than via a React component).
  const copyLabel = t(locale, 'api.copy')
  const copiedLabel = t(locale, 'api.copied')
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const pres = root.querySelectorAll<HTMLElement>('.api-page-md pre')
    const cleanups: Array<() => void> = []
    pres.forEach((pre) => {
      if (pre.querySelector('.page-copy-btn')) return
      pre.style.position = 'relative'
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'page-copy-btn'
      btn.textContent = copyLabel
      const onClick = () => {
        const code = pre.querySelector('code')?.textContent ?? pre.textContent ?? ''
        navigator.clipboard.writeText(code).then(() => {
          btn.textContent = copiedLabel
          window.setTimeout(() => {
            btn.textContent = copyLabel
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
  const epReqExamples = useMemo<CodeBlock[]>(
    () =>
      (activeEndpoint?.operation['x-request-examples'] ?? []).map((s) => ({
        lang: s.lang.toLowerCase(),
        code: s.source,
        label: s.label,
      })),
    [activeEndpoint]
  )
  const epRespJson = useMemo(() => (activeEndpoint ? buildResponseExample(activeEndpoint) : null), [activeEndpoint])

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

  const epPathSegs = useMemo(() => (activeEndpoint ? formatPath(activeEndpoint.path) : []), [activeEndpoint])

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

  // ── Copy path ─────────────────────────────────────────────────────────────
  const [pathCopied, setPathCopied] = useState(false)
  function copyPath() {
    if (!activeEndpoint) return
    navigator.clipboard.writeText(activeEndpoint.path).then(() => {
      setPathCopied(true)
      setTimeout(() => setPathCopied(false), 1800)
    })
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const showIntro = !activeOp && !activePage
  const showPage = !!activePg
  const showEndpoint = !!activeEndpoint

  // On-this-page TOC entries for the active endpoint.
  const tocItems = isDocsModel
    ? [
        { id: 'request', label: L.request[locale], sub: false },
        ...(hasParams ? [{ id: 'parameters', label: L.parameters[locale], sub: true }] : []),
        ...(epReqExamples.length ? [{ id: 'request-example', label: L.requestExample[locale], sub: true }] : []),
        { id: 'response', label: L.response[locale], sub: false },
        ...(epRespProps.length ? [{ id: 'response-properties', label: L.responseProps[locale], sub: true }] : []),
        ...(epRespJson ? [{ id: 'response-json', label: L.responseJson[locale], sub: true }] : []),
        { id: 'error-code', label: L.errorCode[locale], sub: false },
      ]
    : []

  // Breadcrumb trail (Home is prepended by DocsBreadcrumb).
  const crumbs: { text: string; href?: string }[] =
    showEndpoint && activeEndpoint
      ? [
          ...(epTag ? [{ text: epTag }] : []),
          {
            text: pickLocale(
              activeEndpoint.operation.summary,
              activeEndpoint.operation['x-summary-zh'],
              activeEndpoint.operation['x-summary-zh-hk'],
              locale
            ),
          },
        ]
      : activePg
        ? [{ text: pickLocale(activePg.title, activePg.titleZh, activePg.titleZhHk, locale) }]
        : []

  return (
    <div ref={rootRef} data-lbus-component="api-reference" className="docs-layout">
      {/* ── Sidebar (docs sidebar DOM) ── */}
      <aside
        data-lbus-component="sidebar"
        className="fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-[color:var(--lb-stroke)] bg-[var(--lbus-c-bg)] px-6 py-6 lg:sticky lg:top-[60px] lg:z-auto lg:inset-y-auto lg:h-[calc(100vh-60px)] lg:translate-x-0"
        aria-label="API navigation">
        <div className="sidebar-search">
          <input
            ref={searchInputRef}
            className="search-input"
            type="text"
            placeholder={t(locale, 'api.search')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
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
                      className={`${NAV_LEAF} ${active ? NAV_LEAF_ACTIVE : NAV_LEAF_IDLE}`}>
                      {icon && (
                        <span
                          className="nav-page-icon inline-flex items-center justify-center shrink-0 text-[color:var(--lb-fg-3)]"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: icon }}
                        />
                      )}
                      <span className="flex-1 min-w-0 truncate">
                        {pickLocale(pg.title, pg.titleZh, pg.titleZhHk, locale)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
          {/* Tag groups — each a collapsible section separated by a divider */}
          {filteredGroups.map((g) => (
            <div key={g.name} className="border-t border-[color:var(--app-card-stroke)] mt-[10px] pt-[10px]">
              <ul className="list-none p-0 m-0 flex flex-col gap-[2px]" role="list">
                <ApiSidebarGroup
                  group={g}
                  activeOp={activeOp}
                  onSelect={selectEndpoint}
                  locale={locale}
                  forceOpen={!!query.trim()}
                />
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      <div className="docs-body">
        <div className="docs-inner">
          <div className="docs-main">
            <article className="docs-content">
              <DocsBreadcrumb items={crumbs} locale={locale} />
              {/* ── Intro (nothing selected) ── */}
              {showIntro && (
                <div className="intro-content">
                  <h2 className="intro-title">{t(locale, 'api.intro.title')}</h2>
                  <p className="intro-desc">{t(locale, 'api.intro.desc')}</p>
                  <div className="intro-cards">
                    <div className="intro-card">
                      <strong className="intro-card-title">{t(locale, 'api.intro.httpTitle')}</strong>
                      <p className="intro-card-desc">{t(locale, 'api.intro.httpDesc')}</p>
                    </div>
                    <div className="intro-card">
                      <strong className="intro-card-title">{t(locale, 'api.intro.wsTitle')}</strong>
                      <p className="intro-card-desc">{t(locale, 'api.intro.wsDesc')}</p>
                    </div>
                  </div>
                  <p className="intro-hint">{t(locale, 'api.intro.hint')}</p>
                </div>
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
                    <CodeTabs
                      blocks={activePg.codeTabs.map((s) => ({
                        lang: s.lang.toLowerCase(),
                        code: s.source,
                        label: s.label,
                      }))}
                      labelCopy={t(locale, 'api.copy')}
                      labelCopied={t(locale, 'api.copied')}
                    />
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
                  <h1 className="ep-title">
                    {pickLocale(
                      activeEndpoint.operation.summary,
                      activeEndpoint.operation['x-summary-zh'],
                      activeEndpoint.operation['x-summary-zh-hk'],
                      locale
                    )}
                  </h1>

                  {/* Path + method badge */}
                  <div className="ep-path">
                    <span className={`ep-method-badge method-${activeEndpoint.method.toLowerCase()}`}>
                      {activeEndpoint.method}
                    </span>
                    <span className="ep-path-text">
                      {epPathSegs.map((seg, i) => (
                        <span key={i} className={seg.isParam ? 'path-param' : 'path-static'}>
                          {seg.text}
                        </span>
                      ))}
                    </span>
                    <button
                      type="button"
                      className="path-copy-btn"
                      title={t(locale, 'api.pathCopy')}
                      onClick={copyPath}>
                      {pathCopied ? '✓' : t(locale, 'api.pathCopy')}
                    </button>
                  </div>

                  {/* Quote permission badge */}
                  {(activeEndpoint.operation['x-quote-command'] ||
                    activeEndpoint.operation['x-quote-level'] ||
                    activeEndpoint.operation['x-quote-market']) && (
                    <QuotePermission
                      command={activeEndpoint.operation['x-quote-command']}
                      level={activeEndpoint.operation['x-quote-level']}
                      market={activeEndpoint.operation['x-quote-market']}
                      locale={locale}
                    />
                  )}

                  {/* Prose description */}
                  {epProse && <div className="prose vp-doc" dangerouslySetInnerHTML={{ __html: epProse }} />}

                  {/* CLI — reuse the docs CliCommand card for pixel parity */}
                  {epCli && <CliCommand code={epCli} locale={locale} />}

                  {isDocsModel ? (
                    <>
                      {/* ── Request ── */}
                      <h2 id="request">{L.request[locale]}</h2>

                      {hasParams && (
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
                      )}

                      {epReqExamples.length > 0 && (
                        <section id="request-example" className="api-section">
                          <h3>{L.requestExample[locale]}</h3>
                          <CodeTabs
                            blocks={epReqExamples}
                            labelCopy={t(locale, 'api.copy')}
                            labelCopied={t(locale, 'api.copied')}
                          />
                          <p className="error-code-note">
                            {L.apiKeyNoteBody[locale]}
                            <a href={`${localePrefix}/docs/api?page=authentication`}>{L.authLink[locale]}</a>
                            {locale === 'en' ? '.' : '。'}
                          </p>
                        </section>
                      )}

                      {/* ── Response ── */}
                      <h2 id="response">{L.response[locale]}</h2>

                      {epRespProps.length > 0 && (
                        <section id="response-properties" className="api-section">
                          <h3>{L.responseProps[locale]}</h3>
                          <ParamTable rows={epRespProps} locale={locale} />
                        </section>
                      )}

                      {epRespJson && (
                        <section id="response-json" className="api-section">
                          <h3>{L.responseJson[locale]}</h3>
                          <CodeTabs
                            blocks={[{ lang: 'json', code: epRespJson, label: 'JSON' }]}
                            labelCopy={t(locale, 'api.copy')}
                            labelCopied={t(locale, 'api.copied')}
                          />
                        </section>
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

            {/* On this page TOC (docs TOC DOM) */}
            {showEndpoint && isDocsModel && tocItems.length > 0 && (
              <aside className="docs-toc text-[0.85rem]" data-lbus-component="toc" aria-label="Table of contents">
                <nav>
                  <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[color:var(--lbus-c-text)] mb-3 mt-0">
                    {L.onThisPage[locale]}
                  </p>
                  <ul className="list-none p-0 m-0 flex flex-col gap-1" role="list">
                    {tocItems.map((it) => (
                      <li key={it.id} className={it.sub ? 'pl-3' : ''}>
                        <a
                          href={`#${it.id}`}
                          className="block py-[0.15rem] text-[color:var(--lb-fg-2)] no-underline hover:text-[color:var(--lb-brand)]">
                          {it.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            )}
          </div>
          <DocFooterRow locale={locale} />
        </div>
      </div>
    </div>
  )
}
