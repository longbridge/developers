import { useState, useEffect } from 'react'

export interface TocHeading {
  depth: number
  slug: string
  text: string
}

interface Props {
  headings: TocHeading[]
}

export default function TOC({ headings }: Props) {
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
    <aside className="toc" data-lbus-component="toc" aria-label="Table of contents">
      <nav>
        <p className="toc-title">On this page</p>
        <ul className="toc-list" role="list">
          {filtered.map((h) => (
            <li
              key={h.slug}
              className={`toc-item toc-depth-${h.depth}${activeId === h.slug ? ' toc-active' : ''}`}
            >
              <a
                href={`#${h.slug}`}
                className="toc-link"
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
