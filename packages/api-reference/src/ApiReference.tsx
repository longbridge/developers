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
  type EndpointItem,
  type PageItem,
  type CodeBlock,
  type Section,
} from './openapi-loader'
import { CodePanel } from './CodeSample'
import { QuotePermission } from './QuotePermission'
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

  // Code samples from x-codeSamples
  if (ep.operation['x-codeSamples']?.length) {
    for (const sample of ep.operation['x-codeSamples']) {
      blocks.push({
        lang: sample.lang.toLowerCase(),
        code: sample.source,
        label: sample.label || sample.lang,
      })
    }
  } else if (ep.method !== 'WEBSOCKET') {
    // Auto-generated curl fallback (skipped for WebSocket operations)
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
        <div className="sidebar-scroll">
          {/* Static pages */}
          {pages.map((pg) => (
            <button
              key={pg.id}
              type="button"
              className={`nav-item${activePage === pg.id ? ' is-active' : ''}`}
              onClick={() => selectPage(pg.id)}>
              {pickLocale(pg.title, pg.titleZh, pg.titleZhHk, locale)}
            </button>
          ))}
          {/* Tag groups */}
          {filteredGroups.map((g) => (
            <div key={g.name} className="tag-group">
              <p className="tag-label">{pickLocale(g.name, g.nameZh, g.nameZhHk, locale)}</p>
              {g.endpoints.map((ep) => {
                const id = epId(ep)
                const summary = pickLocale(
                  ep.operation.summary,
                  ep.operation['x-summary-zh'],
                  ep.operation['x-summary-zh-hk'],
                  locale
                )
                return (
                  <button
                    key={id}
                    type="button"
                    className={`nav-item${activeOp === id ? ' is-active' : ''}`}
                    onClick={() => selectEndpoint(id)}>
                    <span className={`nav-method method-${ep.method.toLowerCase()}`}>{ep.method}</span>
                    <span className="nav-label">{summary}</span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>
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
        <div data-lbus-component="api-main-endpoint" className="api-main api-main--split">
          {/* Left column: metadata + params */}
          <div className="api-content">
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

            {/* Param sections */}
            {epSections.map((section) => (
              <section key={section.key} className="api-section">
                <h4 className="section-title">{section.title}</h4>
                <div className="param-list">
                  {section.params.length === 0 ? (
                    <p className="param-fallback">{t(locale, 'api.fallback')}</p>
                  ) : (
                    section.params.map((row) => (
                      <div key={row.name} className="param-row">
                        <div className="param-meta">
                          <code className="param-name">{row.name}</code>
                          <span className="param-type">{row.type}</span>
                          <span className={`param-required ${row.required ? 'is-required' : 'is-optional'}`}>
                            {row.required ? t(locale, 'api.param.required') : t(locale, 'api.param.optional')}
                          </span>
                        </div>
                        {row.description && <p className="param-desc">{row.description}</p>}
                      </div>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>

          {/* Right column: code samples */}
          {epCodeBlocks.length > 0 && (
            <CodePanel blocks={epCodeBlocks} labelCopy={t(locale, 'api.copy')} labelCopied={t(locale, 'api.copied')} />
          )}
        </div>
      )}
    </div>
  )
}
