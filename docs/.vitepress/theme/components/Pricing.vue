<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

interface Tier {
  id: string
  name: string
  badge?: string
  price: string
  priceSub: string
  description: string
  markets: string[]
  highlight: boolean
  cta: string
  ctaHref: string
}

interface FeatureRow {
  category: string
  name: string
  tiers: Record<string, boolean | string>
}

const t = computed(() => {
  const zh = lang.value.startsWith('zh')
  return {
    heroTitle: zh ? '行情权限定价' : 'Market Data Pricing',
    heroSubtitle: zh
      ? '按需选择行情权限，解锁更多 OpenAPI 数据能力'
      : 'Choose the market data plan that fits your needs and unlock more OpenAPI capabilities',
    noteTitle: zh ? '说明' : 'Note',
    noteText: zh
      ? 'OpenAPI 行情权限独立于 App / PC / Web，需单独购买。基础行情（BMP）免费赠送，更高级别权限通过 Longbridge App「行情商店」购买后激活。'
      : 'OpenAPI quote permissions are independent from App / PC / Web and must be purchased separately. Basic quotes (BMP) are included free. Higher-level permissions are activated after purchase in the Longbridge App "Quote Store".',
    marketsLabel: zh ? '覆盖市场' : 'Markets',
    ctaFree: zh ? '免费使用' : 'Free',
    ctaPurchase: zh ? '前往购买' : 'Purchase',
    featureTableTitle: zh ? '功能对比' : 'Feature Comparison',
    categoryPull: zh ? '拉取接口' : 'Pull APIs',
    categoryPush: zh ? '推送 / 订阅' : 'Push / Subscribe',
    categoryData: zh ? '数据范围' : 'Data Coverage',
    yes: '✓',
    no: '–',
    partial: zh ? '部分' : 'Partial',
    tierLabels: {
      free: zh ? '免费 (BMP)' : 'Free (BMP)',
      lv1: zh ? 'LV1 实时' : 'LV1 Real-time',
      lv2: zh ? 'LV2 实时' : 'LV2 Real-time',
    },
  }
})

const tiers = computed<Tier[]>(() => {
  const zh = lang.value.startsWith('zh')
  return [
    {
      id: 'free',
      name: zh ? '免费 (BMP)' : 'Free (BMP)',
      price: zh ? '¥0' : '$0',
      priceSub: zh ? '开通账户即享' : 'included with account',
      description: zh
        ? '基础延迟行情，适合策略研究和历史数据分析'
        : 'Basic delayed quotes for strategy research and historical data analysis',
      markets: zh
        ? ['港股（延迟/快照）', '美股 Nasdaq Basic', 'A股（基础）', '新加坡股（基础）']
        : ['HK (delayed/snapshot)', 'US Nasdaq Basic', 'CN (basic)', 'SG (basic)'],
      highlight: false,
      cta: zh ? '免费使用' : 'Get started free',
      ctaHref: 'https://open.longbridge.com',
    },
    {
      id: 'lv1',
      name: zh ? 'LV1 实时行情' : 'LV1 Real-time',
      badge: zh ? '推荐' : 'Popular',
      price: zh ? '按市场计费' : 'Per market',
      priceSub: zh ? '在 Longbridge App 购买' : 'purchase in Longbridge App',
      description: zh
        ? '全市场实时推送、隔夜美股行情，适合量化与实盘交易'
        : 'Real-time push across all markets with US overnight data — ideal for quant and live trading',
      markets: zh
        ? ['港股 LV1 实时', '美股 LV1 Nasdaq', 'A股 LV1 实时', '新加坡股 LV1']
        : ['HK LV1 real-time', 'US LV1 Nasdaq', 'CN LV1 real-time', 'SG LV1'],
      highlight: true,
      cta: zh ? '前往购买' : 'Purchase',
      ctaHref: 'https://open.longbridge.com',
    },
    {
      id: 'lv2',
      name: zh ? 'LV2 实时行情' : 'LV2 Real-time',
      price: zh ? '按市场计费' : 'Per market',
      priceSub: zh ? '在 Longbridge App 购买' : 'purchase in Longbridge App',
      description: zh
        ? '完整十档买卖盘口深度与券商持仓队列，港股专属'
        : 'Full 10-level order book depth and broker queues — HK market only',
      markets: zh ? ['港股 LV2 实时'] : ['HK LV2 real-time'],
      highlight: false,
      cta: zh ? '前往购买' : 'Purchase',
      ctaHref: 'https://open.longbridge.com',
    },
  ]
})

const featureRows = computed<FeatureRow[]>(() => {
  const zh = lang.value.startsWith('zh')
  return [
    // Data coverage
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '港股市场' : 'HK Market',
      tiers: { free: zh ? '延迟/快照' : 'Delayed/Snapshot', lv1: zh ? 'LV1 实时' : 'LV1 Real-time', lv2: zh ? 'LV2 实时' : 'LV2 Real-time' },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '美股市场' : 'US Market',
      tiers: { free: 'Nasdaq Basic', lv1: zh ? 'LV1 Nasdaq 实时' : 'LV1 Nasdaq Real-time', lv2: zh ? 'LV1 Nasdaq 实时' : 'LV1 Nasdaq Real-time' },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? 'A股市场' : 'CN Market',
      tiers: { free: zh ? '基础' : 'Basic', lv1: zh ? 'LV1 实时' : 'LV1 Real-time', lv2: zh ? 'LV1 实时' : 'LV1 Real-time' },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '新加坡市场' : 'SG Market',
      tiers: { free: zh ? '基础' : 'Basic', lv1: zh ? 'LV1 实时' : 'LV1 Real-time', lv2: zh ? 'LV1 实时' : 'LV1 Real-time' },
    },
    {
      category: zh ? '数据范围' : 'Data Coverage',
      name: zh ? '美股隔夜行情' : 'US Overnight Quotes',
      tiers: { free: false, lv1: true, lv2: true },
    },
    // Pull APIs
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
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '逐笔成交' : 'Tick Trades',
      tiers: { free: false, lv1: true, lv2: true },
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
      name: zh ? '资金流向（日内）' : 'Capital Flow Intraday',
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '资金分布' : 'Capital Distribution',
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '计算指标' : 'Calc Indexes',
      tiers: { free: false, lv1: true, lv2: true },
    },
    {
      category: zh ? '拉取接口' : 'Pull APIs',
      name: zh ? '权证/期权数据' : 'Warrant / Option Data',
      tiers: { free: false, lv1: true, lv2: true },
    },
    // Push / Subscribe
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

function cellValue(val: boolean | string): string {
  if (val === true) return '✓'
  if (val === false) return '–'
  return String(val)
}

function cellClass(val: boolean | string): string {
  if (val === true) return 'cell-yes'
  if (val === false) return 'cell-no'
  return 'cell-text'
}
</script>

<template>
  <div class="pricing-page">
    <div class="pricing-hero">
      <h1 class="pricing-hero-title">{{ t.heroTitle }}</h1>
      <p class="pricing-hero-sub">{{ t.heroSubtitle }}</p>
    </div>

    <div class="pricing-note">
      <strong>{{ t.noteTitle }}:</strong> {{ t.noteText }}
    </div>

    <div class="pricing-cards">
      <div
        v-for="tier in tiers"
        :key="tier.id"
        :class="['pricing-card', tier.highlight && 'pricing-card--highlight']"
      >
        <div v-if="tier.badge" class="pricing-card-badge">{{ tier.badge }}</div>
        <div class="pricing-card-name">{{ tier.name }}</div>
        <div class="pricing-card-price">
          {{ tier.price }}
          <span class="pricing-card-price-sub">{{ tier.priceSub }}</span>
        </div>
        <p class="pricing-card-desc">{{ tier.description }}</p>
        <div class="pricing-card-markets">
          <div class="pricing-card-markets-label">{{ t.marketsLabel }}</div>
          <ul class="pricing-card-markets-list">
            <li v-for="m in tier.markets" :key="m">{{ m }}</li>
          </ul>
        </div>
        <a :href="tier.ctaHref" target="_blank" rel="noopener" :class="['pricing-card-cta', tier.highlight && 'pricing-card-cta--primary']">
          {{ tier.cta }}
        </a>
      </div>
    </div>

    <h2 class="pricing-table-title">{{ t.featureTableTitle }}</h2>

    <div class="pricing-table-wrap">
      <table class="pricing-table">
        <thead>
          <tr>
            <th class="col-feature"></th>
            <th v-for="tier in tiers" :key="tier.id" :class="['col-tier', tier.highlight && 'col-tier--highlight']">
              {{ tier.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="cat in categories" :key="cat">
            <tr class="category-row">
              <td :colspan="tiers.length + 1">{{ cat }}</td>
            </tr>
            <tr v-for="row in rowsForCategory(cat)" :key="row.name">
              <td class="feature-name">{{ row.name }}</td>
              <td
                v-for="tier in tiers"
                :key="tier.id"
                :class="['feature-cell', cellClass(row.tiers[tier.id])]"
              >
                {{ cellValue(row.tiers[tier.id]) }}
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.pricing-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
}

.pricing-hero {
  text-align: center;
  margin-bottom: 2rem;
}

.pricing-hero-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 0.75rem;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.pricing-hero-sub {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

.pricing-note {
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.pricing-card {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  background: var(--vp-c-bg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pricing-card--highlight {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.pricing-card-badge {
  position: absolute;
  top: -0.6rem;
  left: 1.25rem;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.pricing-card-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.pricing-card-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.pricing-card-price-sub {
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.pricing-card-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.55;
}

.pricing-card-markets-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.35rem;
}

.pricing-card-markets-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pricing-card-markets-list li {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  padding-left: 1rem;
  position: relative;
}

.pricing-card-markets-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
}

.pricing-card-cta {
  display: block;
  text-align: center;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  margin-top: auto;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.pricing-card-cta:hover {
  background: var(--vp-c-default-soft);
  border-color: var(--vp-c-text-3);
}

.pricing-card-cta--primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}

.pricing-card-cta--primary:hover {
  background: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}

.pricing-table-title {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: var(--vp-c-text-1);
}

.pricing-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.pricing-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.pricing-table th,
.pricing-table td {
  padding: 0.6rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: middle;
}

.pricing-table tbody tr:last-child td {
  border-bottom: none;
}

.pricing-table thead th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}

.col-feature {
  width: 36%;
}

.col-tier {
  width: calc(64% / 3);
  text-align: center;
}

.col-tier--highlight {
  color: var(--vp-c-brand-1);
}

.category-row td {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3);
  padding: 0.4rem 1rem;
}

.feature-name {
  color: var(--vp-c-text-2);
}

.feature-cell {
  text-align: center;
  font-size: 0.875rem;
  white-space: nowrap;
}

.cell-yes {
  color: var(--vp-c-green-1, #22c55e);
  font-weight: 600;
  font-size: 1rem;
}

.cell-no {
  color: var(--vp-c-text-3);
}

.cell-text {
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
}
</style>
