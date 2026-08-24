import { useState, useEffect } from 'react'
import { t, type Locale } from '@longbridge/openapi-utils'

export interface TocHeading {
  depth: number
  slug: string
  text: string
}

interface Props {
  headings: TocHeading[]
  locale?: Locale
}

/** Read the article's h2/h3 straight from the rendered DOM. The server
 *  `headings` export misses any heading the vite preflight rewrites into a raw
 *  JSX element (`## Foo {#bar}` → `<h2 id="bar">…`, see astro.config.ts step
 *  2) — Astro's mdast heading collector never sees those, so they'd be absent
 *  from the TOC (e.g. "Rate Limit", "Pricing"). Deriving from the DOM captures
 *  every rendered heading with an id, regardless of how it was produced. */
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

export default function TOC({ headings, locale = 'en' }: Props) {
  // SSR seed from the prop (may be incomplete); the DOM is the source of
  // truth once mounted.
  const [items, setItems] = useState<TocHeading[]>(() =>
    headings.filter((h) => h.depth >= 2 && h.depth <= 3),
  )
  const [activeId, setActiveId] = useState<string>('')

  // Re-derive from the DOM on mount and after each ClientRouter swap (the TOC
  // island re-mounts per page, but the listener also covers a persisted mount).
  useEffect(() => {
    const sync = () => setItems(collectFromDom())
    sync()
    document.addEventListener('astro:page-load', sync)
    return () => document.removeEventListener('astro:page-load', sync)
  }, [])

  useEffect(() => {
    if (!items.length) return

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id)
          break
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '0px 0px -80% 0px',
      threshold: 0,
    })

    const headingEls = items
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null)

    for (const el of headingEls) {
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
    }
  }, [items])

  if (!items.length) return null

  return (
    <aside className="docs-toc text-[0.85rem]" data-lbus-component="toc" aria-label="Table of contents">
      <nav>
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[color:var(--lbus-c-text)] mb-3 mt-0">{t(locale, 'toc.title')}</p>
        <ul className="list-none p-0 m-0 flex flex-col gap-1" role="list">
          {items.map((h) => (
            <li
              key={h.slug}
              className={h.depth === 2 ? '' : 'pl-3'}
            >
              <a
                href={`#${h.slug}`}
                className={activeId === h.slug ? 'text-[color:var(--lb-brand)] no-underline block py-[0.15rem]' : 'text-[color:var(--lb-fg-2)] no-underline block py-[0.15rem] hover:text-[color:var(--lb-brand)]'}
                aria-current={activeId === h.slug ? 'location' : undefined}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
