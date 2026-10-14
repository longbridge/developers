/**
 * Pricing.tsx
 * Port of Pricing.vue → React, for MDX pages.
 * Locale: detected at runtime from window.location.pathname; SSR default 'en'.
 * No AppNav / AppFooter — BaseLayout.astro already renders TopNav + Footer.
 */
import { useState, useMemo, useEffect } from 'react'
import './Pricing.css'

// ── Inline i18n ───────────────────────────────────────────────────────────────

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'PRICING',
      title1: 'Build for free.',
      title2: 'Pay only for real-time market data.',
      desc: 'Core API features — trading, accounts, fundamentals, <a href="https://longbridge.com/en/news">news</a> — are completely free. Subscribe to real-time <a href="https://longbridge.com/markets">market data</a> only when you need it.',
    },
    free: {
      price: 'Free',
      items: [
        { title: 'Trading & Account APIs', desc: 'Fundamentals, analysis, news, assets, orders — every core API is free.' },
        { title: 'Basic Market Data', desc: 'US LV1, HK LV1, CN LV1 — bundled with your account. <a href="https://longbridge.com/en/markets">View live market data</a> to see what\'s included.' },
        { title: 'Push & Pull Data', desc: 'WebSocket real-time push and REST API pull — unlimited.' },
      ],
    },
    realtime: {
      eyebrow: 'REAL-TIME MARKET DATA',
      title: 'Subscribe only to what you need.',
      desc: 'OpenAPI quote permissions are independent from App / PC / Web and must be purchased separately. Activate via <a href="https://longbridge.com/hk/en/download">Longbridge App</a> → Me → Quote Store.',
    },
    billing: { label: 'Billing' },
    cycle: { auto: 'Auto-renew', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual', badge: 'Best' },
    suffix: { mo: '/mo', quarter: '/quarter', year: '/year' },
    plan: {
      subscribe: 'Subscribe',
      was: 'Was',
      items: [
        { market: 'HK Market', name: 'HK LV2 Advanced', badge: 'Global (incl. HK)', tagline: 'HKEX real-time quotes with 10-level order book and broker queue.', coverage: 'HK market only (excludes US)', feats: ['10-level bid/ask depth', 'Real-time depth push', 'Broker queue (HK)'] },
        { market: 'US Options', name: 'OPRA US Options', badge: '', tagline: 'US options real-time quotes with best bid/ask — sold separately, any tier.', coverage: 'Adds onto any tier', feats: ['Option chain lookup', 'Real-time option quotes', 'Option quote push'] },
      ],
    },
    comparison: {
      eyebrow: 'FEATURE COMPARISON',
      title: "What's included in each plan.",
      plans: [
        { label: 'US LV1', tag: 'Free', color: 'var(--lb-market-us)' },
        { label: 'OPRA', tag: 'Paid', color: 'var(--lb-ai-mention)' },
        { label: 'HK LV1', tag: 'Free (promo)', color: 'var(--lb-up)' },
        { label: 'HK LV2', tag: 'Paid', color: 'var(--lb-market-hk)' },
        { label: 'CN LV1', tag: 'Free (promo)', color: 'var(--lb-up)' },
      ],
      matrix: [
        { f: 'Basic APIs', g: 'Core' },
        { f: 'WebSocket real-time push', g: 'Core' },
        { f: 'Pull quote (REST)', g: 'Core' },
        { f: 'US best bid/ask', g: 'US' },
        { f: 'Pre / post-market', g: 'US' },
        { f: 'Overnight (night session)', g: 'US' },
        { f: 'Option chain & real-time quotes', g: 'Options' },
        { f: 'HK real-time (basic)', g: 'HK' },
        { f: 'Hang Seng Index', g: 'HK' },
        { f: 'HK 10-level order book', g: 'HK' },
        { f: 'Real-time depth push', g: 'HK' },
        { f: 'Broker queue (HK)', g: 'HK' },
        { f: 'CN A-shares real-time\n (China mainland IP only; other regions: 15-min delay)', g: 'CN' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        { q: 'Are OpenAPI quote subscriptions separate from the App?', a: 'Yes. OpenAPI quote permissions are independent from App / PC / Web. Activate via <a href="https://longbridge.com/hk/en/download">Longbridge App</a> → Me → Quote Store.' },
        { q: 'Do I need a subscription to test the API?', a: 'No. Trading, account, and fundamentals APIs are free. You can also use Basic Market Data tiers (US LV1, HK LV1, CN LV1) for free.' },
        { q: 'Can I cancel anytime?', a: 'Yes. Cancel any time before the next billing cycle. Quote permissions stay active until the end of the paid period.' },
        { q: 'What about paper trading?', a: 'Paper trading runs against the canary environment with simulated matching on live bid-ask spreads. Free for all <a href="https://longbridge.com/hk/en/download">integrated accounts</a> — no quote subscription required.' },
        { q: 'Are there usage limits on REST or WebSocket?', a: 'No hard usage caps. Rate limits scale with your account tier. See the Rate Limits doc for details.' },
        { q: 'What payment methods are accepted?', a: 'All payments are processed through your <a href="https://longbridge.com/hk/en/download">Longbridge account</a>. Settled in HKD; cross-currency settled at exchange-rate.' },
      ],
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: '定价',
      title1: '免费开始构建。',
      title2: '仅为实时行情数据付费。',
      desc: '交易、账户、基本面、<a href="https://longbridge.com/en/news">资讯</a>等核心 API 功能完全免费。仅在需要时订阅实时<a href="https://longbridge.com/markets">行情数据</a>。',
    },
    free: {
      price: '免费',
      items: [
        { title: '交易与账户 API', desc: '基本面、分析、资讯、资产、订单——所有核心 API 均免费。' },
        { title: '基础行情数据', desc: '美股 LV1、港股一档、A 股一档——随账户附赠。<a href="https://longbridge.com/en/markets">查看实时行情</a>了解包含内容。' },
        { title: '推送与拉取数据', desc: 'WebSocket 实时推送与 REST API 拉取——无限制。' },
      ],
    },
    realtime: {
      eyebrow: '实时行情数据',
      title: '只订阅您需要的数据。',
      desc: 'OpenAPI 行情权限与 App / PC / Web 独立，需单独购买。通过<a href="https://longbridge.com/hk/en/download">长桥 App</a> → 我的 → 行情商店开通。',
    },
    billing: { label: '计费周期' },
    cycle: { auto: '自动续订', monthly: '月付', quarterly: '季付', annual: '年付', badge: '最优' },
    suffix: { mo: '/月', quarter: '/季', year: '/年' },
    plan: {
      subscribe: '立即订阅',
      was: '原价',
      items: [
        { market: '港股市场', name: 'HK LV2 高级行情', badge: '全球（含港股）', tagline: '港交所实时行情，含 10 档买卖盘及券商队列。', coverage: '仅限港股市场（不含美股）', feats: ['10 档买卖盘深度', '实时深度推送', '券商队列（港股）'] },
        { market: '美股期权', name: 'OPRA 美股期权', badge: '', tagline: '美股期权实时行情含最优买卖价——独立出售，适用任何套餐。', coverage: '可叠加任意套餐', feats: ['期权链查询', '实时期权行情', '期权行情推送'] },
      ],
    },
    comparison: {
      eyebrow: '功能对比',
      title: '各方案功能一览。',
      plans: [
        { label: '美股 LV1', tag: '免费', color: 'var(--lb-market-us)' },
        { label: 'OPRA', tag: '付费', color: 'var(--lb-ai-mention)' },
        { label: '港股 LV1', tag: '推广免费', color: 'var(--lb-up)' },
        { label: '港股 LV2', tag: '付费', color: 'var(--lb-market-hk)' },
        { label: 'A 股 LV1', tag: '推广免费', color: 'var(--lb-up)' },
      ],
      matrix: [
        { f: '基础 API', g: '核心' },
        { f: 'WebSocket 实时推送', g: '核心' },
        { f: '拉取行情（REST）', g: '核心' },
        { f: '美股最优买卖价', g: '美股' },
        { f: '盘前、盘中、盘后行情', g: '美股' },
        { f: '夜盘行情', g: '美股' },
        { f: '期权链与实时期权行情', g: '期权' },
        { f: '港股实时（基础）', g: '港股' },
        { f: '恒生指数', g: '港股' },
        { f: '港股 10 档买卖盘', g: '港股' },
        { f: '实时深度推送', g: '港股' },
        { f: '券商队列（港股）', g: '港股' },
        { f: 'A 股实时行情\n（受交易所规则限制，仅限中国大陆 IP；其他地区延迟 15 分钟）', g: 'A 股' },
      ],
    },
    faq: {
      eyebrow: '常见问题',
      title: '常见问题解答',
      items: [
        { q: 'OpenAPI 行情订阅与 App 是否独立？', a: '是的。OpenAPI 行情权限与 App / PC / Web 完全独立。通过<a href="https://longbridge.com/hk/en/download">长桥 App</a> → 我的 → 行情商店开通。' },
        { q: '测试 API 需要订阅吗？', a: '不需要。交易、账户和基本面 API 均免费。您也可以免费使用基础行情（美股 LV1、港股 LV1、A 股 LV1）。' },
        { q: '可以随时取消吗？', a: '可以。在下一个计费周期前随时取消。行情权限在已付费周期结束前持续有效。' },
        { q: '模拟交易如何使用？', a: '模拟交易基于 canary 环境运行，以实时买卖价差进行模拟撮合。所有<a href="https://longbridge.com/hk/en/download">综合账户</a>均免费，无需行情订阅。' },
        { q: 'REST 或 WebSocket 有使用限制吗？', a: '没有硬性使用上限。频率限制随账户等级调整。详情请参阅频率限制文档。' },
        { q: '支持哪些付款方式？', a: '所有付款均通过<a href="https://longbridge.com/hk/en/download">长桥账户</a>处理，以港元结算；跨币种按汇率换算。' },
      ],
    },
  },
  'zh-HK': {
    hero: {
      eyebrow: '定價',
      title1: '免費開始構建。',
      title2: '僅為即時行情數據付費。',
      desc: '交易、帳戶、基本面、<a href="https://longbridge.com/en/news">資訊</a>等核心 API 功能完全免費。僅在需要時訂閱即時<a href="https://longbridge.com/markets">行情數據</a>。',
    },
    free: {
      price: '免費',
      items: [
        { title: '交易與帳戶 API', desc: '基本面、分析、資訊、資產、訂單——所有核心 API 均免費。' },
        { title: '基礎行情數據', desc: '美股 LV1、港股一檔、A 股一檔——隨帳戶附贈。<a href="https://longbridge.com/en/markets">查看即時行情</a>了解包含內容。' },
        { title: '推送與拉取數據', desc: 'WebSocket 即時推送與 REST API 拉取——無限制。' },
      ],
    },
    realtime: {
      eyebrow: '即時行情數據',
      title: '只訂閱您需要的數據。',
      desc: 'OpenAPI 行情權限與 App / PC / Web 獨立，需單獨購買。透過<a href="https://longbridge.com/hk/en/download">長橋 App</a> → 我的 → 行情商店開通。',
    },
    billing: { label: '計費週期' },
    cycle: { auto: '自動續訂', monthly: '月付', quarterly: '季付', annual: '年付', badge: '最優' },
    suffix: { mo: '/月', quarter: '/季', year: '/年' },
    plan: {
      subscribe: '立即訂閱',
      was: '原價',
      items: [
        { market: '港股市場', name: 'HK LV2 高級行情', badge: '全球（含港股）', tagline: '港交所即時行情，含 10 檔買賣盤及券商隊列。', coverage: '僅限港股市場（不含美股）', feats: ['10 檔買賣盤深度', '即時深度推送', '券商隊列（港股）'] },
        { market: '美股期權', name: 'OPRA 美股期權', badge: '', tagline: '美股期權即時行情含最優買賣價——獨立出售，適用任何套餐。', coverage: '可疊加任意套餐', feats: ['期權鏈查詢', '即時期權行情', '期權行情推送'] },
      ],
    },
    comparison: {
      eyebrow: '功能對比',
      title: '各方案功能一覽。',
      plans: [
        { label: '美股 LV1', tag: '免費', color: 'var(--lb-market-us)' },
        { label: 'OPRA', tag: '付費', color: 'var(--lb-ai-mention)' },
        { label: '港股 LV1', tag: '推廣免費', color: 'var(--lb-up)' },
        { label: '港股 LV2', tag: '付費', color: 'var(--lb-market-hk)' },
        { label: 'A 股 LV1', tag: '推廣免費', color: 'var(--lb-up)' },
      ],
      matrix: [
        { f: '基礎 API', g: '核心' },
        { f: 'WebSocket 即時推送', g: '核心' },
        { f: '拉取行情（REST）', g: '核心' },
        { f: '美股最優買賣價', g: '美股' },
        { f: '盤前、盤中、盤後行情', g: '美股' },
        { f: '夜盤行情', g: '美股' },
        { f: '期權鏈與即時期權行情', g: '期權' },
        { f: '港股即時（基礎）', g: '港股' },
        { f: '恒生指數', g: '港股' },
        { f: '港股 10 檔買賣盤', g: '港股' },
        { f: '即時深度推送', g: '港股' },
        { f: '券商隊列（港股）', g: '港股' },
        { f: 'A 股即時行情\n（受交易所規則限制，僅限中國大陸 IP；其他地區延遲 15 分鐘）', g: 'A 股' },
      ],
    },
    faq: {
      eyebrow: '常見問題',
      title: '常見問題解答',
      items: [
        { q: 'OpenAPI 行情訂閱與 App 是否獨立？', a: '是的。OpenAPI 行情權限與 App / PC / Web 完全獨立。透過<a href="https://longbridge.com/hk/en/download">長橋 App</a> → 我的 → 行情商店開通。' },
        { q: '測試 API 需要訂閱嗎？', a: '不需要。交易、帳戶和基本面 API 均免費。您也可以免費使用基礎行情（美股 LV1、港股 LV1、A 股 LV1）。' },
        { q: '可以隨時取消嗎？', a: '可以。在下一個計費週期前隨時取消。行情權限在已付費週期結束前持續有效。' },
        { q: '模擬交易如何使用？', a: '模擬交易基於 canary 環境運行，以即時買賣價差進行模擬撮合。所有<a href="https://longbridge.com/hk/en/download">綜合帳戶</a>均免費，無需行情訂閱。' },
        { q: 'REST 或 WebSocket 有使用限制嗎？', a: '沒有硬性使用上限。頻率限制隨帳戶等級調整。詳情請參閱頻率限制文件。' },
        { q: '支援哪些付款方式？', a: '所有付款均透過<a href="https://longbridge.com/hk/en/download">長橋帳戶</a>處理，以港元結算；跨幣種按匯率換算。' },
      ],
    },
  },
} as const

// ── Static data ───────────────────────────────────────────────────────────────

interface PlanCycle {
  price: number
  discount?: number
  approxMo?: number
}

const PAID_PLANS = [
  {
    id: 'hk-lv2',
    currency: 'HK$',
    color: 'var(--lb-market-hk)',
    hasBadge: true,
    cycles: {
      auto: { price: 558, discount: 22 },
      monthly: { price: 718 },
      quarterly: { price: 1428, discount: 34, approxMo: 476 },
      annual: { price: 5288, discount: 39, approxMo: 441 },
    } as Record<string, PlanCycle>,
  },
  {
    id: 'opra',
    currency: 'HK$',
    color: 'var(--lb-ai-mention)',
    hasBadge: false,
    cycles: {
      auto: { price: 22, discount: 45 },
      monthly: { price: 40 },
      quarterly: { price: 83, discount: 31, approxMo: 28 },
      annual: { price: 269, discount: 44, approxMo: 22 },
    } as Record<string, PlanCycle>,
  },
]

const FREE_ICONS = [
  { icon: 'shield', color: 'var(--lb-up)' },
  { icon: 'chart', color: 'var(--lb-status-neutral)' },
  { icon: 'bolt', color: 'var(--lb-brand)' },
]

const BILLING_CYCLES = [
  { key: 'auto' },
  { key: 'monthly' },
  { key: 'quarterly' },
  { key: 'annual', badge: true },
]

const MATRIX_ROW_DATA = [
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 1, 0],
  [0, 0, 0, 0, 1],
]

// ── SVG icons ─────────────────────────────────────────────────────────────────

const ShieldIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
)

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
  </svg>
)

const GlobeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--lb-fg-3)', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
  </svg>
)

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="var(--lb-up)" fillOpacity="0.15" />
    <path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="var(--lb-up)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// ── Helper ────────────────────────────────────────────────────────────────────

function getPlanCycle(plan: { cycles: Record<string, PlanCycle> }, cycleKey: string): PlanCycle {
  return plan.cycles[cycleKey] ?? plan.cycles.monthly
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Pricing({ locale: initialLocale = 'en' }: { locale?: 'en' | 'zh-CN' | 'zh-HK' } = {}) {
  const [locale, setLocale] = useState<'en' | 'zh-CN' | 'zh-HK'>(initialLocale)
  const [cycle, setCycle] = useState('auto')

  // Detect locale from URL pathname on client (fallback / safety net)
  useEffect(() => {
    const path = window.location.pathname
    if (path.includes('/zh-CN/')) setLocale('zh-CN')
    else if (path.includes('/zh-HK/')) setLocale('zh-HK')
    else setLocale('en')
  }, [])

  const content = useMemo(() => LOCALE[locale], [locale])

  const cycleSuffix = useMemo(() => {
    if (cycle === 'quarterly') return content.suffix.quarter
    if (cycle === 'annual') return content.suffix.year
    return content.suffix.mo
  }, [cycle, content])

  const cycleLabels = useMemo<Record<string, string>>(
    () => ({
      auto: content.cycle.auto,
      monthly: content.cycle.monthly,
      quarterly: content.cycle.quarterly,
      annual: content.cycle.annual,
    }),
    [content]
  )

  const freeItems = useMemo(
    () => content.free.items.map((item, i) => ({ ...item, ...FREE_ICONS[i] })),
    [content]
  )

  const plans = useMemo(
    () => PAID_PLANS.map((p, i) => ({ ...p, ...content.plan.items[i] })),
    [content]
  )

  interface MatrixRow {
    type: 'group' | 'row'
    label?: string
    f?: string
    row?: number[]
  }

  const matrixRows = useMemo<MatrixRow[]>(() => {
    const result: MatrixRow[] = []
    let lastGroup = ''
    for (let i = 0; i < content.comparison.matrix.length; i++) {
      const m = content.comparison.matrix[i]
      if (m.g !== lastGroup) {
        result.push({ type: 'group', label: m.g })
        lastGroup = m.g
      }
      result.push({ type: 'row', f: m.f, row: MATRIX_ROW_DATA[i] })
    }
    return result
  }, [content])

  return (
    <div className="page-root pricing-page-root" data-lbus-component="pricing">
      {/* Hero */}
      <section className="pricing-hero">
        <div className="pricing-hero-bg" />
        <div className="section-inner pricing-hero-inner">
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
            <span className="eyebrow">{content.hero.eyebrow}</span>
            <h1 className="h-display" style={{ marginTop: '20px', fontSize: 'clamp(40px, 5vw, 60px)' }}>
              {content.hero.title1}
              <br />
              <span style={{ color: 'var(--lb-brand)' }}>{content.hero.title2}</span>
            </h1>
            <p
              className="t-body"
              style={{ marginTop: '20px', maxWidth: '580px', marginLeft: 'auto', marginRight: 'auto' }}
              dangerouslySetInnerHTML={{ __html: content.hero.desc }}
            />
          </div>
        </div>
      </section>

      {/* Free Baseline */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="section-inner">
          <div className="pricing-free-grid">
            {freeItems.map((item) => (
              <div key={item.title} className="pricing-free-card">
                <div className="pricing-free-head">
                  <div
                    className="pricing-free-icon"
                    style={{
                      background: `color-mix(in srgb, ${item.color} 14%, transparent)`,
                      color: item.color,
                    }}
                  >
                    {item.icon === 'shield' && <ShieldIcon />}
                    {item.icon === 'chart' && <ChartIcon />}
                    {item.icon === 'bolt' && <BoltIcon />}
                  </div>
                  <span className="pricing-free-price">{content.free.price}</span>
                </div>
                <h3 className="h-card" style={{ marginTop: '16px' }}>{item.title}</h3>
                <p
                  className="t-meta"
                  style={{ marginTop: '8px', lineHeight: '1.55' }}
                  dangerouslySetInnerHTML={{ __html: item.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Paid Plans */}
      <section className="section" style={{ paddingTop: '32px' }}>
        <div className="section-inner">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            <div style={{ maxWidth: '520px' }}>
              <span className="eyebrow">{content.realtime.eyebrow}</span>
              <h2 className="h-section" style={{ marginTop: '14px' }}>{content.realtime.title}</h2>
              <p
                className="t-meta"
                style={{ marginTop: '10px', lineHeight: '1.55' }}
                dangerouslySetInnerHTML={{ __html: content.realtime.desc }}
              />
            </div>

            <div className="pricing-cycle">
              <span className="pricing-cycle-label">{content.billing.label}</span>
              <div className="pricing-cycle-tabs">
                {BILLING_CYCLES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`pricing-cycle-tab${cycle === c.key ? ' is-active' : ''}`}
                    onClick={() => setCycle(c.key)}
                  >
                    {cycleLabels[c.key]}
                    {c.badge && (
                      <span className="pricing-cycle-badge">{content.cycle.badge}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pricing-plans-grid">
            {plans.map((p) => {
              const pc = getPlanCycle(p, cycle)
              return (
                <div key={p.id} className="pricing-plan-card">
                  <div className="pricing-plan-head">
                    <span
                      className="pricing-plan-market"
                      style={{
                        color: p.color,
                        background: `color-mix(in srgb, ${p.color} 12%, transparent)`,
                      }}
                    >
                      {p.market}
                    </span>
                    {p.badge && <span className="pricing-plan-badge">{p.badge}</span>}
                  </div>
                  <h3 className="pricing-plan-name">{p.name}</h3>
                  <div className="pricing-plan-price">
                    <span className="pricing-plan-cur">{p.currency}</span>
                    <span className="pricing-plan-num">{pc.price}</span>
                    <span className="pricing-plan-suf">{cycleSuffix}</span>
                    {pc.discount && (
                      <span className="pricing-plan-discount">-{pc.discount}%</span>
                    )}
                  </div>
                  {pc.approxMo ? (
                    <div className="pricing-plan-approx">
                      ≈{p.currency}{pc.approxMo}{content.suffix.mo}
                    </div>
                  ) : pc.discount ? (
                    <div className="pricing-plan-was">
                      {content.plan.was} <s>{p.currency}{p.cycles.monthly.price}{content.suffix.mo}</s>
                    </div>
                  ) : null}
                  <p className="pricing-plan-tag">{p.tagline}</p>
                  <div className="pricing-plan-cov">
                    <GlobeIcon />
                    {p.coverage}
                  </div>
                  <ul className="pricing-plan-feats">
                    {p.feats.map((feat) => (
                      <li key={feat}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12l4.5 4.5 9.5-9.5"
                            stroke={p.color}
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    className="btn btn-primary pricing-plan-cta"
                    href="https://longbridge.com/download"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.plan.subscribe}
                    <ArrowIcon />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="section" style={{ paddingTop: '48px', paddingBottom: '80px' }}>
        <div className="section-inner">
          <div style={{ maxWidth: '540px', marginBottom: '24px' }}>
            <span className="eyebrow">{content.comparison.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: '14px' }}>{content.comparison.title}</h2>
          </div>
          <div className="pricing-matrix-wrap">
            <table className="pricing-matrix">
              <thead>
                <tr>
                  <th className="pricing-matrix-feat-h"></th>
                  {content.comparison.plans.map((p) => (
                    <th key={p.label}>
                      <div className="pricing-matrix-col">
                        <span className="pricing-matrix-plan" style={{ color: p.color }}>{p.label}</span>
                        <span className="pricing-matrix-tag">{p.tag}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map((r, idx) =>
                  r.type === 'group' ? (
                    <tr key={`group-${r.label}-${idx}`} className="pricing-matrix-group">
                      <td colSpan={content.comparison.plans.length + 1}>{r.label}</td>
                    </tr>
                  ) : (
                    <tr key={`row-${r.f}-${idx}`}>
                      <td className="pricing-matrix-feat">{r.f}</td>
                      {r.row!.map((v, j) => (
                        <td key={j} className="pricing-matrix-cell">
                          {v ? (
                            <CheckCircleIcon />
                          ) : (
                            <span style={{ color: 'var(--lb-fg-3)' }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ borderTop: '1px solid var(--app-card-stroke)', background: 'var(--app-canvas)' }}>
        <div className="section-inner">
          <div style={{ maxWidth: '560px', marginBottom: '32px' }}>
            <span className="eyebrow">{content.faq.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: '14px' }}>{content.faq.title}</h2>
          </div>
          <div className="pricing-faq-grid">
            {content.faq.items.map((item) => (
              <div key={item.q} className="pricing-faq-card">
                <h4 className="pricing-faq-q">{item.q}</h4>
                <p className="pricing-faq-a" dangerouslySetInnerHTML={{ __html: item.a }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
