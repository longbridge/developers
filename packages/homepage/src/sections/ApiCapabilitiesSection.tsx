import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "API Capabilities" section
// (NewHomePage/index.vue, section #7: `.api-caps-grid` / `.api-cap-card`).
// Markup, copy, inline styles, and CSS mirror the legacy source. Shared legacy
// chrome (.section / .section-inner / .eyebrow / .h-section / .h-card / .t-meta)
// is provided globally by homepage.css under `.new-home-page`; only the
// section-specific `.api-cap*` rules are carried here. Legacy has no
// `.lb-dark` overrides for this section, so there is nothing to translate to
// `[data-mode="dark"]`; every token referenced already exists in
// src/styles/tokens.css.
const LOCALE = {
  en: {
    apiCaps: {
      eyebrow: 'API Capabilities',
      title: 'Real-time data and trading capabilities for every investment workflow.',
      items: [
        {
          title: 'Market Data',
          count: '30+',
          desc: 'Real-time quotes, order depth, candlestick, intraday, capital flow, and push subscriptions',
          items: [
            'Real-time quotes',
            'Order book depth',
            'Candlestick charts',
            'Intraday timeline',
            'Capital flow',
            'WebSocket push',
          ],
        },
        {
          title: 'Trading & Orders',
          count: '14+',
          desc: 'Submit, replace, and withdraw orders. Track positions, balance, and execution history',
          items: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
        },
        {
          title: 'Derivatives',
          count: '8+',
          desc: 'Full option chains with Greeks, warrants listing, and real-time derivative quotes',
          items: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
        },
        {
          title: 'Financial Research',
          count: '7+',
          desc: 'Financial statements, valuation metrics, dividend history, EPS forecasts, analyst ratings',
          items: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
        },
        {
          title: 'Content & News',
          count: '8+',
          desc: 'Real-time news feeds, community discussions, topics, and engagement metrics',
          items: ['News feeds', 'Community topics', 'Discussions', 'Engagement data'],
        },
      ],
    },
  },
  'zh-CN': {
    apiCaps: {
      eyebrow: 'API 功能',
      title: '覆盖每个投资工作流的实时数据与交易能力',
      items: [
        {
          title: '行情数据',
          count: '30+',
          desc: '实时报价、买卖盘深度、K 线、分时、资金流向及推送订阅',
          items: ['实时报价', '买卖盘深度', 'K 线图', '分时数据', '资金流向', 'WebSocket 推送'],
        },
        {
          title: '交易与订单',
          count: '14+',
          desc: '提交、修改与撤销订单。追踪持仓、余额及成交历史',
          items: ['提交订单', '修改与撤单', '持仓与余额', '成交历史', '订单状态推送'],
        },
        {
          title: '衍生品',
          count: '8+',
          desc: '完整期权链含希腊字母、权证列表及实时衍生品报价',
          items: ['期权链 + 希腊字母', '权证筛选', '发行商目录', '衍生品报价'],
        },
        {
          title: '金融研究',
          count: '7+',
          desc: '财务报表、估值指标、分红历史、EPS 预测、分析师评级',
          items: ['财务报表', '估值指标', '分红历史', 'EPS 预测', '分析师评级'],
        },
        {
          title: '内容与资讯',
          count: '8+',
          desc: '实时新闻推送、社区讨论、话题及互动数据',
          items: ['新闻推送', '社区话题', '讨论帖', '互动数据'],
        },
      ],
    },
  },
  'zh-HK': {
    apiCaps: {
      eyebrow: 'API 功能',
      title: '覆蓋每個投資工作流的即時數據與交易能力',
      items: [
        {
          title: '行情數據',
          count: '30+',
          desc: '即時報價、買賣盤深度、K 線、分時、資金流向及推送訂閱',
          items: ['即時報價', '買賣盤深度', 'K 線圖', '分時數據', '資金流向', 'WebSocket 推送'],
        },
        {
          title: '交易與訂單',
          count: '14+',
          desc: '提交、修改與撤銷訂單。追蹤持倉、餘額及成交歷史',
          items: ['提交訂單', '修改與撤單', '持倉與餘額', '成交歷史', '訂單狀態推送'],
        },
        {
          title: '衍生品',
          count: '8+',
          desc: '完整期權鏈含希臘字母、權證列表及即時衍生品報價',
          items: ['期權鏈 + 希臘字母', '權證篩選', '發行商目錄', '衍生品報價'],
        },
        {
          title: '金融研究',
          count: '7+',
          desc: '財務報表、估值指標、股息歷史、EPS 預測、分析師評級',
          items: ['財務報表', '估值指標', '股息歷史', 'EPS 預測', '分析師評級'],
        },
        {
          title: '內容與資訊',
          count: '8+',
          desc: '即時新聞推送、社群討論、話題及互動數據',
          items: ['新聞推送', '社群話題', '討論帖', '互動數據'],
        },
      ],
    },
  },
}

type CapIcon = 'chart' | 'shield' | 'bolt' | 'book' | 'globe'

// Locale-independent per-card data (legacy `API_CAPS`), merged per-index with
// `content.apiCaps.items[i]` exactly like the legacy `apiCaps` computed.
// Legacy also carried an English copy of title/count/desc/items on each entry
// as a fallback; every locale supplies all five items so it was never rendered
// and is omitted here.
const API_CAPS: { icon: CapIcon; color: string; link: string }[] = [
  { icon: 'chart', color: 'var(--lb-status-neutral)', link: '/docs/quote/overview' },
  { icon: 'shield', color: 'var(--lb-brand)', link: '/docs/trade/trade-overview' },
  { icon: 'bolt', color: 'var(--lb-ai-mention)', link: '/docs/cli/derivatives/option' },
  { icon: 'book', color: 'var(--lb-chart-purple)', link: '/docs/cli/fundamentals/financial-report' },
  { icon: 'globe', color: 'var(--lb-status-alert)', link: '/docs/content/overview' },
]

// Verbatim from legacy app-styles.css ("API capability cards" block).
const API_CAPS_CSS = `
/* API capability cards */
.api-caps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 980px) {
  .api-caps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .api-caps-grid {
    grid-template-columns: 1fr;
  }
}
.api-cap-card {
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
  transition: all var(--lb-transition-normal);
}
.api-cap-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--app-shadow-2);
  border-color: var(--app-card-stroke-strong);
}
.api-cap-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.api-cap-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.api-cap-count {
  font-family: var(--app-mono);
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
}
.api-cap-list {
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  display: grid;
  gap: 6px;
}
.api-cap-list li {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--lb-fg-2);
}
`

function CapIconGlyph({ icon }: { icon: CapIcon }) {
  const common = {
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (icon) {
    case 'chart':
      return (
        <svg {...common}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'bolt':
      return (
        <svg {...common}>
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      )
    case 'book':
      return (
        <svg {...common}>
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    case 'globe':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
        </svg>
      )
  }
}

interface ApiCapabilitiesSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function ApiCapabilitiesSection({ locale }: ApiCapabilitiesSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const apiCaps = API_CAPS.map((c, i) => ({ ...c, ...(content.apiCaps.items[i] ?? {}) }))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: API_CAPS_CSS }} />
      <section
        data-lbus-component="api-capabilities-section"
        className="section"
        style={{
          background: 'var(--app-canvas)',
          borderTop: '1px solid var(--app-card-stroke)',
          borderBottom: '1px solid var(--app-card-stroke)',
        }}>
        <div className="section-inner">
          <div style={{ maxWidth: '560px', marginBottom: '48px' }}>
            <span className="eyebrow">{content.apiCaps.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: '16px' }}>
              {content.apiCaps.title}
            </h2>
          </div>
          <div className="api-caps-grid">
            {apiCaps.map((c) => (
              <a key={c.title} href={localePath(locale, c.link)} className="api-cap-card">
                <div className="api-cap-head">
                  <div
                    className="api-cap-icon"
                    style={{ background: `color-mix(in srgb, ${c.color} 14%, transparent)`, color: c.color }}>
                    <CapIconGlyph icon={c.icon} />
                  </div>
                  <span
                    className="api-cap-count"
                    style={{ color: c.color, background: `color-mix(in srgb, ${c.color} 12%, transparent)` }}>
                    {c.count}
                  </span>
                </div>
                <h3 className="h-card" style={{ marginTop: '18px' }}>
                  {c.title}
                </h3>
                <p className="t-meta" style={{ marginTop: '8px', lineHeight: 1.55 }}>
                  {c.desc}
                </p>
                <ul className="api-cap-list">
                  {c.items.map((item) => (
                    <li key={item}>
                      <svg width="10" height="10" viewBox="0 0 24 24" style={{ color: c.color, flexShrink: 0 }}>
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
