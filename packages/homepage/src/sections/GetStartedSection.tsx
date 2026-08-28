import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "Get started" section (NewHomePage/index.vue,
// the `.gs-grid` section). Markup, copy, inline styles, and CSS mirror the
// legacy source; the only translation is the dark-mode selector
// (`.lb-dark` → `[data-mode="dark"]`). Generic legacy utilities (.section /
// .section-inner / .eyebrow / .h-section / .h-card / .t-meta / .t-body) are
// provided globally under `.new-home-page` by homepage.css and are NOT
// redefined here.
const LOCALE = {
  en: {
    eyebrow: 'Get started',
    title: 'Get started in minutes',
    desc: 'Set up your environment, authenticate, and make your first API call — everything you need to go from zero to live data.',
    items: [
      {
        title: 'Authentication setup',
        desc: 'Register an OAuth 2.0 client, obtain credentials, and configure your SDK with automatic token management.',
        cta: 'Setup guide',
      },
      {
        title: 'API Reference',
        desc: 'Browse 100+ endpoints for quotes, trading, portfolio, and content. Try requests directly in the browser.',
        cta: 'Explore APIs',
      },
      {
        title: 'Install CLI',
        desc: 'One-line install for macOS, Linux, and Windows. 130+ commands with interactive TUI and JSON output.',
        cta: 'Install now',
      },
    ],
  },
  'zh-CN': {
    eyebrow: '开始使用',
    title: '几分钟内快速上手',
    desc: '搭建环境、完成认证、发起第一个 API 调用——从零到实时数据，所有步骤一应俱全。',
    items: [
      { title: '认证配置', desc: '注册 OAuth 2.0 客户端，获取凭证，并配置 SDK 的自动令牌管理。', cta: '配置指南' },
      {
        title: 'API 参考',
        desc: '浏览 100+ 个行情、交易、投资组合和内容接口，直接在浏览器中调试请求。',
        cta: '探索 API',
      },
      {
        title: '安装 CLI',
        desc: '支持 macOS、Linux 和 Windows 一行安装。130+ 条命令，含交互式 TUI 与 JSON 输出。',
        cta: '立即安装',
      },
    ],
  },
  'zh-HK': {
    eyebrow: '開始使用',
    title: '幾分鐘內快速上手',
    desc: '搭建環境、完成認證、發起第一個 API 呼叫——從零到即時數據，所有步驟一應俱全。',
    items: [
      { title: '認證配置', desc: '註冊 OAuth 2.0 客戶端，獲取憑證，並配置 SDK 的自動令牌管理。', cta: '配置指南' },
      {
        title: 'API 參考',
        desc: '瀏覽 100+ 個行情、交易、投資組合和內容接口，直接在瀏覽器中偵錯請求。',
        cta: '探索 API',
      },
      {
        title: '安裝 CLI',
        desc: '支援 macOS、Linux 和 Windows 一行安裝。130+ 條命令，含互動式 TUI 與 JSON 輸出。',
        cta: '立即安裝',
      },
    ],
  },
}

type GsIcon = 'key' | 'book' | 'terminal'

// Locale-independent card metadata (legacy `const GETSTARTED`); the per-locale
// `items[i]` above is merged over it by index (legacy `getstarted` computed).
const GETSTARTED: { key: string; icon: GsIcon; href: string }[] = [
  { key: 'auth', icon: 'key', href: '/docs/getting-started' },
  { key: 'api', icon: 'book', href: '/docs' },
  { key: 'cli', icon: 'terminal', href: '/docs/cli' },
]

const GETSTARTED_CSS = `
/* Get started + final CTA */
.gs-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 40px;
}
@media (max-width: 820px) {
  .gs-grid {
    grid-template-columns: 1fr;
  }
}
.gs-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 16px;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  transition: all var(--lb-transition-normal);
  position: relative;
}
.gs-card:hover {
  box-shadow: var(--app-shadow-2);
  transform: translateY(-3px);
}
.gs-card-step {
  position: absolute;
  top: 20px;
  right: 24px;
  font-family: var(--app-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--lb-fg-3);
  letter-spacing: 0.05em;
}
.gs-card-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--lb-brand) 12%, transparent);
  color: var(--lb-brand);
  display: grid;
  place-items: center;
}
/* Shared with the legacy product cards; needed here because .gs-card reuses it. */
.product-card-cta {
  margin-top: auto;
  padding-top: 18px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  color: var(--lb-fg-1);
  transition: gap var(--lb-transition-fast);
}

[data-mode="dark"] .gs-card-icon-wrap {
  background: color-mix(in srgb, var(--lb-brand) 18%, transparent);
}
`

interface GetStartedSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

function GsIconSvg({ icon }: { icon: GsIcon }) {
  if (icon === 'key') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round">
        <circle cx="7" cy="15" r="4" />
        <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
      </svg>
    )
  }
  if (icon === 'book') {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    )
  }
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  )
}

export function GetStartedSection({ locale }: GetStartedSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const getstarted = GETSTARTED.map((g, i) => ({ ...g, ...(content.items[i] ?? {}) }))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: GETSTARTED_CSS }} />
      <section
        data-lbus-component="get-started-section"
        className="section"
        style={{ borderTop: '1px solid var(--app-card-stroke)', background: 'var(--app-canvas)' }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              {content.title}
            </h2>
            <p className="t-body" style={{ marginTop: 14 }}>
              {content.desc}
            </p>
          </div>
          <div className="gs-grid">
            {getstarted.map((g, i) => (
              <a key={g.key} className="gs-card" href={localePath(locale, g.href)}>
                <div className="gs-card-step">{String(i + 1).padStart(2, '0')}</div>
                <div className="gs-card-icon-wrap">
                  <GsIconSvg icon={g.icon} />
                </div>
                <h3 className="h-card" style={{ marginTop: 18 }}>
                  {g.title}
                </h3>
                <p className="t-meta" style={{ marginTop: 8, lineHeight: 1.55, flex: 1 }}>
                  {g.desc}
                </p>
                <span className="product-card-cta">
                  {g.cta}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
