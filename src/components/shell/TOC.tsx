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

export default function TOC({ headings, locale = 'en' }: Props) {
  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3)
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!filtered.length) return

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

    const headingEls = filtered
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null)

    for (const el of headingEls) {
      observer.observe(el)
    }

    return () => {
      observer.disconnect()
    }
    // headings reference is stable per page render; re-run when it changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headings])

  if (!filtered.length) return null

  return (
    <aside className="docs-toc text-[0.85rem]" data-lbus-component="toc" aria-label="Table of contents">
      <nav>
        <p className="text-xs font-semibold uppercase tracking-[0.05em] text-[color:var(--lbus-c-text)] mb-3 mt-0">{t(locale, 'toc.title')}</p>
        <ul className="list-none p-0 m-0 flex flex-col gap-1" role="list">
          {filtered.map((h) => (
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
