/**
 * Longbridge Developers WebSocket 使用示例
 * 演示如何连接、订阅行情、处理推送数据等
 */

import { createWebSocketClient, type WebSocketConfig, type QuoteData } from './websocket-client'

// React hooks (需要在 React 项目中导入)
// import { useState, useEffect } from 'react'

// Vue hooks (需要在 Vue 项目中导入)
// import { ref, watch, onUnmounted, readonly, type Ref } from 'vue'

// 为了避免编译错误，这里声明这些函数（实际使用时请导入真实的 hooks）
declare function useState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void]
declare function useEffect(effect: () => void | (() => void), deps?: any[]): void
declare function ref<T>(value: T): { value: T }
declare function watch<T>(source: T, callback: () => void, options?: any): void
declare function onUnmounted(callback: () => void): void
declare function readonly<T>(value: T): T
declare type Ref<T> = { value: T }

// ==================== 配置示例 ====================

const wsConfig: WebSocketConfig = {
  appKey: '',
  accessToken: '',
  appSecret: '',
  // 可选配置
  wsUrl: 'wss://openapi-quote.longbridge.com', // 默认值
  timeout: 30000, // 30 秒超时
  autoReconnect: true, // 自动重连
  reconnectInterval: 5000, // 重连间隔 5 秒
  maxReconnectAttempts: 3, // 最大重连 3 次
}

// ==================== 基础使用示例 ====================

async function basicExample() {
  console.log('=== 基础 WebSocket 示例 ===')

  // 创建 WebSocket 客户端
  const wsClient = createWebSocketClient(wsConfig)

  try {
    // 连接到服务器
    await wsClient.connect()
    console.log('✅ WebSocket 连接成功')

    // 订阅港股腾讯和美股苹果的实时行情
    await wsClient.subscribeQuote({
      symbol: ['700.HK', 'AAPL.US'],
      sub_type: [1, 2], // 1: 实时价格，2: 买卖盘
      is_first_push: true, // 立即推送当前数据
    })
    console.log('✅ 行情订阅成功')

    // 等待一段时间接收数据
    await new Promise((resolve) => setTimeout(resolve, 10000))

    // 获取当前订阅列表
    const subscriptions = await wsClient.getSubscriptions()
    console.log('📊 当前订阅：', subscriptions)

    // 取消订阅
    await wsClient.unsubscribeQuote(['AAPL.US'])
    console.log('✅ 取消 AAPL.US 订阅成功')
  } catch (error) {
    console.error('❌ WebSocket 示例失败：', error)
  } finally {
    // 断开连接
    wsClient.disconnect()
    console.log('🔌 WebSocket 连接已断开')
  }
}

// ==================== 事件监听示例 ====================

async function eventListenerExample() {
  console.log('=== WebSocket 事件监听示例 ===')

  const wsClient = createWebSocketClient(wsConfig)

  // 设置事件监听器
  wsClient.on('connected', () => {
    console.log('🔗 WebSocket 已连接')
  })

  wsClient.on('disconnected', () => {
    console.log('📡 WebSocket 已断开')
  })

  wsClient.on('error', (error) => {
    console.error('❌ WebSocket 错误：', error)
  })

  wsClient.on('quote', (data: QuoteData) => {
    console.log('📈 收到行情数据：', {
      symbol: data.symbol,
      price: data.last_done,
      open: data.open,
      high: data.high,
      low: data.low,
      volume: data.volume,
      timestamp: new Date(data.timestamp || 0).toLocaleString(),
    })
  })

  wsClient.on('push', (data) => {
    console.log('📨 收到推送数据：', data)
  })

  try {
    await wsClient.connect()

    // 订阅多个股票
    await wsClient.subscribeQuote({
      symbol: ['700.HK', 'AAPL.US', 'BABA.US'],
      sub_type: [1], // 只订阅实时价格
      is_first_push: true,
    })

    // 保持连接 30 秒
    console.log('⏱️  保持连接 30 秒...')
    await new Promise((resolve) => setTimeout(resolve, 30000))
  } catch (error) {
    console.error('❌ 事件监听示例失败：', error)
  } finally {
    wsClient.disconnect()
  }
}

// ==================== 错误处理和重连示例 ====================

async function reconnectExample() {
  console.log('=== 重连机制示例 ===')

  // 配置自动重连
  const reconnectConfig: WebSocketConfig = {
    ...wsConfig,
    autoReconnect: true,
    reconnectInterval: 3000, // 3 秒重连间隔
    maxReconnectAttempts: 5, // 最多重连 5 次
  }

  const wsClient = createWebSocketClient(reconnectConfig)

  let reconnectCount = 0

  wsClient.on('connected', () => {
    console.log('🔗 WebSocket 连接成功')
    reconnectCount = 0
  })

  wsClient.on('disconnected', () => {
    console.log('📡 WebSocket 连接断开')
  })

  wsClient.on('error', (error) => {
    reconnectCount++
    console.error(`❌ WebSocket 错误 (第${reconnectCount}次):`, error)
  })

  try {
    await wsClient.connect()

    await wsClient.subscribeQuote({
      symbol: ['700.HK'],
      sub_type: [1],
      is_first_push: true,
    })

    // 模拟网络问题 - 手动断开连接测试重连
    console.log('🔌 5 秒后将断开连接测试重连...')
    setTimeout(() => {
      console.log('🔌 手动断开连接')
      wsClient.disconnect()
    }, 5000)

    // 保持脚本运行
    await new Promise((resolve) => setTimeout(resolve, 30000))
  } catch (error) {
    console.error('❌ 重连示例失败：', error)
  } finally {
    wsClient.disconnect()
  }
}

// ==================== 行情数据分析示例 ====================

async function quoteAnalysisExample() {
  console.log('=== 行情数据分析示例 ===')

  const wsClient = createWebSocketClient(wsConfig)
  const quoteHistory: Map<string, QuoteData[]> = new Map()

  wsClient.on('quote', (data: QuoteData) => {
    if (!quoteHistory.has(data.symbol)) {
      quoteHistory.set(data.symbol, [])
    }

    const history = quoteHistory.get(data.symbol)!
    history.push({ ...data, timestamp: Date.now() })

    // 保持最近 50 条数据
    if (history.length > 50) {
      history.shift()
    }

    // 简单的价格变化分析
    if (history.length >= 2) {
      const current = history[history.length - 1]
      const previous = history[history.length - 2]

      if (current.last_done && previous.last_done) {
        const change = current.last_done - previous.last_done
        const changePercent = (change / previous.last_done) * 100

        const trend = change > 0 ? '📈' : change < 0 ? '📉' : '➡️'

        console.log(
          `${trend} ${data.symbol}: ${current.last_done} (${change >= 0 ? '+' : ''}${change.toFixed(4)}, ${changePercent.toFixed(2)}%)`
        )
      }
    }
  })

  try {
    await wsClient.connect()

    // 订阅热门股票
    await wsClient.subscribeQuote({
      symbol: ['700.HK', 'AAPL.US', 'BABA.US', 'TSLA.US', '9988.HK'],
      sub_type: [1],
      is_first_push: true,
    })

    console.log('📊 开始监控股票价格变化...')
    await new Promise((resolve) => setTimeout(resolve, 60000)) // 运行 1 分钟

    // 输出统计信息
    console.log('\n📈 行情统计:')
    for (const [symbol, history] of quoteHistory) {
      if (history.length >= 2) {
        const first = history[0]
        const last = history[history.length - 1]

        if (first.last_done && last.last_done) {
          const totalChange = last.last_done - first.last_done
          const totalChangePercent = (totalChange / first.last_done) * 100

          console.log(
            `  ${symbol}: ${first.last_done} → ${last.last_done} (${totalChange >= 0 ? '+' : ''}${totalChange.toFixed(4)}, ${totalChangePercent.toFixed(2)}%) [${history.length} 个数据点]`
          )
        }
      }
    }
  } catch (error) {
    console.error('❌ 行情分析示例失败：', error)
  } finally {
    wsClient.disconnect()
  }
}

// ==================== React Hook 示例 ====================

/**
 * React Hook 示例 - 在 React 组件中使用 WebSocket
 */
export function useWebSocketQuote(symbols: string[]) {
  const [quotes, setQuotes] = useState<Map<string, QuoteData>>(new Map())
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const wsClient = createWebSocketClient(wsConfig)

    wsClient.on('connected', () => {
      setIsConnected(true)
      setError(null)
    })

    wsClient.on('disconnected', () => {
      setIsConnected(false)
    })

    wsClient.on('error', (err: Error) => {
      setError(err.message)
    })

    wsClient.on('quote', (data: QuoteData) => {
      setQuotes((prev) => new Map(prev.set(data.symbol, data)))
    })

    // 连接并订阅
    wsClient
      .connect()
      .then(() => {
        return wsClient.subscribeQuote({
          symbol: symbols,
          sub_type: [1],
          is_first_push: true,
        })
      })
      .catch((err) => {
        setError(err.message)
      })

    return () => {
      wsClient.disconnect()
    }
  }, [symbols.join(',')])

  return { quotes, isConnected, error }
}

// ==================== Vue Composition API 示例 ====================

/**
 * Vue Composition API 示例
 */
export function useWebSocketQuoteVue(symbols: Ref<string[]>) {
  const quotes = ref<Map<string, QuoteData>>(new Map())
  const isConnected = ref(false)
  const error = ref<string | null>(null)
  let wsClient: ReturnType<typeof createWebSocketClient> | null = null

  const connect = async () => {
    if (wsClient) {
      wsClient.disconnect()
    }

    wsClient = createWebSocketClient(wsConfig)

    wsClient.on('connected', () => {
      isConnected.value = true
      error.value = null
    })

    wsClient.on('disconnected', () => {
      isConnected.value = false
    })

    wsClient.on('error', (err: Error) => {
      error.value = err.message
    })

    wsClient.on('quote', (data: QuoteData) => {
      quotes.value.set(data.symbol, data)
      // 触发响应式更新
      quotes.value = new Map(quotes.value)
    })

    try {
      await wsClient.connect()
      await wsClient.subscribeQuote({
        symbol: symbols.value,
        sub_type: [1],
        is_first_push: true,
      })
    } catch (err) {
      error.value = (err as Error).message
    }
  }

  watch(symbols, connect, { immediate: true })

  onUnmounted(() => {
    wsClient?.disconnect()
  })

  return { quotes: readonly(quotes), isConnected: readonly(isConnected), error: readonly(error) }
}

// ==================== 导出示例函数 ====================

export { basicExample, eventListenerExample, reconnectExample, quoteAnalysisExample, wsConfig as exampleConfig }

// 如果直接运行此文件，执行基础示例
if (typeof window !== 'undefined' && window.location?.pathname) {
  // 浏览器环境
  console.log('🌐 在浏览器中运行 WebSocket 示例')
  basicExample()
} else if (typeof process !== 'undefined' && process.argv) {
  // Node.js 环境
  console.log('🖥️  在 Node.js 中运行 WebSocket 示例')
  basicExample()
}
