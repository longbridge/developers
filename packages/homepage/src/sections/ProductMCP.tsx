'use client'
import React, { useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------
const LOCALE = {
  en: {
    title: 'MCP',
    subtitle: 'Connect ChatGPT and AI assistants to live market data — no API keys required',
    desc: 'Longbridge is available directly in the <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>. Other AI clients can connect to the hosted HTTP MCP service with OAuth 2.1 authentication.',
    tools: [
      { title: 'Market Data', desc: 'Real-time quotes, candlesticks, historical data' },
      { title: 'Account Info', desc: 'Account overview, assets, positions' },
      { title: 'Trading', desc: 'Place, modify, cancel orders' },
    ],
    cta: 'MCP Documentation',
    note: 'ChatGPT: open the <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a> or Apps → search longbridge → authorize → use @longbridge.',
  },
  'zh-CN': {
    title: 'MCP',
    subtitle: '让 ChatGPT 和 AI 助手连接实时行情 — 无需 API Key',
    desc: 'Longbridge 已可直接通过 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a> 使用。其他 AI 客户端可通过托管 HTTP MCP 服务和 OAuth 2.1 授权接入。',
    tools: [
      { title: '行情数据', desc: '实时行情、K 线、历史数据' },
      { title: '账户信息', desc: '账户总览、资产、持仓' },
      { title: '交易', desc: '下单、改单、撤单' },
    ],
    cta: 'MCP 文档',
    note: 'ChatGPT：打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，或 Apps → 搜索 longbridge → 授权 → 使用 @longbridge。',
  },
  'zh-HK': {
    title: 'MCP',
    subtitle: '讓 ChatGPT 和 AI 助手連接即時行情 — 無需 API Key',
    desc: 'Longbridge 已可直接透過 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a> 使用。其他 AI 客戶端可透過託管 HTTP MCP 服務和 OAuth 2.1 授權接入。',
    tools: [
      { title: '行情數據', desc: '即時行情、K 線、歷史數據' },
      { title: '賬戶信息', desc: '賬戶總覽、資產、持倉' },
      { title: '交易', desc: '下單、改單、撤單' },
    ],
    cta: 'MCP 文檔',
    note: 'ChatGPT：打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，或 Apps → 搜尋 longbridge → 授權 → 使用 @longbridge。',
  },
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
type McpClient =
  | { id: string; name: string; logo: string; type: 'ui'; steps: string[]; fields?: Record<string, string> }
  | { id: string; name: string; logo: string; type: 'shell'; cmd: string }
  | { id: string; name: string; logo: string; type: 'json'; json: object }

const clients: McpClient[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
    type: 'ui',
    steps: ['Open App link', 'Authorize', 'Use @longbridge'],
    fields: { Use: '@longbridge' },
  },
  {
    id: 'codex',
    name: 'Codex',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
    type: 'ui',
    steps: ['Settings', 'MCP Servers', 'Add Server'],
    fields: { Name: 'longbridge', Type: 'Streamable HTTP', URL: 'https://mcp.longbridge.com' },
  },
  {
    id: 'claude',
    name: 'Claude Code',
    logo: 'https://assets.lbctrl.com/uploads/6932dfac-0f9c-4577-bdd8-fc3d22d4223a/claude.svg',
    type: 'shell',
    cmd: 'claude mcp add --transport http longbridge https://mcp.longbridge.com',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    logo: 'https://assets.lbctrl.com/uploads/f694478e-201b-4e74-a7b6-023639a27805/cursor.svg',
    type: 'ui',
    steps: ['Settings', 'MCP Servers', 'Add Remote MCP Server'],
    fields: { URL: 'https://mcp.longbridge.com' },
  },
  {
    id: 'zed',
    name: 'Zed',
    logo: 'https://assets.lbctrl.com/uploads/3418077a-9766-4514-bc8e-eef076309689/zed.svg',
    type: 'json',
    json: { mcpServers: { longbridge: { url: 'https://mcp.longbridge.com' } } },
  },
  {
    id: 'cherry',
    name: 'Cherry Studio',
    logo: 'https://assets.lbctrl.com/uploads/df8f9467-91a5-4bdb-8dde-5127441f0b04/cherrystudio.svg',
    type: 'ui',
    steps: ['Settings', 'MCP Servers', 'Add'],
    fields: { URL: 'https://mcp.longbridge.com' },
  },
]

// ---------------------------------------------------------------------------
// SVG layout constants
// ---------------------------------------------------------------------------
const CLIENT_H = 34
const BUS_TOP_Y = 82
const HUB_X = 240
const HUB_Y = 108
const HUB_W = 160
const HUB_H = 40
const HUB_CX = 320
const BUS_BOT_Y = 192
const TOOL_Y = 218
const TOOL_H = 78

const clientNodes = [
  { name: 'ChatGPT', x: 8, w: 82, clickIdx: 0 },
  { name: 'Codex', x: 98, w: 64, clickIdx: 1 },
  { name: 'Claude Code', x: 170, w: 104, clickIdx: 2 },
  { name: 'Cursor', x: 282, w: 68, clickIdx: 3 },
  { name: 'Zed', x: 358, w: 48, clickIdx: 4 },
  { name: 'Cherry Studio', x: 414, w: 112, clickIdx: 5 },
  { name: 'Any Client', x: 534, w: 98, clickIdx: -1 },
]

const toolPositions = [
  { x: 8, w: 160 },
  { x: 240, w: 160 },
  { x: 472, w: 160 },
]

const clientCenters = clientNodes.map((c) => c.x + c.w / 2)
const toolCenters = toolPositions.map((t) => t.x + t.w / 2)

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------
const MCP_CSS = `
.mcp-section {
  padding: 4rem 1rem;
  background: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  overflow: hidden;
}
.mcp-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 1.5rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  width: 100%;
}
.mcp-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.mcp-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  line-height: 1.4;
}
.mcp-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-3);
}
.mcp-diagram-wrap {
  width: 100%;
  max-width: 64rem;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
  box-sizing: border-box;
}
.mcp-diagram-svg {
  width: 100%;
  height: auto;
  display: block;
  overflow: visible;
}
.mcp-edge {
  stroke: var(--vp-c-text-3);
  stroke-width: 1.5;
  stroke-dasharray: 5 3;
  fill: none;
  stroke-opacity: 0.5;
  transition: stroke 0.2s, stroke-opacity 0.2s;
}
.mcp-edge-hi {
  stroke: var(--brand-color);
  stroke-opacity: 0.6;
  animation: mcp-dash 0.8s linear infinite;
}
.mcp-edge-down {
  stroke: var(--brand-color);
  stroke-opacity: 0.35;
  stroke-dasharray: 5 3;
}
@keyframes mcp-dash {
  to { stroke-dashoffset: -8; }
}
.mcp-n {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  font-family: var(--vp-font-family-base);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  user-select: none;
}
.mcp-client-logo {
  width: 13px;
  height: 13px;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 2px;
}
:root.dark .mcp-client-logo {
  filter: brightness(0) invert(1);
}
.mcp-n-client {
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  font-size: 0.68rem;
}
.mcp-n-client:hover:not(.more) {
  border-color: var(--brand-color);
}
.mcp-n-client.active {
  border-color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 6%, var(--vp-c-bg));
  color: var(--brand-color);
}
.mcp-n-client.more {
  border-style: dashed;
  opacity: 0.55;
  cursor: default;
  color: var(--vp-c-text-3);
  font-weight: 500;
}
.mcp-n-hub {
  border: 1.5px solid var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 6%, var(--vp-c-bg));
  color: var(--brand-color);
  cursor: default;
}
.mcp-n-tool {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  cursor: default;
  white-space: normal;
}
.mcp-n-tool-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.3;
}
.mcp-n-tool-desc {
  font-size: 0.65rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mcp-config {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.mcp-config-tabs {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  overflow-x: auto;
}
.mcp-config-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.mcp-tab-logo {
  width: 1rem;
  height: 1rem;
  object-fit: contain;
  flex-shrink: 0;
  border-radius: 2px;
}
:root.dark .mcp-tab-logo {
  filter: brightness(0) invert(1);
}
.mcp-config-tab:hover {
  color: var(--vp-c-text-2);
}
.mcp-config-tab.active {
  color: var(--brand-color);
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}
.mcp-config-panel {
  border-radius: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  overflow: hidden;
}
.mcp-config-cmd {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.75rem 0.875rem;
}
.mcp-cmd-prompt {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-3);
  user-select: none;
  line-height: 1.5;
}
.mcp-cmd-shell {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--brand-color);
  line-height: 1.5;
  flex: 1;
  word-break: break-all;
}
.mcp-config-json {
  position: relative;
  padding: 0.75rem 0.875rem;
}
.mcp-json-code {
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  line-height: 1.6;
  white-space: pre;
  overflow-x: auto;
}
.mcp-json-code code {
  font-family: inherit;
}
.mcp-copy-json {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
.mcp-config-steps {
  padding: 0.75rem 0.875rem;
}
.mcp-steps-nav {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  margin-bottom: 0.625rem;
}
.mcp-step {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--vp-c-text-3) 8%, transparent);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.mcp-step-arrow {
  color: var(--vp-c-text-3);
  flex-shrink: 0;
}
.mcp-fields {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}
.mcp-field {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-size: 0.75rem;
}
.mcp-field-key {
  font-weight: 600;
  color: var(--vp-c-text-3);
  min-width: 3rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
}
.mcp-field-value {
  font-family: var(--vp-font-family-mono);
  font-size: 0.7rem;
  color: var(--brand-color);
  word-break: break-all;
}
.mcp-copy-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.25rem;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.mcp-copy-btn:hover {
  color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.mcp-copy-btn:active {
  transform: scale(0.8);
}
.mcp-config-note {
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  text-align: center;
}
.mcp-cta-wrap {
  text-align: center;
  margin-top: 1.5rem;
}
.mcp-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.mcp-cta:hover {
  gap: 0.625rem;
}
@media (max-width: 768px) {
  .mcp-section { padding: 3rem 0.75rem; }
  .mcp-diagram-wrap { padding: 0 0.5rem; }
  .mcp-header { padding: 0 0.5rem; }
  .mcp-config { padding: 0 0.5rem; }
  .mcp-title { font-size: 1.5rem; }
  .mcp-subtitle { font-size: 0.82rem; }
  .mcp-desc { font-size: 0.78rem; }
}
@media (max-width: 480px) {
  .mcp-title { font-size: 1.25rem; }
  .mcp-subtitle { font-size: 0.75rem; }
  .mcp-desc { font-size: 0.72rem; }
}
`

// ---------------------------------------------------------------------------
// SVG icons
// ---------------------------------------------------------------------------
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface ProductMCPProps {
  locale: Locale
}

export function ProductMCP({ locale }: ProductMCPProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const [activeClient, setActiveClient] = useState(0)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const [copiedJson, setCopiedJson] = useState(false)

  const currentClient = clients[activeClient]

  const copyText =
    currentClient.type === 'shell'
      ? currentClient.cmd
      : currentClient.type === 'json'
        ? JSON.stringify(currentClient.json, null, 2)
        : ''

  const formattedJson =
    currentClient.type === 'json' ? JSON.stringify(currentClient.json, null, 2) : ''

  function handleCopyCmd() {
    navigator.clipboard.writeText(copyText)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 1500)
  }

  function handleCopyJson() {
    navigator.clipboard.writeText(formattedJson)
    setCopiedJson(true)
    setTimeout(() => setCopiedJson(false), 1500)
  }

  // active client center for hi-bus line
  const activeCenter = clientCenters[activeClient] ?? HUB_CX

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MCP_CSS }} />
      <section data-lbus-component="product-mcp" className="mcp-section">
        {/* Header */}
        <div className="mcp-header">
          <h2 className="mcp-title">{content.title}</h2>
          <p className="mcp-subtitle">{content.subtitle}</p>
          <p className="mcp-desc" dangerouslySetInnerHTML={{ __html: content.desc }} />
        </div>

        {/* SVG diagram */}
        <div className="mcp-diagram-wrap">
          <svg
            viewBox="0 0 640 300"
            preserveAspectRatio="xMidYMid meet"
            className="mcp-diagram-svg"
          >
            {/* Top bus (background dashed) */}
            <line
              className="mcp-edge"
              x1={clientCenters[0]}
              y1={BUS_TOP_Y}
              x2={clientCenters[clientCenters.length - 1]}
              y2={BUS_TOP_Y}
            />

            {/* Active hi-bus segment from active client to hub */}
            <line
              className="mcp-edge mcp-edge-hi"
              x1={activeCenter}
              y1={BUS_TOP_Y}
              x2={HUB_CX}
              y2={BUS_TOP_Y}
            />

            {/* Client stub lines (vertical from node top to bus) */}
            {clientCenters.map((cx, idx) => (
              <line
                key={idx}
                className="mcp-edge"
                x1={cx}
                y1={CLIENT_H}
                x2={cx}
                y2={BUS_TOP_Y}
                style={{ opacity: idx === clientNodes.length - 1 ? 0.4 : 1 }}
              />
            ))}

            {/* Hub spine: bus → hub top */}
            <line
              className="mcp-edge mcp-edge-hi"
              x1={HUB_CX}
              y1={BUS_TOP_Y}
              x2={HUB_CX}
              y2={HUB_Y}
            />

            {/* Hub spine: hub bottom → lower bus */}
            <line
              className="mcp-edge mcp-edge-hi"
              x1={HUB_CX}
              y1={HUB_Y + HUB_H}
              x2={HUB_CX}
              y2={BUS_BOT_Y}
            />

            {/* Bottom bus */}
            <line
              className="mcp-edge mcp-edge-down"
              x1={toolCenters[0]}
              y1={BUS_BOT_Y}
              x2={toolCenters[toolCenters.length - 1]}
              y2={BUS_BOT_Y}
            />

            {/* Tool stub lines */}
            {toolCenters.map((cx, idx) => (
              <line
                key={idx}
                className="mcp-edge mcp-edge-down"
                x1={cx}
                y1={BUS_BOT_Y}
                x2={cx}
                y2={TOOL_Y}
              />
            ))}

            {/* Client foreignObject nodes */}
            {clientNodes.map((cn, idx) => {
              const isActive = cn.clickIdx === activeClient
              const isMore = cn.clickIdx < 0
              const logo = cn.clickIdx >= 0 ? clients[cn.clickIdx]?.logo : undefined
              return (
                <foreignObject key={idx} x={cn.x} y={0} width={cn.w} height={CLIENT_H}>
                  <div
                    className={`mcp-n mcp-n-client${isActive ? ' active' : ''}${isMore ? ' more' : ''}`}
                    onClick={!isMore ? () => setActiveClient(cn.clickIdx) : undefined}
                  >
                    {logo ? (
                      <img className="mcp-client-logo" src={logo} alt={cn.name} />
                    ) : null}
                    {cn.name}
                  </div>
                </foreignObject>
              )
            })}

            {/* Hub foreignObject */}
            <foreignObject x={HUB_X} y={HUB_Y} width={HUB_W} height={HUB_H}>
              <div className="mcp-n mcp-n-hub">Longbridge MCP</div>
            </foreignObject>

            {/* Tool foreignObject nodes */}
            {toolPositions.map((tp, idx) => (
              <foreignObject key={idx} x={tp.x} y={TOOL_Y} width={tp.w} height={TOOL_H}>
                <div className="mcp-n mcp-n-tool">
                  <span className="mcp-n-tool-title">{content.tools[idx]?.title}</span>
                  <span className="mcp-n-tool-desc">{content.tools[idx]?.desc}</span>
                </div>
              </foreignObject>
            ))}
          </svg>
        </div>

        {/* Config panel */}
        <div className="mcp-config">
          {/* Tabs */}
          <div className="mcp-config-tabs">
            {clients.map((c, idx) => (
              <button
                key={c.id}
                className={`mcp-config-tab${activeClient === idx ? ' active' : ''}`}
                onClick={() => setActiveClient(idx)}
              >
                <img className="mcp-tab-logo" src={c.logo} alt={c.name} />
                {c.name}
              </button>
            ))}
          </div>

          {/* Shell panel */}
          {currentClient.type === 'shell' && (
            <div className="mcp-config-panel">
              <div className="mcp-config-cmd">
                <span className="mcp-cmd-prompt">$</span>
                <code className="mcp-cmd-shell">{currentClient.cmd}</code>
                <button className="mcp-copy-btn" onClick={handleCopyCmd} aria-label="Copy command">
                  {copiedCmd ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          )}

          {/* JSON panel */}
          {currentClient.type === 'json' && (
            <div className="mcp-config-panel">
              <div className="mcp-config-json">
                <pre className="mcp-json-code">
                  <code>{formattedJson}</code>
                </pre>
                <button
                  className="mcp-copy-json mcp-copy-btn"
                  onClick={handleCopyJson}
                  aria-label="Copy JSON"
                >
                  {copiedJson ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>
          )}

          {/* UI panel */}
          {currentClient.type === 'ui' && (
            <div className="mcp-config-panel">
              <div className="mcp-config-steps">
                <div className="mcp-steps-nav">
                  {currentClient.steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <span className="mcp-step">{step}</span>
                      {idx < currentClient.steps.length - 1 && (
                        <ArrowIcon />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {currentClient.fields && (
                  <div className="mcp-fields">
                    {Object.entries(currentClient.fields).map(([key, value]) => (
                      <div key={key} className="mcp-field">
                        <span className="mcp-field-key">{key}</span>
                        <span className="mcp-field-value">{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <p className="mcp-config-note" dangerouslySetInnerHTML={{ __html: content.note }} />
        </div>

        {/* CTA */}
        <div className="mcp-cta-wrap">
          <a href="/docs/mcp" className="mcp-cta">
            {content.cta}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>
    </>
  )
}
