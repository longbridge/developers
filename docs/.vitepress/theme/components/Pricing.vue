<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { LEVEL_COLORS } from './QuotePermissionData'

const { lang } = useData()

const showDialog = ref(false)

function openDialog() {
  showDialog.value = true
}

function closeDialog() {
  showDialog.value = false
}

type BillingPeriod = 'continuous' | 'monthly' | 'quarterly' | 'yearly'
const billing = ref<BillingPeriod>('continuous')

const PRICES = {
  us_lv1: { continuous: 558, monthly: 718, quarterly: 1748, yearly: 5788 },
  opra: { continuous: 22, monthly: 40, quarterly: 83, yearly: 269 },
  hk_lv2_global: { continuous: 558, monthly: 718, quarterly: 1428, yearly: 5288 },
  hk_lv2_mainland: { continuous: 269, monthly: 313, quarterly: 618, yearly: 1999 },
} as const

function priceOf(key: keyof typeof PRICES): number {
  return PRICES[key][billing.value]
}

function perMonthOf(key: keyof typeof PRICES): string | null {
  const unit = lang.value.startsWith('zh') ? '/月' : '/mo'
  if (billing.value === 'quarterly') return `≈ HK$${Math.round(PRICES[key].quarterly / 3)}${unit}`
  if (billing.value === 'yearly') return `≈ HK$${Math.round(PRICES[key].yearly / 12)}${unit}`
  return null
}

function savingsOf(key: keyof typeof PRICES): string | null {
  const monthly = PRICES[key].monthly
  if (billing.value === 'monthly') return null
  if (billing.value === 'continuous') {
    const pct = Math.round((1 - PRICES[key].continuous / monthly) * 100)
    return pct > 0 ? `-${pct}%` : null
  }
  if (billing.value === 'quarterly') {
    const pct = Math.round((1 - PRICES[key].quarterly / (monthly * 3)) * 100)
    return pct > 0 ? `-${pct}%` : null
  }
  if (billing.value === 'yearly') {
    const pct = Math.round((1 - PRICES[key].yearly / (monthly * 12)) * 100)
    return pct > 0 ? `-${pct}%` : null
  }
  return null
}

const billingUnit = computed(() => {
  const zh = lang.value.startsWith('zh')
  if (billing.value === 'quarterly') return zh ? '/季度' : '/quarter'
  if (billing.value === 'yearly') return zh ? '/年' : '/year'
  return zh ? '/月' : '/mo'
})

const t = computed(() => {
  const zh = lang.value.startsWith('zh')
  return {
    heroTitle: zh ? '开发者平台定价' : 'Developer Platform Pricing',
    heroSubtitle: zh
      ? '核心 API 功能完全免费，只有实时行情数据需要按需订阅'
      : 'Core API features are completely free — subscribe to real-time market data only when you need it',

    freeSectionTitle: zh ? '免费' : 'FREE',
    freeItems: zh
      ? [
          { name: '交易 & 账户 API', note: '个股基本面、分析、资讯、资产、订单等基础 API 功能免费' },
          { name: '基础行情', note: 'Nasdaq Basic（含盘前、盘中、盘后）、港股 LV1、沪深 LV1' },
          { name: '数据推送 & 拉取', note: 'WebSocket 实时推送、REST API 主动拉取，无限制' },
        ]
      : [
          { name: 'Trading & Account APIs', note: 'Fundamentals, analysis, news, assets, orders — core APIs free' },
          { name: 'Basic Market Data', note: 'Nasdaq Basic (pre-market, regular & after-hours), HK LV1, CN LV1' },
          { name: 'Push & Pull Data', note: 'WebSocket real-time push and REST API pull — unlimited' },
        ],

    billingPeriods: [
      { id: 'continuous' as BillingPeriod, label: zh ? '连续包月' : 'Auto-renew' },
      { id: 'monthly' as BillingPeriod, label: zh ? '月付' : 'Monthly' },
      { id: 'quarterly' as BillingPeriod, label: zh ? '季付' : 'Quarterly' },
      { id: 'yearly' as BillingPeriod, label: zh ? '年付' : 'Annual', badge: zh ? '最省' : 'Best', badgeGreen: true },
    ],

    usLv1Title: zh ? '美股 LV1 实时行情' : 'US LV1 Real-time',
    usLv1Market: zh ? '美股市场' : 'US Market',
    usLv1Desc: zh
      ? '纳斯达克实时成交行情及最优买卖一档报价（含盘前盘后夜盘），专属美股市场'
      : 'Nasdaq LV1 real-time quotes with best bid/ask incl. pre/post-market — US market only',
    usLv1Features: zh
      ? ['Nasdaq LV1 实时报价', '盘前盘后（夜盘）行情', 'WebSocket 实时推送']
      : ['Nasdaq LV1 real-time quotes', 'Pre/post-market (overnight)', 'WebSocket real-time push'],

    hkLv2Title: zh ? '港股 LV2 高级行情' : 'HK LV2 Advanced',
    hkLv2Market: zh ? '港股市场' : 'HK Market',
    hkLv2Desc: zh
      ? '港交所股票实时成交行情及十档买卖盘报价，专属港股市场（不含美股）'
      : 'HKEX real-time quotes with 10-level order book — HK market only (excludes US)',
    hkLv2Features: zh
      ? ['十档买卖盘口深度', '深度行情实时推送', '券商持仓队列（港股）']
      : ['10-level bid/ask depth', 'Real-time depth push', 'Broker queue (HK)'],
    hkLv2GlobalLabel: zh ? '全球版（含香港）' : 'Global (incl. HK)',
    hkLv2MainlandLabel: zh ? '中国大陆用户优惠价' : 'Mainland China price',
    hkLv2MainlandNote: zh
      ? '港交所对中国大陆用户的特批优惠，以实际购买页面为准'
      : 'Special HKEx rate for mainland China users — subject to verification',

    opraTitle: zh ? 'OPRA 美股期权行情' : 'OPRA US Options',
    opraMarket: zh ? '美股期权' : 'US Options',
    opraBadge: zh ? '加购项' : 'Add-on',
    opraDesc: zh
      ? '美股期权实时成交行情及最优买卖报价，独立于基础行情，可单独加购'
      : 'US options real-time quotes with best bid/ask — sold separately, any tier',
    opraFeatures: zh
      ? ['期权链查询', '期权实时报价', '期权行情推送']
      : ['Option chain lookup', 'Real-time option quotes', 'Option quote push'],

    cta: zh ? '前往购买' : 'Purchase',
    noteText: zh
      ? 'OpenAPI 行情权限独立于 App / PC / Web，需单独购买。在 Longbridge App「我的」→「行情商店」购买后自动激活。'
      : 'OpenAPI quote permissions are independent from App / PC / Web and must be purchased separately. Activate via Longbridge App "Me" → "Quote Store".',
    qrTitle: zh ? '购买行情权限' : 'Purchase Quote Packages',
    qrDesc: zh
      ? '在 Longbridge App「我的」中使用扫码功能，或前往「我的」→「行情商店」。'
      : 'In the Longbridge App, use the QR scanner in the "Me" tab, or go to "Me" → "Quote Store".',

    compareTitle: zh ? '权益对比' : 'Feature Comparison',
    // column order: nasdaq_basic | us_lv1 | opra | hk_lv1 | hk_lv2 | cn_lv1
    compareColumns: [
      { id: 'nasdaq_basic', label: 'Nasdaq Basic', badge: zh ? '免费' : 'Free', color: LEVEL_COLORS.basic },
      { id: 'us_lv1', label: zh ? '美股 LV1' : 'US LV1', badge: zh ? '付费' : 'Paid', color: LEVEL_COLORS.lv1 },
      { id: 'opra', label: 'OPRA', badge: zh ? '付费' : 'Paid', color: null },
      {
        id: 'hk_lv1',
        label: zh ? '港股 LV1' : 'HK LV1',
        badge: zh ? '推广免费' : 'Free (promo)',
        color: LEVEL_COLORS.basic,
      },
      { id: 'hk_lv2', label: zh ? '港股 LV2' : 'HK LV2', badge: zh ? '付费' : 'Paid', color: LEVEL_COLORS.lv2 },
      {
        id: 'cn_lv1',
        label: zh ? '沪深 LV1' : 'CN LV1',
        badge: zh ? '推广免费' : 'Free (promo)',
        color: LEVEL_COLORS.basic,
      },
    ] as Array<{ id: string; label: string; badge: string; color: typeof LEVEL_COLORS.basic | null }>,
    compareRows: (zh
      ? [
          { feature: '基础 API', values: [true, true, true, true, true, true] },
          { feature: 'WebSocket 实时行情推送', values: [true, true, true, true, true, true] },
          { feature: 'Pull 主动拉取行情', values: [true, true, true, true, true, true] },
          { feature: '美股实时行情（买卖一档）', values: [true, true, false, false, false, false] },
          { feature: '盘前、盘中、盘后行情', values: [true, true, false, false, false, false] },
          { feature: '夜盘行情', values: [false, true, false, false, false, false] },
          { feature: '期权链 & 实时报价', values: [false, false, true, false, false, false] },
          { feature: '港股实时行情（基础）', values: [false, false, false, true, true, false] },
          { feature: '恒生指数行情', values: [false, false, false, true, true, false] },
          { feature: '十档买卖盘口深度', values: [false, false, false, false, true, false] },
          { feature: '深度实时行情', values: [false, false, false, false, true, false] },
          { feature: '券商持仓队列（港股）', values: [false, false, false, false, true, false] },
          { feature: '沪深 A 股实时行情', values: [false, false, false, false, false, true] },
        ]
      : [
          { feature: 'Basic APIs', values: [true, true, true, true, true, true] },
          { feature: 'WebSocket Real-time Quote Push', values: [true, true, true, true, true, true] },
          { feature: 'Pull Quote (REST API)', values: [true, true, true, true, true, true] },
          { feature: 'US Quotes (Best Bid/Ask)', values: [true, true, false, false, false, false] },
          { feature: 'Pre-market, regular & after-hours', values: [true, true, false, false, false, false] },
          { feature: 'Overnight (night session)', values: [false, true, false, false, false, false] },
          { feature: 'Options Chain & Real-time Quotes', values: [false, false, true, false, false, false] },
          { feature: 'HK Real-time (basic)', values: [false, false, false, true, true, false] },
          { feature: 'Hang Seng Index', values: [false, false, false, true, true, false] },
          { feature: 'HK 10-level Order Book', values: [false, false, false, false, true, false] },
          { feature: 'Real-time Depth Push', values: [false, false, false, false, true, false] },
          { feature: 'Broker Queue (HK)', values: [false, false, false, false, true, false] },
          { feature: 'CN A-shares Real-time', values: [false, false, false, false, false, true] },
        ]) as Array<{ feature: string; values: boolean[] }>,
  }
})
</script>

<template>
  <div class="max-w-300 mx-auto px-4 sm:px-8 pt-8 pb-16">
    <!-- Hero -->
    <div class="text-center mb-12 pt-6">
      <h1 class="text-[1.8rem]! sm:text-[2.8rem]! font-bold! leading-tight! mb-4! border-none! p-0! mt-0!">
        {{ t.heroTitle }}
      </h1>
      <p class="text-[1.05rem] text-[var(--vp-c-text-2)] m-0 mx-auto leading-relaxed">
        {{ t.heroSubtitle }}
      </p>
    </div>

    <!-- Free included -->
    <div class="grid grid-cols-1 md:grid-cols-3 bg-[var(--vp-c-default-soft)] rounded-[14px] overflow-hidden mb-8">
      <div
        v-for="(item, i) in t.freeItems"
        :key="item.name"
        class="p-[18px_20px]"
        :class="{ 'border-t-2 md:border-t-0 md:border-l-2 border-dashed border-[var(--vp-c-divider)]': i > 0 }">
        <div class="flex items-center gap-1.5 mb-1.5">
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.18" />
            <path
              d="M6 10.5l2.5 2.5 5.5-5.5"
              stroke="#198f28"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
          <span class="text-[0.875rem] font-semibold text-[var(--vp-c-text-1)]">{{ item.name }}</span>
          <span
            class="text-[0.65rem] ml-2 tracking-[0.03em text-[#198f28] leading-4 px-2 py-0 rounded-[3px] bg-[#22c53844] shrink-0"
            >Free</span
          >
        </div>
        <div class="text-[0.75rem] text-[var(--vp-c-text-3)] leading-[1.55] pl-[22px]">{{ item.note }}</div>
      </div>
    </div>

    <!-- Billing period selector -->
    <div class="flex justify-center items-center gap-3 mb-6">
      <div class="flex gap-0.5 p-1 rounded-lg bg-[var(--vp-c-default-soft)]">
        <button
          v-for="p in t.billingPeriods"
          :key="p.id"
          class="relative px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm sm:min-w-28 rounded-md font-medium transition-all duration-150 cursor-pointer whitespace-nowrap"
          :class="
            billing === p.id
              ? 'bg-[var(--vp-c-bg)] shadow-sm text-[var(--vp-c-text-1)]'
              : 'text-[var(--vp-c-text-3)] hover:text-[var(--vp-c-text-2)]'
          "
          @click="billing = p.id">
          {{ p.label
          }}<span
            v-if="p.badge"
            class="ml-1 text-[0.6rem] font-bold"
            :style="{ color: p.badgeGreen ? '#22c55e' : '#f97316' }"
            >{{ p.badge }}</span
          >
        </button>
      </div>
    </div>

    <!-- Product cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
      <!-- US LV1 -->
      <div
        class="relative flex flex-col p-6 border border-[var(--vp-c-divider)] rounded-[18px] overflow-hidden isolate transition-[transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-10px_rgba(10,14,25,0.13),0_3px_12px_-5px_rgba(10,14,25,0.06)]"
        :style="{
          '--card-accent': LEVEL_COLORS.lv1.hex,
          background: `radial-gradient(300px 150px at 100% 0%, color-mix(in srgb, ${LEVEL_COLORS.lv1.hex} 9%, transparent), transparent 70%), var(--vp-c-bg)`,
        }">
        <div class="flex items-center justify-between mb-[18px]">
          <span
            class="text-[0.68rem] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
            :style="{
              background: `color-mix(in srgb, ${LEVEL_COLORS.lv1.hex} 13%, transparent)`,
              color: LEVEL_COLORS.lv1.text,
            }"
            >{{ t.usLv1Market }}</span
          >
          <button
            class="inline-flex items-center gap-[5px] text-[0.78rem] font-medium bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-[180ms] hover:gap-2"
            :style="{ color: LEVEL_COLORS.lv1.text }"
            @click="openDialog">
            {{ t.cta }}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M13 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="text-[1.0625rem] font-semibold text-[var(--vp-c-text-1)] mb-3 tracking-[-0.005em]">
          {{ t.usLv1Title }}
        </div>
        <div class="flex items-baseline gap-[5px] flex-wrap mb-1">
          <span
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]"
            style="font-feature-settings: 'tnum'"
            :style="{ color: LEVEL_COLORS.lv1.hex }"
            >HK${{ priceOf('us_lv1') }}</span
          >
          <span class="text-[0.82rem] text-[var(--vp-c-text-3)]">{{ billingUnit }}</span>
          <span v-if="savingsOf('us_lv1')" class="text-[0.7rem] font-bold text-orange-500">{{
            savingsOf('us_lv1')
          }}</span>
        </div>
        <div v-if="perMonthOf('us_lv1')" class="text-[0.73rem] text-[var(--vp-c-text-3)] mb-1">
          {{ perMonthOf('us_lv1') }}
        </div>
        <div class="border-t border-dashed border-[var(--vp-c-divider)] my-[14px]"></div>
        <p class="text-[0.82rem] text-[var(--vp-c-text-2)] leading-[1.6] m-0 mb-[14px]">{{ t.usLv1Desc }}</p>
        <ul class="m-0 p-0 list-none flex flex-col gap-[7px]">
          <li
            v-for="f in t.usLv1Features"
            :key="f"
            class="flex items-center gap-[7px] text-[0.82rem] text-[var(--vp-c-text-2)]">
            <svg class="w-[14px] h-[14px] shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.15" />
              <path
                d="M6 10.5l2.5 2.5 5.5-5.5"
                stroke="#198f28"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>
      </div>

      <!-- HK LV2 -->
      <div
        class="relative flex flex-col p-6 border border-[var(--vp-c-divider)] rounded-[18px] overflow-hidden isolate transition-[transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-10px_rgba(10,14,25,0.13),0_3px_12px_-5px_rgba(10,14,25,0.06)]"
        :style="{
          '--card-accent': LEVEL_COLORS.lv2.hex,
          background: `radial-gradient(300px 150px at 100% 0%, color-mix(in srgb, ${LEVEL_COLORS.lv2.hex} 9%, transparent), transparent 70%), var(--vp-c-bg)`,
        }">
        <div class="flex items-center justify-between mb-[18px]">
          <span
            class="text-[0.68rem] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
            :style="{
              background: `color-mix(in srgb, ${LEVEL_COLORS.lv2.hex} 13%, transparent)`,
              color: LEVEL_COLORS.lv2.text,
            }"
            >{{ t.hkLv2Market }}</span
          >
          <button
            class="inline-flex items-center gap-[5px] text-[0.78rem] font-medium bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-[180ms] hover:gap-2"
            :style="{ color: LEVEL_COLORS.lv2.text }"
            @click="openDialog">
            {{ t.cta }}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M13 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="text-[1.0625rem] font-semibold text-[var(--vp-c-text-1)] mb-3 tracking-[-0.005em]">
          {{ t.hkLv2Title }}
        </div>
        <!-- Global price -->
        <div class="text-[0.68rem] text-[var(--vp-c-text-3)] mb-0.5">{{ t.hkLv2GlobalLabel }}</div>
        <div class="flex items-baseline gap-[5px] flex-wrap mb-1">
          <span
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]"
            style="font-feature-settings: 'tnum'"
            :style="{ color: LEVEL_COLORS.lv2.hex }"
            >HK${{ priceOf('hk_lv2_global') }}</span
          >
          <span class="text-[0.82rem] text-[var(--vp-c-text-3)]">{{ billingUnit }}</span>
          <span v-if="savingsOf('hk_lv2_global')" class="text-[0.7rem] font-bold text-orange-500">{{
            savingsOf('hk_lv2_global')
          }}</span>
        </div>
        <div v-if="perMonthOf('hk_lv2_global')" class="text-[0.73rem] text-[var(--vp-c-text-3)] mb-1">
          {{ perMonthOf('hk_lv2_global') }}
        </div>
        <!-- Mainland price, zh only -->
        <div v-if="lang.startsWith('zh')" class="mt-[10px] px-3 py-[10px] rounded-[10px] bg-[var(--vp-c-default-soft)]">
          <div class="flex items-baseline gap-1">
            <span class="text-[1rem] font-bold leading-none text-[var(--vp-c-text-2)]"
              >HK${{ priceOf('hk_lv2_mainland') }}</span
            >
            <span class="text-[0.72rem] text-[var(--vp-c-text-3)]">{{ billingUnit }}</span>
            <span class="ml-3 text-[0.72rem] text-[var(--vp-c-text-3)]">{{ t.hkLv2MainlandLabel }}</span>
          </div>
          <div class="text-[0.63rem] text-[var(--vp-c-text-3)] mt-1 leading-snug">{{ t.hkLv2MainlandNote }}</div>
        </div>
        <div class="border-t border-dashed border-[var(--vp-c-divider)] my-[14px]"></div>
        <p class="text-[0.82rem] text-[var(--vp-c-text-2)] leading-[1.6] m-0 mb-[14px]">{{ t.hkLv2Desc }}</p>
        <ul class="m-0 p-0 list-none flex flex-col gap-[7px]">
          <li
            v-for="f in t.hkLv2Features"
            :key="f"
            class="flex items-center gap-[7px] text-[0.82rem] text-[var(--vp-c-text-2)]">
            <svg class="w-[14px] h-[14px] shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.15" />
              <path
                d="M6 10.5l2.5 2.5 5.5-5.5"
                stroke="#198f28"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>
      </div>

      <!-- OPRA -->
      <div
        class="relative flex flex-col p-6 border border-[var(--vp-c-divider)] rounded-[18px] overflow-hidden isolate transition-[transform,box-shadow] duration-[220ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_-10px_rgba(10,14,25,0.13),0_3px_12px_-5px_rgba(10,14,25,0.06)]"
        :style="{
          '--card-accent': LEVEL_COLORS.opra.hex,
          background: `radial-gradient(300px 150px at 100% 0%, color-mix(in srgb, ${LEVEL_COLORS.opra.hex} 9%, transparent), transparent 70%), var(--vp-c-bg)`,
        }">
        <div class="flex items-center justify-between mb-[18px]">
          <span
            class="text-[0.68rem] font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
            :style="{
              background: `color-mix(in srgb, ${LEVEL_COLORS.opra.hex} 13%, transparent)`,
              color: LEVEL_COLORS.opra.text,
            }"
            >{{ t.opraMarket }}</span
          >
          <button
            class="inline-flex items-center gap-[5px] text-[0.78rem] font-medium bg-transparent border-none cursor-pointer p-0 transition-[gap] duration-[180ms] hover:gap-2"
            :style="{ color: LEVEL_COLORS.opra.text }"
            @click="openDialog">
            {{ t.cta }}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12H19M13 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="text-[1.0625rem] font-semibold text-[var(--vp-c-text-1)] mb-3 tracking-[-0.005em]">
          {{ t.opraTitle }}
        </div>
        <div class="flex items-baseline gap-[5px] flex-wrap mb-1">
          <span
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]"
            style="font-feature-settings: 'tnum'"
            :style="{ color: LEVEL_COLORS.opra.hex }"
            >HK${{ priceOf('opra') }}</span
          >
          <span class="text-[0.82rem] text-[var(--vp-c-text-3)]">{{ billingUnit }}</span>
          <span v-if="savingsOf('opra')" class="text-[0.7rem] font-bold text-orange-500">{{ savingsOf('opra') }}</span>
        </div>
        <div v-if="perMonthOf('opra')" class="text-[0.73rem] text-[var(--vp-c-text-3)] mb-1">
          {{ perMonthOf('opra') }}
        </div>
        <div class="border-t border-dashed border-[var(--vp-c-divider)] my-[14px]"></div>
        <p class="text-[0.82rem] text-[var(--vp-c-text-2)] leading-[1.6] m-0 mb-[14px]">{{ t.opraDesc }}</p>
        <ul class="m-0 p-0 list-none flex flex-col gap-[7px]">
          <li
            v-for="f in t.opraFeatures"
            :key="f"
            class="flex items-center gap-[7px] text-[0.82rem] text-[var(--vp-c-text-2)]">
            <svg class="w-[14px] h-[14px] shrink-0" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.15" />
              <path
                d="M6 10.5l2.5 2.5 5.5-5.5"
                stroke="#198f28"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            {{ f }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Feature comparison table -->
    <div class="mb-10 overflow-x-auto rounded-xl border border-[var(--vp-c-divider)]">
      <table class="w-full text-sm border-collapse" style="min-width: 580px">
        <thead>
          <tr>
            <th
              class="text-left py-2.5 px-3 text-[0.8rem] font-medium text-[var(--vp-c-text-3)] border-b border-[var(--vp-c-divider)] w-[30%]"></th>
            <th
              v-for="col in t.compareColumns"
              :key="col.id"
              class="py-2.5 pt-10 px-2 text-center border-b border-[var(--vp-c-divider)]">
              <div class="flex flex-col items-center gap-1">
                <span
                  class="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                  :style="
                    col.color
                      ? { background: `color-mix(in srgb, ${col.color.hex} 15%, transparent)`, color: col.color.text }
                      : { background: 'var(--vp-c-default-soft)', color: 'var(--vp-c-text-2)' }
                  ">
                  {{ col.label }}
                </span>
                <span class="text-[0.65rem] text-[var(--vp-c-text-3)] whitespace-nowrap">{{ col.badge }}</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in t.compareRows"
            :key="row.feature"
            class="border-b border-[var(--vp-c-divider)] last:border-0 odd:bg-[var(--vp-c-default-soft)]">
            <td class="py-2.5 px-3 text-[0.82rem] text-[var(--vp-c-text-2)]">{{ row.feature }}</td>
            <td v-for="(val, i) in row.values" :key="i" class="py-2.5 px-2 text-center">
              <svg v-if="val" class="w-4 h-4 mx-auto" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.15" />
                <path
                  d="M6 10.5l2.5 2.5 5.5-5.5"
                  stroke="#198f28"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
              <span v-else class="text-[var(--vp-c-text-3)] text-base leading-none">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Note -->
    <div class="flex items-start gap-2 text-xs text-[var(--vp-c-text-3)] leading-relaxed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="shrink-0 mt-[1px] w-3.5 h-3.5"
        viewBox="0 0 20 20"
        fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd" />
      </svg>
      <span>{{ t.noteText }}</span>
    </div>
  </div>

  <!-- Purchase Dialog -->
  <Teleport to="body">
    <div v-if="showDialog" class="fixed inset-0 z-[200] flex items-center justify-center" @click.self="closeDialog">
      <div class="absolute inset-0 bg-black/50" @click="closeDialog"></div>
      <div
        class="relative bg-[var(--vp-c-bg)] rounded-2xl shadow-2xl w-full max-w-xs mx-4 p-6 flex flex-col items-center gap-4">
        <button
          class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full text-[var(--vp-c-text-3)] hover:bg-[var(--vp-c-default-soft)] transition-colors cursor-pointer"
          style="background: transparent; border: none"
          aria-label="Close"
          @click="closeDialog">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <div class="text-base font-semibold text-[var(--vp-c-text-1)] text-center">{{ t.qrTitle }}</div>
        <div class="rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img
            class="w-56 h-56"
            src="https://assets.lbctrl.com/uploads/01c3494f-7a78-4e69-a50f-c9ce5cd5a859/my-quotes.svg" />
        </div>
        <p class="text-sm text-[var(--vp-c-text-2)] text-center leading-relaxed m-0">{{ t.qrDesc }}</p>
      </div>
    </div>
  </Teleport>
</template>
