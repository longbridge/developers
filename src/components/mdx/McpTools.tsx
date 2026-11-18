/**
 * McpTools.tsx
 * Port of McpTools.vue → React, for MDX pages.
 * Data source: .data/mcp-tools.json (written at build time by
 *   src/integrations/prebuild-mcp-tools.ts which fetches from
 *   https://mcp.longbridge.com/mcp/tools.json).
 * Locale: McpToolsIsland.astro derives it from the URL and passes it in. The
 *   manifest ships English tools plus a `locales` overlay (zh-CN / zh-HK /
 *   ja-JP) keyed by tool name, carrying the title, description and per-param
 *   descriptions; anything the overlay omits falls back to English.
 */
import { useRef, useState, useEffect } from 'react'
import mcpToolsData from '../../../.data/mcp-tools.json'
import './McpTools.css'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SchemaProperty {
  type: string | string[]
  description?: string
  enum?: string[]
  default?: unknown
  format?: string
  minimum?: number
  maximum?: number
}

interface ToolSchema {
  properties?: Record<string, SchemaProperty>
  required?: string[]
}

interface Tool {
  name: string
  description: string
  inputSchema?: ToolSchema
}

interface ToolsPayload {
  tools: Tool[]
  /**
   * Per-locale overlay shipped alongside the English tools. Keyed by locale,
   * then by tool name; `properties` maps a parameter name to its description.
   * Partial by design — anything missing falls back to the English entry.
   */
  locales?: Record<string, { tools?: Record<string, LocaleToolText> }>
}

interface LocaleToolText {
  title?: string
  description?: string
  properties?: Record<string, string>
}

interface ParamRow {
  name: string
  type: string
  required: boolean
  description?: string
  enum?: string[]
  default?: unknown
}

// ── Inline i18n (keys also added to locale files) ────────────────────────────

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    searchPlaceholder: 'Search tools…',
    clearSearch: 'Clear search',
    noMatch: 'No tools match "{query}"',
    noParams: 'No parameters.',
    params: 'Parameters',
    required: 'required',
    enum: 'Enum',
    default: 'Default',
  },
  'zh-CN': {
    searchPlaceholder: '搜索工具…',
    clearSearch: '清除搜索',
    noMatch: '没有匹配 "{query}" 的工具',
    noParams: '无参数。',
    params: '参数',
    required: '必填',
    enum: '枚举',
    default: '默认',
  },
  'zh-HK': {
    searchPlaceholder: '搜尋工具…',
    clearSearch: '清除搜尋',
    noMatch: '沒有符合「{query}」的工具',
    noParams: '無參數。',
    params: '參數',
    required: '必填',
    enum: '枚舉',
    default: '預設',
  },
}

function tStr(locale: string, key: string, vars?: Record<string, string>): string {
  const dict = STRINGS[locale] ?? STRINGS['en']
  let str = dict[key] ?? STRINGS['en'][key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(`{${k}}`, v)
    }
  }
  return str
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatType(type: string | string[]): string {
  return Array.isArray(type) ? type.join(' | ') : type
}

function getParams(schema?: ToolSchema, localized?: LocaleToolText): ParamRow[] {
  if (!schema?.properties) return []
  const required = new Set(schema.required ?? [])
  return Object.entries(schema.properties).map(([name, def]) => ({
    name,
    type: formatType(def.type),
    required: required.has(name),
    // Fall back to English when the overlay omits this parameter.
    description: localized?.properties?.[name] ?? def.description,
    enum: def.enum,
    default: def.default,
  }))
}

/**
 * Lowercased haystack per tool: the name, the English description, and every
 * locale's title and description. Searching across locales is deliberate —
 * the overlays are Simplified and Traditional Chinese variants of each other,
 * so searching "K 线" on the zh-HK page still finds "K 線".
 */
function buildSearchIndex(): Record<string, string> {
  const payload = mcpToolsData as unknown as ToolsPayload
  const index: Record<string, string> = {}
  for (const tool of payload.tools) {
    index[tool.name] = `${tool.name}\n${tool.description}`
  }
  for (const entry of Object.values(payload.locales ?? {})) {
    for (const [name, text] of Object.entries(entry.tools ?? {})) {
      if (!(name in index)) continue
      index[name] += `\n${text.title ?? ''}\n${text.description ?? ''}`
    }
  }
  for (const name of Object.keys(index)) {
    index[name] = index[name].toLowerCase()
  }
  return index
}

/** Built once at module scope — the manifest is static. */
const searchIndex = buildSearchIndex()

/** The overlay for one locale, or an empty map for English / an unknown locale. */
function localeTools(locale: string): Record<string, LocaleToolText> {
  const payload = mcpToolsData as unknown as ToolsPayload
  return payload.locales?.[locale]?.tools ?? {}
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    className="mcp-tools-search-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const WrenchIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`mcp-tool-icon${open ? ' mcp-tool-icon--open' : ''}`}
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
)

const ChevronIcon = () => (
  <svg
    className="mcp-accordion-chevron"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
)

// ── Accordion Item ─────────────────────────────────────────────────────────────

interface AccordionItemProps {
  tool: Tool
  isOpen: boolean
  onToggle: () => void
  locale: string
  localized?: LocaleToolText
}

function AccordionItem({ tool, isOpen, onToggle, locale, localized }: AccordionItemProps) {
  const params = getParams(tool.inputSchema, localized)
  const contentRef = useRef<HTMLDivElement>(null)

  return (
    <div
      className="mcp-accordion-item"
      data-state={isOpen ? 'open' : 'closed'}
    >
      <button
        type="button"
        className="mcp-accordion-trigger"
        data-state={isOpen ? 'open' : 'closed'}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="mcp-tool-title">
          <WrenchIcon open={isOpen} />
          <code className="mcp-tool-name">{tool.name}</code>
          {localized?.title && (
            <span className="mcp-tool-label">{localized.title}</span>
          )}
        </span>
        <ChevronIcon />
      </button>

      <div
        ref={contentRef}
        className="mcp-accordion-content"
        data-state={isOpen ? 'open' : 'closed'}
        hidden={!isOpen}
      >
        <div className="mcp-accordion-content-inner">
          <p className="mcp-tool-desc">{localized?.description ?? tool.description}</p>

          {params.length === 0 ? (
            <p className="mcp-tool-no-params">{tStr(locale, 'noParams')}</p>
          ) : (
            <>
              <h4 className="mcp-params-title">{tStr(locale, 'params')}</h4>
              <dl className="mcp-params">
                {params.map((p) => (
                  <div key={p.name} className="mcp-param">
                    <dt className="mcp-param-head">
                      <code className="mcp-param-name">{p.name}</code>
                      <span className="mcp-param-type">{p.type}</span>
                      {p.required && (
                        <span className="mcp-param-required">
                          {tStr(locale, 'required')}
                        </span>
                      )}
                    </dt>
                    <dd className="mcp-param-body">
                      {p.description && (
                        <p className="mcp-param-desc">{p.description}</p>
                      )}
                      {p.enum && (
                        <p className="mcp-param-meta">
                          {tStr(locale, 'enum')}: {p.enum.map((e) => `"${e}"`).join(' | ')}
                        </p>
                      )}
                      {p.default !== undefined && (
                        <p className="mcp-param-meta">
                          {tStr(locale, 'default')}: {String(p.default)}
                        </p>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export interface McpToolsProps {
  locale?: string
}

export function McpTools({ locale = 'en' }: McpToolsProps) {
  const allTools: Tool[] = (mcpToolsData as unknown as ToolsPayload).tools
  const i18n = localeTools(locale)

  const [query, setQuery] = useState('')
  const [openValue, setOpenValue] = useState<string>('')
  const listRef = useRef<HTMLDivElement>(null)

  // Scroll open item into view after accordion animation settles (~220ms)
  useEffect(() => {
    if (!openValue || !listRef.current) return
    const timer = setTimeout(() => {
      const container = listRef.current
      if (!container) return
      const openItem = container.querySelector<HTMLElement>(
        '.mcp-accordion-item[data-state="open"]'
      )
      if (!openItem) return
      const itemTop =
        openItem.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop
      const itemBottom = itemTop + openItem.offsetHeight
      const visibleTop = container.scrollTop
      const visibleBottom = visibleTop + container.clientHeight
      if (itemTop >= visibleTop && itemBottom <= visibleBottom) return
      container.scrollTo({ top: itemTop, behavior: 'smooth' })
    }, 220)
    return () => clearTimeout(timer)
  }, [openValue])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? allTools.filter((t) => searchIndex[t.name]?.includes(q))
    : allTools

  function handleToggle(name: string) {
    setOpenValue((prev) => (prev === name ? '' : name))
  }

  return (
    <div className="mcp-tools" data-lbus-component="mcp-tools">
      <div className="mcp-tools-search">
        <div className="mcp-tools-input-wrap">
          <SearchIcon />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="mcp-tools-input"
            placeholder={tStr(locale, 'searchPlaceholder')}
          />
          {query && (
            <button
              type="button"
              className="mcp-tools-clear"
              aria-label={tStr(locale, 'clearSearch')}
              onClick={() => setQuery('')}
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* The list frame stays put when a search comes up empty — the message
          sits inside it, so the page keeps its shape between queries. */}
      <div ref={listRef} className="mcp-tools-list">
        {filtered.length === 0 ? (
          <div className="mcp-tools-empty">
            {tStr(locale, 'noMatch', { query: query.trim() })}
          </div>
        ) : (
          filtered.map((tool) => (
            <AccordionItem
              key={tool.name}
              tool={tool}
              isOpen={openValue === tool.name}
              onToggle={() => handleToggle(tool.name)}
              locale={locale}
              localized={i18n[tool.name]}
            />
          ))
        )}
      </div>
    </div>
  )
}
