import { useState, useEffect } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

type Pref = 'light' | 'dark' | 'system'

interface Props {
  locale?: Locale
}

const CYCLE: Record<Pref, Pref> = { light: 'dark', dark: 'system', system: 'light' }

function applyTheme(pref: Pref): void {
  const dark =
    pref === 'dark' ||
    (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.mode = dark ? 'dark' : 'light'
  document.documentElement.dataset.nbPref = pref
  localStorage.setItem('ui-mode', pref)
}

function MoonIcon() {
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

// locale prop kept for API compatibility — icon toggle does not need locale labels
export default function ThemeToggle({ locale: _locale = 'en' }: Props) {
  const [pref, setPref] = useState<Pref>('system')

  useEffect(() => {
    const stored = (localStorage.getItem('ui-mode') ?? 'system') as Pref
    setPref(stored)
    applyTheme(stored)

    const mql = matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      const current = (localStorage.getItem('ui-mode') ?? 'system') as Pref
      if (current === 'system') {
        document.documentElement.dataset.mode = e.matches ? 'dark' : 'light'
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  function cycle(): void {
    const next = CYCLE[pref]
    setPref(next)
    applyTheme(next)
  }

  const isDark =
    pref === 'dark' ||
    (pref === 'system' &&
      typeof window !== 'undefined' &&
      matchMedia('(prefers-color-scheme: dark)').matches)

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      data-lbus-component="theme-toggle"
      onClick={cycle}
      className="inline-flex items-center justify-center w-8 h-8 rounded text-[color:var(--lb-fg-2)] hover:text-[color:var(--lbus-c-text)] bg-transparent border-0 cursor-pointer"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
