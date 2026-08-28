import type { Locale } from '@longbridge/openapi-utils'
import { CopyButton } from './CopyButton'

// 1:1 port of the legacy VitePress "Hosted MCP" section (NewHomePage/index.vue
// section #6, `.section > .section-inner.mcp-grid`). Markup, copy, inline
// styles, and CSS mirror the legacy source. Shared legacy utilities (.section /
// .section-inner / .eyebrow / .h-section / .t-body / .t-meta / .btn* / .code*
// / .ln-*) are provided globally and are NOT redefined here; only the `.mcp-*`
// rules are ported (app-styles.css "MCP section" block). No dark-mode rules
// exist for these classes in legacy.
//
// Legacy `.code-copy` button `@click="copyToClipboard(...)"` wrote
// `claude mcp add --transport http longbridge \\\n  https://mcp.longbridge.com`
// to `navigator.clipboard`. The page is hydrated as a React island, so the same
// handler lives here as `onClick`; markup is unchanged and there is no state,
// so SSR and the first client render are identical.
const LOCALE = {
  en: {
    eyebrow: 'Hosted MCP',
    title: 'Connect ChatGPT and AI assistants to live market data — no API keys.',
    desc: 'Open the <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>, authorize, then use <code>@longbridge</code>. Other AI clients connect through hosted HTTP MCP with OAuth 2.1.',
    cta: 'MCP Documentation',
    note: 'ChatGPT Apps first; other clients use OAuth 2.1 on first use. No API key needed.',
  },
  'zh-CN': {
    eyebrow: '托管 MCP',
    title: '无需 API Key，让 ChatGPT 和 AI 助手连接实时市场数据',
    desc: '打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，完成授权后用 <code>@longbridge</code> 调用。其他 AI 客户端可通过托管 HTTP MCP 和 OAuth 2.1 接入。',
    cta: 'MCP 文档',
    note: '优先使用 ChatGPT Apps；其他客户端首次使用时通过 OAuth 2.1 授权，无需 API Key。',
  },
  'zh-HK': {
    eyebrow: '託管 MCP',
    title: '無需 API Key，讓 ChatGPT 和 AI 助手連接即時市場數據',
    desc: '打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，完成授權後用 <code>@longbridge</code> 調用。其他 AI 客戶端可透過託管 HTTP MCP 和 OAuth 2.1 接入。',
    cta: 'MCP 文件',
    note: '優先使用 ChatGPT Apps；其他客戶端首次使用時透過 OAuth 2.1 授權，無需 API Key。',
  },
}

// Locale-independent (legacy `const MCP_CLIENTS`).
const MCP_CLIENTS = ['ChatGPT', 'Codex', 'Claude Code', 'Gemini', 'Cursor', 'Zed']

const MCP_CSS = `
/* MCP section */
.mcp-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 56px;
  align-items: center;
}
@media (max-width: 980px) {
  .mcp-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
.mcp-clients {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 22px;
}
.mcp-client-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 14px;
  border: 1px solid var(--app-card-stroke);
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--lb-fg-2);
  background: var(--lb-card);
}
.mcp-client-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--lb-brand);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--lb-brand) 18%, transparent);
}
.mcp-code {
  box-shadow: var(--app-shadow-2);
}
`

interface McpSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function McpSection({ locale }: McpSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MCP_CSS }} />
      <section data-lbus-component="mcp-section" className="section">
        <div className="section-inner mcp-grid">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: '18px' }}>
              {content.title}
            </h2>
            <p
              className="t-body"
              style={{ marginTop: '14px', maxWidth: '520px' }}
              dangerouslySetInnerHTML={{ __html: content.desc }}
            />
            <div className="mcp-clients">
              {MCP_CLIENTS.map((c) => (
                <span key={c} className="mcp-client-pill">
                  <span className="mcp-client-dot" />
                  {c}
                </span>
              ))}
            </div>
            <a className="btn btn-outline" style={{ marginTop: '24px' }} href={localePath(locale, '/docs/mcp')}>
              {content.cta}
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
            </a>
          </div>
          <div className="code mcp-code">
            <div className="code-head">
              <span style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#ff5f57' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#febc2e' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '999px', background: '#28c840' }} />
              </span>
              <span style={{ marginLeft: '8px', fontSize: '11.5px', color: 'var(--lb-fg-3)' }}>
                ~/projects/quant — claude
              </span>
              <CopyButton text={'claude mcp add --transport http longbridge \\\n  https://mcp.longbridge.com'} />
            </div>
            <div className="code-body" style={{ fontSize: '13.5px', lineHeight: '1.8' }}>
              <div>
                <span className="ln-comment"># One-line install for Claude Code</span>
              </div>
              <div>
                <span className="ln-prompt">$ </span>claude mcp add --transport http longbridge \
              </div>
              <div>
                &nbsp;&nbsp;<span className="ln-str">https://mcp.longbridge.com</span>
              </div>
              <div>&nbsp;</div>
              <div style={{ color: 'var(--lb-fg-2)' }}>→ Opening browser for OAuth 2.1…</div>
              <div style={{ color: 'var(--lb-fg-2)' }}>✓ Authenticated as jason@longbridge.com</div>
              <div style={{ color: 'var(--lb-fg-2)' }}>✓ Connected · 130 tools available</div>
              <div>&nbsp;</div>
              <div>
                <span className="ln-comment"># Verify the connection</span>
              </div>
              <div>
                <span className="ln-prompt">$ </span>claude mcp list
              </div>
              {/* Legacy wrote this line across multiple template lines; Vue's
                  condense mode keeps a single leading and trailing space, and
                  `.code-body` is `white-space: pre`, so both are visible. */}
              <div style={{ color: 'var(--lb-fg-2)' }}>
                {' '}
                longbridge &nbsp; <span style={{ color: 'var(--lb-up)' }}>✓ ready</span> &nbsp; 130 tools{' '}
              </div>
            </div>
            <div
              style={{
                padding: '10px 16px',
                borderTop: '1px solid var(--app-card-stroke)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--lb-fg-3)' }}>
                <circle cx="7" cy="15" r="4" />
                <path d="m10 12 9-9 3 3-3 3 3 3-3 3-3-3-3 3" />
              </svg>
              <span className="t-meta" style={{ fontSize: '11.5px' }}>
                {content.note}
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
