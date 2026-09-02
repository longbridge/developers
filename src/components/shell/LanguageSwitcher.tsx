import { useState, useEffect, useRef } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

interface Props {
  currentLocale: Locale
  currentPath: string
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'zh-CN', label: '简体中文' },
  { value: 'zh-HK', label: '繁體中文' },
]

function buildUrl(currentLocale: Locale, targetLocale: Locale, currentPath: string): string {
  // Strip current locale prefix to get bare path.
  // `currentPath` can carry a `.html` suffix (build format:'file' → Astro.url
  // pathname is `…/overview.html`); drop it so the switched-locale link points
  // at the clean URL, not the 404 `.html` file.
  let barePath = currentPath.replace(/(?:index)?\.html$/, '')
  if (currentLocale !== 'en') {
    const prefix = `/${currentLocale}`
    if (barePath.startsWith(prefix + '/')) {
      barePath = barePath.slice(prefix.length)
    } else if (barePath === prefix || barePath === prefix + '/') {
      barePath = '/'
    }
  }
  if (!barePath) barePath = '/'

  // For English, use bare path (no prefix)
  if (targetLocale === 'en') {
    return barePath
  }

  // For zh-CN or zh-HK, prepend locale
  if (barePath === '/') {
    return `/${targetLocale}`
  }
  return `/${targetLocale}${barePath}`
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
    </svg>
  )
}

export default function LanguageSwitcher({ currentLocale, currentPath }: Props) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [open])

  return (
    <div
      ref={containerRef}
      data-lbus-component="lang-switcher"
      className="relative"
    >
      <button
        type="button"
        aria-label="Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        data-lbus-component="lang-switcher-trigger"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center w-8 h-8 rounded text-[color:var(--lb-fg-2)] hover:text-[color:var(--lbus-c-text)] bg-transparent border-0 cursor-pointer"
      >
        <GlobeIcon />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1 min-w-[9rem] bg-[var(--lbus-c-bg)] border border-[color:var(--lb-stroke)] rounded-lg shadow-lg list-none p-1 m-0 z-50"
        >
          {LOCALES.map(({ value, label }) => (
            <li key={value} role="option" aria-selected={value === currentLocale}>
              <a
                href={buildUrl(currentLocale, value, currentPath)}
                onClick={() => setOpen(false)}
                className={
                  value === currentLocale
                    ? 'block px-3 py-2 text-sm rounded text-[color:var(--lb-brand)] no-underline'
                    : 'block px-3 py-2 text-sm rounded text-[color:var(--lbus-c-text)] no-underline hover:bg-[var(--lb-bg-2)]'
                }
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
