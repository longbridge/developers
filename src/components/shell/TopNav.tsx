import { useState } from 'react'
import type { Locale } from '../../lib/i18n'
import { nav as navEn } from '../../data/nav.en'
import { nav as navZhCN } from '../../data/nav.zh-CN'
import { nav as navZhHK } from '../../data/nav.zh-HK'
import type { NavItem } from '../../data/nav.en'
import UserAvatar from './UserAvatar'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import SearchButton from './SearchButton'

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

export default function TopNav({ locale, pathname: currentPath = '/' }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navItems = navForLocale(locale)

  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--lb-stroke)] bg-[color-mix(in_oklch,var(--lbus-c-bg)_90%,transparent)] [backdrop-filter:blur(8px)] [-webkit-backdrop-filter:blur(8px)]" data-lbus-component="top-nav">
      <div className="flex items-center gap-4 max-w-[80rem] h-14 px-4 mx-auto">
        {/* Logo */}
        <a href={homeHref} className="inline-flex items-center" aria-label="Longbridge Developers">
          <img
            src={LOGO_LIGHT}
            alt="Longbridge Developers"
            className="block h-7 w-auto [[data-mode='dark']_&]:hidden"
            width={180}
            height={32}
          />
          <img
            src={LOGO_DARK}
            alt="Longbridge Developers"
            className="hidden h-7 w-auto [[data-mode='dark']_&]:inline-block"
            width={180}
            height={32}
          />
        </a>

        {/* Desktop nav */}
        <nav className="flex-1 min-w-0 text-sm hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-5 list-none p-0 m-0" role="list">
            {navItems.map((item) => (
              <li key={item.link ?? item.text}>
                {item.link ? (
                  <a
                    href={item.link}
                    className={isActive(item, currentPath) ? 'text-[color:var(--lb-brand)] no-underline py-1 inline-block font-medium' : 'text-[color:var(--lb-fg-2)] no-underline py-1 inline-block hover:text-[color:var(--lbus-c-text)]'}
                    aria-current={isActive(item, currentPath) ? 'page' : undefined}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-[color:var(--lb-fg-2)] py-1 inline-block">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <SearchButton locale={locale} />
          <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
          <ThemeToggle locale={locale} />

          <UserAvatar locale={locale} />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="inline-flex lg:hidden bg-transparent border-0 cursor-pointer text-[color:var(--lbus-c-text)] text-xl py-1 px-2"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span aria-hidden="true">{mobileOpen ? '✕' : '☰'}</span>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="flex" aria-label="Mobile navigation">
          <ul className="flex flex-col list-none p-0 m-0 w-full px-4 py-2" role="list">
            {navItems.map((item) => (
              <li key={item.link ?? item.text}>
                {item.link ? (
                  <a
                    href={item.link}
                    className={isActive(item, currentPath) ? 'text-[color:var(--lb-brand)] no-underline py-2 block font-medium' : 'text-[color:var(--lb-fg-2)] no-underline py-2 block hover:text-[color:var(--lbus-c-text)]'}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-[color:var(--lb-fg-2)] py-2 block">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
