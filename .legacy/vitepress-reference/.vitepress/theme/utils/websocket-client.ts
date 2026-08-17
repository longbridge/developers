/**
 * Longbridge Developers WebSocket 客户端
 * 支持二进制协议、握手认证、行情订阅等功能
 */

import { LongbridgeApiClient } from './http-client'

// ==================== 类型定义 ====================

export interface WebSocketConfig {
  /** App Key */
  appKey: string
  /** Access Token */
  accessToken: string
  /** App Secret */
  appSecret: string
  /** HTTP API 基础 URL，用于获取 OTP */
  apiBaseUrl?: string
  /** WebSocket 连接地址 */
  wsUrl?: string
  /** 连接超时时间 (毫秒) */
  timeout?: number
  /** 是否自动重连 */
  autoReconnect?: boolean
  /** 重连间隔 (毫秒) */
  reconnectInterval?: number
  /** 最大重连次数 */
  maxReconnectAttempts?: number
}

export interface SubscribeQuoteRequest {
  /** 股票代码列表 */
  symbol: string[]
  /** 订阅类型 */
  sub_type: number[]
  /** 是否首次推送 */
  is_first_push?: boolean
}

export interface QuoteData {
  /** 股票代码 */
  symbol: string
  /** 当前价格 */
  last_done?: number
  /** 开盘价 */
  open?: number
  /** 最高价 */
  high?: number
  /** 最低价 */
  low?: number
  /** 时间戳 */
  timestamp?: number
  /** 成交量 */
  volume?: number
  /** 成交额 */
  turnover?: number
}

export interface WebSocketMessage {
  /** 消息类型 */
  type: 'quote' | 'order' | 'trade' | 'error' | 'connected' | 'disconnected'
  /** 消息数据 */
  data?: any
  /** 错误信息 */
  error?: string
}

// ==================== 协议常量 ====================

const PROTOCOL_VERSION = 1
const CODEC_PROTOBUF = 1
const PLATFORM_WEB = 9

// 数据包类型
const PACKET_TYPE_REQUEST = 1
const PACKET_TYPE_RESPONSE = 2
const PACKET_TYPE_PUSH = 3

const CMD_AUTH = 3

// 业务指令
const CMD_SUBSCRIBE_QUOTE = 101
const CMD_UNSUBSCRIBE_QUOTE = 102
const CMD_GET_SUBSCRIPTIONS = 103

// ==================== 协议工具函数 ====================

/**
 * 创建数据包头（1 字节）
 * 格式：type(4 位) + verify(1 位) + gzip(1 位) + reserve(2 位)
 */
function createPacketHeader(type: number, verify = 0, gzip = 0, reserve = 0): number {
  return (type & 0xf) | ((verify & 1) << 4) | ((gzip & 1) << 5) | ((reserve & 3) << 6)
}

/**
 * 解析数据包头（1字节）
 */
function parsePacketHeader(headerByte: number): {
  type: number
  verify: number
  gzip: number
  reserve: number
} {
  return {
    type: headerByte & 0xf,
    verify: (headerByte >> 4) & 1,
    gzip: (headerByte >> 5) & 1,
    reserve: (headerByte >> 6) & 3,
  }
}

/**
 * 创建请求包
 * 格式：header(1) + cmd_code(1) + request_id(4) + timeout(2) + body_len(3) + body + [nonce(8) + signature(16)]
 */
function createRequestHeader(cmd: number, requestId: number, bodyLength: number, timeout = 30000): ArrayBuffer {
  const headerSize = 11 // 1 + 1 + 4 + 2 + 3 = 11 字节
  const buffer = new ArrayBuffer(headerSize)
  const view = new DataView(buffer)
  let offset = 0

  // 数据包头 (1 字节)
  const header = createPacketHeader(PACKET_TYPE_REQUEST)
  view.setUint8(offset, header)
  offset += 1

  // 命令码 (1 字节)
  view.setUint8(offset, cmd)
  offset += 1

  // 请求 ID (4 字节，Big Endian)
  view.setUint32(offset, requestId, false)
  offset += 4

  // 超时时间 (2 字节，Big Endian)
  view.setUint16(offset, Math.min(timeout, 60000), false)
  offset += 2

  // 包体长度 (3 字节，Big Endian)
  // 使用 3 个字节表示 body 长度，最大支持 16MB
  view.setUint8(offset, (bodyLength >> 16) & 0xff)
  view.setUint8(offset + 1, (bodyLength >> 8) & 0xff)
  view.setUint8(offset + 2, bodyLength & 0xff)

  return buffer
}

/**
 * 解析响应包头
 * 格式：header(1) + cmd_code(1) + request_id(4) + status_code(1) + body_len(3) + body + [nonce(8) + signature(16)]
 */
function parseResponseHeader(buffer: ArrayBuffer): {
  header: ReturnType<typeof parsePacketHeader>
  cmd: number
  requestId: number
  statusCode: number
  bodyLength: number
} {
  const view = new DataView(buffer)
  let offset = 0

  // 数据包头 (1 字节)
  const header = parsePacketHeader(view.getUint8(offset))
  offset += 1

  // 命令码 (1 字节)
  const cmd = view.getUint8(offset)
  offset += 1

  // 请求 ID (4 字节，Big Endian)
  const requestId = view.getUint32(offset, false)
  offset += 4

  // 状态码 (1 字节)
  const statusCode = view.getUint8(offset)
  offset += 1

  // 包体长度 (3 字节，Big Endian)
  const bodyLength = (view.getUint8(offset) << 16) | (view.getUint8(offset + 1) << 8) | view.getUint8(offset + 2)

  return {
    header,
    cmd,
    requestId,
    statusCode,
    bodyLength,
  }
}

/**
 * 解析推送包头
 * 格式：header(1) + cmd_code(1) + body_len(3) + body + [nonce(8) + signature(16)]
 */
function parsePushHeader(buffer: ArrayBuffer): {
  header: ReturnType<typeof parsePacketHeader>
  cmd: number
  bodyLength: number
} {
  const view = new DataView(buffer)
  let offset = 0

  // 数据包头 (1 字节)
  const header = parsePacketHeader(view.getUint8(offset))
  offset += 1

  // 命令码 (1 字节)
  const cmd = view.getUint8(offset)
  offset += 1

  // 包体长度 (3 字节，Big Endian)
  const bodyLength = (view.getUint8(offset) << 16) | (view.getUint8(offset + 1) << 8) | view.getUint8(offset + 2)

  return {
    header,
    cmd,
    bodyLength,
  }
}

/**
 * 合并 ArrayBuffer
 */
function concatArrayBuffers(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
  const combined = new ArrayBuffer(buffer1.byteLength + buffer2.byteLength)
  const view = new Uint8Array(combined)
  view.set(new Uint8Array(buffer1), 0)
  view.set(new Uint8Array(buffer2), buffer1.byteLength)
  return combined
}

// ==================== WebSocket 客户端 ====================

export class LongbridgeWebSocketClient {
  private config: Required<WebSocketConfig>
  private ws: WebSocket | null = null
  private apiClient: LongbridgeApiClient
  private isConnected = false
  private isConnecting = false
  private reconnectCount = 0
  private reconnectTimer: number | null = null
  private messageBuffer = new ArrayBuffer(0)
  private requestId = 0
  private pendingRequests = new Map<number, (response: any) => void>()
  private eventListeners = new Map<string, Function[]>()

  constructor(config: WebSocketConfig) {
    this.config = {
      apiBaseUrl: 'https://openapi.longbridge.com',
      wsUrl: 'wss://openapi-quote.longbridge.com',
      timeout: 30000,
      autoReconnect: true,
      reconnectInterval: 5000,
      maxReconnectAttempts: 5,
      ...config,
    }

    this.apiClient = new LongbridgeApiClient({
      appKey: this.config.appKey,
      accessToken: this.config.accessToken,
      appSecret: this.config.appSecret,
      baseUrl: this.config.apiBaseUrl,
    })
  }

  /**
   * 连接 WebSocket
   */
  async connect(): Promise<void> {
    if (this.isConnected || this.isConnecting) {
      return
    }

    this.isConnecting = true

    try {
      // 1. 获取 OTP Token
      console.log('获取 WebSocket 连接 Token...')
      const otpResponse = await this.apiClient.get('/v1/socket/token')

      if (otpResponse.response.code !== 0 || !otpResponse.response.data?.otp) {
        throw new Error(`获取 OTP 失败：${otpResponse.response.msg}`)
      }

      const otp = otpResponse.response.data.otp
      console.log('获取 OTP 成功')

      // 2. 建立 WebSocket 连接
      const wsUrl = `${this.config.wsUrl}?version=${PROTOCOL_VERSION}&codec=${CODEC_PROTOBUF}&platform=${PLATFORM_WEB}`
      console.log('连接 WebSocket:', wsUrl)

      this.ws = new WebSocket(wsUrl)
      this.ws.binaryType = 'arraybuffer'

      // 3. 设置事件监听器
      this.setupWebSocketEventListeners()

      // 4. 等待连接建立
      await this.waitForConnection()

      // 5. 进行身份认证
      await this.authenticate(otp)

      this.isConnected = true
      this.isConnecting = false
      this.reconnectCount = 0

      console.log('WebSocket 连接已建立')
      this.emit('connected')
    } catch (error) {
      this.isConnecting = false
      console.error('WebSocket 连接失败：', error)
      this.emit('error', error)

      if (this.config.autoReconnect) {
        this.scheduleReconnect()
      }

      throw error
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.isConnected = false
    this.isConnecting = false
    this.reconnectCount = 0
    this.pendingRequests.clear()

    console.log('WebSocket 已断开连接')
    this.emit('disconnected')
  }

  /**
   * 订阅行情
   */
  async subscribeQuote(request: SubscribeQuoteRequest): Promise<void> {
    const body = JSON.stringify(request) // 简化处理，实际应使用 protobuf
    await this.sendRequest(CMD_SUBSCRIBE_QUOTE, body)
  }

  /**
   * 取消订阅行情
   */
  async unsubscribeQuote(symbols: string[]): Promise<void> {
    const body = JSON.stringify({ symbol: symbols })
    await this.sendRequest(CMD_UNSUBSCRIBE_QUOTE, body)
  }

  /**
   * 获取已订阅列表
   */
  async getSubscriptions(): Promise<string[]> {
    const response = await this.sendRequest<{ symbols?: string[] }>(CMD_GET_SUBSCRIPTIONS)
    return response?.symbols || []
  }

  /**
   * 添加事件监听器
   */
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)!.push(listener)
  }

  /**
   * 移除事件监听器
   */
  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(event: string, ...args: any[]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((listener) => listener(...args))
    }
  }

  /**
   * 设置 WebSocket 事件监听器
   */
  private setupWebSocketEventListeners(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('WebSocket 连接已打开')
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket 连接已关闭：', event.code, event.reason)
      this.isConnected = false
      this.emit('disconnected')

      if (this.config.autoReconnect && this.reconnectCount < this.config.maxReconnectAttempts) {
        this.scheduleReconnect()
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket 连接错误：', error)
      this.emit('error', error)
    }

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data as ArrayBuffer)
    }
  }

  /**
   * 等待连接建立
   */
  private waitForConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        reject(new Error('WebSocket 未初始化'))
        return
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      const onOpen = () => {
        this.ws?.removeEventListener('open', onOpen)
        this.ws?.removeEventListener('error', onError)
        resolve()
      }

      const onError = (error: Event) => {
        this.ws?.removeEventListener('open', onOpen)
        this.ws?.removeEventListener('error', onError)
        reject(error)
      }

      this.ws.addEventListener('open', onOpen)
      this.ws.addEventListener('error', onError)
    })
  }

  /**
   * 身份认证
   */
  private async authenticate(otp: string): Promise<void> {
    console.log(`开始身份认证，OTP 长度：${otp.length}`)

    try {
      await this.sendRequest(CMD_AUTH, otp, undefined, true) // 跳过连接状态检查
      console.log('身份认证成功')
    } catch (error) {
      console.error('身份认证失败：', error)
      throw error
    }
  }

  /**
   * 处理接收到的消息
   */
  private handleMessage(data: ArrayBuffer): void {
    console.log(`收到消息：${data.byteLength} 字节`)

    // 打印前几个字节用于调试
    const debugView = new Uint8Array(data.slice(0, Math.min(16, data.byteLength)))
    console.log(
      '消息前 16 字节：',
      Array.from(debugView)
        .map((b) => `0x${b.toString(16).padStart(2, '0')}`)
        .join(' ')
    )

    // 将新数据添加到缓冲区
    this.messageBuffer = concatArrayBuffers(this.messageBuffer, data)

    // 尝试解析完整的消息
    this.parseMessages()
  }

  /**
   * 解析消息
   */
  private parseMessages(): void {
    while (this.messageBuffer.byteLength > 0) {
      // 至少需要包头的最小长度（1 字节）
      if (this.messageBuffer.byteLength < 1) {
        break
      }

      const view = new DataView(this.messageBuffer)
      const headerByte = view.getUint8(0)
      const packetHeader = parsePacketHeader(headerByte)

      console.log(
        `解析包头: type=${packetHeader.type}, verify=${packetHeader.verify}, gzip=${packetHeader.gzip}, reserve=${packetHeader.reserve}`
      )

      let headerLength: number
      let bodyLength: number

      if (packetHeader.type === PACKET_TYPE_RESPONSE) {
        // 响应包最小头部：1 + 1 + 4 + 1 + 3 = 10 字节
        if (this.messageBuffer.byteLength < 10) break
        headerLength = 10
        // 解析body长度（3字节）
        bodyLength = (view.getUint8(7) << 16) | (view.getUint8(8) << 8) | view.getUint8(9)
        console.log(`响应包: headerLength=${headerLength}, bodyLength=${bodyLength}`)
      } else if (packetHeader.type === PACKET_TYPE_PUSH) {
        // 推送包最小头部：1 + 1 + 3 = 5 字节
        if (this.messageBuffer.byteLength < 5) break
        headerLength = 5
        // 解析body长度（3字节）
        bodyLength = (view.getUint8(2) << 16) | (view.getUint8(3) << 8) | view.getUint8(4)
        console.log(`推送包: headerLength=${headerLength}, bodyLength=${bodyLength}`)
      } else {
        // 未知包类型，跳过这个字节
        console.warn(`未知包类型: ${packetHeader.type}，跳过`)
        this.messageBuffer = this.messageBuffer.slice(1)
        continue
      }

      // 检查是否有完整的包
      const totalLength = headerLength + bodyLength
      if (this.messageBuffer.byteLength < totalLength) {
        console.log(`包不完整: 需要${totalLength}字节，当前只有${this.messageBuffer.byteLength}字节`)
        break
      }

      // 提取完整的包
      const packet = this.messageBuffer.slice(0, totalLength)
      this.messageBuffer = this.messageBuffer.slice(totalLength)

      console.log(`处理完整包: 总长度=${totalLength}字节`)

      // 处理包
      if (packetHeader.type === PACKET_TYPE_RESPONSE) {
        this.handleResponse(packet)
      } else if (packetHeader.type === PACKET_TYPE_PUSH) {
        this.handlePush(packet)
      }
    }
  }

  /**
   * 处理响应包
   */
  private handleResponse(packet: ArrayBuffer): void {
    const header = parseResponseHeader(packet.slice(0, 10))
    const body = packet.slice(10)

    const callback = this.pendingRequests.get(header.requestId)
    if (callback) {
      this.pendingRequests.delete(header.requestId)

      if (header.statusCode !== 0) {
        callback({ error: `服务器错误: ${header.statusCode}` })
      } else {
        try {
          const bodyText = new TextDecoder().decode(body)
          const data = bodyText ? JSON.parse(bodyText) : null
          callback({ data })
        } catch (error) {
          callback({ error: '解析响应数据失败' })
        }
      }
    }
  }

  /**
   * 处理推送包
   */
  private handlePush(packet: ArrayBuffer): void {
    const header = parsePushHeader(packet.slice(0, 5))
    const body = packet.slice(5)

    try {
      const bodyText = new TextDecoder().decode(body)
      const data = bodyText ? JSON.parse(bodyText) : null

      // 根据命令类型处理不同的推送数据
      if (header.cmd === CMD_SUBSCRIBE_QUOTE) {
        this.emit('quote', data)
      } else {
        this.emit('push', { cmd: header.cmd, data })
      }
    } catch (error) {
      console.error('解析推送数据失败:', error)
    }
  }

  /**
   * 安排重连
   */
  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectCount++
    console.log(`准备重连 (${this.reconnectCount}/${this.config.maxReconnectAttempts})...`)

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch((error) => {
        console.error('重连失败：', error)
      })
    }, this.config.reconnectInterval) as any
  }

  /**
   * 发送请求包的通用方法
   */
  private sendRequest<T = any>(
    cmd: number,
    body?: string | ArrayBuffer | Uint8Array,
    timeout?: number,
    skipConnectionCheck = false
  ): Promise<T> {
    if (!skipConnectionCheck && !this.isConnected) {
      throw new Error('WebSocket 未连接')
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket 连接未就绪')
    }

    const requestId = ++this.requestId
    let bodyBuffer: ArrayBuffer
    let bodyLength = 0

    // 处理请求体数据
    if (body) {
      if (typeof body === 'string') {
        const textEncoder = new TextEncoder()
        const encoded = textEncoder.encode(body)
        bodyBuffer = new ArrayBuffer(encoded.length)
        new Uint8Array(bodyBuffer).set(encoded)
        bodyLength = encoded.length
      } else if (body instanceof ArrayBuffer) {
        bodyBuffer = body
        bodyLength = body.byteLength
      } else if (body instanceof Uint8Array) {
        bodyBuffer = new ArrayBuffer(body.length)
        new Uint8Array(bodyBuffer).set(body)
        bodyLength = body.length
      } else {
        throw new Error('不支持的请求体数据类型')
      }
    } else {
      bodyBuffer = new ArrayBuffer(0)
      bodyLength = 0
    }

    // 创建请求包
    const header = createRequestHeader(cmd, requestId, bodyLength, timeout)
    const packet = bodyLength > 0 ? concatArrayBuffers(header, bodyBuffer) : header

    console.log(
      `发送请求包：cmd=${cmd}, requestId=${requestId}, bodyLength=${bodyLength}, packetLength=${packet.byteLength}`
    )

    return new Promise<T>((resolve, reject) => {
      this.pendingRequests.set(requestId, (response) => {
        if (response.error) {
          reject(new Error(response.error))
        } else {
          resolve(response.data)
        }
      })

      this.ws?.send(packet)

      // 超时处理
      const timeoutMs = timeout || this.config.timeout
      setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId)
          reject(new Error(`请求超时 (cmd: ${cmd})`))
        }
      }, timeoutMs)
    })
  }
}

// ==================== 导出便捷方法 ====================

/**
 * 创建 WebSocket 客户端实例
 */
export function createWebSocketClient(config: WebSocketConfig): LongbridgeWebSocketClient {
  return new LongbridgeWebSocketClient(config)
}

// ==================== 默认导出 ====================

export default {
  LongbridgeWebSocketClient,
  createWebSocketClient,
}
