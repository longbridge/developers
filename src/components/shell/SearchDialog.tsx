import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import MiniSearch from 'minisearch'
import type { Locale } from '@longbridge/openapi-utils'
import { t } from '@longbridge/openapi-utils'
import SearchResults, { type SearchHit } from './SearchResults'

interface Props {
  locale: Locale
  isOpen: boolean
  onClose: () => void
}

interface Section {
  id: string
  url: string
  title: string
  headings: string[]
  body: string
}

const DEBOUNCE_MS = 120
const MAX_RESULTS = 12

// Per-locale caches survive dialog close/reopen. First-open pays the fetch;
// subsequent opens are instant.
const indexCache = new Map<Locale, MiniSearch<Section>>()
const inflight = new Map<Locale, Promise<MiniSearch<Section>>>()

async function buildIndex(locale: Locale): Promise<MiniSearch<Section>> {
  // Served from /assets/ (not the site root) so the production nginx serves it
  // as a static file via _assets.conf. A root .json would fall to the catch-all,
  // be rewritten to `<path>/index.html`, and 404 — the "Search index failed to
  // load" seen on the deployed site. Mirrors the /assets asset-dir alignment.
  const res = await fetch(`/assets/search-index.${locale}.json`)
  if (!res.ok) throw new Error(`search-index ${locale} ${res.status}`)
  const { sections } = (await res.json()) as { sections: Section[] }

  const ms = new MiniSearch<Section>({
    fields: ['title', 'headingsJoined', 'body'],
    storeFields: ['url', 'title', 'headings'],
    tokenize: (text) => {
      const out: string[] = []
      let buf = ''
      for (const ch of text.toLowerCase()) {
        if (/[一-鿿぀-ヿ가-힯]/.test(ch)) {
          if (buf) { out.push(buf); buf = '' }
          out.push(ch)
        } else if (/[a-z0-9]/.test(ch)) {
          buf += ch
        } else {
          if (buf) { out.push(buf); buf = '' }
        }
      }
      if (buf) out.push(buf)
      return out
    },
    extractField: (doc, field) => {
      if (field === 'headingsJoined') return (doc as Section).headings.join(' ')
      // For non-virtual fields, hand back the raw value. Returning a
      // stringified array here corrupts storeFields — `headings` came back
      // as "a,b,c" instead of ["a","b","c"] and the UI's .map() blew up.
      return (doc as unknown as Record<string, unknown>)[field] as string
    },
    searchOptions: {
      boost: { title: 3, headingsJoined: 2, body: 1 },
      fuzzy: 0.15,
      prefix: true,
    },
  })

  // Dedup by id — the section builder occasionally emits duplicates for
  // headings that share text within a doc, and MiniSearch throws on add.
  const seen = new Set<string>()
  const unique = sections.filter((s) => {
    if (seen.has(s.id)) return false
    seen.add(s.id)
    return true
  })
  ms.addAll(unique)

  indexCache.set(locale, ms)
  return ms
}

async function loadIndex(locale: Locale): Promise<MiniSearch<Section>> {
  const hit = indexCache.get(locale)
  if (hit) return hit
  const pending = inflight.get(locale)
  if (pending) return pending

  const promise = buildIndex(locale)

  inflight.set(locale, promise)
  return promise
}

export default function SearchDialog({ locale, isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [status, setStatus] = useState<'idle' | 'loading-index' | 'ready' | 'error'>('idle')
  const msRef = useRef<MiniSearch<Section> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Kick index load once when dialog first opens for this locale.
  useEffect(() => {
    if (!isOpen) return
    if (msRef.current) return
    let cancelled = false
    setStatus('loading-index')
    loadIndex(locale)
      .then((ms) => {
        if (cancelled) return
        msRef.current = ms
        setStatus('ready')
      })
      .catch(() => {
        if (cancelled) return
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [isOpen, locale])

  // Autofocus + reset per-open
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

  const navigateTo = useCallback(
    (url: string) => {
      onClose()
      window.location.href = url
    },
    [onClose],
  )

  // Keyboard nav
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
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        if (activeIndex >= 0) {
          e.preventDefault()
          const hit = results[activeIndex]
          if (hit) navigateTo(hit.url)
        } else if (results[0]) {
          e.preventDefault()
          navigateTo(results[0].url)
        }
      }
    }

    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [isOpen, results, activeIndex, navigateTo, onClose])

  // Debounced search — re-triggers when either the query or the index
  // readiness changes, so a query typed while the index is still loading
  // gets served the moment it becomes available.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setActiveIndex(-1)
      return
    }
    debounceRef.current = setTimeout(() => {
      const ms = msRef.current
      if (!ms) {
        // index not ready yet — leave loading spinner on, results will
        // populate once status flips to 'ready' and this effect re-runs
        setResults([])
        return
      }
      setLoading(true)
      try {
        const raw = ms.search(trimmed)
        const hits: SearchHit[] = raw.slice(0, MAX_RESULTS).map((r) => ({
          id: String(r.id),
          url: r.url as string,
          title: r.title as string,
          headings: r.headings as string[],
          matchedTerms: r.terms ?? [],
        }))
        setResults(hits)
        setActiveIndex(hits.length > 0 ? 0 : -1)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, status])

  // Portal into the LIVE document.body, read fresh on each render — not cached in
  // state. TopNav is transition:persist, so this dialog mounts once and survives
  // navigation, but ClientRouter replaces <body> on every swap; a cached target
  // would keep pointing at the old, detached body and the dialog would render
  // where nothing is visible. `isOpen` is false during SSR, so document is safe.
  if (!isOpen || typeof document === 'undefined') return null

  const showIndexError = status === 'error' && query.trim().length > 0

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-20 px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-[min(40rem,100%)] bg-[var(--lb-bg-1)] border border-[color:var(--app-card-stroke)] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
        data-lbus-component="search-dialog"
        role="dialog"
        aria-label="Search"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 h-12 border-b border-[color:var(--app-card-stroke)]">
          <svg
            className="text-[color:var(--lb-fg-2)] shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
            className="flex-1 border-0 bg-transparent outline-none text-[color:var(--lb-fg-1)] text-[15px] py-2 placeholder:text-[color:var(--lb-fg-2)]"
            placeholder={t(locale, 'search.placeholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t(locale, 'search.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              type="button"
              className="bg-transparent border-0 cursor-pointer p-1 text-[color:var(--lb-fg-2)] hover:text-[color:var(--lb-fg-1)] shrink-0"
              onClick={() => setQuery('')}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Results body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {showIndexError ? (
            <p className="p-4 text-[color:var(--lb-fg-2)] text-sm text-center">
              Search index failed to load.
            </p>
          ) : (
            <SearchResults
              results={results}
              loading={loading || status === 'loading-index'}
              query={query}
              locale={locale}
              onSelect={navigateTo}
              activeIndex={activeIndex}
              onHover={setActiveIndex}
            />
          )}
        </div>

        {/* Footer hint bar (mirrors legacy: ↑↓ Switch  ↵ Select  esc Close) */}
        <div className="flex items-center gap-4 px-4 h-10 border-t border-[color:var(--app-card-stroke)] bg-[var(--lb-bg-2)] text-[11px] text-[color:var(--lb-fg-2)]">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↑</Kbd>
            <Kbd>↓</Kbd>
            <span>Switch</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>↵</Kbd>
            <span>Select</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            <span>Close</span>
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="[font-family:var(--app-mono)] [font-size:11px] leading-[11px] px-[5px] py-[2px] bg-[var(--lb-bg-1)] border border-[color:var(--app-card-stroke)] rounded text-[color:var(--lb-fg-2)]">
      {children}
    </kbd>
  )
}
