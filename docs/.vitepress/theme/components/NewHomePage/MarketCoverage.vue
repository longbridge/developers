<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const markets = [
  {
    key: 'hk',
    flag: `<svg viewBox="0 0 640 480"><path fill="#de2910" d="M0 0h640v480H0z"/><g fill="#fff" transform="translate(320 240) scale(6)"><polygon points="0,-12 3.5,-3.5 12,-3.5 5,2.5 7.5,12 0,6.5 -7.5,12 -5,2.5 -12,-3.5 -3.5,-3.5"/></g></svg>`,
    products: ['Stocks', 'ETFs', 'Warrants', 'CBBC'],
    quote: true,
    trade: true,
    example: '700.HK',
  },
  {
    key: 'us',
    flag: `<svg viewBox="0 0 640 480"><path fill="#bd3d44" d="M0 0h640v37h-640zm0 74h640v37h-640zm0 148h640v37h-640zm0 74h640v37h-640z"/><path fill="#fff" d="M0 37h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640z"/><path fill="#192f5d" d="M0 0h260v260H0z"/></svg>`,
    products: ['Stocks', 'ETFs', 'Options'],
    quote: true,
    trade: true,
    example: 'AAPL.US',
  },
  {
    key: 'cn',
    flag: `<svg viewBox="0 0 640 480"><path fill="#de2910" d="M0 0h640v480H0z"/><g fill="#ff0" transform="translate(96 72) scale(4.8)"><polygon points="0,-12 3.5,-3.5 12,-3.5 5,2.5 7.5,12 0,6.5 -7.5,12 -5,2.5 -12,-3.5 -3.5,-3.5"/></g></svg>`,
    products: ['A-Shares', 'ETFs', 'Indexes'],
    quote: true,
    trade: false,
    example: '600519.SH',
  },
  {
    key: 'sg',
    flag: `<svg viewBox="0 0 640 480"><path fill="#ed2939" d="M0 0h640v240H0z"/><path fill="#fff" d="M0 240h640v240H0z"/></svg>`,
    products: ['Stocks'],
    quote: true,
    trade: false,
    example: 'D05.SG',
  },
]
</script>

<template>
  <section class="mc-section">
    <div class="mc-grid">
      <!-- Title as inline label in grid -->
      <div class="mc-label-cell">
        <span class="mc-label-tag">{{ $t('market.title') }}</span>
        <p class="mc-label-desc">{{ $t('market.subtitle') }}</p>
      </div>
      <div v-for="m in markets" :key="m.key" class="mc-card">
        <div class="mc-card-top">
          <span class="mc-flag" v-html="m.flag" />
          <div>
            <h3 class="mc-market-name">{{ $t(`market.${m.key}.name`) }}</h3>
            <code class="mc-example">{{ m.example }}</code>
          </div>
        </div>
        <div class="mc-products">
          <span v-for="p in m.products" :key="p" class="mc-product">{{ p }}</span>
        </div>
        <div class="mc-caps">
          <span class="mc-cap" :class="{ enabled: m.quote }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline v-if="m.quote" points="20 6 9 17 4 12"/><line v-else x1="18" y1="6" x2="6" y2="18"/></svg>
            Quote
          </span>
          <span class="mc-cap" :class="{ enabled: m.trade }">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><polyline v-if="m.trade" points="20 6 9 17 4 12"/><line v-else x1="18" y1="6" x2="6" y2="18"/></svg>
            Trade
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mc-section { padding: 3rem 0 4rem; background: var(--vp-c-bg-soft); }

.mc-grid {
  display: grid;
  grid-template-columns: 1fr repeat(4, 1fr);
  gap: 0.75rem;
  max-width: 56rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  align-items: center;
}

/* Label cell — replaces centered header */
.mc-label-cell {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem;
}

.mc-label-tag {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.01em;
}

.mc-label-desc {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
}

.mc-card {
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  transition: all 0.25s;
}
.mc-card:hover {
  border-color: color-mix(in srgb, var(--brand-color) 30%, var(--vp-c-divider));
  box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-color) 5%, transparent);
}

.mc-card-top { display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.75rem; }

.mc-flag { display: flex; width: 1.75rem; height: 1.25rem; border-radius: 3px; overflow: hidden; flex-shrink: 0; border: 1px solid var(--vp-c-divider); }
.mc-flag :deep(svg) { width: 100%; height: 100%; }

.mc-market-name { font-size: 0.85rem; font-weight: 700; color: var(--vp-c-text-1); }
.mc-example { font-size: 0.65rem; font-family: var(--vp-font-family-mono); color: var(--vp-c-text-3); }

.mc-products { display: flex; flex-wrap: wrap; gap: 0.25rem; margin-bottom: 0.625rem; }
.mc-product {
  padding: 0.125rem 0.375rem; border-radius: 0.1875rem;
  font-size: 0.65rem; font-weight: 600;
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
  color: var(--brand-color);
}

.mc-caps { display: flex; gap: 0.5rem; }
.mc-cap {
  display: inline-flex; align-items: center; gap: 0.2rem;
  font-size: 0.65rem; font-weight: 600; color: var(--vp-c-text-3);
}
.mc-cap.enabled { color: var(--brand-color); }
.mc-cap svg { flex-shrink: 0; }

@media (max-width: 768px) {
  .mc-grid { grid-template-columns: repeat(2, 1fr); }
  .mc-label-cell { grid-column: span 2; grid-row: span 1; text-align: center; }
}
@media (max-width: 480px) {
  .mc-grid { grid-template-columns: 1fr; }
  .mc-label-cell { grid-column: span 1; }
}
</style>
