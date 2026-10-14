/**
 * US tenant app_id cookie detection
 * Ported verbatim from legacy utils/app-id.ts
 */

const US_APPID_API_HOST: Record<string, string> = {
  longbridge_us: 'https://mr.longbridge.com',
  longbridge_us_uat: 'https://mr.longbridge-staging.com',
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const pairs = document.cookie.split(';')
  for (const pair of pairs) {
    const trimmed = pair.trim()
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx)
    const value = trimmed.slice(eqIdx + 1)
    if (key === name) return decodeURIComponent(value)
  }
  return undefined
}

export function getAppIdFromCookie(): string | undefined {
  return readCookie('app_id') || readCookie('x-original-app-id')
}

export function isUsAppId(): boolean {
  const appId = getAppIdFromCookie()
  return appId ? !!US_APPID_API_HOST[appId] : false
}

export function resolveUsApiHost(): string | undefined {
  const appId = getAppIdFromCookie()
  return appId ? US_APPID_API_HOST[appId] : undefined
}
