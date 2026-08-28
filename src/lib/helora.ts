/**
 * Helora customer-service widget boot — ported from the legacy VitePress
 * `AppNav.vue` (bootHelora / waitForHeloraAndBoot / headerAction / theme sync).
 *
 * The SDK <script> is injected in BaseLayout's <head> (with a build-time
 * `data-helora-proxy` attribute). This module waits for `window.Helora`, boots
 * it once with the current locale/theme, wires the "submit issue" header action
 * to GitHub, and hot-syncs the theme when the user toggles it.
 *
 * Not loaded inside the whale app (host provides its own) or on the CN site
 * (not yet onboarded) — the caller guards those.
 */
import { t, type Locale } from '@longbridge/openapi-utils'

let booted = false
const disposers: Array<() => void> = []

function buildBootConfig(locale: Locale) {
  const tag = document.querySelector<HTMLScriptElement>('script[data-helora-proxy]')
  const proxy = (tag?.dataset.heloraProxy as 'prod' | 'staging') || 'staging'
  const dark = document.documentElement.dataset.mode === 'dark'
  return {
    proxy,
    guest: true,
    configPlatform: 'web' as const,
    configKey: 'helora-agent-openapi',
    source: 'web_openapi',
    locale,
    theme: { mode: (dark ? 'dark' : 'light') as 'dark' | 'light' },
    headerActions: [
      { id: 'issue', label: t(locale, 'helora.submitIssue'), icon: 'alert-circle', intent: 'event' as const },
    ],
  }
}

function tryBoot(locale: Locale): boolean {
  const Helora = window.Helora
  if (!Helora) return false
  Helora.boot(buildBootConfig(locale))
  booted = true
  const offAction = Helora.on?.('headerAction', (payload?: { id?: string }) => {
    if (payload?.id === 'issue') {
      window.open('https://github.com/longbridge/openapi/issues/new', '_blank', 'noopener,noreferrer')
    }
  })
  if (typeof offAction === 'function') disposers.push(offAction)
  return true
}

/** Boot Helora once. Polls for the async SDK with a bounded timeout, then keeps
 *  the theme in sync via a MutationObserver on <html data-mode>. */
export function bootHelora(locale: Locale): void {
  if (booted) return
  if (tryBoot(locale)) {
    watchTheme()
    return
  }
  let tries = 0
  const timer = window.setInterval(() => {
    tries += 1
    if (tryBoot(locale) || tries > 100) {
      window.clearInterval(timer)
      if (booted) watchTheme()
    }
  }, 100)
  disposers.push(() => window.clearInterval(timer))
}

function watchTheme(): void {
  const obs = new MutationObserver(() => {
    if (!booted) return
    const dark = document.documentElement.dataset.mode === 'dark'
    window.Helora?.setThemeMode?.(dark ? 'dark' : 'light')
  })
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
  disposers.push(() => obs.disconnect())
}
