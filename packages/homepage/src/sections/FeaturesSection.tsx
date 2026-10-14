import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "FEATURES" products matrix
// (NewHomePage/index.vue section #3, `.products-grid`). Copy, markup, and CSS
// mirror the legacy source. Shared utilities (.section / .section-inner /
// .eyebrow / .h-section / .btn / .btn-ghost) come from the page-level
// homepage.css and are only consumed here.
const LOCALE = {
  en: {
    features: {
      eyebrow: 'FEATURES',
      title: 'Everything you need for market analysis, quantitative research, and intelligent trading.',
      cta: 'Compare all',
    },
    products: [
      {
        label: 'AI Skill',
        title: 'Investment analysis agent for any AI',
        desc: 'Use Longbridge in ChatGPT Apps with @longbridge, or give Claude, Cursor, Gemini, Codex, Zed, and Cherry Studio live market intelligence.',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: 'AI-native terminal for trading',
        desc: 'Interactive TUI dashboard, 130+ commands, and --format json output for scripting and AI agent integration. OAuth 2.0 works on SSH and headless servers.',
        tags: ['130+ cmds', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + hosted MCP',
        desc: 'Official ChatGPT App plus hosted OAuth 2.1 MCP for Codex, Claude Code, Cursor, Zed, and Cherry Studio.',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 languages, one Rust core',
        desc: 'Get your first quote in minutes. Python, Node.js, Rust, Go, Java, C, C++ — with async support and built-in rate control.',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: 'Paper Trading',
        title: 'Sandbox at zero cost',
        desc: 'Test orders with real market data — simulated matching based on live bid-ask spreads. No securities account required.',
        tags: ['Sandbox', 'Zero Cost'],
      },
      {
        label: 'LLM Ready',
        title: 'Built for retrieval & RAG',
        desc: 'llms.txt standard compliance, every doc available as .md for RAG pipelines, and Accept: text/markdown header support on longbridge.com.',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
  },
  'zh-CN': {
    features: {
      eyebrow: '功能特性',
      title: '一切所需，涵盖行情分析、量化研究与智能交易',
      cta: '查看全部',
    },
    products: [
      {
        label: 'AI Skill',
        title: '为任意 AI 打造的投资分析 Agent',
        desc: '在 ChatGPT Apps 中通过 @longbridge 使用 Longbridge，也可为 Claude、Cursor、Gemini、Codex、Zed、Cherry Studio 提供实时市场智能。',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: '面向交易的 AI 原生终端',
        desc: '交互式 TUI 仪表盘、130+ 条命令，以及用于脚本和 AI Agent 集成的 --format json 输出。OAuth 2.0 支持 SSH 和无头服务器。',
        tags: ['130+ 命令', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + 托管 MCP',
        desc: '官方 ChatGPT App，加上面向 Codex、Claude Code、Cursor、Zed、Cherry Studio 的托管 OAuth 2.1 MCP。',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 种语言，共用 Rust 内核',
        desc: '几分钟内获取第一个报价。Python、Node.js、Rust、Go、Java、C、C++——支持异步模式与内置限速控制。',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: '模拟交易',
        title: '零成本沙盒环境',
        desc: '用真实市场数据测试订单——基于实时买卖价差进行模拟撮合。无需证券账户。',
        tags: ['沙盒', '零成本'],
      },
      {
        label: 'LLM 就绪',
        title: '专为检索与 RAG 构建',
        desc: '符合 llms.txt 标准，每篇文档均提供 .md 格式供 RAG 流水线使用，longbridge.com 支持 Accept: text/markdown 请求头。',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
  },
  'zh-HK': {
    features: {
      eyebrow: '功能特性',
      title: '一切所需，涵蓋行情分析、量化研究與智能交易',
      cta: '查看全部',
    },
    products: [
      {
        label: 'AI Skill',
        title: '為任意 AI 打造的投資分析 Agent',
        desc: '在 ChatGPT Apps 中透過 @longbridge 使用 Longbridge，也可為 Claude、Cursor、Gemini、Codex、Zed、Cherry Studio 提供即時市場智能。',
        tags: ['Agent Skills'],
      },
      {
        label: 'CLI',
        title: '面向交易的 AI 原生終端',
        desc: '互動式 TUI 儀表板、130+ 條命令，以及用於腳本和 AI Agent 整合的 --format json 輸出。OAuth 2.0 支援 SSH 和無頭伺服器。',
        tags: ['130+ 命令', '--format json', 'TUI'],
      },
      {
        label: 'MCP',
        title: 'ChatGPT App + 託管 MCP',
        desc: '官方 ChatGPT App，加上面向 Codex、Claude Code、Cursor、Zed、Cherry Studio 的託管 OAuth 2.1 MCP。',
        tags: ['ChatGPT App', 'OAuth 2.1'],
      },
      {
        label: 'SDK',
        title: '7 種語言，共用 Rust 核心',
        desc: '幾分鐘內獲取第一個報價。Python、Node.js、Rust、Go、Java、C、C++——支援非同步模式與內建限速控制。',
        tags: ['Python', 'Rust', 'Go', '+ 4'],
      },
      {
        label: '模擬交易',
        title: '零成本沙盒環境',
        desc: '用真實市場數據測試訂單——基於即時買賣價差進行模擬撮合。無需證券帳戶。',
        tags: ['沙盒', '零成本'],
      },
      {
        label: 'LLM 就緒',
        title: '專為檢索與 RAG 構建',
        desc: '符合 llms.txt 標準，每篇文件均提供 .md 格式供 RAG 流水線使用，longbridge.com 支援 Accept: text/markdown 請求頭。',
        tags: ['Markdown', 'llms.txt'],
      },
    ],
  },
}

// Locale-independent card data (legacy `PRODUCTS`), merged per index with
// `content.products[i]` exactly like the legacy `products` computed.
const PRODUCTS = [
  {
    key: 'skill',
    href: '/skill',
    accent: 'var(--lb-brand)',
  },
  {
    key: 'cli',
    href: '/docs/cli',
    accent: 'var(--lb-status-alert)',
  },
  {
    key: 'mcp',
    href: '/docs/mcp',
    accent: 'var(--lb-ai-mention)',
  },
  {
    key: 'sdk',
    href: '/docs',
    accent: 'var(--lb-status-neutral)',
  },
  {
    key: 'paper',
    href: '/docs',
    accent: 'var(--lb-up)',
  },
  {
    key: 'llm',
    href: '/docs',
    accent: 'var(--lb-chart-purple)',
  },
]

const FEATURES_CSS = `
/* Products grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
@media (max-width: 980px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
.product-card {
  display: flex;
  flex-direction: column;
  padding: 28px 24px;
  background: var(--lb-card);
  border: 1px solid var(--app-card-stroke);
  border-radius: 16px;
  transition:
    transform var(--lb-transition-normal),
    box-shadow var(--lb-transition-normal),
    border-color var(--lb-transition-normal);
  min-height: 220px;
  position: relative;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--app-shadow-2);
  border-color: var(--app-card-stroke-strong);
}
.product-card:hover .product-card-head svg {
  color: var(--lb-fg-1) !important;
  transform: translateX(2px);
}
.product-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid var(--app-card-stroke);
}
.product-card-head svg {
  transition:
    transform var(--lb-transition-fast),
    color var(--lb-transition-fast);
}
.product-card-label {
  font-size: 11.5px;
  line-height: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.product-card-title {
  font-size: 19px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.25;
  margin: 0;
  color: var(--lb-fg-1);
}
.product-card-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--lb-fg-2);
  margin: 10px 0 0;
}
.product-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 14px;
}
.product-card-tag {
  font-family: var(--app-mono);
  font-size: 10.5px;
  line-height: 12px;
  font-weight: 500;
  padding: 2px 7px;
  border-radius: 4px;
  background: var(--lb-bg-2);
  color: var(--lb-fg-2);
  border: 1px solid var(--app-card-stroke);
  white-space: nowrap;
}
`

interface FeaturesSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function FeaturesSection({ locale }: FeaturesSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const products = PRODUCTS.map((p, i) => ({ ...p, ...(content.products[i] ?? {}) }))

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: FEATURES_CSS }} />
      <section data-lbus-component="features-section" className="section">
        <div className="section-inner">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '48px',
            }}>
            <div style={{ maxWidth: '560px' }}>
              <span className="eyebrow">{content.features.eyebrow}</span>
              <h2 className="h-section" style={{ marginTop: '16px' }}>
                {content.features.title}
              </h2>
            </div>
            <a className="btn btn-ghost" href={localePath(locale, '/docs')}>
              {content.features.cta}
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="products-grid">
            {products.map((p) => (
              <a
                key={p.key}
                href={localePath(locale, p.href)}
                className="product-card"
                style={{ '--card-accent': p.accent } as React.CSSProperties}>
                <div className="product-card-head">
                  <span className="product-card-label" style={{ color: p.accent }}>
                    {p.label}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--lb-fg-3)' }}>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
                <h3 className="product-card-title">{p.title}</h3>
                <p className="product-card-desc">{p.desc}</p>
                <div className="product-card-tags">
                  {p.tags.map((t) => (
                    <span key={t} className="product-card-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
