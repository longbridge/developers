import { useState, useEffect } from 'react'
import { t, type Locale } from '@longbridge/openapi-utils'
import { nav as navEn } from '../../data/nav.en'
import { nav as navZhCN } from '../../data/nav.zh-CN'
import { nav as navZhHK } from '../../data/nav.zh-HK'
import type { NavItem } from '../../data/nav.en'
import UserAvatar from './UserAvatar'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'
import SearchButton from './SearchButton'
import FeaturesMenu from './FeaturesMenu'

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

function GitHubIcon() {
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
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  )
}

export default function TopNav({ locale, pathname: initialPath = '/' }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  // This island is `transition:persist`ed, so it stays mounted across
  // ClientRouter navigations and its `pathname` prop never updates. Track the
  // live path in state and refresh it on `astro:page-load` (fires after each
  // swap + on first load) so the active highlight and LanguageSwitcher stay
  // correct. Also close the mobile menu after navigating.
  const [currentPath, setCurrentPath] = useState(initialPath)
  useEffect(() => {
    const onPageLoad = () => {
      setCurrentPath(window.location.pathname)
      setMobileOpen(false)
    }
    document.addEventListener('astro:page-load', onPageLoad)
    return () => document.removeEventListener('astro:page-load', onPageLoad)
  }, [])
  const navItems = navForLocale(locale)

  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--app-card-stroke)] bg-[color-mix(in_srgb,var(--lb-bg-1)_80%,transparent)] [backdrop-filter:saturate(180%)_blur(20px)] [-webkit-backdrop-filter:saturate(180%)_blur(20px)] font-[var(--lb-font-sans)]" data-lbus-component="top-nav">
      <div className="flex items-center gap-8 max-w-[1240px] h-[60px] px-6 mx-auto">
        {/* Logo — legacy .app-brand: gap 8 / weight 700 / color --lb-fg-1 */}
        <a href={homeHref} className="inline-flex items-center gap-2 shrink-0 self-stretch text-[color:var(--lb-fg-1)] font-bold text-[15px] tracking-[-0.01em] whitespace-nowrap" aria-label="Longbridge Developers">
          <img
            src={LOGO_LIGHT}
            alt="Longbridge Developers"
            className="block h-[30px] w-auto dark:hidden"
            width={180}
            height={30}
          />
          <img
            src={LOGO_DARK}
            alt="Longbridge Developers"
            className="hidden h-[30px] w-auto dark:block"
            width={180}
            height={30}
          />
        </a>

        {/* Desktop nav — legacy .app-nav-links: gap 4px */}
        <nav className="flex-1 min-w-0 hidden lg:block" aria-label="Main navigation">
          <ul className="flex items-center gap-1 list-none p-0 m-0" role="list">
            {/* Features dropdown — ported from legacy FeaturesMenu.vue */}
            <li>
              <FeaturesMenu locale={locale} />
            </li>
            {navItems.map((item) => (
              <li key={item.link ?? item.text}>
                {item.link ? (
                  <a
                    href={item.link}
                    className={
                      isActive(item, currentPath)
                        ? 'no-underline text-[color:var(--lb-fg-1)] [font-size:13.5px] font-semibold opacity-100 rounded-md px-3 py-1.5 hover:bg-[var(--lb-bg-2)] inline-block whitespace-nowrap'
                        : 'no-underline text-[color:var(--lb-fg-1)] [font-size:13.5px] font-medium opacity-[0.78] rounded-md px-3 py-1.5 hover:bg-[var(--lb-bg-2)] hover:opacity-100 inline-block whitespace-nowrap'
                    }
                    aria-current={isActive(item, currentPath) ? 'page' : undefined}
                  >
                    {item.text}
                  </a>
                ) : (
                  <span className="text-[color:var(--lb-fg-1)] [font-size:13.5px] font-medium opacity-[0.78] px-3 py-1.5 inline-block whitespace-nowrap">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right controls — legacy .app-nav-tail: gap 8 */}
        <div className="flex items-center gap-2">
          <SearchButton locale={locale} />
          <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
          <ThemeToggle locale={locale} />
          {/* GitHub icon link — legacy .app-nav-icon-btn: 32×32 · rounded-8 · fg-2 · hover bg-2/fg-1 */}
          <a
            href="https://github.com/longbridge/developers"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            data-lbus-component="nav-github"
            className="hidden lg:grid place-items-center w-8 h-8 rounded-lg border border-transparent text-[color:var(--lb-fg-2)] hover:bg-[var(--lb-bg-2)] hover:text-[color:var(--lb-fg-1)] no-underline"
          >
            <GitHubIcon />
          </a>
          {/* Get Started CTA — legacy .btn.btn-primary.btn-sm: 28h · 12px · 12.5px · 600 · pill · bg fg-1 / color fg-invert */}
          <a
            href="/user/register"
            data-lbus-component="nav-get-started"
            className="hidden lg:inline-flex items-center justify-center gap-1.5 rounded-full border border-transparent bg-[var(--lb-fg-1)] text-[color:var(--lb-fg-invert)] h-7 px-3 text-[12.5px] font-semibold no-underline hover:opacity-[0.88] whitespace-nowrap"
          >
            {t(locale, 'nav.getStarted')}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
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
