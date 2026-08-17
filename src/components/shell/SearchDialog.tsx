import { useState, useEffect, useRef, useCallback } from 'react'
import type { Locale } from '../../lib/i18n'
import { t } from '../../lib/i18n'
import SearchResults, { type SearchResultItem } from './SearchResults'

// Shape of a raw pagefind result fragment (url available before data() call)
interface PagefindRawResult {
  url: string
  data: () => Promise<SearchResultItem>
}

interface PagefindAPI {
  search: (query: string) => Promise<{ results: PagefindRawResult[] }>
}

interface Props {
  locale: Locale
  isOpen: boolean
  onClose: () => void
}

function passesLocale(url: string, locale: Locale): boolean {
  if (locale === 'zh-CN') return url.startsWith('/zh-CN')
  if (locale === 'zh-HK') return url.startsWith('/zh-HK')
  // en: exclude zh-CN and zh-HK
  return !url.startsWith('/zh-CN') && !url.startsWith('/zh-HK')
}

const DEBOUNCE_MS = 200
const MAX_RESULTS = 10

export default function SearchDialog({ locale, isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [pfReady, setPfReady] = useState<'loading' | 'ready' | 'unavailable'>('loading')
  const pfRef = useRef<PagefindAPI | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load pagefind once on component mount
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        // Dynamic import — Vite will not bundle this; it's served from dist/pagefind/
        // @ts-expect-error pagefind.js is generated at build time and not resolvable in dev
        const pf = (await import(/* @vite-ignore */ '/pagefind/pagefind.js')) as PagefindAPI
        if (!cancelled) {
          pfRef.current = pf
          setPfReady('ready')
        }
      } catch {
        // Expected in dev: /pagefind/pagefind.js doesn't exist until after build
        if (!cancelled) setPfReady('unavailable')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Autofocus + reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults([])
      setActiveIndex(-1)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [isOpen])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  // Keyboard: Esc / ↑ ↓ / Enter (only when open)
  useEffect(() => {
    if (!isOpen) return

    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, -1))
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault()
        const hit = results[activeIndex]
        if (hit) navigateTo(hit.url)
      }
    }

    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, results, activeIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  const navigateTo = useCallback(
    (url: string) => {
      onClose()
      window.location.href = url
    },
    [onClose],
  )

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setActiveIndex(-1)
      return
    }

    debounceRef.current = setTimeout(async () => {
      if (!pfRef.current) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const { results: raw } = await pfRef.current.search(trimmed)
        // Filter by locale before loading data (pagefind exposes url on raw result)
        const filtered = raw.filter((r) => passesLocale(r.url, locale)).slice(0, MAX_RESULTS)
        const data = await Promise.all(filtered.map((r) => r.data()))
        setResults(data)
        setActiveIndex(-1)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, locale])

  if (!isOpen) return null

  const showUnavailable = pfReady === 'unavailable' && query.trim().length > 0

  return (
    // Backdrop — click outside to close
    <div
      className="search-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="search-dialog"
        data-lbus-component="search-dialog"
        role="dialog"
        aria-label="Search"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="search-dialog-header">
          <svg
            className="search-dialog-icon"
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
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            className="search-dialog-input"
            placeholder={t(locale, 'search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t(locale, 'search.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="search-dialog-esc"
            onClick={onClose}
            aria-label="Close search"
          >
            <kbd>Esc</kbd>
          </button>
        </div>

        {/* Results body */}
        <div className="search-dialog-body">
          {showUnavailable ? (
            <p className="search-unavailable">
              Search is available after first production build.
            </p>
          ) : (
            <SearchResults
              results={results}
              loading={loading}
              query={query}
              locale={locale}
              onSelect={navigateTo}
              activeIndex={activeIndex}
            />
          )}
        </div>
      </div>
    </div>
  )
}
