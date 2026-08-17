/**
 * Longbridge Developers 请求库
 * 支持 HTTP API 和 WebSocket 连接
 */

// ==================== 类型定义 ====================

export interface ApiConfig {
  /** App Key */
  appKey: string
  /** Access Token */
  accessToken: string
  /** App Secret */
  appSecret: string
  /** API 基础 URL，默认：https://openapi.longbridge.com */
  baseUrl?: string
  /** 请求超时时间 (毫秒)，默认：30000 */
  timeout?: number
}

export interface ApiResponse<T = any> {
  status: number
  statusText: string
  response: {
    /** 业务状态码，0 表示成功 */
    code: number
    /** 响应消息 */
    msg: string
    /** 响应数据 */
    data?: T
  }
}

export interface RequestOptions {
  /** 请求方法 */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** URL 查询参数 */
  params?: Record<string, string | number | boolean>
  /** 请求体数据 */
  body?: any
  /** 额外的请求头 */
  headers?: Record<string, string>
  /** 请求超时时间 */
  timeout?: number
}

// ==================== 工具函数 ====================

/**
 * 生成时间戳
 */
function getTimestamp(): string {
  return (Date.now() / 1000).toString()
}

/**
 * 生成签名
 */
async function generateSignature(
  method: string,
  uri: string,
  headers: Record<string, string>,
  params: string,
  body: string,
  secret: string
): Promise<string> {
  const ts = headers['X-Timestamp']
  const accessToken = headers['Authorization']
  const appKey = headers['X-Api-Key']
  const mtd = method.toUpperCase()

  let canonicalRequest = `${mtd}|${uri}|${params}|authorization:${accessToken}\nx-api-key:${appKey}\nx-timestamp:${ts}\n|authorization;x-api-key;x-timestamp|`

  if (body !== '') {
    const encoder = new TextEncoder()
    const data = encoder.encode(body)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const payloadHash = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    canonicalRequest += payloadHash
  }

  const canonicalBuffer = new TextEncoder().encode(canonicalRequest)
  const canonicalHash = await crypto.subtle.digest('SHA-1', canonicalBuffer)
  const canonicalHashHex = Array.from(new Uint8Array(canonicalHash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const signStr = `HMAC-SHA256|${canonicalHashHex}`

  // 确保密钥是有效的字符串格式
  const normalizedSecret = secret?.trim() || 'unknown'

  const secretKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(normalizedSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signBuffer = await crypto.subtle.sign('HMAC', secretKey, new TextEncoder().encode(signStr))
  const signature = Array.from(new Uint8Array(signBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return `HMAC-SHA256 SignedHeaders=authorization;x-api-key;x-timestamp, Signature=${signature}`
}

/**
 * 构建 URL 查询参数
 */
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  return searchParams.toString()
}

// ==================== HTTP API 客户端 ====================

export class LongbridgeApiClient {
  private config: Required<ApiConfig>

  constructor(config: ApiConfig) {
    this.config = {
      baseUrl: 'https://openapi.longbridge.com',
      timeout: 30000,
      ...config,
    }
  }

  /**
   * 发送 HTTP 请求
   */
  async request<T = any>(uri: string, options: RequestOptions = {}): Promise<ApiResponse> {
    const { method = 'GET', params = {}, body, headers: customHeaders = {}, timeout = this.config.timeout } = options

    // 构建查询参数
    const queryString = Object.keys(params).length > 0 ? buildQueryString(params) : ''
    const fullUrl = queryString ? `${this.config.baseUrl}${uri}?${queryString}` : `${this.config.baseUrl}${uri}`

    // 构建请求头
    const timestamp = getTimestamp()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Api-Key': this.config.appKey,
      Authorization: this.config.accessToken,
      'X-Timestamp': timestamp,
      ...customHeaders,
    }

    // 构建请求体
    const requestBody = body ? JSON.stringify(body) : ''

    // 生成签名
    const signature = await generateSignature(method, uri, headers, queryString, requestBody, this.config.appSecret)
    headers['X-Api-Signature'] = signature

    // 创建 AbortController 用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(fullUrl, {
        method,
        headers,
        body: method !== 'GET' ? requestBody : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log('response', response)
      const result = await response.json()
      return {
        status: response.status,
        statusText: response.statusText,
        response: result,
      }
    } catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`timeout ${timeout}ms`)
        }
        throw error
      }
      throw new Error('unknown')
    }
  }

  /**
   * GET 请求
   */
  async get<T = any>(uri: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(uri, { method: 'GET', params })
  }

  /**
   * POST 请求
   */
  async post<T = any>(uri: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(uri, { method: 'POST', body })
  }

  /**
   * PUT 请求
   */
  async put<T = any>(uri: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(uri, { method: 'PUT', body })
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(uri: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>(uri, { method: 'DELETE', params })
  }

  /**
   * 测试连接
   */
  async test(): Promise<ApiResponse> {
    return this.get('/v1/test')
  }
}

// ==================== 导出便捷方法 ====================

/**
 * 创建 API 客户端实例
 */
export function createApiClient(config: ApiConfig): LongbridgeApiClient {
  return new LongbridgeApiClient(config)
}

// ==================== 默认导出 ====================

export default {
  LongbridgeApiClient,
  createApiClient,
}
