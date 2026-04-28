<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
// Compact layout only

const { t } = useI18n()
// Single layout — Compact only

const caps = [
  {
    key: 'quote',
    link: '/docs/quote/overview',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
    features: [
      'Real-time quotes',
      'Order book depth',
      'Candlestick charts',
      'Intraday timeline',
      'Capital flow',
      'WebSocket push',
    ],
    count: 30,
  },
  {
    key: 'trade',
    link: '/docs/trade/overview',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
    features: ['Submit orders', 'Modify & cancel', 'Positions & balance', 'Execution history', 'Order status push'],
    count: 14,
  },
  {
    key: 'derivatives',
    link: '/docs/cli/derivatives/option',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>`,
    features: ['Option chains + Greeks', 'Warrant filtering', 'Issuer directory', 'Derivative quotes'],
    count: 8,
  },
  {
    key: 'research',
    link: '/docs/cli/fundamentals/financial-report',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    features: ['Financial statements', 'Valuation metrics', 'Dividend history', 'EPS forecasts', 'Analyst ratings'],
    count: 7,
  },
  {
    key: 'content',
    link: '/docs/content/news',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/><line x1="10" y1="6" x2="18" y2="6"/><line x1="10" y1="10" x2="18" y2="10"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
    features: ['News feeds', 'Community topics', 'Discussions', 'Engagement data'],
    count: 8,
  },
]
</script>

<template>
  <section class="cap-section">
    <div class="cap-content">
      <div class="cap-header">
        <h2 class="cap-title">{{ $t('cap.title') }}</h2>
        <p class="cap-subtitle">{{ $t('cap.subtitle') }}</p>
      </div>

      <div class="cap-compact">
        <a v-for="cap in caps" :key="cap.key" :href="cap.link" class="cc-card">
          <div class="cc-top">
            <span class="cc-icon" v-html="cap.icon" />
            <div class="cc-info">
              <span class="cc-name">{{ $t(`cap.${cap.key}`) }}</span>
              <span class="cc-desc">{{ $t(`cap.${cap.key}.desc`) }}</span>
            </div>
            <span class="cc-count">{{ cap.count }}+</span>
          </div>
          <div class="cc-tags">
            <span v-for="f in cap.features" :key="f" class="cc-tag">{{ f }}</span>
          </div>
        </a>
      </div>

      <!-- V2: Table — structured data table with columns -->
    </div>
  </section>
</template>

<style scoped>
.cap-section {
  padding: 4rem 0;
  background: var(--vp-c-bg-soft);
}
.cap-content {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.cap-header {
  margin-bottom: 1.5rem;
}
.cap-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.cap-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
}

/* ========== V1: Compact Cards ========== */
.cap-compact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cc-card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none !important;
  transition: border-color 0.2s;
}
.cc-card:hover {
  border-color: color-mix(in srgb, var(--brand-color) 40%, var(--vp-c-divider));
}
.cc-card:hover .cc-icon {
  color: var(--brand-color);
  animation: cc-icon-pulse 0.6s ease;
}
@keyframes cc-icon-pulse {
  0% {
    transform: scale(1);
  }
  40% {
    transform: scale(1.2) rotate(-5deg);
  }
  100% {
    transform: scale(1);
  }
}

.cc-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.cc-icon {
  display: flex;
  width: 1.125rem;
  height: 1.125rem;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.cc-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.cc-info {
  flex: 1;
  min-width: 0;
}
.cc-name {
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: block;
}
.cc-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  display: block;
  margin-top: 0.1rem;
}
.cc-count {
  font-size: 1.125rem;
  font-weight: 800;
  color: var(--brand-color);
  font-family: var(--vp-font-family-mono);
  flex-shrink: 0;
}

.cc-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.cc-tag {
  font-size: 0.62rem;
  font-weight: 500;
  padding: 0.1rem 0.375rem;
  border-radius: 0.1875rem;
  background: color-mix(in srgb, var(--vp-c-text-3) 6%, transparent);
  color: var(--vp-c-text-2);
}
</style>
