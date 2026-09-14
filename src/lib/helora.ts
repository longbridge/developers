/**
 * Helora customer-service widget boot — ported from the legacy VitePress
 * `AppNav.vue` (bootHelora / waitForHeloraAndBoot / headerAction / theme sync).
 *
 * The SDK <script> is injected in BaseLayout's <head> (with a build-time
 * `data-helora-proxy` attribute). This module waits for `window.Helora` and
 * (re)boots it on every ClientRouter page-load with the current locale/theme,
 * wires the "submit issue" header action to GitHub, and hot-syncs the theme
 * when the user toggles it.
 *
 * Not loaded inside the whale app (host provides its own) or on the CN site
 * (not yet onboarded) — the caller guards those.
 */
import { t, type Locale } from '@longbridge/openapi-utils'

// ClientRouter 每次切页替换 <body>,helora 的 Shadow DOM 宿主节点会被冲掉，所以要
// 每次 page-load 重新 boot。Helora.boot() 自带「先 destroy 旧实例再重建」,重复调用安全;
// 下面这些单例句柄用于重复 boot 时不残留旧的监听 / observer / 轮询定时器。
let offAction: (() => void) | null = null
let pollTimer: number | null = null
let themeWatched = false

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
  // boot() 已销毁上一实例 (连同它的 on 订阅),这里先释放我们持有的旧句柄再重订，避免叠加。
  offAction?.()
  offAction =
    Helora.on?.('headerAction', (payload?: { id?: string }) => {
      if (payload?.id === 'issue') {
        window.open('https://github.com/longbridge/openapi/issues/new', '_blank', 'noopener,noreferrer')
      }
    }) ?? null
  return true
}

/** (Re)boot Helora on every page-load. Idempotent: boot() self-destroys the prior
 *  instance, so 切页重挂不残留。Polls for the async SDK with a bounded timeout, then
 *  keeps the theme in sync via a single MutationObserver on <html data-mode>. */
export function bootHelora(locale: Locale): void {
  // 取消上一次 page-load 可能仍在跑的轮询，避免多个定时器叠加。
  if (pollTimer !== null) {
    window.clearInterval(pollTimer)
    pollTimer = null
  }
  if (tryBoot(locale)) {
    watchThemeOnce()
    return
  }
  let tries = 0
  pollTimer = window.setInterval(() => {
    tries += 1
    if (tryBoot(locale) || tries > 100) {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer)
        pollTimer = null
      }
      watchThemeOnce()
    }
  }, 100)
}

/** <html data-mode> → Helora 主题热同步。<html> 与 document 跨 ClientRouter swap 存活，
 *  observer 只建一次即可覆盖后续所有 re-boot。 */
function watchThemeOnce(): void {
  if (themeWatched) return
  themeWatched = true
  const obs = new MutationObserver(() => {
    const dark = document.documentElement.dataset.mode === 'dark'
    window.Helora?.setThemeMode?.(dark ? 'dark' : 'light')
  })
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-mode'] })
}
