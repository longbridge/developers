import { withQuery } from 'ufo'
import { localePath } from './i18n'

const INVITE_CODE_KEY = 'invite-code'

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

/** 优先读 URL query 的 invite-code，退回 cookie（enhanceApp 里已把 URL 的 invite-code 写入 cookie）。 */
function resolveInviteCode(): string | undefined {
  if (typeof window === 'undefined') return undefined
  const fromQuery = new URLSearchParams(window.location.search).get(INVITE_CODE_KEY)
  if (fromQuery) return fromQuery
  return readCookie(INVITE_CODE_KEY)
}

/**
 * 生成登录重定向路径
 * @param ssoParams 传递给 SSO 页面的额外查询参数
 * @returns 包含重定向参数的登录 URL
 */
export function createLoginRedirectPath(ssoParams?: Record<string, string | number | boolean>): string {
  const redirect_to = withQuery(localePath(`${window.location.origin}/sso`), {
    redirect_to: window.location.href,
    ...ssoParams,
  })

  const inviteCode = resolveInviteCode()

  return withQuery(localePath(`/login`), {
    redirect_to,
    logout: '1',
    'with-us': '1',
    ...(inviteCode ? { [INVITE_CODE_KEY]: inviteCode } : {}),
  })
}
