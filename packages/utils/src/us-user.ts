/**
 * 当前访问者是否按美国用户处理（定价入口 / 付费行情模块对美国用户隐藏）。
 *
 * 判定顺序：
 * 1. 已登录：app_id cookie 是否美国租户
 * 2. 未登录：region cookie（大小写不敏感）
 * 3. region 也没有：请求 portal `/api/_ping`，取响应头 `x-ip-region`
 *
 * 仅客户端调用（在 effect 里），结果在当前页面内缓存；判定失败按非美国处理，保持原有展示。
 */

// 与 packages/tryit/src/utils/app-id.ts、BaseLayout 的 apiProxyBootstrap 中的美国租户 app_id 一致
const US_APP_IDS = ['longbridge_us', 'longbridge_us_uat']

/** Longbridge US Terms of Service / Privacy Policy (PDF) */
export const US_LEGAL_LINKS = {
  terms: 'https://assets.lbkrs.com/uploads/317ef02f-85e7-4afa-9e76-8acd8c0b42fe/Terms-of-Service-final-.pdf',
  privacy: 'https://assets.lbkrs.com/uploads/e4890745-e18b-42f2-9817-da63148e0ac4/Privacy-Policy-final-.pdf',
}

let cached: Promise<boolean> | undefined

function readCookie(name: string): string | undefined {
  const parts = `; ${document.cookie}`.split(`; ${name}=`)
  return parts.length === 2 ? decodeURIComponent(parts.pop()!.split(';').shift() || '') : undefined
}

function isLoggedIn(): boolean {
  try {
    return !!(window as unknown as { longportInternal?: { isLogin?: () => boolean } }).longportInternal?.isLogin?.()
  } catch {
    return false
  }
}

async function ipRegionIsUS(): Promise<boolean> {
  const base = (window as unknown as { __API_PROXY_URL__?: string }).__API_PROXY_URL__
  if (!base) return false
  try {
    const res = await fetch(`${base}/api/_ping`, { credentials: 'omit' })
    return (res.headers.get('x-ip-region') || '').toUpperCase() === 'US'
  } catch {
    return false
  }
}

export function isUSUser(): Promise<boolean> {
  if (!cached) {
    cached = (async () => {
      if (isLoggedIn()) {
        const appId = readCookie('app_id') || readCookie('x-original-app-id')
        return !!appId && US_APP_IDS.includes(appId)
      }
      const region = readCookie('region')
      if (region) return region.toUpperCase() === 'US'
      return ipRegionIsUS()
    })()
  }
  return cached
}
