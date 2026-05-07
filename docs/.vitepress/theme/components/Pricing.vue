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
          { name: '基础行情', note: 'Nasdaq Basic、港股 LV1、沪深 LV1' },
          { name: '数据推送 & 拉取', note: 'WebSocket 实时推送、REST API 主动拉取，无限制' },
        ]
      : [
          { name: 'Trading & Account APIs', note: 'Fundamentals, analysis, news, assets, orders — core APIs free' },
          { name: 'Basic Market Data', note: 'Nasdaq Basic, HK LV1, CN LV1' },
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
          { feature: '盘前盘后（夜盘）行情', values: [false, true, false, false, false, false] },
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
          { feature: 'Pre/post-market (overnight)', values: [false, true, false, false, false, false] },
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
    <div class="grid grid-cols-1 sm:grid-cols-3 bg-[var(--vp-c-default-soft)] rounded-[14px] overflow-hidden mb-8">
      <div
        v-for="(item, i) in t.freeItems"
        :key="item.name"
        class="p-[18px_20px]"
        :class="{ 'border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-[var(--vp-c-divider)]': i > 0 }">
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
      <div class="grid grid-cols-2 sm:flex gap-0.5 p-1 rounded-lg bg-[var(--vp-c-default-soft)]">
        <button
          v-for="p in t.billingPeriods"
          :key="p.id"
          class="relative px-3.5 py-1.5 sm:min-w-28 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap"
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
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]" style="font-feature-settings:'tnum'"
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
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]" style="font-feature-settings:'tnum'"
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
            class="text-[1.9rem] font-bold leading-none tracking-[-0.02em]" style="font-feature-settings:'tnum'"
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
        <div class="w-[160px] h-[160px] rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <svg viewBox="0 0 33 33" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><path d="M2,2H3V3H2zM3,2H4V3H3zM4,2H5V3H4zM5,2H6V3H5zM6,2H7V3H6zM7,2H8V3H7zM8,2H9V3H8zM11,2H12V3H11zM14,2H15V3H14zM15,2H16V3H15zM16,2H17V3H16zM17,2H18V3H17zM19,2H20V3H19zM20,2H21V3H20zM24,2H25V3H24zM25,2H26V3H25zM26,2H27V3H26zM27,2H28V3H27zM28,2H29V3H28zM29,2H30V3H29zM30,2H31V3H30zM2,3H3V4H2zM8,3H9V4H8zM10,3H11V4H10zM11,3H12V4H11zM12,3H13V4H12zM14,3H15V4H14zM17,3H18V4H17zM22,3H23V4H22zM24,3H25V4H24zM30,3H31V4H30zM2,4H3V5H2zM4,4H5V5H4zM5,4H6V5H5zM6,4H7V5H6zM8,4H9V5H8zM10,4H11V5H10zM11,4H12V5H11zM13,4H14V5H13zM16,4H17V5H16zM18,4H19V5H18zM21,4H22V5H21zM22,4H23V5H22zM24,4H25V5H24zM26,4H27V5H26zM27,4H28V5H27zM28,4H29V5H28zM30,4H31V5H30zM2,5H3V6H2zM4,5H5V6H4zM5,5H6V6H5zM6,5H7V6H6zM8,5H9V6H8zM10,5H11V6H10zM11,5H12V6H11zM12,5H13V6H12zM13,5H14V6H13zM14,5H15V6H14zM16,5H17V6H16zM17,5H18V6H17zM19,5H20V6H19zM20,5H21V6H20zM22,5H23V6H22zM24,5H25V6H24zM26,5H27V6H26zM27,5H28V6H27zM28,5H29V6H28zM30,5H31V6H30zM2,6H3V7H2zM4,6H5V7H4zM5,6H6V7H5zM6,6H7V7H6zM8,6H9V7H8zM12,6H13V7H12zM14,6H15V7H14zM15,6H16V7H15zM16,6H17V7H16zM17,6H18V7H17zM19,6H20V7H19zM20,6H21V7H20zM21,6H22V7H21zM22,6H23V7H22zM24,6H25V7H24zM26,6H27V7H26zM27,6H28V7H27zM28,6H29V7H28zM30,6H31V7H30zM2,7H3V8H2zM8,7H9V8H8zM11,7H12V8H11zM12,7H13V8H12zM13,7H14V8H13zM15,7H16V8H15zM16,7H17V8H16zM18,7H19V8H18zM19,7H20V8H19zM24,7H25V8H24zM30,7H31V8H30zM2,8H3V9H2zM3,8H4V9H3zM4,8H5V9H4zM5,8H6V9H5zM6,8H7V9H6zM7,8H8V9H7zM8,8H9V9H8zM10,8H11V9H10zM12,8H13V9H12zM14,8H15V9H14zM16,8H17V9H16zM18,8H19V9H18zM20,8H21V9H20zM22,8H23V9H22zM24,8H25V9H24zM25,8H26V9H25zM26,8H27V9H26zM27,8H28V9H27zM28,8H29V9H28zM29,8H30V9H29zM30,8H31V9H30zM10,9H11V10H10zM13,9H14V10H13zM15,9H16V10H15zM20,9H21V10H20zM22,9H23V10H22zM2,10H3V11H2zM8,10H9V11H8zM10,10H11V11H10zM13,10H14V11H13zM16,10H17V11H16zM17,10H18V11H17zM19,10H20V11H19zM23,10H24V11H23zM24,10H25V11H24zM27,10H28V11H27zM28,10H29V11H28zM29,10H30V11H29zM5,11H6V12H5zM9,11H10V12H9zM10,11H11V12H10zM11,11H12V12H11zM14,11H15V12H14zM16,11H17V12H16zM20,11H21V12H20zM21,11H22V12H21zM26,11H27V12H26zM28,11H29V12H28zM29,11H30V12H29zM3,12H4V13H3zM5,12H6V13H5zM6,12H7V13H6zM7,12H8V13H7zM8,12H9V13H8zM9,12H10V13H9zM11,12H12V13H11zM13,12H14V13H13zM19,12H20V13H19zM20,12H21V13H20zM22,12H23V13H22zM24,12H25V13H24zM4,13H5V14H4zM5,13H6V14H5zM11,13H12V14H11zM13,13H14V14H13zM14,13H15V14H14zM16,13H17V14H16zM17,13H18V14H17zM18,13H19V14H18zM24,13H25V14H24zM25,13H26V14H25zM27,13H28V14H27zM2,14H3V15H2zM3,14H4V15H3zM4,14H5V15H4zM7,14H8V15H7zM8,14H9V15H8zM13,14H14V15H13zM14,14H15V15H14zM15,14H16V15H15zM16,14H17V15H16zM22,14H23V15H22zM24,14H25V15H24zM25,14H26V15H25zM30,14H31V15H30zM2,15H3V16H2zM4,15H5V16H4zM6,15H7V16H6zM7,15H8V16H7zM9,15H10V16H9zM11,15H12V16H11zM14,15H15V16H14zM15,15H16V16H15zM16,15H17V16H16zM19,15H20V16H19zM20,15H21V16H20zM21,15H22V16H21zM22,15H23V16H22zM24,15H25V16H24zM25,15H26V16H25zM26,15H27V16H26zM29,15H30V16H29zM30,15H31V16H30zM4,16H5V17H4zM5,16H6V17H5zM8,16H9V17H8zM10,16H11V17H10zM12,16H13V17H12zM13,16H14V17H13zM14,16H15V17H14zM15,16H16V17H15zM16,16H17V17H16zM17,16H18V17H17zM18,16H19V17H18zM19,16H20V17H19zM24,16H25V17H24zM25,16H26V17H25zM26,16H27V17H26zM27,16H28V17H27zM28,16H29V17H28zM2,17H3V18H2zM3,17H4V18H3zM7,17H8V18H7zM10,17H11V18H10zM11,17H12V18H11zM14,17H15V18H14zM15,17H16V18H15zM16,17H17V18H16zM18,17H19V18H18zM21,17H22V18H21zM22,17H23V18H22zM24,17H25V18H24zM25,17H26V18H25zM26,17H27V18H26zM28,17H29V18H28zM30,17H31V18H30zM2,18H3V19H2zM4,18H5V19H4zM5,18H6V19H5zM6,18H7V19H6zM8,18H9V19H8zM9,18H10V19H9zM10,18H11V19H10zM16,18H17V19H16zM17,18H18V19H17zM19,18H20V19H19zM22,18H23V19H22zM27,18H28V19H27zM28,18H29V19H28zM2,19H3V20H2zM3,19H4V20H3zM6,19H7V20H6zM11,19H12V20H11zM12,19H13V20H12zM13,19H14V20H13zM18,19H19V20H18zM19,19H20V20H19zM20,19H21V20H20zM21,19H22V20H21zM22,19H23V20H22zM24,19H25V20H24zM25,19H26V20H25zM26,19H27V20H26zM28,19H29V20H28zM29,19H30V20H29zM30,19H31V20H30zM2,20H3V21H2zM3,20H4V21H3zM8,20H9V21H8zM13,20H14V21H13zM14,20H15V21H14zM15,20H16V21H15zM16,20H17V21H16zM18,20H19V21H18zM19,20H20V21H19zM21,20H22V21H21zM22,20H23V21H22zM25,20H26V21H25zM26,20H27V21H26zM27,20H28V21H27zM30,20H31V21H30zM2,21H3V22H2zM4,21H5V22H4zM5,21H6V22H5zM6,21H7V22H6zM9,21H10V22H9zM12,21H13V22H12zM13,21H14V22H13zM14,21H15V22H14zM16,21H17V22H16zM17,21H18V22H17zM18,21H19V22H18zM21,21H22V22H21zM23,21H24V22H23zM24,21H25V22H24zM26,21H27V22H26zM2,22H3V23H2zM5,22H6V23H5zM6,22H7V23H6zM7,22H8V23H7zM8,22H9V23H8zM9,22H10V23H9zM10,22H11V23H10zM14,22H15V23H14zM18,22H19V23H18zM20,22H21V23H20zM22,22H23V23H22zM23,22H24V23H23zM24,22H25V23H24zM25,22H26V23H25zM26,22H27V23H26zM28,22H29V23H28zM29,22H30V23H29zM30,22H31V23H30zM10,23H11V24H10zM14,23H15V24H14zM15,23H16V24H15zM18,23H19V24H18zM19,23H20V24H19zM20,23H21V24H20zM22,23H23V24H22zM26,23H27V24H26zM27,23H28V24H27zM2,24H3V25H2zM3,24H4V25H3zM4,24H5V25H4zM5,24H6V25H5zM6,24H7V25H6zM7,24H8V25H7zM8,24H9V25H8zM14,24H15V25H14zM15,24H16V25H15zM16,24H17V25H16zM17,24H18V25H17zM18,24H19V25H18zM19,24H20V25H19zM21,24H22V25H21zM22,24H23V25H22zM24,24H25V25H24zM26,24H27V25H26zM27,24H28V25H27zM28,24H29V25H28zM2,25H3V26H2zM8,25H9V26H8zM11,25H12V26H11zM12,25H13V26H12zM14,25H15V26H14zM15,25H16V26H15zM19,25H20V26H19zM20,25H21V26H20zM21,25H22V26H21zM22,25H23V26H22zM26,25H27V26H26zM29,25H30V26H29zM30,25H31V26H30zM2,26H3V27H2zM4,26H5V27H4zM5,26H6V27H5zM6,26H7V27H6zM8,26H9V27H8zM12,26H13V27H12zM13,26H14V27H13zM14,26H15V27H14zM15,26H16V27H15zM17,26H18V27H17zM18,26H19V27H18zM19,26H20V27H19zM21,26H22V27H21zM22,26H23V27H22zM23,26H24V27H23zM24,26H25V27H24zM25,26H26V27H25zM26,26H27V27H26zM27,26H28V27H27zM29,26H30V27H29zM2,27H3V28H2zM4,27H5V28H4zM5,27H6V28H5zM6,27H7V28H6zM8,27H9V28H8zM12,27H13V28H12zM13,27H14V28H13zM15,27H16V28H15zM18,27H19V28H18zM20,27H21V28H20zM21,27H22V28H21zM22,27H23V28H22zM23,27H24V28H23zM25,27H26V28H25zM27,27H28V28H27zM28,27H29V28H28zM29,27H30V28H29zM2,28H3V29H2zM4,28H5V29H4zM5,28H6V29H5zM6,28H7V29H6zM8,28H9V29H8zM12,28H13V29H12zM13,28H14V29H13zM16,28H17V29H16zM20,28H21V29H20zM21,28H22V29H21zM23,28H24V29H23zM24,28H25V29H24zM25,28H26V29H25zM26,28H27V29H26zM27,28H28V29H27zM28,28H29V29H28zM29,28H30V29H29zM2,29H3V30H2zM8,29H9V30H8zM13,29H14V30H13zM14,29H15V30H14zM17,29H18V30H17zM23,29H24V30H23zM25,29H26V30H25zM27,29H28V30H27zM28,29H29V30H28zM30,29H31V30H30zM2,30H3V31H2zM3,30H4V31H3zM4,30H5V31H4zM5,30H6V31H5zM6,30H7V31H6zM7,30H8V31H7zM8,30H9V31H8zM10,30H11V31H10zM11,30H12V31H11zM12,30H13V31H12zM15,30H16V31H15zM18,30H19V31H18zM20,30H21V31H20zM21,30H22V31H21zM23,30H24V31H23zM24,30H25V31H24zM25,30H26V31H25zM28,30H29V31H28z" fill="#000000" fill-rule="nonzero" stroke="none" /></svg>
        </div>
        <p class="text-sm text-[var(--vp-c-text-2)] text-center leading-relaxed m-0">{{ t.qrDesc }}</p>
      </div>
    </div>
  </Teleport>
</template>
