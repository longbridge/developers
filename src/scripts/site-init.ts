/**
 * Global client init — ports the side effects of the legacy VitePress
 * `theme/index.ts` enhanceApp() to Astro's ClientRouter lifecycle:
 *   - saveInviteCodeFromUrl() on first load + after every navigation
 *   - sensors.init() once (神策 handles SPA $pageview via is_track_single_page)
 *   - a top progress bar on navigation (legacy useProgressBar)
 *
 * Loaded once from BaseLayout.astro via `<script>import '.../site-init'</script>`.
 * Astro re-executes inline module scripts only on full loads, but the
 * `astro:*` listeners registered here survive ClientRouter swaps.
 */
import type { Locale } from '@longbridge/openapi-utils'
import { saveInviteCodeFromUrl } from '../lib/auth'
import { sensors } from '../lib/sensors'
import { detectWhaleApp } from '../lib/whale'
import { bootHelora } from '../lib/helora'
import { renderMermaid } from './mermaid-init'

/* ── Top progress bar (legacy useProgressBar) ─────────────────────────────── */
let barEl: HTMLDivElement | null = null
let animTimer: ReturnType<typeof setInterval> | null = null
let finishTimer: ReturnType<typeof setTimeout> | null = null

function ensureBar(): HTMLDivElement {
  if (barEl) return barEl
  const el = document.createElement('div')
  el.setAttribute('data-lbus-component', 'route-progress')
  el.style.cssText =
    'position:fixed;top:0;left:0;height:2px;width:0;z-index:2000;' +
    'background:var(--lb-brand,#00b8b8);opacity:0;pointer-events:none;' +
    'transition:width .12s ease,opacity .35s ease;'
  document.body.appendChild(el)
  barEl = el
  return el
}

function startProgress(): void {
  if (finishTimer) { clearTimeout(finishTimer); finishTimer = null }
  if (animTimer) { clearInterval(animTimer); animTimer = null }
  const el = ensureBar()
  el.style.opacity = '1'
  let current = 8
  el.style.width = current + '%'
  animTimer = setInterval(() => {
    current = Math.min(current + (85 - current) * 0.1, 85)
    el.style.width = current + '%'
  }, 120)
}

function finishProgress(): void {
  if (animTimer) { clearInterval(animTimer); animTimer = null }
  if (!barEl) return
  barEl.style.width = '100%'
  finishTimer = setTimeout(() => {
    if (!barEl) return
    barEl.style.opacity = '0'
    barEl.style.width = '0'
  }, 350)
}

/* ── Sensors: init once ───────────────────────────────────────────────────── */
let sensorsStarted = false
function initSensorsOnce(): void {
  if (sensorsStarted) return
  sensorsStarted = true
  void sensors.init()
}

/* ── Helora support widget: boot once (skip whale app + CN) ────────────────── */
let heloraStarted = false
function initHeloraOnce(): void {
  if (heloraStarted) return
  heloraStarted = true
  // Host app provides its own support UI; CN site not onboarded yet.
  if (detectWhaleApp() || import.meta.env.PUBLIC_REGION === 'cn') return
  const locale = (document.documentElement.lang || 'en') as Locale
  bootHelora(locale)
}

/* ── Wiring ───────────────────────────────────────────────────────────────── */
function onPageReady(): void {
  saveInviteCodeFromUrl()
  initSensorsOnce()
  initHeloraOnce()
  void renderMermaid()
  finishProgress()
}

// astro:page-load fires on the initial load and after every ClientRouter swap.
document.addEventListener('astro:page-load', onPageReady)
// astro:before-preparation fires when a client-side navigation begins.
document.addEventListener('astro:before-preparation', startProgress)

// Cover the initial load even if astro:page-load already fired before this
// module executed (idempotent: cookie write + sensors.init are safe to repeat).
onPageReady()
