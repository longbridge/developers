/**
 * Whale App (Longbridge in-app WebView) detection — ported from the legacy
 * VitePress `composables/useWhaleApp.ts`. The host app injects `lbcommitid`
 * and `lbtheme/<mode>` into the User-Agent.
 *
 * Used to (a) hide the site chrome (top nav / local nav / footer) inside the
 * embedded WebView and (b) take the theme from the UA instead of localStorage.
 * The no-flash versions of both run inline in BaseLayout's <head>; this module
 * is for JS consumers (site-init, helora).
 */
const WHALE_RE = /lbcommitid/i
const THEME_RE = /lbtheme\/(\S+)/

export function detectWhaleApp(ua?: string): boolean {
  if (typeof navigator === 'undefined' && !ua) return false
  return WHALE_RE.test(ua ?? navigator.userAgent ?? '')
}

/** Theme mode injected by the whale app as `lbtheme/<mode>` in the UA. */
export function getThemeModeByUA(ua?: string): string {
  if (typeof navigator === 'undefined' && !ua) return ''
  const match = (ua ?? navigator.userAgent ?? '').match(THEME_RE) || []
  return match[1] || ''
}
