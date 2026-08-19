/* Features dropdown data — ported verbatim from legacy
   docs/.vitepress/theme/components/FeaturesMenu.vue lines 14-155.
   Keep three locales in lockstep. */

import type { Locale } from '@longbridge/openapi-utils'

export type FeatureItem = {
  title: string
  desc: string
  link: string
  /** SVG inner path markup (rendered inside a lucide-style 24×24 viewBox). */
  icon: string
}

const icons = {
  quote: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>`,
  kline: `<path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 19v2"/><path d="M17 3v2"/><rect width="4" height="8" x="15" y="5" rx="1"/><path d="M17 13v3"/>`,
  report: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>`,
  consensus: `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>`,
  news: `<path d="M4 3h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M8 7h8"/><path d="M8 11h8"/><path d="M8 15h5"/>`,
  filing: `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><circle cx="11.5" cy="14.5" r="2.5"/><path d="M13.25 16.25 15 18"/>`,
  investors: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
  option: `<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>`,
  order: `<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>`,
} as const

const en: FeatureItem[] = [
  { title: 'Live Market Quotes', desc: 'Live prices & order book depth for global markets', link: '/docs/quote/pull/quote', icon: icons.quote },
  { title: 'Price History', desc: 'OHLCV candlestick & intraday historical data', link: '/docs/quote/pull/history-candlestick', icon: icons.kline },
  { title: 'Financial Statements', desc: 'Earnings, balance sheet & cash flow data', link: '/docs/fundamental/fundamental/financial-report', icon: icons.report },
  { title: 'Analyst Estimates', desc: 'Consensus forecasts & institutional ratings', link: '/docs/fundamental/fundamental/consensus', icon: icons.consensus },
  { title: 'Company News', desc: 'Breaking news & market updates', link: '/docs/content/news/news', icon: icons.news },
  { title: 'SEC Filings', desc: 'Annual reports, earnings & regulatory documents', link: '/docs/quote/pull/filings', icon: icons.filing },
  { title: 'Institutional', desc: 'Fund holdings & position changes', link: '/docs/fundamental/fundamental/fund-holdings', icon: icons.investors },
  { title: 'Options & Warrants', desc: 'Derivatives pricing, chain & screening data', link: '/docs/quote/pull/option-quote', icon: icons.option },
  { title: 'Order Execution', desc: 'Trade orders, portfolio & account management', link: '/docs/trade/trade-overview', icon: icons.order },
]

const zhCN: FeatureItem[] = [
  { title: '实时行情报价', desc: '全球市场实时价格与盘口深度数据', link: '/docs/quote/pull/quote', icon: icons.quote },
  { title: '历史价格', desc: 'OHLCV K 线与日内历史行情数据', link: '/docs/quote/pull/history-candlestick', icon: icons.kline },
  { title: '财务报表', desc: '盈利、资产负债表与现金流量数据', link: '/docs/fundamental/fundamental/financial-report', icon: icons.report },
  { title: '分析师预测', desc: '机构评级与一致性盈利预期数据', link: '/docs/fundamental/fundamental/consensus', icon: icons.consensus },
  { title: '公司新闻', desc: '实时财经资讯与市场动态', link: '/docs/content/news/news', icon: icons.news },
  { title: '年报公告', desc: '年报、季报及监管申报文件', link: '/docs/quote/pull/filings', icon: icons.filing },
  { title: '机构持仓', desc: '基金持仓明细与仓位变动数据', link: '/docs/fundamental/fundamental/fund-holdings', icon: icons.investors },
  { title: '期权与权证', desc: '衍生品定价、期权链与筛选数据', link: '/docs/quote/pull/option-quote', icon: icons.option },
  { title: '委托交易', desc: '交易委托、组合管理与账户操作', link: '/docs/trade/trade-overview', icon: icons.order },
]

const zhHK: FeatureItem[] = [
  { title: '實時行情報價', desc: '全球市場實時價格與盤口深度數據', link: '/docs/quote/pull/quote', icon: icons.quote },
  { title: '歷史價格', desc: 'OHLCV K 線與日內歷史行情數據', link: '/docs/quote/pull/history-candlestick', icon: icons.kline },
  { title: '財務報表', desc: '盈利、資產負債表與現金流量數據', link: '/docs/fundamental/fundamental/financial-report', icon: icons.report },
  { title: '分析師預測', desc: '機構評級與一致性盈利預期數據', link: '/docs/fundamental/fundamental/consensus', icon: icons.consensus },
  { title: '公司新聞', desc: '實時財經資訊與市場動態', link: '/docs/content/news/news', icon: icons.news },
  { title: '年報財報', desc: '年報、季報及監管申報文件', link: '/docs/quote/pull/filings', icon: icons.filing },
  { title: '機構持倉', desc: '基金持倉明細與倉位變動數據', link: '/docs/fundamental/fundamental/fund-holdings', icon: icons.investors },
  { title: '期權與認股證', desc: '衍生品定價、期權鏈與篩選數據', link: '/docs/quote/pull/option-quote', icon: icons.option },
  { title: '委託交易', desc: '交易委託、組合管理與賬戶操作', link: '/docs/trade/trade-overview', icon: icons.order },
]

export function featuresForLocale(locale: Locale): FeatureItem[] {
  if (locale === 'zh-CN') return zhCN
  if (locale === 'zh-HK') return zhHK
  return en
}

/** Prefix path with locale (empty for 'en' — matches spec §-1 rules). */
export function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path
  return `/${locale}${path}`
}
