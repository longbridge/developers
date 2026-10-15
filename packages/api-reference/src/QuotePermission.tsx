/**
 * QuotePermission.tsx
 * Quote-permission badge + detail card — a faithful port of the docs MDX
 * component (src/components/mdx/QuotePermission.tsx) so the reference renders it
 * identically. Resolves command/level/market against quote-permissions.yaml.
 */
import { load } from 'js-yaml'
import type { Locale } from '@longbridge/openapi-utils'
import rawQP from '../../../quote-permissions.yaml?raw'
// CSS is loaded via api-reference.css (@import) so it ships with the layout.

// ── YAML types ────────────────────────────────────────────────────────────────

interface LocaleString {
  en: string
  'zh-CN': string
  'zh-HK': string
  [key: string]: string
}
interface LevelDef {
  label: LocaleString
  description: LocaleString
  link_text: LocaleString
}
interface CommandDef {
  level: string
  market?: string
  description?: LocaleString
}
interface QPData {
  ui: {
    link_url: string
    permission_title: LocaleString
    separate_note: LocaleString
    market_labels?: Record<string, LocaleString>
  }
  levels: Record<string, LevelDef>
  commands?: Record<string, CommandDef>
}

let _qpData: QPData | null = null
function getQPData(): QPData {
  if (!_qpData) _qpData = load(rawQP) as QPData
  return _qpData
}

// ── Shield-check SVG (14×14) ──────────────────────────────────────────────────

const ShieldCheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.76 8.95a1 1 0 0 1-.48 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

// ── Component ─────────────────────────────────────────────────────────────────

export interface QuotePermissionProps {
  /** API command key — looked up in quote-permissions.yaml commands. */
  command?: string
  /** Explicit level override ('basic' | 'lv1' | 'lv2' | 'overnight' | 'opra'). */
  level?: string
  /** Explicit market override (e.g. 'US', 'HK'). */
  market?: string
  locale?: Locale
}

export function QuotePermission({ command, level, market, locale = 'en' }: QuotePermissionProps) {
  const qp = getQPData()
  const cmdEntry = command ? (qp.commands?.[command] ?? null) : null
  const effectiveLevel = cmdEntry?.level ?? level ?? 'basic'
  const effectiveMarket = market ?? cmdEntry?.market
  const levelDef = qp.levels?.[effectiveLevel]
  if (!levelDef) return null

  const ui = qp.ui
  const l = (s: LocaleString | undefined): string => (s ? (s[locale] ?? s.en ?? '') : '')

  const title = l(ui?.permission_title)
  const badgeLabel = l(levelDef.label)
  const descriptionRaw = cmdEntry?.description ? l(cmdEntry.description) : l(levelDef.description)
  const descriptionLines = descriptionRaw ? descriptionRaw.split('\n').filter(Boolean) : []
  const linkUrl = ui?.link_url ?? ''
  const linkText = l(levelDef.link_text)
  const separateNote = l(ui?.separate_note)
  const marketLabel = effectiveMarket
    ? l(ui?.market_labels?.[effectiveMarket]) || effectiveMarket
    : null

  return (
    <div data-lbus-component="quote-permission" className="qp-alert" data-level={effectiveLevel}>
      <div className="qp-header">
        <span className="qp-icon">
          <ShieldCheckIcon />
        </span>
        <span className="qp-label">{title}</span>
        {marketLabel && <span className="qp-market-tag">{marketLabel}</span>}
        <span className="qp-badge">{badgeLabel}</span>
      </div>

      {descriptionLines.length > 1 ? (
        <ul className="qp-list">
          {descriptionLines.map((line) => (
            <li key={line} className="qp-list-item">
              {line}
            </li>
          ))}
        </ul>
      ) : descriptionLines.length === 1 ? (
        <p className="qp-desc">{descriptionLines[0]}</p>
      ) : null}

      <div className="qp-footer">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="qp-link">
          {linkText}
        </a>
        <span className="qp-sep" aria-hidden="true">
          ·
        </span>
        <span className="qp-note">{separateNote}</span>
      </div>
    </div>
  )
}
