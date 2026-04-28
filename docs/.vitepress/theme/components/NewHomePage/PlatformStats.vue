<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NumberTicker from '../inspira/NumberTicker.vue'

const { t } = useI18n()

// Logo-inspired stat colors: teal, yellow/gold, orange, cyan
let statColors = ['#00b8b8', '#d4a800', '#c34607', '#505050']
// if dark
if (document.querySelector('html')?.classList.contains('dark')) {
  statColors = ['#00dbb6', '#ffe000', '#fc5200', '#AAAAAA']
}

const stats = computed(() => [
  {
    value: 4,
    label: t('stats.ainative'),
    suffix: '+',
    link: '/docs/mcp',
    color: statColors[0],
    card: {
      title: t('stats.ainative'),
      items: [
        {
          name: 'AI Skill',
          desc: 'Investment analysis agent',
          link: '/skill',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 017 7c0 2.4-1.2 4.5-3 5.7V17a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2.3C6.2 13.5 5 11.4 5 9a7 7 0 017-7z"/><path d="M9 22h6"/></svg>`,
        },
        {
          name: 'CLI JSON',
          desc: '--format json for AI agents',
          link: '/docs/cli',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
        },
        {
          name: 'MCP',
          desc: 'Model Context Protocol',
          link: '/docs/mcp',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m-7-3.5l5.2-3m1.6-1l5.2-3M5 6.5l5.2 3m1.6 1l5.2 3"/></svg>`,
        },
        {
          name: 'llms.txt',
          desc: 'LLM-ready documentation',
          link: '/docs/llm',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
        },
      ],
    },
  },
  {
    value: 6,
    label: t('stats.markets'),
    suffix: '+',
    link: '/docs/',
    color: statColors[1],
    card: {
      title: t('stats.markets'),
      items: [
        {
          name: 'United States',
          desc: 'Stocks, ETFs, Options (OPRA)',
          icon: `<svg viewBox="0 0 32 32"><clipPath id="us"><circle cx="16" cy="16" r="16"/></clipPath><g clip-path="url(#us)"><rect width="32" height="32" fill="#fff"/><g fill="#b22234"><rect y="0" width="32" height="2.46"/><rect y="4.92" width="32" height="2.46"/><rect y="9.85" width="32" height="2.46"/><rect y="14.77" width="32" height="2.46"/><rect y="19.7" width="32" height="2.46"/><rect y="24.62" width="32" height="2.46"/><rect y="29.54" width="32" height="2.46"/></g><rect width="12.8" height="17.23" fill="#3c3b6e"/><g fill="#fff"><circle cx="2.1" cy="1.7" r="0.7"/><circle cx="6.4" cy="1.7" r="0.7"/><circle cx="10.7" cy="1.7" r="0.7"/><circle cx="4.3" cy="4" r="0.7"/><circle cx="8.5" cy="4" r="0.7"/><circle cx="2.1" cy="6.3" r="0.7"/><circle cx="6.4" cy="6.3" r="0.7"/><circle cx="10.7" cy="6.3" r="0.7"/><circle cx="4.3" cy="8.6" r="0.7"/><circle cx="8.5" cy="8.6" r="0.7"/><circle cx="2.1" cy="10.9" r="0.7"/><circle cx="6.4" cy="10.9" r="0.7"/><circle cx="10.7" cy="10.9" r="0.7"/></g></g></svg>`,
        },
        {
          name: 'Hong Kong',
          desc: 'Stocks, ETFs, Warrants, CBBC',
          icon: `<svg viewBox="0 0 32 32"><clipPath id="hk"><circle cx="16" cy="16" r="16"/></clipPath><g clip-path="url(#hk)"><rect width="32" height="32" fill="#de2910"/><g fill="#fff" transform="translate(16 16) scale(2)"><polygon points="0,-5 1.5,-1.5 5,-1.5 2,1 3,5 0,2.7 -3,5 -2,1 -5,-1.5 -1.5,-1.5"/></g></g></svg>`,
        },
        {
          name: 'Singapore',
          desc: 'SGX Securities',
          icon: `<svg viewBox="0 0 32 32"><clipPath id="sg2"><circle cx="16" cy="16" r="16"/></clipPath><g clip-path="url(#sg2)"><rect y="0" width="32" height="16" fill="#ed2939"/><rect y="16" width="32" height="16" fill="#fff"/></g></svg>`,
        },
        {
          name: 'China A-Shares',
          desc: 'SH/SZ Stocks, ETFs, Indexes',
          icon: `<svg viewBox="0 0 32 32"><clipPath id="cn"><circle cx="16" cy="16" r="16"/></clipPath><g clip-path="url(#cn)"><rect width="32" height="32" fill="#de2910"/><g fill="#ffde00" transform="translate(5.3 5.3) scale(1.6)"><polygon points="0,-4 1.2,-1.2 4,-1.2 1.7,.8 2.5,4 0,2.2 -2.5,4 -1.7,.8 -4,-1.2 -1.2,-1.2"/></g><g fill="#ffde00" transform="translate(12.8 2.7) scale(0.6)"><polygon points="0,-4 1.2,-1.2 4,-1.2 1.7,.8 2.5,4 0,2.2 -2.5,4 -1.7,.8 -4,-1.2 -1.2,-1.2" transform="rotate(23)"/></g><g fill="#ffde00" transform="translate(15 6.4) scale(0.6)"><polygon points="0,-4 1.2,-1.2 4,-1.2 1.7,.8 2.5,4 0,2.2 -2.5,4 -1.7,.8 -4,-1.2 -1.2,-1.2" transform="rotate(-10)"/></g><g fill="#ffde00" transform="translate(13.3 10.7) scale(0.6)"><polygon points="0,-4 1.2,-1.2 4,-1.2 1.7,.8 2.5,4 0,2.2 -2.5,4 -1.7,.8 -4,-1.2 -1.2,-1.2" transform="rotate(23)"/></g></g></svg>`,
        },
      ],
    },
  },
  {
    value: 7,
    label: t('stats.sdks'),
    suffix: '+',
    link: '/sdk',
    color: statColors[2],
    card: {
      title: t('stats.sdks'),
      items: [
        {
          name: 'Python',
          desc: 'pip install longbridge',
          icon: `<img src="https://assets.lbctrl.com/uploads/50244d9f-f886-4dc5-8ee5-4983d0ecb169/python.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
        {
          name: 'Node.js',
          desc: 'bun add longbridge',
          icon: `<img src="https://assets.lbctrl.com/uploads/1729711f-90d8-4b4d-9047-63a8adabdf20/nodejs.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
        {
          name: 'Rust',
          desc: 'longbridge = "4.0.5"',
          icon: `<img src="https://assets.lbctrl.com/uploads/f777c482-71bb-45a4-a2fe-5e639bd510cb/rust.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
        {
          name: 'Go',
          desc: 'go get github.com/longbridge/openapi-go',
          icon: `<img src="https://assets.lbctrl.com/uploads/37a78e80-f177-4931-a7b3-a12692c478ad/go.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
        {
          name: 'Java',
          desc: 'io.github.longbridge:openapi-sdk',
          icon: `<img src="https://assets.lbctrl.com/uploads/f5d96da9-8cba-43e4-8eed-f704e52cb413/java.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
        {
          name: 'C++',
          desc: 'find_package(longbridge)',
          icon: `<img src="https://assets.lbctrl.com/uploads/14e521de-8f43-4042-aa4d-659d7b645da4/cplusplus.svg" style="width:100%;height:100%;object-fit:contain;" />`,
        },
      ],
    },
  },
  {
    value: 100,
    label: t('stats.endpoints'),
    suffix: '+',
    link: '/docs/api',
    color: statColors[3],
    card: {
      title: t('stats.endpoints'),
      items: [
        {
          name: 'Quote',
          desc: '30+ endpoints + WebSocket push',
          link: '/docs/quote/overview',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
        },
        {
          name: 'Trade',
          desc: '14+ endpoints + order push',
          link: '/docs/trade/overview',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>`,
        },
        {
          name: 'Derivatives',
          desc: 'Option chains, warrants',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8l-2 4h12l-2-4z"/></svg>`,
        },
        {
          name: 'Research',
          desc: 'Financials, EPS, ratings',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        },
        {
          name: 'Content',
          desc: 'News, community, topics',
          icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2"/></svg>`,
        },
      ],
    },
  },
])
</script>

<template>
  <section class="stats-section">
    <div class="stats-container">
      <div class="stats-grid">
        <ClientOnly>
          <VDropdown
            v-for="(stat, index) in stats"
            :key="stat.label"
            placement="bottom"
            :distance="8"
            :skidding="0"
            :triggers="['hover', 'focus']"
            :popper-triggers="['hover']"
            :delay="{ show: 200, hide: 150 }">
            <a :href="stat.link" class="stats-item" :style="{ '--stat-color': stat.color }">
              <div class="stats-value">
                <NumberTicker
                  :value="stat.value"
                  :delay="index * 200"
                  :duration="1500"
                  :decimal-places="0"
                  class="stats-number" />
                <span v-if="stat.suffix" class="stats-suffix">{{ stat.suffix }}</span>
              </div>
              <div class="stats-label">{{ stat.label }}</div>
            </a>

            <template #popper>
              <div class="hc">
                <div class="hc-header">
                  <span class="hc-title">{{ stat.card.title }}</span>
                  <span class="hc-count">{{ stat.value }}{{ stat.suffix }}</span>
                </div>
                <div class="hc-items">
                  <div
                    v-for="item in stat.card.items"
                    :key="item.name"
                    class="hc-item">
                    <span class="hc-item-icon" v-html="item.icon" />
                    <div class="hc-item-text">
                      <span class="hc-item-name">{{ item.name }}</span>
                      <span class="hc-item-desc">{{ item.desc }}</span>
                    </div>
                  </div>
                </div>
                <a :href="stat.link" class="hc-footer">
                  Learn more
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </a>
              </div>
            </template>
          </VDropdown>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

<style scoped>
.stats-section {
  padding: 3rem 0;
  background: linear-gradient(
    180deg,
    var(--vp-c-bg) 0%,
    var(--vp-c-bg-soft) 30%,
    var(--vp-c-bg-soft) 70%,
    var(--vp-c-bg) 100%
  );
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.stats-container {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stats-item {
  text-align: center;
  position: relative;
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  text-decoration: none !important;
  transition: all 0.2s;
}

/* Vertical dividers */
.stats-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 20%;
  height: 60%;
  width: 1px;
  background: var(--vp-c-divider);
  transition: opacity 0.3s;
}
.stats-item:hover::after,
.stats-item:hover + .stats-item::after {
  opacity: 0;
}

@media (max-width: 640px) {
  .stats-item:nth-child(2)::after {
    display: none;
  }
}

.stats-value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 2px;
}
.stats-number {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--stat-color, var(--brand-color));
  transition: all 0.25s;
}
.stats-item:hover .stats-number {
  transform: scale(1.1);
  text-shadow: 0 0 20px color-mix(in srgb, var(--stat-color, var(--brand-color)) 25%, transparent);
}

.stats-suffix {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--stat-color, var(--brand-color));
  transition: all 0.25s;
}
.stats-item:hover .stats-suffix {
  transform: scale(1.1);
}
.stats-label {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>

<style>
/* Hover card */
.hc {
  min-width: 16rem;
  max-width: 24rem;
  font-family: var(--vp-font-family-base);
}

.hc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.hc-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.hc-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--brand-color);
  font-family: var(--vp-font-family-mono);
}

/* Auto-grid: 1 col for <=4 items, 2 cols for 5+ */
.hc-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
  padding: 0.5rem 0.75rem;
  gap: 0.25rem;
}

.hc-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
}

.hc-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  color: var(--brand-color);
}
.hc-item-icon svg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
}

.hc-item-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.hc-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
}
.hc-item-desc {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--vp-font-family-mono);
}

.hc-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.875rem;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.hc-footer:hover {
  gap: 0.5rem;
}

/* floating-vue theme override */
.v-popper--theme-dropdown .v-popper__inner {
  background: var(--vp-c-bg) !important;
  border: 1px solid var(--vp-c-divider) !important;
  border-radius: 0.625rem !important;
  box-shadow: 0 8px 24px color-mix(in srgb, #000 8%, transparent) !important;
  padding: 0 !important;
  overflow: hidden;
}
.v-popper--theme-dropdown .v-popper__arrow-container {
  display: none;
}
</style>
