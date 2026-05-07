<script setup lang="ts">
import { computed, ref } from 'vue'
import { useData } from 'vitepress'
import { localePath } from '../utils/i18n'

const { lang } = useData()

const props = defineProps<{ screenMenu?: boolean }>()

const isOpen = ref(false)
let closeTimer: ReturnType<typeof setTimeout> | null = null

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
}

type FeatureItem = { title: string; desc: string; link: string; icon: string }

const i18n: Record<string, FeatureItem[]> = {
  en: [
    {
      title: 'Live Market Quotes',
      desc: 'Live prices & order book depth for global markets',
      link: '/docs/cli/market-data/quote',
      icon: icons.quote,
    },
    {
      title: 'Price History',
      desc: 'OHLCV candlestick & intraday historical data',
      link: '/docs/cli/market-data/kline',
      icon: icons.kline,
    },
    {
      title: 'Financial Statements',
      desc: 'Earnings, balance sheet & cash flow data',
      link: '/docs/cli/fundamentals/financial-report',
      icon: icons.report,
    },
    {
      title: 'Analyst Estimates',
      desc: 'Consensus forecasts & institutional ratings',
      link: '/docs/cli/fundamentals/consensus',
      icon: icons.consensus,
    },
    { title: 'Company News', desc: 'Breaking news & market updates', link: '/docs/cli/content/news', icon: icons.news },
    {
      title: 'SEC Filings',
      desc: 'Annual reports, earnings & regulatory documents',
      link: '/docs/cli/content/filing',
      icon: icons.filing,
    },
    {
      title: 'Institutional',
      desc: 'Fund holdings & position changes',
      link: '/docs/cli/research/investors',
      icon: icons.investors,
    },
    {
      title: 'Options & Warrants',
      desc: 'Derivatives pricing, chain & screening data',
      link: '/docs/cli/derivatives/option',
      icon: icons.option,
    },
    {
      title: 'Order Execution',
      desc: 'Trade orders, portfolio & account management',
      link: '/docs/cli/orders/order',
      icon: icons.order,
    },
  ],
  'zh-CN': [
    {
      title: '实时行情报价',
      desc: '全球市场实时价格与盘口深度数据',
      link: '/docs/cli/market-data/quote',
      icon: icons.quote,
    },
    { title: '历史价格', desc: 'OHLCV K 线与日内历史行情数据', link: '/docs/cli/market-data/kline', icon: icons.kline },
    {
      title: '财务报表',
      desc: '盈利、资产负债表与现金流量数据',
      link: '/docs/cli/fundamentals/financial-report',
      icon: icons.report,
    },
    {
      title: '分析师预测',
      desc: '机构评级与一致性盈利预期数据',
      link: '/docs/cli/fundamentals/consensus',
      icon: icons.consensus,
    },
    { title: '公司新闻', desc: '实时财经资讯与市场动态', link: '/docs/cli/content/news', icon: icons.news },
    { title: '年报公告', desc: '年报、季报及监管申报文件', link: '/docs/cli/content/filing', icon: icons.filing },
    {
      title: '机构持仓',
      desc: '基金持仓明细与仓位变动数据',
      link: '/docs/cli/research/investors',
      icon: icons.investors,
    },
    {
      title: '期权与权证',
      desc: '衍生品定价、期权链与筛选数据',
      link: '/docs/cli/derivatives/option',
      icon: icons.option,
    },
    { title: '委托交易', desc: '交易委托、组合管理与账户操作', link: '/docs/cli/orders/order', icon: icons.order },
  ],
  'zh-HK': [
    {
      title: '實時行情報價',
      desc: '全球市場實時價格與盤口深度數據',
      link: '/docs/cli/market-data/quote',
      icon: icons.quote,
    },
    { title: '歷史價格', desc: 'OHLCV K 線與日內歷史行情數據', link: '/docs/cli/market-data/kline', icon: icons.kline },
    {
      title: '財務報表',
      desc: '盈利、資產負債表與現金流量數據',
      link: '/docs/cli/fundamentals/financial-report',
      icon: icons.report,
    },
    {
      title: '分析師預測',
      desc: '機構評級與一致性盈利預期數據',
      link: '/docs/cli/fundamentals/consensus',
      icon: icons.consensus,
    },
    { title: '公司新聞', desc: '實時財經資訊與市場動態', link: '/docs/cli/content/news', icon: icons.news },
    { title: '年報財報', desc: '年報、季報及監管申報文件', link: '/docs/cli/content/filing', icon: icons.filing },
    {
      title: '機構持倉',
      desc: '基金持倉明細與倉位變動數據',
      link: '/docs/cli/research/investors',
      icon: icons.investors,
    },
    {
      title: '期權與認股證',
      desc: '衍生品定價、期權鏈與篩選數據',
      link: '/docs/cli/derivatives/option',
      icon: icons.option,
    },
    { title: '委託交易', desc: '交易委託、組合管理與賬戶操作', link: '/docs/cli/orders/order', icon: icons.order },
  ],
}

const features = computed(() => i18n[lang.value] ?? i18n.en)

const menuLabel = computed(() => ({ en: 'Features', 'zh-CN': '功能', 'zh-HK': '功能' })[lang.value] ?? 'Features')

function open() {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  isOpen.value = true
}

function close() {
  closeTimer = setTimeout(() => {
    isOpen.value = false
    closeTimer = null
  }, 150)
}
</script>

<template>
  <!-- Mobile screen menu layout -->
  <div v-if="props.screenMenu" class="screen-menu-group" :class="{ open: isOpen }">
    <button class="screen-menu-button" @click="isOpen = !isOpen">
      <span>{{ menuLabel }}</span>
      <span class="vpi-plus screen-menu-icon" />
    </button>
    <div class="screen-menu-items">
      <a
        v-for="item in features"
        :key="item.title"
        :href="localePath(item.link)"
        class="screen-menu-link"
        @click="isOpen = false"
        >{{ item.title }}</a
      >
    </div>
  </div>

  <!-- Desktop hover dropdown layout -->
  <div v-else class="relative flex items-center px-3" @mouseenter="open" @mouseleave="close">
    <button
      class="flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-[inherit] text-sm font-medium whitespace-nowrap transition-colors duration-250"
      :class="isOpen ? 'text-[var(--vp-c-brand-1)]' : 'text-[var(--vp-c-text-1)] hover:text-[var(--vp-c-brand-1)]'">
      {{ menuLabel }}
      <svg
        class="opacity-70 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="dropdown-panel absolute top-[calc(100%-8px)] left-1/2 z-100 w-160 overflow-hidden rounded-xl border border-[var(--vp-c-divider)] bg-[var(--vp-c-bg)] p-2 shadow-lg dark:shadow-2xl">
        <div class="grid grid-cols-3 gap-1">
          <a
            v-for="item in features"
            :key="item.title"
            :href="localePath(item.link)"
            class="flex min-w-0 flex-col gap-1 rounded-lg p-3 no-underline transition-colors duration-150 hover:bg-[var(--vp-c-bg-soft)]"
            @click="isOpen = false">
            <div class="flex items-center gap-2 overflow-hidden">
              <svg
                class="size-4 shrink-0 text-[var(--vp-c-brand-1)]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                v-html="item.icon" />
              <div class="truncate text-sm font-semibold text-[var(--vp-c-text-1)]">{{ item.title }}</div>
            </div>
            <div
              class="line-clamp-2 w-full overflow-hidden whitespace-normal text-xs leading-normal text-[var(--vp-c-text-2)]">
              {{ item.desc }}
            </div>
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.screen-menu-group {
  border-bottom: 1px solid var(--vp-c-divider);
  height: 48px;
  overflow: hidden;
  transition: border-color 0.5s;
}

.screen-menu-group.open {
  padding-bottom: 10px;
  height: auto;
}

.screen-menu-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 4px 11px 0;
  width: 100%;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: color 0.25s;
}

.screen-menu-group.open .screen-menu-button {
  color: var(--vp-c-brand-1);
}

.screen-menu-icon {
  transition: transform 0.25s;
}

.screen-menu-group.open .screen-menu-icon {
  transform: rotate(45deg);
}

.screen-menu-items {
  display: flex;
  flex-direction: column;
}

.screen-menu-link {
  display: block;
  padding: 4px 0 4px 16px;
  line-height: 28px;
  font-size: 14px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
}

.screen-menu-link:hover {
  color: var(--vp-c-brand-1);
}

.dropdown-panel {
  transform: translateX(-50%) translateZ(0);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateZ(0) translateY(-4px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateX(-50%) translateZ(0) translateY(0);
}
</style>
