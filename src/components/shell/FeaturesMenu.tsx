import { useEffect, useRef, useState } from 'react'
import { t, type Locale } from '@longbridge/openapi-utils'
import { featuresForLocale, localePath, type FeatureItem } from '../../data/features-menu'

interface Props {
  locale: Locale
}

/** Ported from legacy FeaturesMenu.vue.
 *  Desktop: hover-open dropdown with 150ms close delay for cursor gap
 *  tolerance (matches legacy behavior). Also toggles on click for keyboard
 *  access and for tap on hybrid touch/mouse devices. Panel closes on outside
 *  click and on Escape. */
export default function FeaturesMenu({ locale }: Props) {
  const [isOpen, setOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const items = featuresForLocale(locale)

  function open() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      setOpen(false)
      closeTimer.current = null
    }, 150)
  }

  useEffect(() => {
    if (!isOpen) return
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen])

  return (
    <div
      ref={rootRef}
      className="relative inline-flex h-full items-center"
      onMouseEnter={open}
      onMouseLeave={scheduleClose}
      data-lbus-component="nav-features"
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setOpen((v) => !v)}
        className={
          isOpen
            ? 'bg-transparent border-0 cursor-pointer text-[color:var(--lb-brand)] [font-size:13.5px] font-medium opacity-100 rounded-md px-3 py-1.5 hover:bg-[var(--lb-bg-2)] inline-flex items-center gap-1 whitespace-nowrap'
            : 'bg-transparent border-0 cursor-pointer text-[color:var(--lb-fg-1)] [font-size:13.5px] font-medium opacity-[0.78] rounded-md px-3 py-1.5 hover:bg-[var(--lb-bg-2)] hover:opacity-100 inline-flex items-center gap-1 whitespace-nowrap'
        }
      >
        {t(locale, 'nav.features')}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className={`opacity-70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute top-full left-0 z-[100] mt-3 w-[640px] overflow-hidden rounded-xl border border-[color:var(--app-card-stroke)] bg-[var(--lb-bg-1)] p-2 [box-shadow:var(--lb-shadow-menu)]"
        >
          <div className="grid grid-cols-3 gap-1">
            {items.map((item) => (
              <FeatureCard
                key={item.title}
                item={item}
                href={localePath(locale, item.link)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FeatureCard({
  item,
  href,
  onNavigate,
}: {
  item: FeatureItem
  href: string
  onNavigate: () => void
}) {
  return (
    <a
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="flex min-w-0 flex-col gap-1 rounded-lg p-3 no-underline transition-colors duration-150 hover:bg-[var(--lb-bg-2)]"
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <svg
          className="size-4 shrink-0 text-[color:var(--lb-brand)]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: item.icon }}
        />
        <div className="truncate [font-size:14px] font-semibold text-[color:var(--lb-fg-1)]">{item.title}</div>
      </div>
      <div className="line-clamp-2 w-full overflow-hidden whitespace-normal [font-size:12px] leading-normal text-[color:var(--lb-fg-2)]">
        {item.desc}
      </div>
    </a>
  )
}
