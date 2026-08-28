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
import { featuresForLocale, localePath } from '../../data/features-menu'

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
  // Legacy mobile nav renders Features as a collapsible accordion.
  const [featuresOpen, setFeaturesOpen] = useState(false)
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
      setFeaturesOpen(false)
    }
    document.addEventListener('astro:page-load', onPageLoad)
    return () => document.removeEventListener('astro:page-load', onPageLoad)
  }, [])
  const navItems = navForLocale(locale)

  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <header className="fixed top-0 left-0 right-0 z-30 border-b border-[color:var(--app-card-stroke)] bg-[color-mix(in_srgb,var(--lb-bg-1)_80%,transparent)] [backdrop-filter:saturate(180%)_blur(20px)] [-webkit-backdrop-filter:saturate(180%)_blur(20px)] font-[var(--lb-font-sans)]" data-lbus-component="top-nav">
      {/* Desktop: lg:gap-0 drops the uniform gap so the nav's own lg:ml-[60px]
          is the exact logo→menu distance. Mobile (legacy .app-nav-inner): 16px
          side padding, 4px gaps, tail pushed right via ml-auto on the controls. */}
      <div className="flex items-center gap-1 lg:gap-0 max-w-[1240px] h-[60px] px-4 lg:px-6 mx-auto">
        {/* Logo — legacy .app-brand: gap 8 / weight 700 / color --lb-fg-1 */}
        <a href={homeHref} className="inline-flex items-center gap-2 shrink-0 self-stretch text-[color:var(--lb-fg-1)] font-bold text-[15px] tracking-[-0.01em] whitespace-nowrap" aria-label="Longbridge Developers">
          <img
            src={LOGO_LIGHT}
            alt="Longbridge Developers"
            className="block h-[22px] lg:h-[30px] w-auto dark:hidden"
            width={180}
            height={30}
          />
          <img
            src={LOGO_DARK}
            alt="Longbridge Developers"
            className="hidden h-[22px] lg:h-[30px] w-auto dark:block"
            width={180}
            height={30}
          />
        </a>

        {/* Desktop nav — legacy .app-nav-links: gap 4px. lg:ml-[60px] sets the
            logo→menu distance (web/desktop only; nav is display:none below lg). */}
        <nav className="flex-1 min-w-0 hidden lg:block lg:ml-[60px]" aria-label="Main navigation">
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

        {/* Right controls — legacy .app-nav-tail: desktop gap 8, mobile gap 4
            and ml-auto to sit flush right (nav is display:none on mobile so it
            can't push the tail over like it does on desktop). */}
        <div className="flex items-center gap-1 lg:gap-2 ml-auto">
          <SearchButton locale={locale} />
          <LanguageSwitcher currentLocale={locale} currentPath={currentPath} />
          {/* Theme toggle — desktop only. Legacy keeps it out of the mobile
              header bar (mobile tail = language · Get Started · menu). */}
          <span className="hidden lg:inline-flex items-center">
            <ThemeToggle locale={locale} />
          </span>
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
          {/* Login block (legacy AppNav tail): logged out → "Get Started" CTA
              linking to the login redirect flow; logged in → Dashboard + avatar
              dropdown. All of it lives in UserAvatar. */}
          <UserAvatar locale={locale} />
        </div>

        {/* Mobile menu toggle — legacy .app-nav-icon-btn (32×32 · rounded-8 ·
            fg-2 · hover bg-2). Keeps the hamburger glyph when open (legacy does
            not swap to an X); the open state shows the bg-2 active fill. */}
        <button
          type="button"
          className={
            'lg:hidden grid place-items-center w-8 h-8 rounded-lg border border-transparent cursor-pointer ' +
            (mobileOpen
              ? 'bg-[var(--lb-bg-2)] text-[color:var(--lb-fg-1)]'
              : 'bg-transparent text-[color:var(--lb-fg-2)] hover:bg-[var(--lb-bg-2)] hover:text-[color:var(--lb-fg-1)]')
          }
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile nav — legacy .app-nav-mobile: white panel, top border, 16px
          side padding, Features as a collapsible accordion, then the nav links
          as divided rows. */}
      {mobileOpen && (
        <nav
          /* absolute top-full: legacy's nav is position:fixed so the panel
             overlays the page — expanding Features must not push the page
             content (docs toolbar etc.) down. This header is sticky (a
             positioned ancestor), so the panel anchors to it and floats over
             the content instead of growing the header in flow. */
          className="lg:hidden absolute left-0 right-0 top-full bg-[var(--lb-bg-1)] border-t border-[color:var(--app-card-stroke)] px-4 pt-2 pb-4 max-h-[calc(100dvh-60px)] overflow-y-auto"
          aria-label="Mobile navigation"
        >
          {/* Features accordion — legacy .screen-menu-group */}
          <div className="border-b border-[color:var(--app-card-stroke)]">
            <button
              type="button"
              className="flex items-center justify-between w-full py-3 pr-1 bg-transparent border-0 cursor-pointer text-[14px] font-medium text-[color:var(--lb-fg-1)]"
              aria-expanded={featuresOpen}
              onClick={() => setFeaturesOpen((v) => !v)}
            >
              <span>{t(locale, 'nav.features')}</span>
              {/* + when collapsed, − when open (legacy vpi-plus toggle) */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                {!featuresOpen && <line x1="12" y1="5" x2="12" y2="19" />}
              </svg>
            </button>
            {featuresOpen && (
              <div className="flex flex-col pb-2">
                {featuresForLocale(locale).map((f) => (
                  <a
                    key={f.title}
                    href={localePath(locale, f.link)}
                    className="block py-1 pl-4 text-[14px] text-[color:var(--lb-fg-2)] no-underline hover:text-[color:var(--lb-fg-1)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {f.title}
                  </a>
                ))}
              </div>
            )}
          </div>
          {/* Top-level links — legacy .app-nav-mobile > a */}
          {navItems.map((item) =>
            item.link ? (
              <a
                key={item.link}
                href={item.link}
                className={
                  'block py-2.5 text-[15px] no-underline border-b border-[color:var(--app-card-stroke)] last:border-b-0 hover:text-[color:var(--lb-brand)] ' +
                  (isActive(item, currentPath) ? 'text-[color:var(--lb-brand)] font-medium' : 'text-[color:var(--lb-fg-1)]')
                }
                aria-current={isActive(item, currentPath) ? 'page' : undefined}
                onClick={() => setMobileOpen(false)}
              >
                {item.text}
              </a>
            ) : (
              <span
                key={item.text}
                className="block py-2.5 text-[15px] border-b border-[color:var(--app-card-stroke)] last:border-b-0 text-[color:var(--lb-fg-2)]"
              >
                {item.text}
              </span>
            )
          )}
        </nav>
      )}
    </header>
  )
}
