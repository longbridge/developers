import React from 'react'
import type { Locale } from '@longbridge/openapi-utils'

const LOCALE = {
  en: {
    user: 'User', yourApp: 'Your Application', accessVia: 'Access via',
    skill: { label: 'AI Skill', desc: 'Investment analysis agent for any AI platform' },
    cli: { label: 'CLI', desc: '130+ commands, TUI dashboard, JSON output' },
    mcp: { label: 'MCP Client', desc: 'Claude, Cursor, Codex, Zed, Cherry Studio' },
    sdk: { label: 'SDK', desc: 'Python, Node.js, Rust, Go, Java, C++' },
    protoIn: 'HTTP / WebSocket', platform: 'Longbridge Platform', gateway: 'API Gateway',
    protoOut: 'Request / Stream', services: 'Services',
    quote: 'Quote', fundamentals: 'Fundamentals', trade: 'Trade', content: 'Content', more: 'More',
  },
  'zh-CN': {
    user: '用户', yourApp: '你的应用', accessVia: '接入方式',
    skill: { label: 'AI Skill', desc: '适配任何 AI 平台的投资分析 Agent' },
    cli: { label: 'CLI', desc: '130+ 命令，TUI 看板，JSON 输出' },
    mcp: { label: 'MCP Client', desc: 'Claude, Cursor, Codex, Zed, Cherry Studio' },
    sdk: { label: 'SDK', desc: 'Python, Node.js, Rust, Go, Java, C++' },
    protoIn: 'HTTP / WebSocket', platform: 'Longbridge 平台', gateway: 'API 网关',
    protoOut: '请求 / 数据流', services: '服务',
    quote: '行情', fundamentals: '基本面', trade: '交易', content: '内容', more: '更多',
  },
  'zh-HK': {
    user: '用戶', yourApp: '你的應用', accessVia: '接入方式',
    skill: { label: 'AI Skill', desc: '適配任何 AI 平台的投資分析 Agent' },
    cli: { label: 'CLI', desc: '130+ 命令，TUI 看板，JSON 輸出' },
    mcp: { label: 'MCP Client', desc: 'Claude, Cursor, Codex, Zed, Cherry Studio' },
    sdk: { label: 'SDK', desc: 'Python, Node.js, Rust, Go, Java, C++' },
    protoIn: 'HTTP / WebSocket', platform: 'Longbridge 平台', gateway: 'API 閘道',
    protoOut: '請求 / 數據流', services: '服務',
    quote: '行情', fundamentals: '基本面', trade: '交易', content: '內容', more: '更多',
  },
}

const ARCH_CANVAS_CSS = `
.ab { max-width: 64rem; margin: 0 auto; }
@media (max-width: 900px) { .ab { padding: 2rem 1.5rem; } }
.ab-flow { display: flex; align-items: stretch; gap: 0; font-size: 14px; }
.ab-group { display: flex; flex-direction: column; gap: 0.375rem; min-width: 0; }
.ab-group-brand { flex: 0 0 auto; min-width: 10rem; }
.ab-group-label { font-weight: 700; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.06em; }
.ab-label-brand { color: var(--vp-c-text-1); }
.ab-group-box { border: 1.5px solid var(--vp-c-divider); border-radius: 0.625rem; padding: 0.875rem; background: var(--vp-c-bg); display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
.ab-box-brand { border-color: var(--vp-c-divider); background: var(--vp-c-bg); justify-content: center; align-items: center; }
.ab-app { display: flex; align-items: center; gap: 0.375rem; padding: 0.5rem 0.75rem; border-radius: 0.375rem; background: var(--vp-c-bg-soft); font-size: 0.85rem; font-weight: 700; color: var(--vp-c-text-1); }
.ab-app svg { color: var(--vp-c-text-3); flex-shrink: 0; }
.ab-via { font-weight: 600; color: var(--vp-c-text-3); text-transform: uppercase; letter-spacing: 0.04em; }
.ab-tools { display: grid; grid-template-columns: 1fr 1fr; gap: 0.375rem; }
.ab-tool { display: flex; flex-direction: column; gap: 0.125rem; padding: 0.4rem 0.625rem; border-radius: 0.375rem; background: var(--vp-c-bg-soft); text-decoration: none !important; transition: background 0.15s; }
.ab-tool:hover { background: var(--vp-c-bg-elv); }
.ab-tool-name { font-size: 0.75rem; font-weight: 700; color: var(--vp-c-text-1); }
.ab-tool-desc { font-size: 0.58rem; color: var(--vp-c-text-3); line-height: 1.4; }
.ab-gw { display: flex; align-items: center; justify-content: center; padding: 1rem 0; }
.ab-gw-title { font-size: 0.85rem; font-weight: 700; color: var(--vp-c-text-1); white-space: nowrap; }
.ab-box-svc { justify-content: center; }
.ab-svc { display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; border-radius: 0.375rem; background: var(--vp-c-bg-soft); text-decoration: none !important; transition: background 0.15s; min-width: 9rem; }
.ab-svc:hover { background: var(--vp-c-bg-elv); }
.ab-svc-name { font-size: 0.78rem; font-weight: 700; color: var(--vp-c-text-1); }
.ab-svc-count { font-size: 0.65rem; font-weight: 700; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); }
.ab-svc-more { border: 1.5px dashed var(--vp-c-divider); background: transparent; cursor: default; opacity: 0.55; }
.ab-svc-more:hover { background: transparent; }
.ab-svc-more .ab-svc-name { color: var(--vp-c-text-3); font-weight: 500; }
.ab-svc-dots { font-size: 0.78rem; color: var(--vp-c-text-3); letter-spacing: 0.1em; font-family: var(--vp-font-family-mono); }
.ab-arrow { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.25rem; padding: 0 0.375rem; flex-shrink: 0; min-width: 4.5rem; align-self: center; }
.ab-arrow-label { font-size: 0.55rem; font-weight: 600; color: var(--vp-c-text-3); font-family: var(--vp-font-family-mono); white-space: nowrap; }
.ab-arrow-line { display: flex; align-items: center; width: 100%; }
.ab-arrow-shaft { flex: 1; height: 1.5px; background: repeating-linear-gradient(90deg, var(--vp-c-text-3) 0px, var(--vp-c-text-3) 5px, transparent 5px, transparent 8px); animation: ab-dash 0.6s linear infinite; }
@keyframes ab-dash { to { background-position: -8px 0; } }
.ab-arrow-head { width: 0; height: 0; border-left: 6px solid var(--vp-c-text-3); border-top: 4px solid transparent; border-bottom: 4px solid transparent; flex-shrink: 0; }
.ab-arrow-dir { color: var(--vp-c-text-3); opacity: 0.4; }
@media (max-width: 900px) {
  .ab-flow { flex-direction: column; gap: 0; }
  .ab-arrow { flex-direction: row; padding: 0.75rem 0; min-width: auto; align-self: center; gap: 0.5rem; }
  .ab-arrow-line { width: 0; height: 2.5rem; flex-direction: column; }
  .ab-arrow-shaft { width: 1.5px; height: 100%; flex: 1; background: repeating-linear-gradient(180deg, var(--vp-c-text-3) 0px, var(--vp-c-text-3) 5px, transparent 5px, transparent 8px); animation: ab-dash-v 0.6s linear infinite; }
  .ab-arrow-head { border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 6px solid var(--vp-c-text-3); border-bottom: none; }
  .ab-arrow-dir { transform: rotate(90deg); }
  .ab-tools { grid-template-columns: repeat(2, 1fr); }
}
@keyframes ab-dash-v { to { background-position: 0 -8px; } }
@media (max-width: 480px) {
  .ab-tool { min-width: auto; }
}
`

function ArrowRight({ label }: { label: string }) {
  return (
    <div className="ab-arrow">
      <span className="ab-arrow-label">{label}</span>
      <div className="ab-arrow-line">
        <div className="ab-arrow-shaft" />
        <div className="ab-arrow-head" />
      </div>
      <svg className="ab-arrow-dir" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
        <path d="M5 12h14m-4-4 4 4-4 4" />
      </svg>
    </div>
  )
}

interface ArchCanvasProps {
  locale: Locale
}

export function ArchCanvas({ locale }: ArchCanvasProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: ARCH_CANVAS_CSS }} />
      <div className="ab">
        <div className="ab-flow">
          {/* Col 1: User & Tools */}
          <div className="ab-group">
            <div className="ab-group-label">{content.user}</div>
            <div className="ab-group-box">
              <div className="ab-app">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} width="15" height="15" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8m-4-4v4" />
                </svg>
                <span>{content.yourApp}</span>
              </div>
              <div className="ab-via">{content.accessVia}</div>
              <div className="ab-tools">
                <a href="/skill" className="ab-tool">
                  <span className="ab-tool-name">{content.skill.label}</span>
                  <span className="ab-tool-desc">{content.skill.desc}</span>
                </a>
                <a href="/docs/cli" className="ab-tool">
                  <span className="ab-tool-name">{content.cli.label}</span>
                  <span className="ab-tool-desc">{content.cli.desc}</span>
                </a>
                <a href="/docs/mcp" className="ab-tool">
                  <span className="ab-tool-name">{content.mcp.label}</span>
                  <span className="ab-tool-desc">{content.mcp.desc}</span>
                </a>
                <a href="/sdk" className="ab-tool">
                  <span className="ab-tool-name">{content.sdk.label}</span>
                  <span className="ab-tool-desc">{content.sdk.desc}</span>
                </a>
              </div>
            </div>
          </div>

          <ArrowRight label={content.protoIn} />

          {/* Col 2: Longbridge Platform */}
          <div className="ab-group ab-group-brand">
            <div className="ab-group-label ab-label-brand">{content.platform}</div>
            <div className="ab-group-box ab-box-brand">
              <div className="ab-gw">
                <span className="ab-gw-title">{content.gateway}</span>
              </div>
            </div>
          </div>

          <ArrowRight label={content.protoOut} />

          {/* Col 3: Services */}
          <div className="ab-group">
            <div className="ab-group-label">{content.services}</div>
            <div className="ab-group-box ab-box-svc">
              <a href="/docs/quote/overview" className="ab-svc">
                <span className="ab-svc-name">{content.quote}</span>
                <span className="ab-svc-count">30+</span>
              </a>
              <a href="/docs/cli/fundamentals/company" className="ab-svc">
                <span className="ab-svc-name">{content.fundamentals}</span>
                <span className="ab-svc-count">13+</span>
              </a>
              <a href="/docs/trade/overview" className="ab-svc">
                <span className="ab-svc-name">{content.trade}</span>
                <span className="ab-svc-count">14+</span>
              </a>
              <a href="/docs/content/news" className="ab-svc">
                <span className="ab-svc-name">{content.content}</span>
                <span className="ab-svc-count">8+</span>
              </a>
              <div className="ab-svc ab-svc-more">
                <span className="ab-svc-name">{content.more}</span>
                <span className="ab-svc-dots">···</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
