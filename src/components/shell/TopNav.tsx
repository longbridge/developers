import { useState, useEffect } from 'react'
import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'
import { nav as navEn } from '../../data/nav.en'
import { nav as navZhCN } from '../../data/nav.zh-CN'
import { nav as navZhHK } from '../../data/nav.zh-HK'
import type { NavItem } from '../../data/nav.en'
import UserAvatar from './UserAvatar'

type Theme = 'light' | 'dark' | 'system'

interface Props {
  locale: Locale
  pathname?: string
}

const LOGO_LIGHT =
  'https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png'
const LOGO_DARK =
  'https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png'

function navForLocale(locale: Locale): NavItem[] {
  if (locale === 'zh-CN') return navZhCN
  if (locale === 'zh-HK') return navZhHK
  return navEn
}

function isActive(item: NavItem, pathname: string): boolean {
  if (!item.activeMatch) return false
  try {
    return new RegExp(item.activeMatch).test(pathname)
  } catch {
    return false
  }
}

function readTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  const stored = localStorage.getItem('ui-mode')
  if (stored === 'light' || stored === 'dark') return stored
  return 'system'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    root.removeAttribute('data-theme')
  } else {
    root.setAttribute('data-theme', theme)
  }
  localStorage.setItem('ui-mode', theme)
}

function cycleTheme(current: Theme): Theme {
  if (current === 'light') return 'dark'
  if (current === 'dark') return 'system'
  return 'light'
}

export default function TopNav({ locale, pathname = '/' }: Props) {
  const [theme, setTheme] = useState<Theme>('system')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = navForLocale(locale)

  useEffect(() => {
    setTheme(readTheme())
  }, [])

  function handleCycleTheme() {
    const next = cycleTheme(theme)
    setTheme(next)
    applyTheme(next)
  }

  const themeLabel =
    theme === 'light'
      ? t(locale, 'nav.theme.light')
      : theme === 'dark'
        ? t(locale, 'nav.theme.dark')
        : t(locale, 'nav.theme.system')

  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <header className="top-nav" data-lbus-component="top-nav">
      <div className="top-nav-inner">
        {/* Logo */}
        <a href={homeHref} className="top-nav-logo" aria-label="Longbridge Developers">
          <img
            src={LOGO_LIGHT}
            alt="Longbridge Developers"
            className="logo-light"
            width={180}
            height={32}
          />
          <img
            src={LOGO_DARK}
            alt="Longbridge Developers"
            className="logo-dark"
            width={180}
            height={32}
          />
        </a>

        {/* Desktop nav */}
        <nav className="top-nav-links" aria-label="Main navigation">
          <ul role="list">
            {navItems.map((item) => (
              <li key={item.link ?? item.text}>
                {item.link ? (
                  <a
                    href={item.link}
                    className={isActive(item, pathname) ? 'nav-link active' : 'nav-link'}
                    aria-current={isActive(item, pathname) ? 'page' : undefined}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="nav-link nav-group">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right controls */}
        <div className="top-nav-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={handleCycleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            <span className="theme-icon" aria-hidden="true">
              {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
            </span>
          </button>

          <UserAvatar locale={locale} />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="top-nav-mobile" aria-label="Mobile navigation">
          <ul role="list">
            {navItems.map((item) => (
              <li key={item.link ?? item.text}>
                {item.link ? (
                  <a
                    href={item.link}
                    className={isActive(item, pathname) ? 'nav-link active' : 'nav-link'}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="nav-link nav-group">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
