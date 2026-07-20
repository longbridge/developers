import { withQuery } from 'ufo'
import { localePath } from './i18n'

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

  return withQuery(localePath(`/login`), {
    redirect_to,
    logout: '1',
    'with-us': '1',
  })
}
