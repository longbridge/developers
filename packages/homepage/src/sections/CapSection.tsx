import React from 'react'
import type { Locale } from '@longbridge/openapi-utils'

const LOCALE = {
  en: {
    title: 'API Capabilities',
    subtitle: 'Everything you need to build trading and market data applications',
    caps: {
      quote: { name: 'Market Data', desc: 'Real-time quotes, order depth, candlestick, intraday, capital flow, and push subscriptions' },
      trade: { name: 'Trading & Orders', desc: 'Submit, replace, and withdraw orders. Track positions, balance, and execution history' },
      derivatives: { name: 'Derivatives', desc: 'Full option chains with Greeks, warrants listing, and real-time derivative quotes' },
      research: { name: 'Financial Research', desc: 'Financial statements, valuation metrics, dividend history, EPS forecasts, and analyst ratings' },
      content: { name: 'Content & News', desc: 'Real-time news feeds, community discussions, topics, and engagement metrics' },
    } as Record<string, { name: string; desc: string }>,
  },
  'zh-CN': {
    title: 'API 能力',
    subtitle: '构建交易和行情应用所需的一切',
    caps: {
      quote: { name: '行情数据', desc: '实时行情、盘口深度、K 线、分时、资金流向和推送订阅' },
      trade: { name: '交易下单', desc: '提交、修改、撤销订单，跟踪持仓、余额和成交记录' },
      derivatives: { name: '衍生品', desc: '完整期权链含 Greeks、窝轮列表和实时衍生品行情' },
      research: { name: '基本面研究', desc: '财务报表、估值指标、分红历史、EPS 预测和分析师评级' },
      content: { name: '资讯内容', desc: '实时新闻、社区讨论、话题帖子和互动数据' },
    } as Record<string, { name: string; desc: string }>,
  },
  'zh-HK': {
    title: 'API 能力',
    subtitle: '構建交易和行情應用所需的一切',
    caps: {
      quote: { name: '行情數據', desc: '即時行情、盤口深度、K 線、分時、資金流向和推送訂閱' },
      trade: { name: '交易下單', desc: '提交、修改、撤銷訂單，跟蹤持倉、餘額和成交記錄' },
      derivatives: { name: '衍生品', desc: '完整期權鏈含 Greeks、窩輪列表和即時衍生品行情' },
      research: { name: '基本面研究', desc: '財務報表、估值指標、分紅歷史、EPS 預測和分析師評級' },
      content: { name: '資訊內容', desc: '即時新聞、社區討論、話題帖子和互動數據' },
    } as Record<string, { name: string; desc: string }>,
  },
}

const caps = [
  {
    key: 'quote',
    link: '/docs/quote/overview',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    features: ['Real-time quotes', 'Order book depth', 'Candlestick charts', 'Intraday timeline', 'Capital flow', 'WebSocket push'],
    count: 30,
  },
  {
    key: 'trade',
    link: '/docs/trade/overview',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
    features: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
    count: 14,
  },
  {
    key: 'derivatives',
    link: '/docs/cli/derivatives/option',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>`,
    features: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
    count: 8,
  },
  {
    key: 'research',
    link: '/docs/cli/fundamentals/financial-report',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    features: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
    count: 7,
  },
  {
    key: 'content',
    link: '/docs/content/news',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="10" y1="6" x2="18" y2="6"/><line x1="10" y1="10" x2="18" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    features: ['News feeds', 'Community topics', 'Discussions', 'Engagement data'],
    count: 8,
  },
]

const CAP_CSS = `
.cap-section { padding: 4rem 0; background: var(--vp-c-bg); }
.cap-content { max-width: 64rem; margin: 0 auto; padding: 0 1.5rem; }
.cap-header { margin-bottom: 1.5rem; }
.cap-title { font-size: 1.75rem; font-weight: 700; color: var(--vp-c-text-1); letter-spacing: -0.02em; }
.cap-subtitle { margin-top: 1.5rem; color: var(--vp-c-text-2); }
.cap-compact { display: flex; flex-direction: column; gap: 0.5rem; }
.cc-card { display: flex; flex-direction: column; gap: 0.5rem; padding: 0.875rem 1rem; border-radius: 0.5rem; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); text-decoration: none !important; transition: border-color 0.2s; cursor: pointer; }
.cc-card:hover { border-color: color-mix(in srgb, var(--brand-color) 40%, var(--vp-c-divider)); }
.cc-top { display: flex; align-items: center; gap: 0.5rem; }
.cc-icon { display: flex; width: 1.125rem; height: 1.125rem; color: var(--vp-c-text-3); flex-shrink: 0; transition: color .2s; }
.cc-icon svg { width: 100%; height: 100%; }
.cc-card:hover .cc-icon { color: var(--brand-color); }
.cc-info { flex: 1; min-width: 0; }
.cc-name { font-weight: 700; color: var(--vp-c-text-1); display: block; }
.cc-desc { font-size: 0.75rem; color: var(--vp-c-text-3); display: block; margin-top: 0.1rem; }
.cc-count { font-size: 1.125rem; font-weight: 800; color: var(--brand-color); font-family: var(--vp-font-family-mono, monospace); flex-shrink: 0; }
.cc-tags { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.cc-tag { font-size: 0.62rem; font-weight: 500; padding: 0.1rem 0.375rem; border-radius: 0.1875rem; background: color-mix(in srgb, var(--vp-c-text-3) 6%, transparent); color: var(--vp-c-text-2); }
`

interface CapSectionProps {
  locale: Locale
}

export function CapSection({ locale }: CapSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CAP_CSS }} />
      <section data-lbus-component="cap-section" className="cap-section">
        <div className="cap-content">
          <div className="cap-header">
            <h2 className="cap-title">{content.title}</h2>
            <p className="cap-subtitle">{content.subtitle}</p>
          </div>
          <div className="cap-compact">
            {caps.map((cap) => (
              <a key={cap.key} href={cap.link} className="cc-card">
                <div className="cc-top">
                  <span
                    className="cc-icon"
                    dangerouslySetInnerHTML={{ __html: cap.icon }}
                  />
                  <div className="cc-info">
                    <span className="cc-name">{content.caps[cap.key]?.name}</span>
                    <span className="cc-desc">{content.caps[cap.key]?.desc}</span>
                  </div>
                  <span className="cc-count">{cap.count}+</span>
                </div>
                <div className="cc-tags">
                  {cap.features.map((f) => (
                    <span key={f} className="cc-tag">{f}</span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
