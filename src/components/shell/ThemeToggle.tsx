import { useState, useEffect } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { detectWhaleApp } from '@/lib/whale'

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
  // Gate the theme-dependent icon behind mount. The server (and React's
  // first client render, which must byte-match the server HTML) has no
  // access to localStorage or matchMedia — reading them during render made
  // the icon depend on the user's OS theme and caused a hydration mismatch
  // (server MoonIcon vs client SunIcon on a dark-preferring machine). We
  // render a stable MoonIcon until mounted, then swap to the resolved icon.
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Whale app: the theme is UA-driven and applied inline in <head>; the toggle
    // is hidden there, so don't let its mount effect override that theme.
    if (detectWhaleApp()) return
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

  function resolveDark(p: Pref): boolean {
    return p === 'dark' || (p === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  }

  // Legacy useThemeToggle: circular clip-path reveal from the click point via
  // the View Transitions API (falls back to an instant switch).
  function cycle(e: React.MouseEvent): void {
    const next = CYCLE[pref]
    const apply = () => {
      setPref(next)
      applyTheme(next)
    }
    const canAnimate =
      'startViewTransition' in document &&
      matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!canAnimate) {
      apply()
      return
    }
    const x = e.clientX
    const y = e.clientY
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    const nextDark = resolveDark(next)
    document.startViewTransition(apply).ready.then(() => {
      document.documentElement.animate(
        { clipPath: nextDark ? [...clip].reverse() : clip },
        {
          duration: 300,
          easing: 'ease-in',
          pseudoElement: `::view-transition-${nextDark ? 'old' : 'new'}(root)`,
        },
      )
    })
  }

  const isDark =
    mounted &&
    (pref === 'dark' ||
      (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches))

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
