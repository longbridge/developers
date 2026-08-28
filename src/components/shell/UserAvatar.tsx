import { useState, useEffect, useRef } from 'react'
import { t } from '@longbridge/openapi-utils'
import type { Locale } from '@longbridge/openapi-utils'
import { createLoginRedirectPath, readIsLogin, fetchAvatar } from '@/lib/auth'

interface Props {
  locale: Locale
}

function localePath(locale: Locale, path: string): string {
  return locale === 'en' ? path : `/${locale}${path}`
}

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

/**
 * Nav login block — ported from the legacy AppNav.vue tail + UserAvatar/*.
 * Logged out: the primary "Get Started" CTA links to the login redirect flow
 * (createLoginRedirectPath). Logged in: a Dashboard button (desktop) plus an
 * avatar dropdown (Dashboard / Connect AI / Log out). Login state comes from
 * the platform bridge `window.longportInternal` (dev uses a localStorage mock),
 * so this is client-only and updates after mount + on each ClientRouter swap.
 */
export default function UserAvatar({ locale }: Props) {
  const [isLogin, setIsLogin] = useState(false)
  const [loginUrl, setLoginUrl] = useState('')
  const [avatar, setAvatar] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const sync = () => {
      const logged = readIsLogin()
      setIsLogin(logged)
      setLoginUrl(createLoginRedirectPath(locale))
      if (logged) fetchAvatar().then(setAvatar)
      else setAvatar('')
    }
    sync()
    document.addEventListener('astro:page-load', sync)
    return () => document.removeEventListener('astro:page-load', sync)
  }, [locale])

  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

  // Logged out → the primary "Get Started" CTA drives the login redirect. Fall
  // back to a plain /login path until the client computes the full redirect URL
  // (keeps SSR and the first client render identical → no hydration mismatch).
  if (!isLogin) {
    return (
      <a
        href={loginUrl || localePath(locale, '/login')}
        target="_self"
        data-lbus-component="nav-get-started"
        className="inline-flex items-center justify-center gap-1.5 rounded-full border border-transparent bg-[var(--lb-fg-1)] text-[color:var(--lb-fg-invert)] h-7 px-3 text-[12.5px] font-semibold no-underline hover:opacity-[0.88] whitespace-nowrap"
      >
        {t(locale, 'nav.getStarted')}
        <ArrowIcon />
      </a>
    )
  }

  const initials = 'U'
  const openMenu = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setMenuOpen(true)
  }
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setMenuOpen(false), 150)
  }

  const menuItems = [
    { title: t(locale, 'nav.dashboard'), href: localePath(locale, '/dashboard') },
    { title: t(locale, 'nav.connectAi'), href: localePath(locale, '/connect') },
    { title: t(locale, 'nav.logout'), href: localePath(locale, '/log-out') },
  ]

  return (
    <>
      {/* Dashboard quick link — desktop only, like legacy (hidden on mobile). */}
      <a
        href={localePath(locale, '/dashboard')}
        target="_self"
        className="hidden lg:inline-flex items-center rounded-full h-7 px-3 text-[12.5px] font-medium no-underline text-[color:var(--lb-fg-1)] hover:bg-[var(--lb-bg-2)] whitespace-nowrap"
      >
        {t(locale, 'nav.dashboard')}
      </a>
      <div
        ref={rootRef}
        className="relative inline-flex items-center"
        data-lbus-component="user-avatar"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-transparent border-0 cursor-pointer p-0"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {avatar ? (
            <img src={avatar} alt="User" width={28} height={28} className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <span className="w-7 h-7 rounded-full bg-[var(--lb-bg-2)] text-[color:var(--lb-fg-1)] text-xs inline-flex items-center justify-center font-medium" aria-hidden="true">
              {initials}
            </span>
          )}
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border border-[color:var(--app-card-stroke)] bg-[var(--lb-bg-1)] shadow-[0_12px_32px_rgba(0,0,0,0.1)] py-1 z-[100]"
          >
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_self"
                role="menuitem"
                className="block px-4 py-2 text-[13px] no-underline text-[color:var(--lb-fg-1)] hover:bg-[var(--lb-bg-2)]"
                onClick={() => setMenuOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
