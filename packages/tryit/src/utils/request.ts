/**
 * Dynamic API request factory
 * Ported from legacy utils/request.ts; replaced lodash/endsWith with native String.prototype.endsWith
 */

import { LongbridgeApiClient } from '../clients/http-client'
import { resolveUsApiHost } from './app-id'

interface AuthConfig {
  appKey: string
  accessToken: string
  appSecret: string
}

interface RequestOptions {
  baseUrl?: string
}

export function createDynamicRequest(authConfig: AuthConfig, options: RequestOptions = {}): LongbridgeApiClient {
  let baseUrl = options.baseUrl

  if (!baseUrl) {
    const usHost = resolveUsApiHost()
    if (usHost) {
      baseUrl = usHost
    } else {
      const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
      if (hostname.endsWith('.cn')) {
        baseUrl = 'https://openapi.longbridge.cn'
      } else {
        baseUrl = 'https://openapi.longbridge.com'
      }
    }
  }

  if (import.meta.env.DEV) {
    baseUrl = '/api'
  }

  return new LongbridgeApiClient({
    ...authConfig,
    baseUrl,
  })
}

export function createQuickRequest(
  appKey: string,
  accessToken: string,
  appSecret: string,
  options: RequestOptions = {}
): LongbridgeApiClient {
  return createDynamicRequest({ appKey, accessToken, appSecret }, options)
}
