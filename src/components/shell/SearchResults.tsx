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
    <ul className="list-none px-2 py-2 m-0" role="listbox" aria-label="Search results" aria-live="polite">
      {results.map((item, idx) => (
        <li
          key={item.url}
          role="option"
          aria-selected={idx === activeIndex}
          className={idx === activeIndex ? 'rounded bg-[var(--lb-bg-2)]' : 'rounded'}
        >
          <button
            type="button"
            className="w-full text-left bg-transparent border-0 cursor-pointer px-3 py-2 text-[color:var(--lbus-c-text)] rounded"
            onClick={() => onSelect(item.url)}
            tabIndex={-1}
          >
            <span className="block font-medium text-sm">{item.meta?.title ?? item.url}</span>
            {item.excerpt && (
              <span
                className="block text-xs text-[color:var(--lb-fg-2)] mt-1 line-clamp-2"
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
