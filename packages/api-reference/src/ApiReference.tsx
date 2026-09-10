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
} from './openapi-loader'
import { CodePanel, CodeTabs } from './CodeSample'
import { QuotePermission } from './QuotePermission'
import { CliCommand } from '@longbridge/openapi-ui'
import MarkdownIt from 'markdown-it'

// ── markdown-it setup ─────────────────────────────────────────────────────────

const _md = new MarkdownIt({ html: false, linkify: true, typographer: false })

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

function ParamTable({ rows, locale }: { rows: RowVM[]; locale: Locale }) {
  if (!rows.length) return null
  return (
    <div className="api-table-wrap">
      <table className="api-param-table">
        <thead>
          <tr>
            <th>{L.name[locale]}</th>
            <th>{L.type[locale]}</th>
            <th>{L.required[locale]}</th>
            <th>{L.description[locale]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code>{row.name}</code>
              </td>
              <td>
                <span className="param-type">{row.type}</span>
              </td>
              <td>
                <span className={`param-required ${row.required ? 'is-required' : 'is-optional'}`}>
                  {row.required ? t(locale, 'api.param.required') : t(locale, 'api.param.optional')}
                </span>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
  const hasActive = group.endpoints.some((ep) => epId(ep) === activeOp)
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
          {group.endpoints.map((ep) => {
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
  const getQuery = () => {
    if (typeof window === 'undefined') return { op: null, page: null }
    const p = new URLSearchParams(window.location.search)
    return { op: p.get('op'), page: p.get('page') }
  }

  const [activeOp, setActiveOp] = useState<string | null>(() => getQuery().op)
  const [activePage, setActivePage] = useState<string | null>(() => getQuery().page)

  // Listen for popstate
  useEffect(() => {
    function onPop() {
      const q = getQuery()
      setActiveOp(q.op)
      setActivePage(q.page)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Navigate to endpoint
  const selectEndpoint = useCallback((id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('op', id)
    url.searchParams.delete('page')
    window.history.pushState({}, '', url.toString())
    setActiveOp(id)
    setActivePage(null)
  }, [])

  // Navigate to page
  const selectPage = useCallback((id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('page', id)
    url.searchParams.delete('op')
    window.history.pushState({}, '', url.toString())
    setActivePage(id)
    setActiveOp(null)
  }, [])

  // ── Search ────────────────────────────────────────────────────────────────
  const [query, setQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return groups
    const q = query.toLowerCase()
    return groups
      .map((g) => ({
        ...g,
        endpoints: g.endpoints.filter((ep) => {
          const op = ep.operation
          const summary = (op.summary ?? '') + ' ' + (op['x-summary-zh'] ?? '') + ' ' + (op['x-summary-zh-hk'] ?? '')
          return (
            ep.path.toLowerCase().includes(q) ||
            summary.toLowerCase().includes(q) ||
            ep.method.toLowerCase().includes(q) ||
            (op.tags ?? []).some((tg) => tg.toLowerCase().includes(q))
          )
        }),
      }))
      .filter((g) => g.endpoints.length > 0)
  }, [groups, query])

  // ── Find active endpoint / page ───────────────────────────────────────────
  const activeEndpoint = useMemo<EndpointItem | null>(() => {
    if (!activeOp) return null
    for (const g of groups) {
      const found = g.endpoints.find((ep) => epId(ep) === activeOp)
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
  const epParams = useMemo(() => rowsFrom(activeEndpoint?.operation['x-parameters'], locale), [activeEndpoint, locale])
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
  const pageHtml = useMemo<string>(() => {
    if (!activePg) return ''
    const raw = pickLocale(activePg.content, activePg.contentZh, activePg.contentZhHk, locale)
    return raw ? renderMd(raw, localePrefix) : ''
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

  return (
    <div data-lbus-component="api-reference" className="api-reference-page">
      {/* ── Sidebar ── */}
      <aside data-lbus-component="api-sidebar" className="api-sidebar">
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
        <nav className="sidebar-scroll" aria-label="API navigation">
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
                          className="inline-flex items-center shrink-0 mr-3 text-[color:var(--lb-fg-3)]"
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

      {/* ── Intro (nothing selected) ── */}
      {showIntro && (
        <div data-lbus-component="api-intro" className="api-intro">
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
        </div>
      )}

      {/* ── Page content ── */}
      {showPage && (
        <div data-lbus-component="api-main-page" className="api-main">
          <div className="api-content api-page-content vp-doc prose" dangerouslySetInnerHTML={{ __html: pageHtml }} />
        </div>
      )}

      {/* ── Endpoint detail ── */}
      {showEndpoint && activeEndpoint && (
        <div data-lbus-component="api-main-endpoint" className="api-main api-main--docs">
          <div className={isDocsModel ? 'api-doc-layout' : ''}>
            <div className="api-content api-content--docs">
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
                <button type="button" className="path-copy-btn" title={t(locale, 'api.pathCopy')} onClick={copyPath}>
                  {pathCopied ? '✓' : t(locale, 'api.pathCopy')}
                </button>
              </div>

              {/* Quote permission badge */}
              {activeEndpoint.operation['x-quote-command'] && (
                <QuotePermission command={activeEndpoint.operation['x-quote-command']} locale={locale} />
              )}

              {/* Prose description */}
              {epProse && <div className="prose vp-doc" dangerouslySetInnerHTML={{ __html: epProse }} />}

              {/* CLI — reuse the docs CliCommand card for pixel parity */}
              {epCli && <CliCommand code={epCli} locale={locale} />}

              {isDocsModel ? (
                <>
                  {/* ── Request ── */}
                  <h2 id="request" className="section-title">
                    {L.request[locale]}
                  </h2>

                  {epParams.length > 0 && (
                    <section id="parameters" className="api-section">
                      <h3 className="section-subtitle">{L.parameters[locale]}</h3>
                      <p className="section-note">{PARAM_NOTE[locale]}</p>
                      <ParamTable rows={epParams} locale={locale} />
                    </section>
                  )}

                  {epReqExamples.length > 0 && (
                    <section id="request-example" className="api-section">
                      <h3 className="section-subtitle">{L.requestExample[locale]}</h3>
                      <CodeTabs
                        blocks={epReqExamples}
                        labelCopy={t(locale, 'api.copy')}
                        labelCopied={t(locale, 'api.copied')}
                      />
                    </section>
                  )}

                  {/* ── Response ── */}
                  <h2 id="response" className="section-title">
                    {L.response[locale]}
                  </h2>

                  {epRespProps.length > 0 && (
                    <section id="response-properties" className="api-section">
                      <h3 className="section-subtitle">{L.responseProps[locale]}</h3>
                      <ParamTable rows={epRespProps} locale={locale} />
                    </section>
                  )}

                  {epRespJson && (
                    <section id="response-json" className="api-section">
                      <h3 className="section-subtitle">{L.responseJson[locale]}</h3>
                      <CodeTabs
                        blocks={[{ lang: 'json', code: epRespJson, label: 'JSON' }]}
                        labelCopy={t(locale, 'api.copy')}
                        labelCopied={t(locale, 'api.copied')}
                      />
                    </section>
                  )}

                  {/* ── Error Code ── */}
                  <h2 id="error-code" className="section-title">
                    {L.errorCode[locale]}
                  </h2>
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
                      <h2 className="section-title">{section.title}</h2>
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
            </div>

            {/* On this page TOC */}
            {isDocsModel && (
              <aside className="api-toc">
                <p className="api-toc-title">{L.onThisPage[locale]}</p>
                <ul className="api-toc-list">
                  <li>
                    <a href="#request">{L.request[locale]}</a>
                  </li>
                  {epParams.length > 0 && (
                    <li className="is-sub">
                      <a href="#parameters">{L.parameters[locale]}</a>
                    </li>
                  )}
                  {epReqExamples.length > 0 && (
                    <li className="is-sub">
                      <a href="#request-example">{L.requestExample[locale]}</a>
                    </li>
                  )}
                  <li>
                    <a href="#response">{L.response[locale]}</a>
                  </li>
                  {epRespProps.length > 0 && (
                    <li className="is-sub">
                      <a href="#response-properties">{L.responseProps[locale]}</a>
                    </li>
                  )}
                  {epRespJson && (
                    <li className="is-sub">
                      <a href="#response-json">{L.responseJson[locale]}</a>
                    </li>
                  )}
                  <li>
                    <a href="#error-code">{L.errorCode[locale]}</a>
                  </li>
                </ul>
              </aside>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
