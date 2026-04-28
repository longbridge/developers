<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const entries = [
  {
    key: 'auth',
    href: '/docs/getting-started',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
  },
  {
    key: 'api',
    href: '/docs/api',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>`,
  },
  {
    key: 'cli',
    href: '/docs/cli',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  },
]
</script>

<template>
  <section class="gs-section">
    <div class="gs-bg" />
    <div class="gs-content">
      <h2 class="gs-title">{{ $t('getStarted.title') }}</h2>
      <p class="gs-subtitle">{{ $t('getStarted.subtitle') }}</p>

      <div class="gs-cards">
        <a v-for="e in entries" :key="e.key" :href="e.href" class="gs-card">
          <div class="gs-card-header">
            <span class="gs-card-icon" v-html="e.icon" />
            <h3 class="gs-card-title">{{ $t(`getStarted.${e.key}.title`) }}</h3>
          </div>
          <p class="gs-card-desc">{{ $t(`getStarted.${e.key}.desc`) }}</p>
          <span class="gs-card-link">
            {{ $t(`getStarted.${e.key}.cta`) }}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gs-section {
  position: relative;
  padding: 4rem 0;
  overflow: hidden;
}

/* Gradient background */
.gs-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--brand-color) 8%, var(--vp-c-bg-soft)) 0%,
    var(--vp-c-bg-soft) 40%,
    color-mix(in srgb, var(--cyan-60, #66d5c2) 6%, var(--vp-c-bg-soft)) 100%
  );
  z-index: 0;
}

.gs-content {
  position: relative;
  z-index: 1;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
}

.gs-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}

.gs-subtitle {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

/* Cards */
.gs-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.gs-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  text-decoration: none !important;
  transition: all 0.25s;
}

.gs-card:hover {
  border-color: var(--brand-color);
  box-shadow: 0 4px 20px color-mix(in srgb, var(--brand-color) 8%, transparent);
  transform: translateY(-2px);
}

.gs-card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.gs-card-icon {
  display: flex;
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  color: var(--vp-c-text-3);
  transition: color 0.25s, transform 0.25s;
}
.gs-card-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
.gs-card:hover .gs-card-icon {
  color: var(--brand-color);
  transform: scale(1.15);
}

.gs-card-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
}

.gs-card-desc {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  line-height: 1.5;
  flex: 1;
  text-align: left;
}

.gs-card-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  align-self: flex-end;
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  transition: gap 0.2s, color 0.2s;
}
.gs-card:hover .gs-card-link {
  gap: 0.5rem;
  color: var(--brand-color);
}

@media (max-width: 768px) {
  .gs-cards {
    grid-template-columns: 1fr;
  }
}
</style>
