/**
 * Ambient types for the Longbridge platform globals injected into <head> by
 * BaseLayout (ported from the legacy VitePress config.mts head scripts):
 *   - longport-internal.iife.js  → window.longportInternal (login bridge)
 *   - inline __LB_PROXY__         → 'canary' | 'production'
 *   - apiProxyBootstrap           → window.__API_PROXY_URL__
 *   - sensorsdata SDK             → window.sensorsDataAnalytic201505
 * Declared once here so auth.ts / sensors.ts share a single Window shape.
 */
export {}

declare global {
  interface Window {
    longportInternal?: {
      isLogin?: () => boolean
      getUserInfo?: () =>
        | { data?: { member?: { avatar?: string; name?: string; member_id?: string | number } } }
        | Promise<{ data?: { member?: { avatar?: string; name?: string; member_id?: string | number } } }>
    }
    __LB_PROXY__?: 'canary' | 'production'
    __API_PROXY_URL__?: string
    __LB_SESSION_CONFIG__?: Record<string, unknown>
    sensorsDataAnalytic201505?: unknown
    Helora?: {
      boot: (config: Record<string, unknown>) => void
      on?: (event: string, cb: (payload?: { id?: string }) => void) => (() => void) | void
      setThemeMode?: (mode: 'dark' | 'light') => void
    }
  }
}
