import { useState, useEffect, useRef } from 'react'
import { t, type Locale } from '@longbridge/openapi-utils'
import type { SidebarNode } from '@longbridge/openapi-utils'
import Sidebar from './Sidebar'
import Backdrop from './Backdrop'
import type { TocHeading } from './TOC'

interface Props {
  locale: Locale
  pathname?: string
  nodes: SidebarNode[]
  headings?: TocHeading[]
}

/** Read the article's h2/h3 from the rendered DOM — same source of truth as
 *  the desktop TOC (the server `headings` export misses JSX-rewritten
 *  headings; see TOC.tsx). */
function collectFromDom(): TocHeading[] {
  const root = document.querySelector('.docs-content')
  if (!root) return []
  return Array.from(root.querySelectorAll('h2, h3'))
    .filter((el): el is HTMLElement => el instanceof HTMLElement && !!el.id)
    .map((el) => ({
      depth: el.tagName === 'H3' ? 3 : 2,
      slug: el.id,
      text: (el.textContent ?? '').replace(/\s+/g, ' ').trim(),
    }))
}

export default function LocalNav({ locale, pathname = '/', nodes, headings = [] }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  // Legacy .VPLocalNav is tucked behind the header at the top and slides down
  // (translateY) once the page is scrolled — it is not shown at rest.
  const [revealed, setRevealed] = useState(false)
  const [items, setItems] = useState<TocHeading[]>(() =>
    headings.filter((h) => h.depth >= 2 && h.depth <= 3),
  )
  const barRef = useRef<HTMLDivElement | null>(null)

  // Reveal on scroll.
  useEffect(() => {
    const onScroll = () => setRevealed(window.scrollY > 100)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Derive the "On this page" outline from the DOM on mount + each swap.
  useEffect(() => {
    const sync = () => setItems(collectFromDom())
    sync()
    document.addEventListener('astro:page-load', sync)
    return () => document.removeEventListener('astro:page-load', sync)
  }, [])

  // Close both menus after a client-side navigation.
  useEffect(() => {
    const onPage = () => {
      setSidebarOpen(false)
      setTocOpen(false)
    }
    document.addEventListener('astro:page-load', onPage)
    return () => document.removeEventListener('astro:page-load', onPage)
  }, [])

  // Close the TOC dropdown on outside click / Escape.
  useEffect(() => {
    if (!tocOpen) return
    const onDoc = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) setTocOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTocOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [tocOpen])

  const close = () => setSidebarOpen(false)
  const returnToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTocOpen(false)
  }

  return (
    <>
      {/* Reveal bar — legacy .VPLocalNav (fixed, slides in on scroll). The
          transform lives on THIS element only; the sidebar drawer/backdrop are
          rendered as siblings below so the transform (a containing block for
          fixed descendants) does not break the drawer. */}
      <div
        ref={barRef}
        className="fixed left-0 right-0 top-[60px] z-20 lg:hidden transition-transform duration-200 will-change-transform"
        style={{
          transform: revealed ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: revealed ? 'auto' : 'none',
        }}
        data-lbus-component="local-nav"
      >
        <div className="flex items-center justify-between gap-3 h-12 px-4 bg-[var(--lb-bg-1)] border-b border-[color:var(--app-card-stroke)]">
          {/* Sidebar toggle — hamburger + "Menu" (legacy .VPLocalNav .menu) */}
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-[12px] font-medium text-[color:var(--lb-fg-3)] hover:text-[color:var(--lb-fg-1)]"
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            {t(locale, 'toc.menu')}
          </button>

          {/* On this page — legacy TOC dropdown trigger (only when the page has
              an outline). */}
          {items.length > 0 && (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-transparent border-0 cursor-pointer text-[12px] font-medium text-[color:var(--lb-fg-2)] hover:text-[color:var(--lb-fg-1)]"
              aria-label={t(locale, 'toc.title')}
              aria-expanded={tocOpen}
              onClick={() => setTocOpen((v) => !v)}
            >
              {t(locale, 'toc.title')}
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform duration-200 ${tocOpen ? 'rotate-90' : ''}`}
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          )}
        </div>

        {/* TOC dropdown — legacy .VPLocalNavOutlineDropdown */}
        {tocOpen && items.length > 0 && (
          <div className="absolute left-4 right-4 top-full mt-2 rounded-lg border border-[color:var(--app-card-stroke)] bg-[var(--lb-bg-1)] shadow-[0_12px_32px_rgba(0,0,0,0.1)] max-h-[calc(100dvh-140px)] overflow-y-auto py-1">
            <button
              type="button"
              onClick={returnToTop}
              className="block w-full text-left px-4 py-3 text-[14px] font-medium text-[color:var(--lb-brand)] bg-transparent border-0 border-b border-[color:var(--app-card-stroke)] cursor-pointer"
            >
              {t(locale, 'toc.returnToTop')}
            </button>
            {items.map((h) => (
              <a
                key={h.slug}
                href={`#${h.slug}`}
                onClick={() => setTocOpen(false)}
                className={
                  'block px-4 py-2 text-[14px] no-underline text-[color:var(--lb-fg-3)] hover:text-[color:var(--lb-brand)]' +
                  (h.depth === 3 ? ' pl-8' : '')
                }
              >
                {h.text}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar drawer + backdrop — MOBILE ONLY (lg:hidden). The desktop docs
          sidebar is rendered separately by DocsLayout; without this wrapper the
          drawer's Sidebar (lg:sticky, 100vh tall) renders a second time on
          desktop and pushes the article down. Kept outside the transformed
          reveal bar (a plain div, no transform) so the drawer's fixed
          positioning still resolves against the viewport on mobile. */}
      <div className="lg:hidden">
        <Backdrop visible={sidebarOpen} onClick={close} />
        <Sidebar nodes={nodes} pathname={pathname} open={sidebarOpen} onClose={close} />
      </div>
    </>
  )
}
