<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import AppNav from './AppNav.vue'
import AppFooter from './AppFooter.vue'

const { lang } = useData()

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'PRICING',
      title1: 'Build for free.',
      title2: 'Pay only for real-time market data.',
      desc: 'Core API features — trading, accounts, fundamentals, <a href="https://longbridge.com/news">news</a> — are completely free. Subscribe to real-time market data only when you need it.',
    },
    free: {
      price: 'Free',
      items: [
        {
          title: 'Trading & Account APIs',
          desc: 'Fundamentals, analysis, news, assets, orders — every core API is free.',
        },
        { title: 'Real-time Market Data', desc: 'US LV1, HK Level 1, CN Level 1 real-time quotes — included free on registration. <a href="https://longbridge.com/markets">View live market data</a> to see what\'s included.' },
        { title: 'Push & Pull Data', desc: 'WebSocket real-time push and REST API pull — unlimited.' },
      ],
    },
    realtime: {
      eyebrow: 'REAL-TIME MARKET DATA',
      title: 'Subscribe only to what you need.',
      desc: 'OpenAPI quote permissions are independent from App / PC / Web. US LV1 is free on registration; subscribe to the rest as needed via Activate via <a href="https://longbridge.com/hk/download">Longbridge App</a> → Me → Quote Store.',
    },
    billing: { label: 'Billing' },
    cycle: {
      auto: 'Auto-renew',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      annual: 'Annual',
      badge: 'Best',
    },
    suffix: { mo: '/mo', quarter: '/quarter', year: '/year' },
    plan: {
      subscribe: 'Subscribe',
      was: 'Was',
      items: [
        {
          market: 'US Market',
          name: 'US LV1 Real-time',
          badge: '',
          tagline: 'US LV1 real-time quotes with best bid/ask across pre-market, regular, after-hours, and overnight sessions.',
          coverage: 'US market only',
          feats: ['US LV1 real-time quotes', 'Pre / post-market & overnight', 'WebSocket real-time push'],
        },
        {
          market: 'HK Market',
          name: 'HK LV2 Advanced',
          badge: 'Global (incl. HK)',
          tagline: 'HKEX real-time quotes with 10-level order book and broker queue.',
          coverage: 'HK market only (excludes US)',
          feats: ['10-level bid/ask depth', 'Real-time depth push', 'Broker queue (HK)'],
        },
        {
          market: 'US Options',
          name: 'OPRA US Options',
          badge: '',
          tagline: 'US options real-time quotes with best bid/ask — sold separately, any tier.',
          coverage: 'Adds onto any tier',
          feats: ['Option chain lookup', 'Real-time option quotes', 'Option quote push'],
        },
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
        { f: 'CN A-shares real-time', g: 'CN' },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'Are OpenAPI quote subscriptions separate from the App?',
          a: 'Yes. OpenAPI quote permissions are independent from App / PC / Web. Activate via Longbridge App → Me → Quote Store.',
        },
        {
          q: 'Do I need a subscription to test the API?',
          a: 'No. Trading, account, and fundamentals APIs are free. US LV1, HK LV1, and CN LV1 real-time quotes are also free on registration.',
        },
        {
          q: 'Can I cancel anytime?',
          a: 'Yes. Cancel any time before the next billing cycle. Quote permissions stay active until the end of the paid period.',
        },
        {
          q: 'What about paper trading?',
          a: 'Paper trading runs against the canary environment with simulated matching on live bid-ask spreads. Free for all <a href="https://longbridge.com/hk/download">integrated accounts</a> — no quote subscription required.',
        },
        {
          q: 'Are there usage limits on REST or WebSocket?',
          a: 'No hard usage caps. Rate limits scale with your account tier. See the Rate Limits doc for details.',
        },
        {
          q: 'What payment methods are accepted?',
          a: 'All payments are processed through your Longbridge account. Settled in HKD; cross-currency settled at exchange-rate.',
        },
      ],
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: '定价',
      title1: '免费开始构建',
      title2: '仅为实时行情数据付费',
      desc: '交易、账户、基本面、<a href="https://longbridge.com/news">资讯</a>等核心 API 功能完全免费。仅在需要时订阅实时行情数据。',
    },
    free: {
      price: '免费',
      items: [
        { title: '交易与账户 API', desc: '基本面、分析、资讯、资产、订单——所有核心 API 均免费。' },
        { title: '实时行情数据', desc: '美股 LV1、港股一档、A 股一档实时行情——注册即免费赠送。<a href="https://longbridge.com/markets">查看实时行情</a>了解包含内容。' },
        { title: '推送与拉取数据', desc: 'WebSocket 实时推送与 REST API 拉取——无限制。' },
      ],
    },
    realtime: {
      eyebrow: '实时行情数据',
      title: '只订阅您需要的数据',
      desc: 'OpenAPI 行情权限与 App / PC / Web 独立。US LV1 注册即免费赠送，其余按需通过<a href="https://longbridge.com/hk/download">长桥 App</a> → 我的 → 行情商店开通。',
    },
    billing: { label: '计费周期' },
    cycle: {
      auto: '自动续订',
      monthly: '月付',
      quarterly: '季付',
      annual: '年付',
      badge: '最优',
    },
    suffix: { mo: '/月', quarter: '/季', year: '/年' },
    plan: {
      subscribe: '立即订阅',
      was: '原价',
      items: [
        {
          market: '美股市场',
          name: 'US LV1 实时行情',
          badge: '',
          tagline: '美股 LV1 实时行情，含最优买卖价及盘前、盘中、盘后、夜盘全时段。',
          coverage: '仅限美股市场',
          feats: ['美股 LV1 实时行情', '盘前/盘后及夜盘', 'WebSocket 实时推送'],
        },
        {
          market: '港股市场',
          name: 'HK LV2 高级行情',
          badge: '全球（含港股）',
          tagline: '港交所实时行情，含 10 档买卖盘及券商队列。',
          coverage: '仅限港股市场（不含美股）',
          feats: ['10 档买卖盘深度', '实时深度推送', '券商队列（港股）'],
        },
        {
          market: '美股期权',
          name: 'OPRA 美股期权',
          badge: '',
          tagline: '美股期权实时行情含最优买卖价——独立出售，适用任何套餐。',
          coverage: '可叠加任意套餐',
          feats: ['期权链查询', '实时期权行情', '期权行情推送'],
        },
      ],
    },
    comparison: {
      eyebrow: '功能对比',
      title: '各方案功能一览',
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
        { f: 'A 股实时行情', g: 'A 股' },
      ],
    },
    faq: {
      eyebrow: '常见问题',
      title: '常见问题解答',
      items: [
        {
          q: 'OpenAPI 行情订阅与 App 是否独立？',
          a: '是的。OpenAPI 行情权限与 App / PC / Web 完全独立。通过长桥 App → 我的 → 行情商店开通。',
        },
        {
          q: '测试 API 需要订阅吗？',
          a: '不需要。交易、账户和基本面 API 均免费。美股 LV1、港股 LV1、A 股 LV1 实时行情也注册即免费赠送。',
        },
        { q: '可以随时取消吗？', a: '可以。在下一个计费周期前随时取消。行情权限在已付费周期结束前持续有效。' },
        {
          q: '模拟交易如何使用？',
          a: '模拟交易基于 canary 环境运行，以实时买卖价差进行模拟撮合。所有<a href="https://longbridge.com/hk/download">综合账户</a>均免费，无需行情订阅。',
        },
        {
          q: 'REST 或 WebSocket 有使用限制吗？',
          a: '没有硬性使用上限。频率限制随账户等级调整。详情请参阅频率限制文档。',
        },
        { q: '支持哪些付款方式？', a: '所有付款均通过长桥账户处理，以港元结算；跨币种按汇率换算。' },
      ],
    },
  },
  'zh-HK': {
    hero: {
      eyebrow: '定價',
      title1: '免費開始構建。',
      title2: '僅為即時行情數據付費。',
      desc: '交易、帳戶、基本面、<a href="https://longbridge.com/news">資訊</a>等核心 API 功能完全免費。僅在需要時訂閱即時行情數據。',
    },
    free: {
      price: '免費',
      items: [
        { title: '交易與帳戶 API', desc: '基本面、分析、資訊、資產、訂單——所有核心 API 均免費。' },
        { title: '即時行情數據', desc: '美股 LV1、港股一檔、A 股一檔即時行情——註冊即免費贈送。<a href="https://longbridge.com/markets">查看即時行情</a>了解包含內容。' },
        { title: '推送與拉取數據', desc: 'WebSocket 即時推送與 REST API 拉取——無限制。' },
      ],
    },
    realtime: {
      eyebrow: '即時行情數據',
      title: '只訂閱您需要的數據。',
      desc: 'OpenAPI 行情權限與 App / PC / Web 獨立。US LV1 註冊即免費贈送，其餘按需透過<a href="https://longbridge.com/hk/download">長橋 App</a> → 我的 → 行情商店開通。',
    },
    billing: { label: '計費週期' },
    cycle: {
      auto: '自動續訂',
      monthly: '月付',
      quarterly: '季付',
      annual: '年付',
      badge: '最優',
    },
    suffix: { mo: '/月', quarter: '/季', year: '/年' },
    plan: {
      subscribe: '立即訂閱',
      was: '原價',
      items: [
        {
          market: '美股市場',
          name: 'US LV1 即時行情',
          badge: '',
          tagline: '美股 LV1 即時行情，含最優買賣價及盤前、盤中、盤後、夜盤全時段。',
          coverage: '僅限美股市場',
          feats: ['美股 LV1 即時行情', '盤前/盤後及夜盤', 'WebSocket 即時推送'],
        },
        {
          market: '港股市場',
          name: 'HK LV2 高級行情',
          badge: '全球（含港股）',
          tagline: '港交所即時行情，含 10 檔買賣盤及券商隊列。',
          coverage: '僅限港股市場（不含美股）',
          feats: ['10 檔買賣盤深度', '即時深度推送', '券商隊列（港股）'],
        },
        {
          market: '美股期權',
          name: 'OPRA 美股期權',
          badge: '',
          tagline: '美股期權即時行情含最優買賣價——獨立出售，適用任何套餐。',
          coverage: '可疊加任意套餐',
          feats: ['期權鏈查詢', '即時期權行情', '期權行情推送'],
        },
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
        { f: 'A 股即時行情', g: 'A 股' },
      ],
    },
    faq: {
      eyebrow: '常見問題',
      title: '常見問題解答',
      items: [
        {
          q: 'OpenAPI 行情訂閱與 App 是否獨立？',
          a: '是的。OpenAPI 行情權限與 App / PC / Web 完全獨立。透過長橋 App → 我的 → 行情商店開通。',
        },
        {
          q: '測試 API 需要訂閱嗎？',
          a: '不需要。交易、帳戶和基本面 API 均免費。美股 LV1、港股 LV1、A 股 LV1 即時行情也註冊即免費贈送。',
        },
        { q: '可以隨時取消嗎？', a: '可以。在下一個計費週期前隨時取消。行情權限在已付費週期結束前持續有效。' },
        {
          q: '模擬交易如何使用？',
          a: '模擬交易基於 canary 環境運行，以即時買賣價差進行模擬撮合。所有<a href="https://longbridge.com/hk/download">綜合帳戶</a>均免費，無需行情訂閱。',
        },
        {
          q: 'REST 或 WebSocket 有使用限制嗎？',
          a: '沒有硬性使用上限。頻率限制隨帳戶等級調整。詳情請參閱頻率限制文件。',
        },
        { q: '支援哪些付款方式？', a: '所有付款均透過長橋帳戶處理，以港元結算；跨幣種按匯率換算。' },
      ],
    },
  },
}

interface PlanCycle {
  price: number
  discount?: number
  approxMo?: number
}

const PAID_PLANS = [
  {
    id: 'us-lv1',
    currency: 'HK$',
    color: 'var(--lb-market-us)',
    hasBadge: false,
    free: true,
    cycles: {
      auto: { price: 558, discount: 22 },
      monthly: { price: 718 },
      quarterly: { price: 1748, discount: 19, approxMo: 583 },
      annual: { price: 5788, discount: 33, approxMo: 482 },
    } as Record<string, PlanCycle>,
  },
  {
    id: 'hk-lv2',
    currency: 'HK$',
    color: 'var(--lb-market-hk)',
    hasBadge: true,
    free: false,
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
    free: false,
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

const BILLING_CYCLES = [{ key: 'auto' }, { key: 'monthly' }, { key: 'quarterly' }, { key: 'annual', badge: true }]

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

const cycle = ref('auto')
const content = computed(() => LOCALE[lang.value as keyof typeof LOCALE] ?? LOCALE.en)

const cycleSuffix = computed(() => {
  if (cycle.value === 'quarterly') return content.value.suffix.quarter
  if (cycle.value === 'annual') return content.value.suffix.year
  return content.value.suffix.mo
})

const cycleLabels = computed<Record<string, string>>(() => ({
  auto: content.value.cycle.auto,
  monthly: content.value.cycle.monthly,
  quarterly: content.value.cycle.quarterly,
  annual: content.value.cycle.annual,
}))

const freeItems = computed(() => content.value.free.items.map((item, i) => ({ ...item, ...FREE_ICONS[i] })))

const plans = computed(() => PAID_PLANS.map((p, i) => ({ ...p, ...content.value.plan.items[i] })))

function planCycle(plan: { cycles: Record<string, PlanCycle> }): PlanCycle {
  return plan.cycles[cycle.value] ?? plan.cycles.monthly
}

interface MatrixRow {
  type: 'group' | 'row'
  label?: string
  f?: string
  row?: number[]
}
const matrixRows = computed<MatrixRow[]>(() => {
  const result: MatrixRow[] = []
  let lastGroup = ''
  for (let i = 0; i < content.value.comparison.matrix.length; i++) {
    const m = content.value.comparison.matrix[i]
    if (m.g !== lastGroup) {
      result.push({ type: 'group', label: m.g })
      lastGroup = m.g
    }
    result.push({ type: 'row', f: m.f, row: MATRIX_ROW_DATA[i] })
  }
  return result
})
</script>

<template>
  <div class="page-root pricing-page-root">
    <AppNav />

    <!-- Hero -->
    <section class="pricing-hero">
      <div class="pricing-hero-bg" />
      <div class="section-inner pricing-hero-inner">
        <div style="text-align: center; max-width: 760px; margin: 0 auto">
          <span class="eyebrow">{{ content.hero.eyebrow }}</span>
          <h1 class="h-display" style="margin-top: 20px; font-size: clamp(40px, 5vw, 60px)">
            {{ content.hero.title1 }}
            <br />
            <span style="color: var(--lb-brand)">{{ content.hero.title2 }}</span>
          </h1>
          <p
            class="t-body"
            style="margin-top: 20px; max-width: 580px; margin-left: auto; margin-right: auto"
            v-html="content.hero.desc"></p>
        </div>
      </div>
    </section>

    <!-- Free Baseline -->
    <section class="section" style="padding-top: 32px">
      <div class="section-inner">
        <div class="pricing-free-grid">
          <div v-for="item in freeItems" :key="item.title" class="pricing-free-card">
            <div class="pricing-free-head">
              <div
                class="pricing-free-icon"
                :style="{ background: `color-mix(in srgb, ${item.color} 14%, transparent)`, color: item.color }">
                <!-- shield -->
                <svg
                  v-if="item.icon === 'shield'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <!-- chart -->
                <svg
                  v-else-if="item.icon === 'chart'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>
                <!-- bolt -->
                <svg
                  v-else-if="item.icon === 'bolt'"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                  stroke-linejoin="round">
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
                </svg>
              </div>
              <span class="pricing-free-price">{{ content.free.price }}</span>
            </div>
            <h3 class="h-card" style="margin-top: 16px">{{ item.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55" v-html="item.desc"></p>
          </div>
        </div>
      </div>
    </section>

    <!-- Paid Plans -->
    <section class="section" style="padding-top: 32px">
      <div class="section-inner">
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            flex-wrap: wrap;
            gap: 24px;
            margin-bottom: 32px;
          ">
          <div style="max-width: 520px">
            <span class="eyebrow">{{ content.realtime.eyebrow }}</span>
            <h2 class="h-section" style="margin-top: 14px">{{ content.realtime.title }}</h2>
            <p class="t-meta" style="margin-top: 10px; line-height: 1.55" v-html="content.realtime.desc"></p>
          </div>

          <div class="pricing-cycle">
            <span class="pricing-cycle-label">{{ content.billing.label }}</span>
            <div class="pricing-cycle-tabs">
              <button
                v-for="c in BILLING_CYCLES"
                :key="c.key"
                :class="['pricing-cycle-tab', c.key === cycle ? 'is-active' : '']"
                @click="cycle = c.key">
                {{ cycleLabels[c.key] }}
                <span v-if="c.badge" class="pricing-cycle-badge">{{ content.cycle.badge }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="pricing-plans-grid">
          <div v-for="p in plans" :key="p.id" class="pricing-plan-card">
            <div class="pricing-plan-head">
              <span
                class="pricing-plan-market"
                :style="{ color: p.color, background: `color-mix(in srgb, ${p.color} 12%, transparent)` }">
                {{ p.market }}
              </span>
              <span v-if="p.badge" class="pricing-plan-badge">{{ p.badge }}</span>
            </div>
            <h3 class="pricing-plan-name">{{ p.name }}</h3>
            <div class="pricing-plan-price">
              <span v-if="p.free" class="pricing-plan-num">{{ content.free.price }}</span>
              <template v-else>
                <span class="pricing-plan-cur">{{ p.currency }}</span>
                <span class="pricing-plan-num">{{ planCycle(p).price }}</span>
                <span class="pricing-plan-suf">{{ cycleSuffix }}</span>
                <span v-if="planCycle(p).discount" class="pricing-plan-discount">-{{ planCycle(p).discount }}%</span>
              </template>
            </div>
            <template v-if="!p.free">
              <div v-if="planCycle(p).approxMo" class="pricing-plan-approx">
                ≈{{ p.currency }}{{ planCycle(p).approxMo }}{{ content.suffix.mo }}
              </div>
              <div v-else-if="planCycle(p).discount" class="pricing-plan-was">
                {{ content.plan.was }} <s>{{ p.currency }}{{ p.cycles.monthly.price }}{{ content.suffix.mo }}</s>
              </div>
            </template>
            <p class="pricing-plan-tag">{{ p.tagline }}</p>
            <div class="pricing-plan-cov">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
                style="color: var(--lb-fg-3); flex-shrink: 0">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
              </svg>
              {{ p.coverage }}
            </div>
            <ul class="pricing-plan-feats">
              <li v-for="feat in p.feats" :key="feat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l4.5 4.5 9.5-9.5"
                    :stroke="p.color"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>{{ feat }}</span>
              </li>
            </ul>
            <a
              v-if="!p.free"
              class="btn btn-primary pricing-plan-cta"
              href="https://longbridge.com/download"
              target="_blank"
              rel="noreferrer">
              {{ content.plan.subscribe }}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Matrix -->
    <section class="section" style="padding-top: 48px; padding-bottom: 80px">
      <div class="section-inner">
        <div style="max-width: 540px; margin-bottom: 24px">
          <span class="eyebrow">{{ content.comparison.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 14px">{{ content.comparison.title }}</h2>
        </div>
        <div class="pricing-matrix-wrap">
          <table class="pricing-matrix">
            <thead>
              <tr>
                <th class="pricing-matrix-feat-h"></th>
                <th v-for="p in content.comparison.plans" :key="p.label">
                  <div class="pricing-matrix-col">
                    <span class="pricing-matrix-plan" :style="{ color: p.color }">{{ p.label }}</span>
                    <span class="pricing-matrix-tag">{{ p.tag }}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="r in matrixRows" :key="r.label || r.f">
                <tr v-if="r.type === 'group'" class="pricing-matrix-group">
                  <td :colspan="content.comparison.plans.length + 1">{{ r.label }}</td>
                </tr>
                <tr v-else>
                  <td class="pricing-matrix-feat">{{ r.f }}</td>
                  <td v-for="(v, j) in r.row" :key="j" class="pricing-matrix-cell">
                    <svg v-if="v" width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="10" fill="var(--lb-up)" fill-opacity="0.15" />
                      <path
                        d="M6 10.5l2.5 2.5 5.5-5.5"
                        stroke="var(--lb-up)"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round" />
                    </svg>
                    <span v-else style="color: var(--lb-fg-3)">—</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section" style="border-top: 1px solid var(--app-card-stroke); background: var(--app-canvas)">
      <div class="section-inner">
        <div style="max-width: 560px; margin-bottom: 32px">
          <span class="eyebrow">{{ content.faq.eyebrow }}</span>
          <h2 class="h-section" style="margin-top: 14px">{{ content.faq.title }}</h2>
        </div>
        <div class="pricing-faq-grid">
          <div v-for="item in content.faq.items" :key="item.q" class="pricing-faq-card">
            <h4 class="pricing-faq-q">{{ item.q }}</h4>
            <p class="pricing-faq-a" v-html="item.a"></p>
          </div>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style scoped>
.pricing-page-root {
  min-height: 100vh;
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
}

/* ---- Hero ---- */
.pricing-hero {
  position: relative;
  padding: 100px 0 80px;
  overflow: hidden;
}
.pricing-hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 50% -10%,
    color-mix(in srgb, var(--lb-brand) 14%, transparent),
    transparent 70%
  );
  pointer-events: none;
}
.pricing-hero-inner {
  position: relative;
  z-index: 1;
}

/* ---- Free Baseline ---- */
.pricing-free-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) {
  .pricing-free-grid {
    grid-template-columns: 1fr;
  }
}
.pricing-free-card {
  background: var(--lb-bg-1);
  border: 1px solid var(--app-card-stroke);
  border-radius: 14px;
  padding: 24px;
}
.pricing-free-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pricing-free-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ---- Billing Cycle ---- */
.pricing-cycle {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pricing-cycle-label {
  font-size: 13px;
  color: var(--lb-fg-3);
  font-weight: 500;
}
.pricing-cycle-tabs {
  display: flex;
  align-items: center;
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}
.pricing-cycle-tab {
  padding: 2px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--lb-fg-2);
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
  white-space: nowrap;
}
.pricing-cycle-tab:hover {
  color: var(--lb-fg-1);
}
.pricing-cycle-tab.is-active {
  background: var(--lb-fg-1);
  color: var(--lb-fg-invert);
  border-radius: 7px;
}
.pricing-cycle-tab .pricing-cycle-badge {
  padding: 0 6px;
  line-height: 12px;
  font-size: 10px;
  background: color-mix(in srgb, var(--lb-up) 20%, transparent);
  color: var(--lb-up);
}

/* ---- Paid Plans ---- */
.pricing-plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 900px) {
  .pricing-plans-grid {
    grid-template-columns: 1fr;
  }
}
.pricing-plan-card {
  background: var(--lb-bg-1);
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 0;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
}
.pricing-plan-card:hover {
  box-shadow: 0 4px 20px color-mix(in srgb, var(--lb-fg-1) 8%, transparent);
}
.pricing-plan-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.pricing-plan-market {
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.03em;
}
.pricing-plan-badge {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--lb-fg-3);
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  padding: 2px 8px;
  border-radius: 999px;
  margin-left: auto;
}
.pricing-plan-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--lb-fg-1);
  margin: 0 0 12px;
}
.pricing-plan-price {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 4px;
}
.pricing-plan-cur {
  font-size: 14px;
  font-weight: 600;
  color: var(--lb-fg-2);
}
.pricing-plan-num {
  font-size: 36px;
  font-weight: 800;
  color: var(--lb-fg-1);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.pricing-plan-suf {
  font-size: 14px;
  color: var(--lb-fg-3);
}
.pricing-plan-discount {
  font-size: 12px;
  font-weight: 700;
  color: var(--lb-up);
  background: color-mix(in srgb, var(--lb-up) 12%, transparent);
  padding: 2px 7px;
  border-radius: 999px;
  margin-left: 6px;
}
.pricing-plan-approx {
  font-size: 12px;
  color: var(--lb-fg-3);
  margin-bottom: 0;
}
.pricing-plan-was {
  font-size: 12px;
  color: var(--lb-fg-3);
  margin-bottom: 0;
}
.pricing-plan-was s {
  text-decoration: line-through;
}
.pricing-plan-tag {
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.6;
  margin: 12px 0 12px;
}
.pricing-plan-cov {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--lb-fg-3);
  margin-bottom: 16px;
}
.pricing-plan-feats {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
.pricing-plan-feats li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--lb-fg-2);
}
.pricing-plan-cta {
  margin-top: auto;
  width: 100%;
  justify-content: center;
}

/* ---- Feature Matrix ---- */
.pricing-matrix-wrap {
  overflow-x: auto;
  border: 1px solid var(--app-card-stroke);
  border-radius: 12px;
}
.pricing-matrix {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}
.pricing-matrix thead th {
  padding: 12px 16px;
  border-bottom: 1px solid var(--app-card-stroke);
  text-align: center;
  vertical-align: bottom;
}
.pricing-matrix-feat-h {
  text-align: left !important;
  min-width: 220px;
}
.pricing-matrix-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.pricing-matrix-plan {
  font-size: 13px;
  font-weight: 700;
}
.pricing-matrix-tag {
  font-size: 10px;
  color: var(--lb-fg-3);
  font-weight: 500;
}
.pricing-matrix-group td {
  padding: 8px 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--lb-fg-3);
  background: var(--lb-bg-2);
  border-bottom: 1px solid var(--app-card-stroke);
}
.pricing-matrix-feat {
  padding: 11px 16px;
  font-size: 13px;
  color: var(--lb-fg-2);
  border-bottom: 1px solid var(--app-card-stroke);
  vertical-align: middle;
}
.pricing-matrix tbody tr:last-child td {
  border-bottom: none;
}
.pricing-matrix-cell {
  padding: 11px 16px;
  text-align: center;
  border-bottom: 1px solid var(--app-card-stroke);
  vertical-align: middle;
}
.pricing-matrix-cell svg,
.pricing-matrix-cell span {
  display: block;
  margin: 0 auto;
}
.pricing-matrix tbody tr:hover .pricing-matrix-feat,
.pricing-matrix tbody tr:hover .pricing-matrix-cell {
  background: var(--lb-hover);
}

/* ---- FAQ ---- */
.pricing-faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}
@media (max-width: 768px) {
  .pricing-faq-grid {
    grid-template-columns: 1fr;
  }
}
.pricing-faq-card {
  background: var(--lb-bg-2);
  border: 1px solid var(--app-card-stroke);
  border-radius: 12px;
  padding: 20px;
}
.pricing-faq-q {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--lb-fg-1);
  margin: 0 0 8px;
  line-height: 1.4;
}
.pricing-faq-a {
  font-size: 13px;
  color: var(--lb-fg-2);
  line-height: 1.6;
  margin: 0;
}

/* ---- Shared ---- */
.section {
  padding: 80px 0;
}
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.eyebrow {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lb-brand);
}
.h-display {
  font-size: clamp(32px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--lb-fg-1);
}
.h-section {
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 700;
  line-height: 1.25;
  letter-spacing: -0.01em;
  color: var(--lb-fg-1);
  margin: 0;
}
.h-card {
  font-size: 15px;
  font-weight: 700;
  color: var(--lb-fg-1);
  margin: 0;
}
.t-body {
  font-size: 16px;
  line-height: 1.65;
  color: var(--lb-fg-2);
}
.t-meta {
  font-size: 14px;
  line-height: 1.55;
  color: var(--lb-fg-2);
  margin: 0;
}
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}
.btn:hover {
  opacity: 0.85;
}
.btn-primary {
  background: var(--lb-fg-1);
  color: var(--lb-fg-invert);
}

@media (max-width: 640px) {
  .pricing-hero {
    padding: 60px 0 40px;
  }
  .section {
    padding: 48px 0;
  }
  .section-inner {
    padding: 0 16px;
  }
}
</style>
