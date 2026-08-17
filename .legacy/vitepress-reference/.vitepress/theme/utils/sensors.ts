/**
 * Sensors (神策) analytics wrapper for Longbridge Developers.
 *
 * The SDK script is loaded via <script defer> in `.vitepress/config.mts`
 * (`sensorsdata/1.27.11.min.js`) and exposes `window.sensorsDataAnalytic201505`.
 * This module waits for that global, initializes with the correct server_url
 * based on the build-time proxy (canary vs production, injected by config.mts
 * as `window.__LB_PROXY__`), and exposes a queued `track()` / `login()` API
 * so callers don't need to await SDK readiness themselves.
 *
 * Default behaviour (once init runs):
 * - `$pageview` fires on first load and on every SPA route change
 *   (`is_track_single_page: true`).
 * - **Every click on the page is auto-reported as `$WebClick`**
 *   (`heatmap.clickmap: 'default'`), carrying tag / class / text / xpath.
 * - Page stay / scroll depth reported as `$WebStay`
 *   (`heatmap.scroll_notice_map: 'default'`).
 * - If the user is already signed in (`window.longportInternal.isLogin()`),
 *   their member id is bound via `sensors.login()` after init.
 *
 * If a call site wants to disable the initial auto pageview, pass
 * `{ autoTrack: false }` to `sensors.init()`.
 */

// Reporting endpoint & project name per environment.
const SERVER_URL_MAP = {
  production: 'https://event-tracking.lbkrs.com',
  default: 'https://event-forward.longbridge.xyz',
} as const

const PROJECT_NAME_MAP = {
  production: 'production',
  default: 'default',
} as const

const GLOBAL_KEY = 'sensorsDataAnalytic201505' as const

type SensorsInstance = {
  init: (config: Record<string, unknown>) => void
  quick: (name: string, ...args: unknown[]) => void
  track: (name: string, options?: Record<string, unknown>) => void
  login: (id: string | number) => void
  registerPage: (properties: Record<string, unknown>) => void
}

/**
 * Shape of `window.longportInternal` (loaded via
 * `longport-internal.iife.js` in config.mts insertScript). Only the members
 * we consume are typed; the SDK exposes more.
 */
type LongportInternal = {
  isLogin?: () => boolean
  getUserInfo?: () =>
    | { data?: { member?: { member_id?: string | number } } }
    | Promise<{ data?: { member?: { member_id?: string | number } } }>
}

/** Build-time proxy: 'canary' | 'production', injected by config.mts. */
type LbProxy = 'canary' | 'production'

declare global {
  interface Window {
    __LB_PROXY__?: LbProxy
    longportInternal?: LongportInternal
  }
}

export interface SensorsInitOptions {
  show_log?: boolean
  /** Set to false to skip the initial $pageview after init(). */
  autoTrack?: boolean
}

const READY_POLL_MS = 100
const READY_POLL_MAX_TRIES = 50 // 5s total; SDK is <script defer>, should land well before.

class Sensors {
  private instance: SensorsInstance | null = null
  private readyPromise: Promise<void> | null = null
  private pendingConfig: SensorsInitOptions | undefined
  private initialized = false

  /** Initialize the SDK. Safe to call multiple times — only runs once. */
  init(options?: SensorsInitOptions): Promise<void> {
    this.pendingConfig = options
    return this.ensureReady()
  }

  /** Wait for the SDK to be ready (loaded + initialized). */
  getReadyPromise(): Promise<void> {
    return this.ensureReady()
  }

  /** Custom event. Queued — callers don't need to await ready. */
  track(name: string, options?: Record<string, unknown>): void {
    void this.ensureReady().then(() => this.instance?.track(name, options))
  }

  /** Bind the current user's stable id (e.g. member id). */
  login(id: string | number): void {
    void this.ensureReady().then(() => this.instance?.login(id))
  }

  /** Manual SPA pageview trigger (usually not needed — is_track_single_page handles it). */
  trackPageview(): void {
    void this.ensureReady().then(() => this.instance?.quick('autoTrackSinglePage'))
  }

  private ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise
    this.readyPromise = new Promise<void>((resolve) => {
      if (typeof window === 'undefined') return resolve()
      const win = window as unknown as Record<string, SensorsInstance | undefined>

      const start = () => {
        this.instance = win[GLOBAL_KEY] ?? null
        if (this.instance && !this.initialized) {
          this.doInit()
          this.initialized = true
        }
        resolve()
      }

      if (win[GLOBAL_KEY]) {
        start()
        return
      }

      let tries = 0
      const timer = setInterval(() => {
        tries += 1
        if (win[GLOBAL_KEY] || tries >= READY_POLL_MAX_TRIES) {
          clearInterval(timer)
          start()
        }
      }, READY_POLL_MS)
    })
    return this.readyPromise
  }

  private getServerUrl(): string {
    // window.__LB_PROXY__ is set by config.mts head inline script from
    // process.env.PROXY (same source as oneTapProxy). 'canary' => default
    // reporting bucket; anything else => production.
    const proxy: LbProxy = typeof window !== 'undefined' ? (window.__LB_PROXY__ ?? 'production') : 'production'
    const bucket = proxy === 'canary' ? 'default' : 'production'
    return `${SERVER_URL_MAP[bucket]}/sa?project=${PROJECT_NAME_MAP[bucket]}`
  }

  private doInit(): void {
    if (!this.instance) return

    const config = {
      server_url: this.getServerUrl(),
      // SPA route change auto-reports $pageview.
      is_track_single_page: true,
      use_client_time: true,
      // Beacon survives page unload; better delivery for click-then-leave flows.
      send_type: 'beacon',
      heatmap: {
        // 'default' = auto-capture all clicks as $WebClick.
        clickmap: 'default',
        // 'default' = auto-capture scroll / stay as $WebStay.
        scroll_notice_map: 'default',
        // Visualized-tracking config UI not used here.
        get_vtrack_config: false,
      },
      show_log: false,
      ...this.pendingConfig,
    }

    this.instance.init(config)

    this.instance.registerPage({
      platform_type: 'Web',
      user_agent: navigator.userAgent,
      site: typeof location !== 'undefined' ? location.hostname : '',
    })

    // Fire initial $pageview unless explicitly disabled.
    if (this.pendingConfig?.autoTrack !== false) {
      this.instance.quick('autoTrack')
    }
    // Bind logged-in identity (fire-and-forget; must not block init).
    void this.bindLoggedInUser()
  }

  /**
   * If the user is already signed in on longportInternal, resolve their
   * member_id and call `sensors.login()`. Runs after init and is safe to
   * fail silently — analytics must not break the page.
   */
  private async bindLoggedInUser(): Promise<void> {
    if (!this.instance) return
    try {
      const lp = typeof window !== 'undefined' ? window.longportInternal : undefined
      if (!lp?.isLogin?.() || !lp.getUserInfo) return
      // getUserInfo may be sync or return a Promise — await tolerates both.
      const info = await Promise.resolve(lp.getUserInfo())
      const mid = info?.data?.member?.member_id
      if (mid !== undefined && mid !== null && `${mid}`.length > 0) {
        this.instance.login(mid)
      }
    } catch {
      // ignore
    }
  }
}

export const sensors = new Sensors()
