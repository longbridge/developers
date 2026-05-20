<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { lang } = useData()

const LOCALE = {
  en: {
    title: 'Start Building in Minutes',
    subtitle:
      'Set up your environment, authenticate, and make your first API call — everything you need to go from zero to live data.',
    cards: {
      auth: {
        title: 'Authentication Setup',
        desc: 'Register an OAuth 2.0 client, obtain credentials, and configure your SDK with automatic token management.',
        cta: 'Setup Guide',
      },
      api: {
        title: 'API Reference',
        desc: 'Browse 100+ endpoints for quotes, trading, portfolio, and content. Try requests directly in the browser.',
        cta: 'Explore APIs',
      },
      cli: {
        title: 'Install CLI',
        desc: 'One-line install for macOS, Linux, and Windows. 130+ commands with interactive TUI and JSON output.',
        cta: 'Install Now',
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
  },
  'zh-CN': {
    title: '几分钟内开始构建',
    subtitle: '配置环境、完成认证、发起第一个 API 调用 — 从零到获取实时数据所需的一切。',
    cards: {
      auth: { title: '认证配置', desc: '注册 OAuth 2.0 客户端，获取凭证，配置 SDK 自动令牌管理。', cta: '配置指南' },
      api: {
        title: 'API 参考',
        desc: '浏览 100+ 行情、交易、持仓和内容端点。直接在浏览器中尝试请求。',
        cta: '探索 API',
      },
      cli: {
        title: '安装 CLI',
        desc: 'macOS、Linux 和 Windows 一行命令安装。130+ 命令，交互式 TUI 和 JSON 输出。',
        cta: '立即安装',
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
  },
  'zh-HK': {
    title: '幾分鐘內開始構建',
    subtitle: '配置環境、完成認證、發起第一個 API 調用 — 從零到獲取即時數據所需的一切。',
    cards: {
      auth: { title: '認證配置', desc: '註冊 OAuth 2.0 客戶端，獲取憑證，配置 SDK 自動令牌管理。', cta: '配置指南' },
      api: {
        title: 'API 參考',
        desc: '瀏覽 100+ 行情、交易、持倉和內容端點。直接在瀏覽器中嘗試請求。',
        cta: '探索 API',
      },
      cli: {
        title: '安裝 CLI',
        desc: 'macOS、Linux 和 Windows 一行命令安裝。130+ 命令，互動式 TUI 和 JSON 輸出。',
        cta: '立即安裝',
      },
    } as Record<string, { title: string; desc: string; cta: string }>,
  },
}

const content = computed(() => LOCALE[lang.value as keyof typeof LOCALE] ?? LOCALE.en)

const entries = [
  {
    key: 'auth',
    href: '/docs/getting-started',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    iconColor: '#00b8b8',
    iconBg: '#e0f7f5',
    iconBgDark: 'color-mix(in srgb, #00b8b8 15%, var(--vp-c-bg-soft))',
  },
  {
    key: 'api',
    href: '/docs/api',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/></svg>`,
    iconColor: '#0ea5e9',
    iconBg: '#e0f0ff',
    iconBgDark: 'color-mix(in srgb, #0ea5e9 15%, var(--vp-c-bg-soft))',
  },
  {
    key: 'cli',
    href: '/docs/cli',
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    iconColor: '#f97316',
    iconBg: '#fff3e0',
    iconBgDark: 'color-mix(in srgb, #f97316 15%, var(--vp-c-bg-soft))',
  },
]
</script>

<template>
  <section class="gs-section">
    <div class="gs-bg" />
    <div class="gs-content">
      <h2 class="gs-title">{{ content.title }}</h2>
      <p class="gs-subtitle">{{ content.subtitle }}</p>

      <div class="gs-cards">
        <a v-for="e in entries" :key="e.key" :href="e.href" class="gs-card">
          <div class="gs-card-header">
            <div
              class="gs-card-icon-wrap"
              :style="{ '--icon-color': e.iconColor, '--icon-bg': e.iconBg, '--icon-bg-dark': e.iconBgDark }">
              <span class="gs-card-icon" v-html="e.icon" />
            </div>
            <h3 class="gs-card-title">{{ content.cards[e.key]?.title }}</h3>
          </div>
          <p class="gs-card-desc">{{ content.cards[e.key]?.desc }}</p>
          <span class="gs-card-link">
            {{ content.cards[e.key]?.cta }}
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
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Gradient background */
.gs-bg {
  position: absolute;
  inset: 0;
  background: var(--vp-c-bg-soft);
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
  border-radius: var(--lb-card-radius);
  border: 1px solid var(--lb-card-border);
  background: var(--vp-c-bg);
  text-decoration: none !important;
  transition:
    transform 0.25s,
    box-shadow 0.25s;
}

.gs-card:hover {
  box-shadow: var(--lb-card-shadow-2);
  transform: translateY(-3px);
}

.gs-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.gs-card-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--icon-bg);
}

:root.dark .gs-card-icon-wrap {
  background: var(--icon-bg-dark);
}

.gs-card-icon {
  display: flex;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--icon-color);
}
.gs-card-icon :deep(svg) {
  width: 100%;
  height: 100%;
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
  transition:
    gap 0.2s,
    color 0.2s;
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
