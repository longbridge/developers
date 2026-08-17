import type { Locale } from '../../lib/i18n'
import { t } from '../../lib/i18n'

export interface SearchResultItem {
  url: string
  meta?: { title?: string }
  excerpt?: string
}

interface Props {
  results: SearchResultItem[]
  loading: boolean
  query: string
  locale: Locale
  onSelect: (url: string) => void
  activeIndex: number
}

export default function SearchResults({
  results,
  loading,
  query,
  locale,
  onSelect,
  activeIndex,
}: Props) {
  if (loading) {
    return (
      <div className="search-status" role="status" aria-live="polite">
        …
      </div>
    )
  }

  if (query.trim() && results.length === 0) {
    return (
      <p className="search-empty" role="status" aria-live="polite">
        {t(locale, 'search.empty')}
      </p>
    )
  }

  if (!query.trim()) return null

  return (
    <ul className="search-results" role="listbox" aria-label="Search results">
      {results.map((item, idx) => (
        <li
          key={item.url}
          role="option"
          aria-selected={idx === activeIndex}
          className={`search-result${idx === activeIndex ? ' is-active' : ''}`}
        >
          <button
            type="button"
            className="search-result-btn"
            onClick={() => onSelect(item.url)}
            tabIndex={-1}
          >
            <span className="search-result-title">{item.meta?.title ?? item.url}</span>
            {item.excerpt && (
              <span
                className="search-result-excerpt"
                // pagefind wraps matched text in <mark> — safe, no user-controlled HTML
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              />
            )}
          </button>
        </li>
      ))}
    </ul>
  )
}
