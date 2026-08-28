import { withQuery } from 'ufo'
import type { Locale } from '@longbridge/openapi-utils'

/**
 * Login / session logic ported from the legacy VitePress theme
 * (docs/.vitepress/theme/utils/navigate.ts + composables/useLoginState.ts +
 * components/UserAvatar/uesAvatar.ts).
 *
 * All of it is client-only: it reads window.location, cookies, and the
 * platform bridge `window.longportInternal`. Call these from effects/handlers
 * in hydrated islands, never during SSR.
 */

const INVITE_CODE_KEY = 'invite-code'
const MOCK_KEY = '__mock_login'

// window.longportInternal / __LB_PROXY__ / … are typed in platform-globals.d.ts.

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const target = `${name}=`
  for (const part of document.cookie.split(';')) {
    const trimmed = part.trim()
    if (trimmed.startsWith(target)) {
      return decodeURIComponent(trimmed.slice(target.length))
    }
  }
  return undefined
}

/** Prefer the URL query's invite-code, fall back to the cookie (legacy enhanceApp
 *  copies the URL invite-code into a cookie). */
function resolveInviteCode(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const fromQuery = new URLSearchParams(window.location.search).get(INVITE_CODE_KEY)
  if (fromQuery) return fromQuery
  return readCookie(INVITE_CODE_KEY)
}

/** Legacy localePath: full URLs and relative paths pass through unchanged; only
 *  site-absolute paths get the locale prefix (en = root, no prefix). */
function localePath(locale: Locale, path: string): string {
  if (!path.startsWith('/')) return path
  return locale === 'en' ? path : `/${locale}${path}`
}

/**
 * Build the login redirect URL — 1:1 with legacy `createLoginRedirectPath`.
 * `/login?redirect_to=<origin>/sso?redirect_to=<current href>&logout=1&with-us=1[&invite-code=…]`
 * so that after login the SSO round-trip lands the user back on the current page.
 */
export function createLoginRedirectPath(
  locale: Locale,
  ssoParams?: Record<string, string | number | boolean>,
): string {
  const redirect_to = withQuery(`${window.location.origin}/sso`, {
    redirect_to: window.location.href,
    ...ssoParams,
  })
  const inviteCode = resolveInviteCode()
  return withQuery(localePath(locale, '/login'), {
    redirect_to,
    logout: '1',
    'with-us': '1',
    ...(inviteCode ? { [INVITE_CODE_KEY]: inviteCode } : {}),
  })
}

/** Legacy `initLoginState`: dev uses a localStorage mock, prod reads the
 *  platform bridge. */
export function readIsLogin(): boolean {
  if (import.meta.env.DEV) {
    try {
      return localStorage.getItem(MOCK_KEY) === 'true'
    } catch {
      return false
    }
  }
  return window.longportInternal?.isLogin?.() ?? false
}

/** Legacy `useAvatar`: pull the member avatar from the platform bridge when
 *  logged in. Returns '' when unavailable. */
export async function fetchAvatar(): Promise<string> {
  try {
    const lp = window.longportInternal
    if (lp?.isLogin?.() && lp.getUserInfo) {
      const res = await Promise.resolve(lp.getUserInfo())
      return res?.data?.member?.avatar ?? ''
    }
  } catch {
    /* ignore */
  }
  return ''
}

/**
 * Legacy `saveInviteCodeFromUrl` (theme/index.ts): if the URL carries
 * `?invite-code=…`, persist it to a 7-day cookie so the login redirect can
 * pick it up later even after the user navigates away. Runs on first load and
 * after every client-side navigation (see scripts/site-init.ts).
 */
export function saveInviteCodeFromUrl(): void {
  if (typeof window === 'undefined') return
  const inviteCode = new URLSearchParams(window.location.search).get(INVITE_CODE_KEY)
  if (inviteCode) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `${INVITE_CODE_KEY}=${encodeURIComponent(inviteCode)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}
