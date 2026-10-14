import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress `Skill.vue` "Capability reference" section
// (template 1852–1886). Copy: `LOCALE.<locale>.cap` (en 100–110, zh-CN 228–238,
// zh-HK 481–491) + `capItems` (zh-CN 293–336, zh-HK 546–589; en has none and
// falls back to the English text inside CAP_REFERENCE, exactly as the legacy
// `capGroups` computed (1132–1139) did).

type CapLocale = {
  cap: Record<string, string>
  capItems?: Record<string, string[]>
}

const LOCALE: Record<Locale, CapLocale> = {
  en: {
    cap: {
      eyebrow: 'Capability reference',
      title: 'Full coverage of Longbridge CLI commands and MCP tools.',
      desc: 'Every capability below is available to your AI in plain conversation.',
      marketData: 'Real-time Market Data',
      fundamentals: 'Fundamentals & Research',
      calendar: 'Calendar & Events',
      news: 'News, Community & Watchlist',
      account: 'Account & Portfolio',
      trading: 'Trading',
    } as Record<string, string>,
  },
  'zh-CN': {
    cap: {
      eyebrow: '能力参考',
      title: '完整覆盖 Longbridge CLI 命令和 MCP 工具',
      desc: '以下所有能力均可通过自然对话调用。',
      marketData: '实时行情数据',
      fundamentals: '基本面与研究',
      calendar: '日历与事件',
      news: '资讯、社区与自选股',
      account: '账户与投资组合',
      trading: '交易',
    } as Record<string, string>,
    capItems: {
      marketData: [
        '实时行情（单个或多个标的）',
        'Level 2 盘口深度（买卖挂单梯）',
        '逐笔成交数据',
        '分钟级日内价格与成交量',
        'K 线 OHLCV 与历史日期范围数据',
        '日内资金流向时间序列',
        '市场情绪温度指数（0–100）',
        '基础静态参数（手数、股本、EPS）',
        '<a href="https://longbridge.com/markets">期权报价</a>与期权链',
        '权证报价及按标的筛选权证',
      ],
      fundamentals: [
        '利润表、资产负债表、现金流量表',
        'PE/PB/PS、股息收益率 + 同行对比',
        '分析师 EPS 预测',
        '营收与利润一致预期及超/不及预期记录',
        '机构评级与目标价分布',
        '计算类财务指数（PE、PB、分红率）',
        '机构股东及持仓变化',
        '持有指定标的的基金与 ETF',
        '历史分红记录及分配详情',
        'SEC / 监管文件（完整 Markdown 内容）',
      ],
      calendar: ['按标的查看即将发布的财报', '重要宏观数据事件', '按市场查看即将派息事件', '交易时段安排与节假日历'],
      news: ['按标的获取<a href="https://longbridge.com/news">最新资讯</a>', '社区讨论话题', '自选股分组：查看、新建、编辑、删除'],
      account: [
        '全子账户股票持仓',
        '全子账户基金持仓',
        '账户现金余额与融资信息',
        '资金流水（入金、出金、分红、手续费）',
        '账户对账单（日报 / 月报）',
        '全币种汇率',
      ],
      trading: [
        '限价单、市价单或条件单',
        '查看当日订单、订单详情、成交记录',
        '撤销待成交订单',
        '修改待成交订单的数量或价格',
        '估算最大可买 / 可卖数量',
        '按标的查询保证金比例要求',
      ],
    } as Record<string, string[]>,
  },
  'zh-HK': {
    cap: {
      eyebrow: '能力參考',
      title: '完整覆蓋 Longbridge CLI 命令和 MCP 工具',
      desc: '以下所有能力均可透過自然對話調用。',
      marketData: '即時行情數據',
      fundamentals: '基本面與研究',
      calendar: '日曆與事件',
      news: '資訊、社區與自選股',
      account: '帳戶與投資組合',
      trading: '交易',
    } as Record<string, string>,
    capItems: {
      marketData: [
        '即時行情（單個或多個標的）',
        'Level 2 盤口深度（買賣掛單梯）',
        '逐筆成交數據',
        '分鐘級日內價格與成交量',
        'K 線 OHLCV 與歷史日期範圍數據',
        '日內資金流向時間序列',
        '市場情緒溫度指數（0–100）',
        '基礎靜態參數（手數、股本、EPS）',
        '<a href="https://longbridge.com/markets">期權報價</a>與期權鏈',
        '權證報價及按標的篩選權證',
      ],
      fundamentals: [
        '利潤表、資產負債表、現金流量表',
        'PE/PB/PS、股息收益率 + 同行對比',
        '分析師 EPS 預測',
        '營收與利潤一致預期及超/不及預期記錄',
        '機構評級與目標價分佈',
        '計算類財務指數（PE、PB、分紅率）',
        '機構股東及持倉變化',
        '持有指定標的的基金與 ETF',
        '歷史分紅記錄及分配詳情',
        'SEC / 監管文件（完整 Markdown 內容）',
      ],
      calendar: ['按標的查看即將發佈的業績', '重要宏觀數據事件', '按市場查看即將派息事件', '交易時段安排與節假日曆'],
      news: ['按標的獲取<a href="https://longbridge.com/news">最新資訊</a>', '社區討論話題', '自選股分組：查看、新建、編輯、刪除'],
      account: [
        '全子賬戶股票持倉',
        '全子賬戶基金持倉',
        '賬戶現金餘額與融資信息',
        '資金流水（入金、出金、分紅、手續費）',
        '賬戶對賬單（日報 / 月報）',
        '全幣種匯率',
      ],
      trading: [
        '限價單、市價單或條件單',
        '查看當日訂單、訂單詳情、成交記錄',
        '撤銷待成交訂單',
        '修改待成交訂單的數量或價格',
        '估算最大可買 / 可賣數量',
        '按標的查詢保證金比例要求',
      ],
    } as Record<string, string[]>,
  },
}

// Legacy `CAP_REFERENCE` (1043–1113), byte-for-byte.
const CAP_REFERENCE = [
  {
    tKey: 'marketData',
    items: [
      'Live quotes for one or more symbols',
      'Level 2 order book depth (bid/ask ladder)',
      'Tick-by-tick recent trades',
      'Intraday minute-by-minute price & volume',
      'OHLCV candlesticks & historical date-range data',
      'Intraday capital flow & distribution',
      'Market sentiment temperature index (0–100)',
      'Static reference info (lot size, shares, EPS)',
      '<a href="https://longbridge.com/markets">Option quotes</a> & option chain',
      'Warrant quotes & warrants by underlying',
    ],
  },
  {
    tKey: 'fundamentals',
    items: [
      'Income statement, balance sheet, cash flow',
      'P/E, P/B, P/S, dividend yield + peer comparison',
      'Analyst EPS forecasts',
      'Revenue & profit consensus with beat/miss',
      'Institution ratings & target price distribution',
      'Calculated financial indexes (PE, PB, DPS rate)',
      'Institutional shareholders with position changes',
      'Funds & ETFs that hold a given symbol',
      'Dividend history & distribution details',
      'SEC / regulatory filings (full Markdown content)',
    ],
  },
  {
    tKey: 'calendar',
    items: [
      'Upcoming earnings events by symbol',
      'High-importance macro data events',
      'Upcoming dividend events by market',
      'Trading session schedule & holiday calendar',
    ],
  },
  {
    tKey: 'news',
    items: [
      '<a href="https://longbridge.com/en/news">Latest news articles</a> for a symbol',
      'Community discussion topics',
      'Watchlist groups: list, create, update, delete',
    ],
  },
  {
    tKey: 'account',
    items: [
      'Stock positions across all sub-accounts',
      'Fund positions across all sub-accounts',
      'Account cash balance & financing info',
      'Cash flow records (deposits, withdrawals, dividends)',
      'Account statements (daily / monthly)',
      'Exchange rates for all supported currencies',
    ],
  },
  {
    tKey: 'trading',
    items: [
      'Limit, market, or stop-limit orders',
      "List today's orders, view detail, executions",
      'Cancel a pending order',
      'Modify quantity or price of a pending order',
      'Estimate max buy/sell quantity',
      'Margin ratio requirements for a symbol',
    ],
  },
]

export function SkillCapSection({ locale }: { locale: Locale }) {
  // Legacy `content` computed (1122): unknown locale falls back to en.
  const content = LOCALE[locale] ?? LOCALE.en

  // Legacy `capGroups` computed (1132–1139): label from `cap[tKey]`, items from
  // the locale's `capItems[tKey]` when present, else the English CAP_REFERENCE.
  const capGroups = CAP_REFERENCE.map((g) => ({
    ...g,
    label: content.cap[g.tKey] ?? g.tKey,
    items: content.capItems?.[g.tKey] ?? g.items,
  }))

  return (
    <section className="section">
      <div className="section-inner">
        <div style={{ maxWidth: 640, marginBottom: 40 }}>
          <span className="eyebrow">{content.cap.eyebrow}</span>
          <h2 className="h-section" style={{ marginTop: 14 }}>
            {content.cap.title}
          </h2>
          <p className="t-meta" style={{ marginTop: 10, lineHeight: 1.55 }}>
            {content.cap.desc}
          </p>
        </div>
        <div className="skill-cap-grid">
          {capGroups.map((g) => (
            <div key={g.tKey} className="skill-cap-col">
              <h3 className="h-card" style={{ fontSize: 14, color: 'var(--lb-fg-1)' }}>
                {g.label}
              </h3>
              <ul>
                {g.items.map((item) => (
                  <li key={item}>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: 'var(--lb-up)', flexShrink: 0, marginTop: 4 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
