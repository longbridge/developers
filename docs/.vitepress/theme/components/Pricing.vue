<script setup lang="ts">
import { ref, computed } from 'vue'
import AppNav from './AppNav.vue'
import AppFooter from './AppFooter.vue'
import { localePath } from '../utils/i18n'

const FREE_BASELINE = [
  {
    icon: 'shield',
    color: 'var(--lb-up)',
    title: 'Trading & Account APIs',
    price: 'Free',
    desc: 'Fundamentals, analysis, news, assets, orders — every core API is free.',
  },
  {
    icon: 'chart',
    color: 'var(--lb-status-neutral)',
    title: 'Basic Market Data',
    price: 'Free',
    desc: 'Nasdaq Basic, HK Level 1, CN Level 1 — bundled with your account.',
  },
  {
    icon: 'bolt',
    color: 'var(--lb-brand)',
    title: 'Push & Pull Data',
    price: 'Free',
    desc: 'WebSocket real-time push and REST API pull — unlimited.',
  },
]

const BILLING_CYCLES = [
  { key: 'monthly', label: 'Monthly', mult: 1.0 },
  { key: 'quarterly', label: 'Quarterly', mult: 0.92 },
  { key: 'annual', label: 'Annual', mult: 0.78, badge: 'Best' },
]

const PAID_PLANS = [
  {
    id: 'us-lv1',
    market: 'US Market',
    name: 'US LV1 Real-time',
    base: 558,
    currency: 'HK$',
    suffix: '/mo',
    tagline: 'Nasdaq LV1 real-time quotes with best bid/ask, including pre / post-market.',
    coverage: 'US market only',
    color: 'var(--lb-market-us)',
    feats: ['Nasdaq LV1 real-time quotes', 'Pre / post-market (overnight)', 'WebSocket real-time push'],
  },
  {
    id: 'hk-lv2',
    market: 'HK Market',
    name: 'HK LV2 Advanced',
    base: 558,
    currency: 'HK$',
    suffix: '/mo',
    badge: 'Global (incl. HK)',
    tagline: 'HKEX real-time quotes with 10-level order book and broker queue.',
    coverage: 'HK market only (excludes US)',
    color: 'var(--lb-market-hk)',
    feats: ['10-level bid/ask depth', 'Real-time depth push', 'Broker queue (HK)'],
  },
  {
    id: 'opra',
    market: 'US Options',
    name: 'OPRA US Options',
    base: 22,
    currency: 'HK$',
    suffix: '/mo',
    tagline: 'US options real-time quotes with best bid/ask — sold separately, any tier.',
    coverage: 'Adds onto any tier',
    color: 'var(--lb-ai-mention)',
    feats: ['Option chain lookup', 'Real-time option quotes', 'Option quote push'],
  },
]

const FEATURE_MATRIX_PLANS = [
  { key: 'nasdaq-basic', label: 'Nasdaq Basic', tag: 'Free', color: 'var(--lb-up)' },
  { key: 'us-lv1', label: 'US LV1', tag: 'Paid', color: 'var(--lb-market-us)' },
  { key: 'opra', label: 'OPRA', tag: 'Paid', color: 'var(--lb-ai-mention)' },
  { key: 'hk-lv1', label: 'HK LV1', tag: 'Free (promo)', color: 'var(--lb-up)' },
  { key: 'hk-lv2', label: 'HK LV2', tag: 'Paid', color: 'var(--lb-market-hk)' },
  { key: 'cn-lv1', label: 'CN LV1', tag: 'Free (promo)', color: 'var(--lb-up)' },
]

const FEATURE_MATRIX = [
  { f: 'Basic APIs', g: 'Core', row: [1, 1, 1, 1, 1, 1] },
  { f: 'WebSocket real-time push', g: 'Core', row: [1, 1, 1, 1, 1, 1] },
  { f: 'Pull quote (REST)', g: 'Core', row: [1, 1, 1, 1, 1, 1] },
  { f: 'US best bid/ask', g: 'US', row: [1, 1, 0, 0, 0, 0] },
  { f: 'Pre / post-market (overnight)', g: 'US', row: [0, 1, 0, 0, 0, 0] },
  { f: 'Option chain & real-time quotes', g: 'Options', row: [0, 0, 1, 0, 0, 0] },
  { f: 'HK real-time (basic)', g: 'HK', row: [0, 0, 0, 1, 1, 0] },
  { f: 'Hang Seng Index', g: 'HK', row: [0, 0, 0, 1, 1, 0] },
  { f: 'HK 10-level order book', g: 'HK', row: [0, 0, 0, 0, 1, 0] },
  { f: 'Real-time depth push', g: 'HK', row: [0, 0, 0, 0, 1, 0] },
  { f: 'Broker queue (HK)', g: 'HK', row: [0, 0, 0, 0, 1, 0] },
  { f: 'CN A-shares real-time', g: 'CN', row: [0, 0, 0, 0, 0, 1] },
]

const FAQ = [
  [
    'Are OpenAPI quote subscriptions separate from the App?',
    'Yes. OpenAPI quote permissions are independent from App / PC / Web. Activate via Longbridge App → Me → Quote Store.',
  ],
  [
    'Do I need a subscription to test the API?',
    'No. Trading, account, and fundamentals APIs are free. You can also use Basic Market Data tiers (Nasdaq Basic, HK LV1, CN LV1) for free.',
  ],
  [
    'Can I cancel anytime?',
    'Yes. Cancel any time before the next billing cycle. Quote permissions stay active until the end of the paid period.',
  ],
  [
    'What about paper trading?',
    'Paper trading runs against the canary environment with simulated matching on live bid-ask spreads. Free for all integrated accounts — no quote subscription required.',
  ],
  [
    'Are there usage limits on REST or WebSocket?',
    'No hard usage caps. Rate limits scale with your account tier. See the Rate Limits doc for details.',
  ],
  [
    'What payment methods are accepted?',
    'All payments are processed through your Longbridge account. Settled in HKD; cross-currency settled at exchange-rate.',
  ],
]

const cycle = ref('annual')
const currentCycle = computed(() => BILLING_CYCLES.find((c) => c.key === cycle.value)!)

function cyclePrice(base: number) {
  return Math.round(base * currentCycle.value.mult)
}
function cycleDiscount(base: number) {
  const off = Math.round((1 - currentCycle.value.mult) * 100)
  return off > 0 ? off : 0
}

// Group rows — build a flat list with group separators
interface MatrixRow {
  type: 'group' | 'row'
  label?: string
  f?: string
  row?: number[]
}
const matrixRows = computed<MatrixRow[]>(() => {
  const result: MatrixRow[] = []
  let lastGroup = ''
  for (const m of FEATURE_MATRIX) {
    if (m.g !== lastGroup) {
      result.push({ type: 'group', label: m.g })
      lastGroup = m.g
    }
    result.push({ type: 'row', f: m.f, row: m.row })
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
          <span class="eyebrow">PRICING</span>
          <h1 class="h-display" style="margin-top: 20px; font-size: clamp(40px, 5vw, 60px)">
            Build for free.
            <br />
            <span style="color: var(--lb-brand)">Pay only for real-time market data.</span>
          </h1>
          <p class="t-body" style="margin-top: 20px; max-width: 580px; margin-left: auto; margin-right: auto">
            Core API features — trading, accounts, fundamentals, news — are completely free. Subscribe to real-time
            market data only when you need it.
          </p>
        </div>
      </div>
    </section>

    <!-- Free Baseline -->
    <section class="section" style="padding-top: 32px">
      <div class="section-inner">
        <div class="pricing-free-grid">
          <div v-for="b in FREE_BASELINE" :key="b.title" class="pricing-free-card">
            <div class="pricing-free-head">
              <div
                class="pricing-free-icon"
                :style="{ background: `color-mix(in srgb, ${b.color} 14%, transparent)`, color: b.color }">
                <!-- shield -->
                <svg
                  v-if="b.icon === 'shield'"
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
                  v-else-if="b.icon === 'chart'"
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
                  v-else-if="b.icon === 'bolt'"
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
              <span class="pricing-free-price">{{ b.price }}</span>
            </div>
            <h3 class="h-card" style="margin-top: 16px">{{ b.title }}</h3>
            <p class="t-meta" style="margin-top: 8px; line-height: 1.55">{{ b.desc }}</p>
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
            <span class="eyebrow">REAL-TIME MARKET DATA</span>
            <h2 class="h-section" style="margin-top: 14px">Subscribe only to what you need.</h2>
            <p class="t-meta" style="margin-top: 10px; line-height: 1.55">
              OpenAPI quote permissions are independent from App / PC / Web and must be purchased separately. Activate
              via Longbridge App → Me → Quote Store.
            </p>
          </div>

          <div class="pricing-cycle">
            <span class="pricing-cycle-label">Billing</span>
            <div class="pricing-cycle-tabs">
              <button
                v-for="c in BILLING_CYCLES"
                :key="c.key"
                :class="['pricing-cycle-tab', c.key === cycle ? 'is-active' : '']"
                @click="cycle = c.key">
                {{ c.label }}
                <span v-if="c.badge" class="pricing-cycle-badge">{{ c.badge }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="pricing-plans-grid">
          <div v-for="p in PAID_PLANS" :key="p.id" class="pricing-plan-card">
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
              <span class="pricing-plan-cur">{{ p.currency }}</span>
              <span class="pricing-plan-num">{{ cyclePrice(p.base) }}</span>
              <span class="pricing-plan-suf">{{ p.suffix }}</span>
              <span v-if="cycleDiscount(p.base) > 0" class="pricing-plan-discount">-{{ cycleDiscount(p.base) }}%</span>
            </div>
            <div v-if="cycleDiscount(p.base) > 0" class="pricing-plan-was">
              Was <s>{{ p.currency }}{{ p.base }}{{ p.suffix }}</s> · billed {{ currentCycle.label.toLowerCase() }}
            </div>
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
              <li v-for="f in p.feats" :key="f">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l4.5 4.5 9.5-9.5"
                    :stroke="p.color"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
                <span>{{ f }}</span>
              </li>
            </ul>
            <a
              class="btn btn-primary pricing-plan-cta"
              href="https://longbridge.com/download"
              target="_blank"
              rel="noreferrer">
              Subscribe
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
          <span class="eyebrow">FEATURE COMPARISON</span>
          <h2 class="h-section" style="margin-top: 14px">What's included in each plan.</h2>
        </div>
        <div class="pricing-matrix-wrap">
          <table class="pricing-matrix">
            <thead>
              <tr>
                <th class="pricing-matrix-feat-h"></th>
                <th v-for="p in FEATURE_MATRIX_PLANS" :key="p.key">
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
                  <td :colspan="FEATURE_MATRIX_PLANS.length + 1">{{ r.label }}</td>
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
          <span class="eyebrow">FAQ</span>
          <h2 class="h-section" style="margin-top: 14px">Frequently asked questions</h2>
        </div>
        <div class="pricing-faq-grid">
          <div v-for="[q, a] in FAQ" :key="q" class="pricing-faq-card">
            <h4 class="pricing-faq-q">{{ q }}</h4>
            <p class="pricing-faq-a">{{ a }}</p>
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
.pricing-cycle-tab {
  padding: 7px 14px;
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
}
.pricing-cycle-tab.is-active .pricing-cycle-badge {
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
  background: var(--lb-bg-2);
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
</style>
