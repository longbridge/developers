<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const icons = {
  cli: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
  skill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z"/><circle cx="12" cy="12" r="2"/></svg>`,
  mcp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7-3.5l5.2-3m1.6-1l5.2-3M5 6.5l5.2 3m1.6 1l5.2 3"/></svg>`,
  sdk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>`,
  paper: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
  llm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>`,
}

const tags: Record<string, string[]> = {
  cli: ['TUI', '--format json'],
  skill: ['AI Agent'],
  mcp: ['OAuth 2.1', 'Hosted'],
  sdk: ['Python', 'Rust', 'Go', '+ 4'],
  paper: ['Sandbox', 'Zero Cost'],
  llm: ['Markdown', 'llms.txt'],
}

const links: Record<string, string> = {
  cli: '/docs/cli',
  skill: '/skill',
  mcp: '/docs/mcp',
  sdk: '/sdk',
  paper: '/docs/getting-started',
  llm: '/docs/llm',
}

const accents: Record<string, string> = {
  skill: '#00dbb6',
  cli: '#fc5200',
  mcp: '#3b82f6',
  sdk: '#22c55e',
  paper: '#f59e0b',
  llm: '#a855f7',
}

const products = ['skill', 'cli', 'mcp', 'sdk', 'paper', 'llm']
</script>

<template>
  <section class="core-section">
    <div class="core-header">
      <h2 class="core-title">{{ $t('core.title') }}</h2>
      <p class="core-subtitle">{{ $t('core.subtitle') }}</p>
    </div>

    <div class="core-grid">
      <a
        v-for="key in products"
        :key="key"
        :href="links[key]"
        class="core-card"
        :style="{
          '--card-accent': accents[key],
          background: `radial-gradient(280px 140px at 100% 0%, color-mix(in srgb, ${accents[key]} 9%, transparent), transparent 70%), var(--vp-c-bg)`,
        }">
        <div class="core-card-inner">
          <div class="core-card-top">
            <span class="core-icon" :style="{ color: accents[key] }" v-html="icons[key as keyof typeof icons]" />
            <span class="core-card-title">{{ $t(`core.${key}.title`) }}</span>
          </div>
          <p class="core-card-desc">{{ $t(`core.${key}.desc`) }}</p>
          <div class="core-tags">
            <span
              v-for="tag in tags[key]"
              :key="tag"
              class="core-tag"
              :style="{
                background: `color-mix(in srgb, ${accents[key]} 10%, transparent)`,
                color: accents[key],
              }">{{ tag }}</span>
          </div>
        </div>
      </a>
    </div>
  </section>
</template>

<style scoped>
.core-section {
  padding: 4rem 0;
  background: var(--vp-c-bg);
}
.core-header {
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 1.5rem;
}
.core-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.core-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
}

.core-icon {
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}
.core-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.core-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}
.core-tag {
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.62rem;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
}

/* Grid */
.core-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}
@media (max-width: 900px) {
  .core-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 480px) {
  .core-grid {
    grid-template-columns: 1fr;
  }
}

.core-card {
  position: relative;
  border-radius: 1rem;
  border: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  overflow: hidden;
  isolation: isolate;
  transition: transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 220ms cubic-bezier(0.2, 0.8, 0.2, 1), border-color 220ms;
}
:root.dark .core-card {
  border-color: color-mix(in srgb, var(--vp-c-divider) 80%, transparent);
}
.core-card:hover {
  border-color: color-mix(in srgb, var(--card-accent, var(--brand-color)) 50%, var(--vp-c-divider));
  transform: translateY(-3px);
  box-shadow: 0 16px 36px -10px rgba(10, 14, 25, 0.13), 0 3px 12px -5px rgba(10, 14, 25, 0.06);
}

.core-card-inner {
  position: relative;
  z-index: 1;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 12rem;
}
.core-card-top {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}
.core-card-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}
.core-card-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
  flex: 1;
}
</style>
