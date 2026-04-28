import fs from 'fs-extra'
import path from 'path'
import { globSync } from 'glob'
import { rewriteMarkdownPath } from '../docs/.vitepress/utils'

type Locale = 'en' | 'zh-CN' | 'zh-HK'

/**
 * Process Markdown file
 * @param filePath file path
 * @param outputPath output path
 * @param locale locale for the file
 */
function processMarkdownFile(filePath: string, outputPath: string, locale: Locale, docsDir: string): void {
  let content = fs.readFileSync(filePath, 'utf-8')

  // Parse SDKLinks elements and replace them
  // Need to implement regex to match <SDKLinks ... /> tags and replace with Markdown tables
  content = parseSDKLinks(content, locale)

  const relativePath = path.relative(docsDir, filePath)

  const rewritePath = rewriteMarkdownPath(relativePath)
  // console.log(`rewritePath: ${relativePath} -> ${rewritePath}`)

  // Use the final determined filename
  const finalFilePath = path.join(outputPath, rewritePath)

  fs.ensureDirSync(path.dirname(finalFilePath))

  fs.writeFileSync(finalFilePath, content, { encoding: 'utf-8' })
}

/**
 * Main function
 */
function main(): void {
  const rootDir = process.cwd()
  const docsDir = path.join(rootDir, 'docs')
  const outputDir = path.join(rootDir, 'docs/.vitepress/dist')

  // Process Markdown files in docs directory

  // Process Markdown files in i18n directory
  const locales = fs.readdirSync(docsDir)
  locales.forEach((locale: string) => {
    if (!['en', 'zh-CN', 'zh-HK'].includes(locale)) {
      return
    }
    const localeDocsDir = path.join(docsDir, locale)
    if (fs.existsSync(localeDocsDir)) {
      const localeFiles = globSync('**/*.md', { cwd: localeDocsDir })
      localeFiles.forEach((file: string) => {
        const inputPath = path.join(localeDocsDir, file)
        processMarkdownFile(inputPath, outputDir, locale as Locale, docsDir)
      })
    }
  })
  console.log('Processing completed!')
}

/**
 * Parse SDKLinks tags and replace with corresponding Markdown tables
 * @param content Markdown file content
 * @param locale locale for table headers
 * @returns Processed content
 */
function parseSDKLinks(content: string, locale: Locale): string {
  // Match tags in format <SDKLinks module="xxx" klass="xxx" method="xxx" go="xxx" java="xxx" />
  const sdkLinksRegex =
    /<SDKLinks\s+(?:module="([^"]+)"\s+)?(?:klass="([^"]+)"\s+)?method="([^"]+)"(?:\s+go="([^"]+)")?(?:\s+java="([^"]+)")?(?:\s+level="([^"]+)")?(?:\s+title="([^"]+)")?\s*\/>/g

  // snakeCase: e.g. "GetHistory" -> "get_history"
  const snakeCase = (str: string): string => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }
  // camelCase: e.g. "get_history" -> "getHistory"
  const camelCase = (str: string): string => {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
  }
  // C++ Doxygen class page slug + method anchor (hex id)
  const cppClassSlug = (k: string) => snakeCase(k).replace(/^_/, '')
  const CPP_ANCHOR_MAP: Record<string, string> = {
    'quote:static_info': 'aa7d2e40f0e94848aa229a629343821e8',
    'quote:quote': 'aa7a4595e9eb5830e935322a8ddc601f5',
    'quote:subscribe': 'a321f37f6d6e05c00062cd5a15b2928a7',
    'quote:unsubscribe': 'ae8bcc8c8c2f66de1decefa074a911547',
    'quote:subscriptions': 'af2bf64d57c5dfc29d39cd63441ed5ec5',
    'quote:set_on_quote': 'af4c98ea970f2632e03e63d188b914ff2',
    'quote:set_on_depth': 'a96e2a7f2f510c3a5dcfb5ac24d656fb7',
    'quote:set_on_brokers': 'af647e715a4ed7ff5d36b51237ff1dbcf',
    'quote:set_on_trades': 'a4217749d54ebce011e42a925bef61de8',
    'quote:depth': 'a92263146c1daffd85cf4e4486a97dfff',
    'quote:brokers': 'af818331256982c8132844bc0f38183fb',
    'quote:participants': 'a4b1206889135f8712e52b88ef321f280',
    'quote:trades': 'a5329988f37c0b1a5ef4145dc8b80cdb2',
    'quote:intraday': 'ad9d3cee180163c0a27564910c4d121e8',
    'quote:candlesticks': 'a6e2108e84363012cdc0ea8bf0d1709c7',
    'quote:history_candlesticks_by_offset': 'ae295ca3676f3b39d1b34103a35c07429',
    'quote:history_candlesticks_by_date': 'a8adf7d1d2bcb8dc1369e397c7859bc1a',
    'quote:option_chain_expiry_date_list': 'a39c967d93c9435deea550956bc668bdb',
    'quote:option_chain_info_by_date': 'a9d8df470c1324ce2407265cdc99df2a5',
    'quote:warrant_issuers': 'a90965318b95a15869f50760339b8a71c',
    'quote:warrant_list': 'aa10434c7eac18b124b763424c0e22f40',
    'quote:trading_session': 'ab8a61cdb2a2b5b2d23f60a8dd0fdbb4f',
    'quote:trading_days': 'a880aaa31010b174bb42c81412c240559',
    'quote:capital_flow': 'a4138de1f06237ed8563b028e783b22ba',
    'quote:capital_distribution': 'a6a8ba241ac3c8249a2a5d0c58c10a786',
    'quote:calc_indexes': 'a32d25607adb4304ffa334dc3467b0d0d',
    'quote:watchlist': 'a6e12e64f96ac4ab514df3127fe404d41',
    'quote:create_watchlist_group': 'afbcabe6c545c05d1d4fcefe0b9a66aea',
    'quote:delete_watchlist_group': 'a0255d0b3c8890d126b7178cf1412bf7d',
    'quote:update_watchlist_group': 'ac44c1873a007d23d8040573ef9001aa6',
    'quote:security_list': 'aa1fe96cbcadcb09a7b3cf08c0324a7b4',
    'quote:market_temperature': 'a24a820b09f5fd60b76016d299136748d',
    'quote:history_market_temperature': 'aa766f5cdb11ac2ebec96e942a4bf97fd',
    'quote:option_quote': 'a1193a0983647090ef2004e39cad5dae8',
    'quote:warrant_quote': 'ae3d3015bf14448e54f5da33030baf350',
    'trade:subscribe': 'a6e0f5a81c89a4a351d8289a8f81d5e26',
    'trade:unsubscribe': 'a35158082ee04f2e865aa8bfce39576b9',
    'trade:replace_order': 'af4fd45eccae1108d356308dbc8a4fd24',
    'trade:submit_order': 'a7288d1a1a76678ba86f8d44b4a2365ef',
    'trade:cancel_order': 'ae8474241533b66f192e8353520cbd7d4',
    'trade:history_executions': 'a323b4e7185bf067e622db373e96bcc75',
    'trade:today_executions': 'addb207fb478708806f4bb414a48fd8ce',
    'trade:history_orders': 'a042c94acf87d282f7c106a44efeedbbd',
    'trade:today_orders': 'aa591e194baa2934634b4a753dc95e0f7',
    'trade:account_balance': 'a4bb7495e51784df7535c8b08c9db05fd',
    'trade:cash_flow': 'a390e380ee98b35d7b05cd59d81016063',
    'trade:fund_positions': 'ac2135e51ac5d72f3b302e41b6f41d116',
    'trade:stock_positions': 'a187b81fba74aeea06333e5460f6c79de',
    'trade:margin_ratio': 'a63733868dd08101f12e379ac7c63501e',
    'trade:order_detail': 'aedb3d207a04d2a4bcde41e351b5c4f60',
    'trade:estimate_max_purchase_quantity': 'a08212a313a00792c42d2e47956ef3070',
  }

  const JAVA_METHOD_MAP: Record<string, string> = {
    subscribe: 'subscribe',
    unsubscribe: 'unsubscribe',
    replace_order: 'replaceOrder',
    submit_order: 'submitOrder',
    cancel_order: 'cancelOrder',
    warrant_list: 'queryWarrantList',
    create_watchlist_group: 'createWatchlistGroup',
    delete_watchlist_group: 'deleteWatchlistGroup',
    update_watchlist_group: 'updateWatchlistGroup',
    set_on_quote: 'setOnQuote',
    set_on_depth: 'setOnDepth',
    set_on_brokers: 'setOnBrokers',
    set_on_trades: 'setOnTrades',
    subscriptions: 'getSubscrptions',
  }

  const JAVA_ANCHOR_MAP: Record<string, string> = {
    getStaticInfo: 'getStaticInfo(java.lang.String[])',
    getQuote: 'getQuote(java.lang.String[])',
    getParticipants: 'getParticipants()',
    getTrades: 'getTrades(java.lang.String,int)',
    subscribe: 'subscribe(java.lang.String[],int)',
    unsubscribe: 'unsubscribe(java.lang.String[],int)',
    getWatchlist: 'getWatchlist()',
    createWatchlistGroup: 'createWatchlistGroup(com.longbridge.quote.CreateWatchlistGroup)',
    deleteWatchlistGroup: 'deleteWatchlistGroup(com.longbridge.quote.DeleteWatchlistGroup)',
    updateWatchlistGroup: 'updateWatchlistGroup(com.longbridge.quote.UpdateWatchlistGroup)',
    getBrokers: 'getBrokers(java.lang.String)',
    getDepth: 'getDepth(java.lang.String)',
    getCalcIndexes: 'getCalcIndexes(java.lang.String[],com.longbridge.quote.CalcIndex[])',
    getCandlesticks: 'getCandlesticks(java.lang.String,com.longbridge.quote.Period,int,com.longbridge.quote.AdjustType,com.longbridge.quote.TradeSessions)',
    getCapitalFlow: 'getCapitalFlow(java.lang.String)',
    getCapitalDistribution: 'getCapitalDistribution(java.lang.String)',
    getHistoryCandlesticksByOffset: 'getHistoryCandlesticksByOffset(java.lang.String,com.longbridge.quote.Period,com.longbridge.quote.AdjustType,boolean,java.time.LocalDateTime,int,com.longbridge.quote.TradeSessions)',
    getHistoryCandlesticksByDate: 'getHistoryCandlesticksByDate(java.lang.String,com.longbridge.quote.Period,com.longbridge.quote.AdjustType,java.time.LocalDate,java.time.LocalDate,com.longbridge.quote.TradeSessions)',
    getHistoryMarketTemperature: 'getHistoryMarketTemperature(com.longbridge.Market,java.time.LocalDate,java.time.LocalDate)',
    getSecurityList: 'getSecurityList(com.longbridge.Market,com.longbridge.quote.SecurityListCategory)',
    getMarketTemperature: 'getMarketTemperature(com.longbridge.Market)',
    getSubscrptions: 'getSubscrptions()',
    getOptionQuote: 'getOptionQuote(java.lang.String[])',
    getWarrantQuote: 'getWarrantQuote(java.lang.String[])',
    getOptionChainExpiryDateList: 'getOptionChainExpiryDateList(java.lang.String)',
    getOptionChainInfoByDate: 'getOptionChainInfoByDate(java.lang.String,java.time.LocalDate)',
    getWarrantIssuers: 'getWarrantIssuers()',
    queryWarrantList: 'queryWarrantList(com.longbridge.quote.QueryWarrantOptions)',
    getTradingSession: 'getTradingSession()',
    getTradingDays: 'getTradingDays(com.longbridge.Market,java.time.LocalDate,java.time.LocalDate)',
    getIntraday: 'getIntraday(java.lang.String,com.longbridge.quote.TradeSessions)',
    setOnQuote: 'setOnQuote(com.longbridge.quote.QuoteHandler)',
    setOnDepth: 'setOnDepth(com.longbridge.quote.DepthHandler)',
    setOnBrokers: 'setOnBrokers(com.longbridge.quote.BrokersHandler)',
    setOnTrades: 'setOnTrades(com.longbridge.quote.TradesHandler)',
    getHistoryExecutions: 'getHistoryExecutions(com.longbridge.trade.GetHistoryExecutionsOptions)',
    getTodayExecutions: 'getTodayExecutions(com.longbridge.trade.GetTodayExecutionsOptions)',
    getHistoryOrders: 'getHistoryOrders(com.longbridge.trade.GetHistoryOrdersOptions)',
    getTodayOrders: 'getTodayOrders(com.longbridge.trade.GetTodayOrdersOptions)',
    replaceOrder: 'replaceOrder(com.longbridge.trade.ReplaceOrderOptions)',
    submitOrder: 'submitOrder(com.longbridge.trade.SubmitOrderOptions)',
    cancelOrder: 'cancelOrder(java.lang.String)',
    getAccountBalance: 'getAccountBalance()',
    getCashFlow: 'getCashFlow(com.longbridge.trade.GetCashFlowOptions)',
    getFundPositions: 'getFundPositions(com.longbridge.trade.GetFundPositionsOptions)',
    getStockPositions: 'getStockPositions(com.longbridge.trade.GetStockPositionsOptions)',
    getMarginRatio: 'getMarginRatio(java.lang.String)',
    getOrderDetail: 'getOrderDetail(java.lang.String)',
    getEstimateMaxPurchaseQuantity: 'getEstimateMaxPurchaseQuantity(com.longbridge.trade.EstimateMaxPurchaseQuantityOptions)',
  }

  return content.replace(
    sdkLinksRegex,
    (module = 'quote', klass = 'QuoteContext', method: string, go?: string, java?: string, title = 'SDK'): string => {
      const snakeMethod = snakeCase(method)
      const camelMethod = camelCase(method)
      const capitalizedMethod = camelMethod.charAt(0).toUpperCase() + camelMethod.slice(1)
      const getPrefixedMethod = `get${capitalizedMethod}`
      const methodGo = go || capitalizedMethod
      const methodJava = java ?? JAVA_METHOD_MAP[method] ?? getPrefixedMethod
      const javaAnchorRaw = JAVA_ANCHOR_MAP[methodJava] ?? methodJava
      const javaAnchor = encodeURIComponent(javaAnchorRaw)

      const links: { title: string; label: string; url: string }[] = [
        {
          title: 'Python',
          label: `longbridge.openapi.${klass}.${snakeMethod}`,
          url: `https://longbridge.github.io/openapi/python/reference_all/#longbridge.openapi.${klass}.${snakeMethod}`,
        },
        {
          title: 'Rust',
          label: `longbridge::${module}::${klass}#${snakeMethod}`,
          url: `https://longbridge.github.io/openapi/rust/longbridge/${module}/struct.${klass}.html#method.${snakeMethod}`,
        },
        {
          title: 'Go',
          label: `${klass}.${methodGo}`,
          url: `https://pkg.go.dev/github.com/longbridge/openapi-go/${module}#${klass}.${methodGo}`,
        },
        {
          title: 'Node.js',
          label: `${klass}#${camelMethod}`,
          url: `https://longbridge.github.io/openapi/nodejs/classes/${klass}.html#${camelMethod.toLowerCase()}`,
        },
        {
          title: 'Java',
          label: `${klass}.${methodJava}`,
          url: `https://longbridge.github.io/openapi/java/com/longbridge/${module}/${klass}.html#${javaAnchor}`,
        },
        (() => {
          const cppBase = `https://longbridge.github.io/openapi/cpp/classlongbridge_1_1${module}_1_1_${cppClassSlug(klass)}.html`
          const cppAnchor = CPP_ANCHOR_MAP[`${module}:${method}`]
          return {
            title: 'C++',
            label: `longbridge::${module}::${klass}::${snakeMethod}`,
            url: cppAnchor ? `${cppBase}#${cppAnchor}` : cppBase,
          }
        })(),
      ]

      // Generate Markdown table
      let tableHeader = ''
      if (locale === 'en') {
        tableHeader = `\n## ${title}\n\n| Language | Link |\n|---|---|`
      } else if (locale === 'zh-HK') {
        tableHeader = `\n## ${title}\n\n| 語言 | 鏈接 |\n|---|---|`
      } else {
        // Default to simplified Chinese
        tableHeader = `\n## ${title}\n\n| 语言 | 链接 |\n|---|---|`
      }

      let tableContent = tableHeader
      links.forEach((item) => {
        tableContent += `\n| ${item.title} | [${item.label}](${item.url}) |`
      })

      return tableContent
    }
  )
}
// call main function
main()
