/**
 * Runtime tenant detection via cookie `app_id`.
 * Aligns with openapi-website-private:
 *   - packages/utils/src/normalize.ts:11-17 (US_APP_IDS)
 *   - packages/services/utils.ts:14-17 (APPID_PROXY_OVERRIDE)
 */

/**
 * API host per US tenant environment.
 * Values match openapi-website-private/packages/utils/src/constant.ts DomainsMap:
 *   us-prod.api    = 'https://mr.longbridge.com'
 *   us-staging.api = 'https://mr.longbridge-staging.com'
 */
export const US_APPID_API_HOST: Record<string, string> = {
  longbridge_us: 'https://mr.longbridge.com',
  longbridge_us_uat: 'https://mr.longbridge-staging.com',
}

/** Read a cookie value on the client. Returns undefined on SSR or missing. */
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

/** Current tenant app_id from cookie (falls back to `x-original-app-id`). */
export function getAppIdFromCookie(): string | undefined {
  return readCookie('app_id') || readCookie('x-original-app-id')
}

/** Whether the current user is on a US tenant (either prod or UAT). */
export function isUsAppId(): boolean {
  const appId = getAppIdFromCookie()
  return !!appId && appId in US_APPID_API_HOST
}

/**
 * Resolve the API host for the current US tenant.
 * Returns the matching host for `longbridge_us` (prod) / `longbridge_us_uat` (staging),
 * or undefined when the cookie is not a US app_id.
 */
export function resolveUsApiHost(): string | undefined {
  const appId = getAppIdFromCookie()
  return appId ? US_APPID_API_HOST[appId] : undefined
}
