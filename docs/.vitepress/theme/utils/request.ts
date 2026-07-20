import { createApiClient, type ApiConfig } from './http-client'
import endsWith from 'lodash/endsWith'
import { resolveUsApiHost } from './app-id'

export interface DynamicAuthConfig {
  appKey: string
  accessToken: string
  appSecret: string
}

/**
 * 创建动态 Request 客户端
 * 支持动态传入认证参数
 *
 * @param authConfig 认证配置信息
 * @param options 可选的额外配置
 * @returns API 客户端实例
 *
 * @example
 * ```typescript
 * // 创建动态客户端
 * const dynamicClient = createDynamicRequest({
 *   appKey: 'your-app-key',
 *   accessToken: 'your-access-token',
 *   appSecret: 'your-app-secret'
 * })
 *
 * // 使用客户端发送请求
 * const response = await dynamicClient.get('/v1/asset/account')
 * ```
 */
export function createDynamicRequest(
  authConfig: DynamicAuthConfig,
  options?: Partial<Pick<ApiConfig, 'baseUrl' | 'timeout'>>
) {
  // Prefer runtime cookie `app_id`:
  //   - longbridge_us     → https://mr.longbridge.com          (US prod)
  //   - longbridge_us_uat → https://mr.longbridge-staging.com  (US staging)
  // Fallback to hostname suffix detection.
  const usHost = resolveUsApiHost()
  const API_BASE_URL =
    usHost ||
    (endsWith(location.hostname, '.xyz')
      ? 'https://openapi.longbridge.xyz'
      : endsWith(location.hostname, '.cn')
        ? 'https://openapi.longbridge.com'
        : 'https://openapi.longbridge.com')

  const config: ApiConfig = {
    appKey: authConfig.appKey,
    accessToken: authConfig.accessToken,
    appSecret: authConfig.appSecret,
    baseUrl: options?.baseUrl || (import.meta.env.DEV ? '/api' : API_BASE_URL),
    timeout: options?.timeout || 30000,
  }

  return createApiClient(config)
}

/**
 * 快速创建 Request 方法
 * 更简洁的 API，直接传入认证参数即可使用
 *
 * @param appKey 应用密钥
 * @param accessToken 访问令牌
 * @param appSecret 应用密钥
 * @param options 可选的额外配置
 * @returns API 客户端实例
 *
 * @example
 * ```typescript
 * // 直接传入参数创建客户端
 * const client = createQuickRequest('key', 'token', 'secret')
 *
 * // 发送请求
 * const response = await client.post('/v1/trade/order', { symbol: 'AAPL.US' })
 * ```
 */
export function createQuickRequest(
  appKey: string,
  accessToken: string,
  appSecret: string,
  options?: Partial<Pick<ApiConfig, 'baseUrl' | 'timeout'>>
) {
  return createDynamicRequest({ appKey, accessToken, appSecret }, options)
}
