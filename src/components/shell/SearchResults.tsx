import type { Locale } from '@longbridge/openapi-utils'
import { t } from '@longbridge/openapi-utils'

export interface SearchHit {
  id: string
  url: string
  title: string
  headings: string[]
  matchedTerms: string[]
}

interface Props {
  results: SearchHit[]
  loading: boolean
  query: string
  locale: Locale
  onSelect: (url: string) => void
  activeIndex: number
  onHover?: (idx: number) => void
}

export default function SearchResults({
  results,
  loading,
  query,
  locale,
  onSelect,
  activeIndex,
  onHover,
}: Props) {
  if (loading) {
    return (
      <div className="p-4 text-[color:var(--lb-fg-2)] text-sm text-center" role="status" aria-live="polite">
        …
      </div>
    )
  }

  if (query.trim() && results.length === 0) {
    return (
      <p className="p-4 text-[color:var(--lb-fg-2)] text-sm text-center" role="status" aria-live="polite">
        {t(locale, 'search.empty')}
      </p>
    )
  }

  if (!query.trim()) return null

  return (
    <ul className="list-none p-3 m-0 flex flex-col gap-2" role="listbox" aria-label="Search results">
      {results.map((hit, idx) => (
        <li key={hit.id} role="option" aria-selected={idx === activeIndex}>
          <button
            type="button"
            className={
              (idx === activeIndex
                ? 'border-[color:var(--lb-brand)] shadow-[0_0_0_1px_var(--lb-brand)_inset]'
                : 'border-[color:var(--app-card-stroke)]') +
              ' w-full text-left bg-[var(--lb-bg-1)] border rounded-lg px-4 py-3 cursor-pointer flex items-center gap-2 [font-size:14px] transition-colors'
            }
            onClick={() => onSelect(hit.url)}
            onMouseEnter={() => onHover?.(idx)}
            tabIndex={-1}
          >
            <span className="text-[color:var(--lb-brand)] font-semibold shrink-0">#</span>
            <span className="flex items-center gap-1.5 flex-wrap min-w-0">
              {hit.headings.map((h, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  <HighlightedText text={h} terms={hit.matchedTerms} bold={i === hit.headings.length - 1} />
                  {i < hit.headings.length - 1 && (
                    <span className="text-[color:var(--lb-fg-3)]" aria-hidden="true">›</span>
                  )}
                </span>
              ))}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

/** Wrap query-term matches in a teal <mark>. Term matching is
 *  case-insensitive; overlapping/nested matches are collapsed by longest-first
 *  sort. */
function HighlightedText({
  text,
  terms,
  bold = false,
}: {
  text: string
  terms: string[]
  bold?: boolean
}) {
  if (!terms.length) {
    return (
      <span className={bold ? 'font-semibold text-[color:var(--lb-fg-1)]' : 'text-[color:var(--lb-fg-1)]'}>
        {text}
      </span>
    )
  }

  const sorted = [...terms].sort((a, b) => b.length - a.length)
  const pattern = new RegExp(
    `(${sorted.map((t) => escapeRe(t)).join('|')})`,
    'gi',
  )
  const parts = text.split(pattern)
  return (
    <span className={bold ? 'font-semibold text-[color:var(--lb-fg-1)]' : 'text-[color:var(--lb-fg-1)]'}>
      {parts.map((part, i) => {
        if (!part) return null
        const isMatch = sorted.some((t) => t.toLowerCase() === part.toLowerCase())
        return isMatch ? (
          <mark
            key={i}
            className="bg-[color:var(--lb-brand)] text-[color:var(--lb-fg-invert)] rounded-[3px] px-[3px] py-[1px]"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      })}
    </span>
  )
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
