import type { ReactNode } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { CopyButton } from './CopyButton'

// 1:1 port of the legacy VitePress "AI Skill spotlight" (NewHomePage/index.vue
// `<section class="section ai-spotlight">`, legacy home section #5). Copy,
// markup, inline styles, and CSS mirror the legacy source. Generic legacy
// classes (.section / .section-inner / .eyebrow / .h-section / .btn / .code /
// .code-head / .code-copy / .is-up / .num) are provided globally by
// homepage.css under `.new-home-page`; only the `.ai-*` rules live here.
//
// Legacy wired both "Copy" buttons to `copyToClipboard(...)`; this island is
// hydrated (`client:load`), so `CopyButton` attaches the same handler via
// `onClick`. Legacy has no `.lb-dark` rules for `.ai-*` (the card is always dark),
// so there is no dark-mode selector to translate. Every token referenced below
// exists in src/styles/tokens.css with the legacy values.
const LOCALE = {
  en: {
    eyebrow: 'AI Skill · packaged tools',
    title1: 'Unlock market insights, deep research,',
    title2: 'and intelligent trading for your AI.',
    desc: 'With Longbridge Skill, your AI assistant can <a href="https://longbridge.com/screener">screen stocks</a>, decode earnings, track insider moves, and place orders — all in plain conversation, no app-switching required.',
    installLabel: 'Copy and send to any AI — it walks you through install:',
    installCmd: `Install Longbridge AI toolkit following the guide:\nhttps://open.longbridge.com/skill/install.md\n\nAnd complete login and test with a market data query.`,
    installOr: '— or via package manager —',
    agentMore: '+ any Skill-compatible agent',
    cta: 'Browse Skill catalog',
  },
  'zh-CN': {
    eyebrow: 'AI Skill · 预打包工具',
    title1: '为你的 AI 解锁市场洞察、',
    title2: '深度研究与智能交易',
    desc: '在 ChatGPT 中打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，授权后用 <code>@longbridge</code> 调用。其他 AI 助手可通过 Longbridge Skill <a href="https://longbridge.com/screener">筛选股票</a>、解读财报、追踪内部人交易和下单。',
    installLabel: '复制发给任意 AI，它会引导你完成安装：',
    installCmd: `请按照以下指南安装 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
    installOr: '—— 或通过包管理器 ——',
    agentMore: '+ 任意兼容 Skill 的 Agent',
    cta: '浏览 Skill 目录',
  },
  'zh-HK': {
    eyebrow: 'AI Skill · 預打包工具',
    title1: '為你的 AI 解鎖市場洞察、',
    title2: '深度研究與智能交易',
    desc: '在 ChatGPT 中打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，授權後用 <code>@longbridge</code> 調用。其他 AI 助手可透過 Longbridge Skill <a href="https://longbridge.com/screener">篩選股票</a>、解讀財報、追蹤內部人交易和下單。',
    installLabel: '複製發給任意 AI，它會引導你完成安裝：',
    installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
    installOr: '—— 或透過套件管理器 ——',
    agentMore: '+ 任意相容 Skill 的 Agent',
    cta: '瀏覽 Skill 目錄',
  },
}

// Legacy `SUPPORTED_AGENTS` (script setup) — rendered as letter-mark chips.
const SUPPORTED_AGENTS = [
  { name: 'ChatGPT', initial: 'G', color: '#10A37F' },
  { name: 'Codex', initial: 'O', color: '#000000' },
  { name: 'Claude Code', initial: 'C', color: '#D97757' },
  { name: 'Cursor', initial: 'C', color: '#000000' },
  { name: 'Gemini', initial: 'G', color: '#1A73E8' },
  { name: 'OpenClaw', initial: 'O', color: 'var(--lb-brand)' },
  { name: 'Zed', initial: 'Z', color: '#0E40D9' },
]

const NPX_CMD = 'npx skills add longbridge/skills -g'

// Verbatim from legacy app-styles.css: "AI install block" (1156–1235) and
// "AI spotlight" (1501–1577).
const AI_SKILL_CSS = `
/* AI install block */
.ai-install-block {
  margin-top: 24px;
  padding: 16px;
  background: rgba(0, 240, 196, 0.04);
  border: 1px solid rgba(0, 240, 196, 0.12);
  border-radius: 12px;
}
.ai-install-label {
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.ai-install-cmd {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 10px 14px;
  background: rgba(10, 14, 25, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
.ai-install-cmd code {
  flex: 1;
  font-family: var(--app-mono);
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-all;
}
.ai-install-cmd .code-copy {
  color: rgba(255, 255, 255, 0.5);
}
.ai-install-cmd .code-copy:hover {
  color: var(--lb-ai-mention);
  background: rgba(0, 240, 196, 0.1);
}
.ai-install-or {
  text-align: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  margin: 10px 0;
}
.ai-agents-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 20px;
}
.ai-agent-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px 4px 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 500;
}
.ai-agent-mark {
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 100%;
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
}
.ai-agent-more {
  padding: 4px 10px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
}

/* AI spotlight */
.ai-spotlight {
  padding-top: 32px;
}
.ai-spotlight-card {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 56px;
  align-items: center;
  background: #09252a;
  border-radius: 24px;
  padding: 56px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 240, 196, 0.08);
}
.ai-spotlight-card::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(0, 240, 196, 0.18), transparent 60%);
  top: -200px;
  right: -200px;
}
.ai-spotlight-card > * {
  position: relative;
  z-index: 1;
}
.ai-spotlight-chat {
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
}
.ai-chat-body {
  padding: 16px;
  display: grid;
  gap: 12px;
}
.ai-msg.user {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px 12px 4px 12px;
  margin-left: 60px;
}
.ai-msg.assistant {
  background: rgba(0, 240, 196, 0.06);
  border: 1px solid rgba(0, 240, 196, 0.16);
  padding: 12px 14px;
  border-radius: 12px 12px 12px 4px;
}
.ai-msg-tool {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.6);
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}
.ai-msg-tool code {
  font-family: var(--app-mono);
  color: var(--lb-ai-mention);
}
.ai-msg-text {
  font-size: 13.5px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.92);
}
@media (max-width: 980px) {
  .ai-spotlight-card {
    grid-template-columns: 1fr;
    padding: 40px 28px;
    gap: 32px;
  }
}
`


function ToolRow({ children }: { children: ReactNode }) {
  return (
    <div className="ai-msg-tool">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ color: 'var(--lb-ai-mention)' }}>
        <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
      <span>{children}</span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginLeft: 'auto', color: 'var(--lb-up)' }}>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  )
}

interface AiSkillSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function AiSkillSection({ locale }: AiSkillSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: AI_SKILL_CSS }} />
      <section data-lbus-component="ai-skill-section" className="section ai-spotlight">
        <div className="section-inner">
          <div className="ai-spotlight-card">
            <div className="ai-spotlight-text">
              <span className="eyebrow" style={{ color: 'var(--lb-ai-mention)' }}>
                {content.eyebrow}
              </span>
              <h2 className="h-section" style={{ marginTop: '18px', color: '#fff' }}>
                {content.title1}
                <br />
                {content.title2}
              </h2>
              <p
                style={{
                  marginTop: '18px',
                  color: 'rgba(255, 255, 255, 0.66)',
                  maxWidth: '520px',
                  lineHeight: '1.65',
                  fontSize: '15px',
                }}
                dangerouslySetInnerHTML={{ __html: content.desc }}
              />

              <div className="ai-install-block">
                <div className="ai-install-label">{content.installLabel}</div>
                <div className="ai-install-cmd">
                  <pre>
                    <code>{content.installCmd}</code>
                  </pre>
                  <CopyButton text={content.installCmd} />
                </div>
                <div className="ai-install-or">{content.installOr}</div>
                <div className="ai-install-cmd">
                  <code>
                    <span style={{ color: 'var(--lb-ai-mention)' }}>$</span> {NPX_CMD}
                  </code>
                  <CopyButton text={NPX_CMD} />
                </div>
              </div>

              <div className="ai-agents-row">
                {SUPPORTED_AGENTS.map((a) => (
                  <div key={a.name} className="ai-agent-chip" title={a.name}>
                    <span className="ai-agent-mark" style={{ background: a.color }}>
                      {a.initial}
                    </span>
                    {a.name}
                  </div>
                ))}
                <div className="ai-agent-chip ai-agent-more">{content.agentMore}</div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <a
                  className="btn btn-lg"
                  href={localePath(locale, '/skill')}
                  style={{ background: '#fff', color: '#09252a' }}>
                  {content.cta}
                  <svg
                    width="15"
                    height="15"
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
            </div>

            <div
              className="ai-spotlight-chat code"
              style={{ background: '#0a0e19', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div
                className="code-head"
                style={{
                  background: '#141826',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: 'var(--lb-ai-mention)' }}>
                  <path d="M12 2.5 13.4 9.2 20.5 10.5 13.6 12 12 18.5 10.4 12 3.5 10.5 10.6 9.2z" />
                </svg>
                Claude Code · skill: longbridge
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)' }}>
                  connected
                </span>
              </div>
              <div className="ai-chat-body">
                <div className="ai-msg user">
                  <div className="ai-msg-text">
                    Pull NVDA's daily chart for the past 6 months and tell me if I should hold my position.
                  </div>
                </div>
                <div className="ai-msg assistant">
                  <ToolRow>
                    used <code>longbridge-kline</code> · 6mo · daily
                  </ToolRow>
                  <ToolRow>
                    used <code>longbridge-positions</code>
                  </ToolRow>
                  <div className="ai-msg-text" style={{ color: 'rgba(255, 255, 255, 0.88)' }}>
                    NVDA broke its 50-day MA on heavy volume{' '}
                    <span className="num" style={{ color: 'var(--lb-ai-mention)' }}>
                      3 sessions ago
                    </span>
                    . Your <b>247 shares</b> at avg <b>$127.40</b> are up{' '}
                    <span className="is-up num" style={{ fontWeight: 600 }}>
                      +12.1%
                    </span>
                    . Concentration risk is{' '}
                    <span style={{ color: 'var(--lb-status-alert)', fontWeight: '600' }}>medium</span> — NVDA is 31% of
                    your portfolio. Consider trimming if it hits $150.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
