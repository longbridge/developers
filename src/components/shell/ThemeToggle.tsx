import { useState, useEffect } from 'react'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'

type Pref = 'light' | 'dark' | 'system'

interface Props {
  locale?: Locale
}

function applyTheme(pref: Pref): void {
  const dark =
    pref === 'dark' ||
    (pref === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.dataset.mode = dark ? 'dark' : 'light'
  document.documentElement.dataset.nbPref = pref
  localStorage.setItem('ui-mode', pref)
}

export default function ThemeToggle({ locale = 'en' }: Props) {
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

  function select(p: Pref): void {
    setPref(p)
    applyTheme(p)
  }

  const labels: Record<Pref, string> = {
    light: t(locale, 'nav.theme.light'),
    dark: t(locale, 'nav.theme.dark'),
    system: t(locale, 'nav.theme.system'),
  }

  return (
    <div
      data-lbus-component="theme-toggle"
      className="theme-toggle"
      role="group"
      aria-label="Theme"
    >
      {(['light', 'dark', 'system'] as Pref[]).map((p) => (
        <button
          key={p}
          type="button"
          aria-pressed={pref === p}
          onClick={() => select(p)}
          className={`theme-toggle-btn${pref === p ? ' active' : ''}`}
        >
          {labels[p]}
        </button>
      ))}
    </div>
  )
}
