<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { LEVEL_COLORS } from './QuotePermissionData'

const { lang } = useData()

const showDialog = ref(false)
const qrDataUrl = ref('')

async function openDialog() {
  showDialog.value = true
  if (!qrDataUrl.value && typeof window !== 'undefined') {
    const QRCode = await import('qrcode')
    qrDataUrl.value = await QRCode.toDataURL('https://open.longbridge.com', {
      width: 200,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
    })
  }
}

function closeDialog() {
  showDialog.value = false
}

interface Tier {
  id: string
  name: string
  badge?: string
  price: string
  priceSub: string
  description: string
  highlight: boolean
  cta: string
  ctaHref: string
  color: string // 500: accent, icon, badge bg
  colorText: string // 600: text on light bg
  colorBg: string
  colorBorder: string
  purchaseViaApp: boolean
}

interface FeatureRow {
  category: string
  name: string
  marketColor?: string
  tiers: Record<string, boolean | string>
}

const t = computed(() => {
  const zh = lang.value.startsWith('zh')
  return {
    heroBadge: zh ? '行情权限' : 'Market Data',
    heroTitle: zh ? '行情权限定价' : 'Market Data Pricing',
    heroSubtitle: zh
      ? '按需选择行情权限，解锁更多 OpenAPI 数据能力'
      : 'Choose the market data plan that fits your needs and unlock more OpenAPI capabilities',
    noteTitle: zh ? '说明' : 'Note',
    noteText: zh
      ? 'OpenAPI 行情权限独立于 App / PC / Web，需单独购买。'
      : 'OpenAPI quote permissions are independent from App / PC / Web and must be purchased separately.',
    featureTableTitle: zh ? '功能对比' : 'Feature Comparison',
    addonTitle: zh ? 'OPRA 美股期权行情' : 'OPRA US Options Quotes',
    addonBadge: zh ? '加购项' : 'Add-on',
    addonPrice: 'HK$22',
    addonPriceSub: zh ? '/月起' : '/ mo. from',
    addonDesc: zh
      ? 'OPRA 美股期权实时成交行情及最优买卖一档报价，独立于基础行情档位，需额外单独购买。'
      : 'OPRA US options real-time quotes with best bid/ask — sold separately, independent of base quote tiers.',
    addonFeatures: zh
      ? ['期权链查询', '期权实时报价', '期权行情推送']
      : ['Option chain lookup', 'Real-time option quotes', 'Option quote push'],
    addonCta: zh ? '前往购买' : 'Purchase',
    qrTitle: zh ? '购买行情权限' : 'Purchase Quote Packages',
    qrDesc: zh
      ? '在 Longbridge App「我的」中使用扫码功能，或前往「我的」→「行情商店」。'
      : 'In the Longbridge App, use the QR scanner in the "Me" tab, or go to "Me" → "Quote Store".',
  }
})

const tiers = computed<Tier[]>(() => {
  const zh = lang.value.startsWith('zh')
  return [
    {
      id: 'free',
      name: zh ? '免费' : 'Free',
      price: zh ? '$0' : '$0',
      priceSub: zh ? '开通账户即享' : 'included with account',
      description: zh
        ? '开通 OpenAPI 自动获得：Nasdaq Basic 实时行情（美股）及 LV1 实时行情（港股），无需额外购买'
        : 'Included with OpenAPI activation: Nasdaq Basic real-time (US) and LV1 real-time (HK) at no extra cost',
      highlight: false,
      cta: '',
      ctaHref: '',
      color: LEVEL_COLORS.basic.hex,
      colorText: LEVEL_COLORS.basic.text,
      colorBg: LEVEL_COLORS.basic.bg,
      colorBorder: LEVEL_COLORS.basic.border,
      purchaseViaApp: false,
    },
    {
      id: 'lv1',
      name: zh ? 'LV1 实时行情' : 'LV1 Real-time',
      badge: zh ? '推荐' : 'Popular',
      price: 'HK$482',
      priceSub: zh ? '/月起' : '/ mo. from',
      description: zh
        ? '纳斯达克实时成交行情及最优买卖一档报价（含夜盘），仅适用于美股'
        : 'Nasdaq real-time quotes with best bid/ask including overnight — US market only',
      highlight: true,
      cta: zh ? '前往购买' : 'Purchase',
      ctaHref: 'https://open.longbridge.com',
      color: LEVEL_COLORS.lv1.hex,
      colorText: LEVEL_COLORS.lv1.text,
      colorBg: LEVEL_COLORS.lv1.bg,
      colorBorder: LEVEL_COLORS.lv1.border,
      purchaseViaApp: true,
    },
    {
      id: 'lv2',
      name: zh ? 'LV2 高级行情' : 'LV2 Advanced',
      price: 'HK$167',
      priceSub: zh ? '/月起' : '/ mo. from',
      description: zh
        ? '港交所股票实时成交行情及十档买卖盘报价，仅适用于港股。全球版（Plus）HK$441/月起'
        : 'HKEX real-time quotes with 10-level order book — HK market only. Global (Plus) from HK$441/mo',
      highlight: false,
      cta: zh ? '前往购买' : 'Purchase',
      ctaHref: 'https://open.longbridge.com',
      color: LEVEL_COLORS.lv2.hex,
      colorText: LEVEL_COLORS.lv2.text,
      colorBg: LEVEL_COLORS.lv2.bg,
      colorBorder: LEVEL_COLORS.lv2.border,
      purchaseViaApp: true,
    },
  ]
})

const featureRows = computed<FeatureRow[]>(() => {
  const zh = lang.value.startsWith('zh')
  return [
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '港股市场' : 'HK Market',
      marketColor: '#ff3a9d',
      tiers: {
        free: zh ? 'LV1 实时' : 'LV1 Real-time',
        lv1: zh ? 'LV1 实时' : 'LV1 Real-time',
        lv2: zh ? 'LV2 高级' : 'LV2 Advanced',
      },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '美股市场' : 'US Market',
      marketColor: '#2A99FE',
      tiers: {
        free: 'Nasdaq Basic',
        lv1: zh ? 'LV1 Nasdaq 实时' : 'LV1 Nasdaq Real-time',
        lv2: 'Nasdaq Basic',
      },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? 'A股市场' : 'CN Market',
      marketColor: '#ff3a3a',
      tiers: {
        free: zh ? '基础' : 'Basic',
        lv1: zh ? 'LV1 实时' : 'LV1 Real-time',
        lv2: zh ? '基础' : 'Basic',
      },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '新加坡市场' : 'SG Market',
      marketColor: '#3ad8ff',
      tiers: {
        free: zh ? '基础' : 'Basic',
        lv1: zh ? 'LV1 实时' : 'LV1 Real-time',
        lv2: zh ? '基础' : 'Basic',
      },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '美股夜盘' : 'US Overnight',
      marketColor: '#6366f1',
      tiers: { free: false, lv1: true, lv2: false },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '证券基础信息' : 'Security Static Info',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '实时报价' : 'Real-time Quote',
      tiers: { free: zh ? '延迟/快照' : 'Delayed/Snapshot', lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? 'K线 / 历史行情' : 'Candlestick / History',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '分时走势' : 'Intraday Timeline',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '逐笔成交' : 'Tick Trades',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '十档深度盘口' : '10-Level Order Book Depth',
      tiers: { free: false, lv1: false, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '券商持仓队列（港股）' : 'Broker Queue (HK only)',
      tiers: { free: false, lv1: false, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '资金流向' : 'Capital Flow',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '计算指标' : 'Calc Indexes',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '权证数据' : 'Warrant Data',
      tiers: { free: true, lv1: true, lv2: true },
    },
    {
      category: zh ? '推送 / 订阅' : 'Push / Subscribe',
      name: zh ? '实时报价推送' : 'Real-time Quote Push',
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '推送 / 订阅' : 'Push / Subscribe',
      name: zh ? '逐笔成交推送' : 'Tick Trade Push',
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '推送 / 订阅' : 'Push / Subscribe',
      name: zh ? '深度盘口推送' : 'Order Book Depth Push',
      tiers: { free: false, lv1: false, lv2: true },
    },
    {
      category: zh ? '推送 / 订阅' : 'Push / Subscribe',
      name: zh ? '券商队列推送（港股）' : 'Broker Queue Push (HK)',
      tiers: { free: false, lv1: false, lv2: true },
    },
  ]
})

const categories = computed(() => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const row of featureRows.value) {
    if (!seen.has(row.category)) {
      seen.add(row.category)
      result.push(row.category)
    }
  }
  return result
})

function rowsForCategory(cat: string) {
  return featureRows.value.filter((r) => r.category === cat)
}

function cellText(val: boolean | string): string {
  if (val === true) return ''
  if (val === false) return '–'
  return String(val)
}

function cellClass(val: boolean | string): string {
  if (val === true) return 'text-center whitespace-nowrap'
  if (val === false) return 'text-center whitespace-nowrap text-[var(--vp-c-text-3)] text-lg font-light'
  return 'text-center whitespace-nowrap text-[var(--vp-c-text-2)] text-[0.82rem]'
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-8 pt-8 pb-16">
    <!-- Hero -->
    <div class="text-center mb-12 pt-6">
      <h1 class="!text-[2.8rem] !font-bold !leading-tight !mb-4 !border-none !p-0 !mt-0">
        {{ t.heroTitle }}
      </h1>
      <p class="text-[1.05rem] text-[var(--vp-c-text-2)] m-0 mx-auto leading-relaxed">
        {{ t.heroSubtitle }}
      </p>
    </div>

    <!-- Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        class="pricing-card relative flex flex-col gap-3 rounded-xl p-6"
        :style="{
          '--tier-color': tier.color,
          border: `1px solid ${tier.colorBorder}`,
          background: tier.colorBg,
        }">
        <div class="text-[1.1rem] font-semibold" :style="{ color: tier.colorText }">{{ tier.name }}</div>
        <div class="text-base font-bold text-[var(--vp-c-text-1)] flex items-baseline gap-1.5">
          {{ tier.price }}
          <span class="text-[0.8rem] font-normal text-[var(--vp-c-text-3)]">{{ tier.priceSub }}</span>
        </div>
        <p class="text-sm text-[var(--vp-c-text-2)] m-0 leading-[1.55]">{{ tier.description }}</p>
        <button
          v-if="tier.purchaseViaApp"
          class="pricing-card-cta mt-auto block w-full text-center px-4 py-2 rounded-lg text-[0.9rem] font-medium transition-[background,color] duration-150 cursor-pointer"
          :style="{ border: `1px solid ${tier.colorBorder}`, color: tier.colorText, background: 'transparent' }"
          @click="openDialog">
          {{ tier.cta }}
        </button>
      </div>
    </div>

    <!-- Addon -->
    <div class="rounded-lg px-5 py-4 mb-12 border border-dashed border-[var(--vp-c-border)]">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
        <span
          class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap bg-[var(--vp-c-default-soft)] text-[var(--vp-c-text-2)]">
          {{ t.addonBadge }}
        </span>
        <span class="text-sm font-semibold text-[var(--vp-c-text-1)]">{{ t.addonTitle }}</span>
        <div class="ml-auto flex items-center gap-2 shrink-0">
          <span class="font-bold text-sm text-[var(--vp-c-text-1)]">
            {{ t.addonPrice }}<span class="font-normal text-xs text-[var(--vp-c-text-3)]">{{ t.addonPriceSub }}</span>
          </span>
          <button
            class="addon-cta shrink-0 inline-block px-3 py-1 rounded-md text-xs font-medium transition-[background,color] duration-150 whitespace-nowrap cursor-pointer border border-[var(--vp-c-text-3)] text-[var(--vp-c-text-1)]"
            style="background: transparent"
            @click="openDialog">
            {{ t.addonCta }}
          </button>
        </div>
      </div>
      <p class="text-xs text-[var(--vp-c-text-2)] m-0 mb-2 leading-relaxed">{{ t.addonDesc }}</p>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="f in t.addonFeatures"
          :key="f"
          class="text-[0.7rem] px-1 py-0.5 leading-4 rounded-md bg-[var(--vp-c-default-soft)] text-[var(--vp-c-text-2)]"
          >{{ f }}</span
        >
      </div>
    </div>

    <!-- Table -->
    <h2 class="!text-[1.35rem] !font-semibold !mb-4 !text-[var(--vp-c-text-1)]">{{ t.featureTableTitle }}</h2>

    <div class="overflow-x-auto rounded-xl border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)]">
      <table class="w-full border-collapse table table-fixed text-sm">
        <thead>
          <tr class="border-b-1 border-[var(--vp-c-divider)] bg-[var(--vp-c-default-soft)]">
            <th class="w-[38%] text-left px-5 py-4 font-semibold text-[var(--vp-c-text-1)] whitespace-nowrap"></th>
            <th
              v-for="tier in tiers"
              :key="tier.id"
              class="text-center px-5 py-3 whitespace-nowrap"
              :style="{ width: 'calc(62% / 3)', color: tier.colorText }">
              <div class="font-semibold text-sm">{{ tier.name }}</div>
              <div v-if="tier.id !== 'free'" class="text-xs font-normal opacity-70 mt-0.5">
                {{ tier.price }}<span>{{ tier.priceSub }}</span>
              </div>
              <div v-else class="text-xs font-normal opacity-70 mt-0.5">{{ tier.priceSub }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="cat in categories" :key="cat">
            <tr class="border-b border-[var(--vp-c-divider)]">
              <td
                :colspan="tiers.length + 1"
                class="px-5 py-2 text-[0.72rem] font-bold uppercase tracking-[0.07em] text-[var(--vp-c-text-3)]">
                {{ cat }}
              </td>
            </tr>
            <tr
              v-for="row in rowsForCategory(cat)"
              :key="row.name"
              class="border-b border-[var(--vp-c-divider)] last:border-b-0 hover:bg-[var(--vp-c-default-soft)] transition-colors duration-100">
              <td class="px-5 py-[0.7rem] align-middle text-sm text-[var(--vp-c-text-2)]">
                <span
                  v-if="row.marketColor"
                  class="inline-block w-[7px] h-[7px] rounded-full mr-2 align-middle shrink-0"
                  :style="{ background: row.marketColor }"></span
                >{{ row.name }}
              </td>
              <td
                v-for="tier in tiers"
                :key="tier.id"
                :class="['px-5 py-[0.7rem] align-middle', cellClass(row.tiers[tier.id])]">
                <svg
                  v-if="row.tiers[tier.id] === true"
                  class="inline-block w-4 h-4 align-middle"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true">
                  <circle cx="10" cy="10" r="10" fill="#22c538" fill-opacity="0.15" />
                  <path
                    d="M6 10.5l2.5 2.5 5.5-5.5"
                    stroke="#198f28"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span v-else>{{ cellText(row.tiers[tier.id]) }}</span>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Note -->
    <div class="flex items-center gap-2 mt-8 text-xs text-[var(--vp-c-text-3)] leading-relaxed">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="shrink-0 mt-[1px] w-3.5 h-3.5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true">
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
          @click="closeDialog"
          aria-label="Close">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button>
        <div class="text-base font-semibold text-[var(--vp-c-text-1)] text-center">{{ t.qrTitle }}</div>
        <div class="w-[160px] h-[160px] rounded-xl overflow-hidden bg-white p-2 flex items-center justify-center">
          <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Code" class="w-full h-full" />
          <div v-else class="w-full h-full bg-[var(--vp-c-default-soft)] animate-pulse rounded-lg"></div>
        </div>
        <p class="text-sm text-[var(--vp-c-text-2)] text-center leading-relaxed m-0">{{ t.qrDesc }}</p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.pricing-card-cta:hover {
  background: var(--tier-color) !important;
  color: #fff !important;
}
.addon-cta:hover {
  background: var(--vp-c-text-1) !important;
  color: var(--vp-c-bg) !important;
}
</style>
