'use client'
import React, { useState, useEffect, useRef } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

// ---------------------------------------------------------------------------
// Locale
// ---------------------------------------------------------------------------
const LOCALE = {
  en: {
    title: 'ChatGPT App + AI Skill',
    subtitle: 'Use Longbridge in ChatGPT first, or give coding agents market intelligence',
    desc: 'In ChatGPT, open the <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a> or search longbridge in Apps, authorize, then use @longbridge. For Codex, Claude Code, Cursor, and other agents, Longbridge Skill teaches your AI how to screen stocks, decode earnings, track insider moves, and place orders.',
    cta: 'Skill Installation Guide',
    installLabel: 'Copy and send to any AI — it walks you through install:',
    installCmd: `Install Longbridge AI toolkit following the guide:\nhttps://open.longbridge.com/skill/install.md\n\nAnd complete login and test with a market data query.`,
    installOr: '— or via package manager —',
    agentMore: '+ any Skill-compatible agent',
    mockYou: 'You',
    mockThinking: 'Using Longbridge Skill...',
    tipBefore: 'Tip: prefix with',
    tipAfter: 'to force trigger',
    caps: [
      {
        title: 'Cross-Market Screener',
        desc: 'Screen HK, US, A-shares, and SG stocks simultaneously with fundamental and technical filters',
        example: 'Find US and HK tech stocks with market cap above $50B, P/E below 25, and a recent MACD golden cross',
      },
      {
        title: 'Technical Diagnosis',
        desc: 'Pull daily, hourly, and 15-min candlestick data with MACD, KDJ, RSI analysis',
        example: "Diagnose TSLA's technicals: daily trend, support/resistance levels, and short-term signals",
      },
      {
        title: 'Earnings Deep Dive',
        desc: 'Unpack earnings in 5 minutes: actuals vs estimates, revenue breakdown, valuation metrics',
        example: 'NVDA just reported — compare actuals vs analyst estimates and break down revenue by segment',
      },
      {
        title: 'Smart Money Tracker',
        desc: 'Track insider trading and institutional ownership shifts across fund types',
        example: "Check AAPL's recent insider trading — are executives selling? How did hedge fund positions change?",
      },
      {
        title: 'Advanced Orders',
        desc: 'Place conditional orders, trailing stops, and options in conversational syntax',
        example: 'Set a trailing stop on TSLA: trigger a sell if it drops more than 8%, show details before executing',
      },
      {
        title: 'Portfolio Review',
        desc: 'Comprehensive P&L analysis: trend, position ranking, allocation breakdown',
        example: 'Review my portfolio this month: P&L trend, biggest winner, worst drag, US vs HK allocation',
      },
    ],
  },
  'zh-CN': {
    title: 'ChatGPT App + AI Skill',
    subtitle: '优先在 ChatGPT 使用 Longbridge，也可为编程 Agent 补充市场智能',
    desc: '在 ChatGPT 中打开 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，或在 Apps 搜索 longbridge 并授权，然后用 @longbridge 调用。Codex、Claude Code、Cursor 等 Agent 可通过 Longbridge Skill 学会选股、解读财报、追踪内部人交易和下单。',
    cta: 'Skill 安装指南',
    installLabel: '复制发给任意 AI，它会引导你完成安装：',
    installCmd: `请按照以下指南安装 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
    installOr: '—— 或通过包管理器 ——',
    agentMore: '+ 任意兼容 Skill 的 Agent',
    mockYou: '你',
    mockThinking: '正在调用 Longbridge Skill...',
    tipBefore: '提示：加前缀',
    tipAfter: '可强制触发',
    caps: [
      {
        title: '跨市场选股',
        desc: '同时筛选港股、美股、A 股和新加坡市场，支持基本面和技术面过滤器',
        example: '找出市值超过 500 亿美元、PE 低于 25 且近期 MACD 金叉的美股和港股科技股',
      },
      {
        title: '技术诊断',
        desc: '拉取日线、小时线、15 分钟 K 线数据，结合 MACD、KDJ、RSI 分析',
        example: '诊断 TSLA 的技术面：日线趋势、支撑/阻力位和短期信号',
      },
      {
        title: '财报深度分析',
        desc: '5 分钟解读财报：实际值 vs 预期、收入分拆、估值指标',
        example: 'NVDA 刚发布财报 — 对比实际业绩和分析师预期，按业务线拆解收入变化',
      },
      {
        title: '聪明钱追踪',
        desc: '追踪内部人交易和机构持仓变动，覆盖各类基金',
        example: '查看 AAPL 近期内部人交易 — 高管是否在大量减持？对冲基金仓位变化如何？',
      },
      {
        title: '智能下单',
        desc: '对话式下单：条件单、追踪止损、期权，AI 确认后执行',
        example: '设置 TSLA 追踪止损：跌幅超过 8% 触发卖出，执行前显示订单详情',
      },
      {
        title: '组合回顾',
        desc: '全面盈亏分析：趋势、持仓排名、配置分布',
        example: '回顾本月组合表现：盈亏趋势、最大赢家、最大拖累、美股 vs 港股配比',
      },
    ],
  },
  'zh-HK': {
    title: 'ChatGPT App + AI Skill',
    subtitle: '優先在 ChatGPT 使用 Longbridge，也可為編程 Agent 補充市場智能',
    desc: '在 ChatGPT 中打開 <a href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">Longbridge ChatGPT App</a>，或在 Apps 搜尋 longbridge 並授權，然後用 @longbridge 調用。Codex、Claude Code、Cursor 等 Agent 可透過 Longbridge Skill 學會選股、解讀財報、追蹤內部人交易和下單。',
    cta: 'Skill 安裝指南',
    installLabel: '複製發給任意 AI，它會引導你完成安裝：',
    installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\nhttps://open.longbridge.com/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
    installOr: '—— 或透過套件管理器 ——',
    agentMore: '+ 任意相容 Skill 的 Agent',
    mockYou: '你',
    mockThinking: '正在調用 Longbridge Skill...',
    tipBefore: '提示：加前綴',
    tipAfter: '可強制觸發',
    caps: [
      {
        title: '跨市場選股',
        desc: '同時篩選港股、美股、A 股和新加坡市場，支持基本面和技術面過濾器',
        example: '找出市值超過 500 億美元、PE 低於 25 且近期 MACD 金叉的美股和港股科技股',
      },
      {
        title: '技術診斷',
        desc: '拉取日線、小時線、15 分鐘 K 線數據，結合 MACD、KDJ、RSI 分析',
        example: '診斷 TSLA 的技術面：日線趨勢、支撐/阻力位和短期信號',
      },
      {
        title: '財報深度分析',
        desc: '5 分鐘解讀財報：實際值 vs 預期、收入分拆、估值指標',
        example: 'NVDA 剛發佈財報 — 對比實際業績和分析師預期，按業務線拆解收入變化',
      },
      {
        title: '聰明錢追蹤',
        desc: '追蹤內部人交易和機構持倉變動，覆蓋各類基金',
        example: '查看 AAPL 近期內部人交易 — 高管是否在大量減持？對沖基金倉位變化如何？',
      },
      {
        title: '智能下單',
        desc: '對話式下單：條件單、追蹤止損、期權，AI 確認後執行',
        example: '設置 TSLA 追蹤止損：跌幅超過 8% 觸發賣出，執行前顯示訂單詳情',
      },
      {
        title: '組合回顧',
        desc: '全面盈虧分析：趨勢、持倉排名、配置分佈',
        example: '回顧本月組合表現：盈虧趨勢、最大贏家、最大拖累、美股 vs 港股配比',
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------
const agents = [
  {
    name: 'ChatGPT',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
  },
  {
    name: 'Codex',
    logo: 'https://assets.lbctrl.com/uploads/88eb58fe-b3bb-4875-90c7-c97e6d8fcc9e/openai.svg',
  },
  {
    name: 'Claude Code',
    logo: 'https://assets.lbctrl.com/uploads/6932dfac-0f9c-4577-bdd8-fc3d22d4223a/claude.svg',
  },
  {
    name: 'Cursor',
    logo: 'https://assets.lbctrl.com/uploads/f694478e-201b-4e74-a7b6-023639a27805/cursor.svg',
  },
  {
    name: 'Gemini',
    logo: 'https://assets.lbctrl.com/uploads/33c65d69-8e68-4de9-ada5-0e2d5e5d35e9/gemini.svg',
  },
]

const cliTabs = [
  { label: 'bun', cmd: 'bunx skills add longbridge/skills -g' },
  { label: 'npx', cmd: 'npx skills add longbridge/skills -g' },
  { label: 'yarn', cmd: 'yarn dlx skills add longbridge/skills -g' },
]

const aiSteps: Record<string, string[]> = {
  cap1: [
    'longbridge quote ... --format json',
    'longbridge valuation ...',
    'Filtering: market cap > $50B, P/E < 25, MACD golden cross...',
    'Found 12 matches across US and HK markets.',
  ],
  cap2: [
    'longbridge kline TSLA.US --period day',
    'longbridge kline TSLA.US --period 1h',
    'MACD: bullish crossover on daily. KDJ: overbought. RSI: 62.',
    'Support at 337.25, resistance at 348.88.',
  ],
  cap3: [
    'longbridge financial-report NVDA.US --type quarterly',
    'longbridge consensus NVDA.US',
    'Revenue: $35.1B vs $33.2B est (+5.7% beat)',
    'P/E forward: 28.4x — above sector median 24.1x',
  ],
  cap4: [
    'longbridge insider-trades AAPL.US',
    'longbridge investors',
    '3 insider sells in past 30 days (routine RSU)',
    'Top 20 institutions: +2.1% net increase QoQ',
  ],
  cap5: [
    'Preparing: TSLA.US trailing stop -8%',
    'Order type: Trailing Stop Loss',
    'Trigger: if price drops 8% from peak',
    '⚠ Awaiting your confirmation to execute.',
  ],
  cap6: [
    'longbridge portfolio',
    'longbridge positions',
    'Monthly P&L: +$3,240 (+4.2%)',
    'Top: NVDA +12.3% | Bottom: 700.HK -3.1%',
  ],
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------
const SKILL_CSS = `
.skill-section {
  padding: 4rem 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, #00dbb6 7%, transparent), transparent 70%),
    var(--vp-c-bg);
}
:root.dark .skill-section {
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, #00dbb6 12%, transparent), transparent 70%),
    var(--vp-c-bg);
}
.skill-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
}
.skill-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  letter-spacing: -0.02em;
}
.skill-subtitle {
  margin-top: 24px;
  color: var(--vp-c-text-2);
  font-weight: 600;
  line-height: 1.4;
}
.skill-desc {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
.skill-install-wrap {
  max-width: 64rem;
  margin: 0 auto 1.5rem;
}
.skill-install-label {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 0.625rem;
}
.skill-install-ai-block {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.625rem;
  border: 1px solid var(--vp-c-divider);
  background: color-mix(in srgb, var(--vp-c-bg-soft) 60%, transparent);
}
.skill-install-ai-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  flex: 1;
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
.skill-install-ai-url {
  color: var(--vp-c-text-3);
}
.skill-install-cli {
  margin-top: 1rem;
}
.skill-install-divider {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  margin-bottom: 0.5rem;
  text-align: center;
  justify-content: center;
}
.skill-install-divider::before,
.skill-install-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--vp-c-divider);
}
.skill-install-cmd-wrap {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 60%, transparent);
}
.skill-install-tabs {
  display: flex;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.25rem;
  gap: 0;
}
.skill-install-tab {
  padding: 0.3rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.skill-install-tab:hover {
  color: var(--vp-c-text-2);
}
.skill-install-tab.active {
  color: var(--brand-color);
  border-bottom-color: var(--brand-color);
}
.skill-install-cmd {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.625rem;
}
.skill-install-cmd code {
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  flex: 1;
}
.skill-copy-btn {
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
.skill-copy-btn:hover {
  color: var(--brand-color);
  background: color-mix(in srgb, var(--brand-color) 8%, transparent);
}
.skill-copy-btn:active {
  transform: scale(0.8);
}
.skill-agent-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin: 0 auto 1.25rem;
  padding: 0 1.5rem;
  max-width: 64rem;
}
.skill-agent-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.625rem 0.25rem 0.25rem;
  border-radius: 9999px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}
.skill-agent-logo {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  object-fit: contain;
  flex-shrink: 0;
}
:root.dark .skill-agent-logo {
  filter: brightness(0) invert(1);
}
.skill-agent-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
.skill-agent-more {
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  border: 1px dashed var(--vp-c-divider);
  font-style: italic;
}
.skill-mock {
  max-width: 64rem;
  margin: 0 auto;
  border-radius: 0.75rem;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  background: color-mix(in srgb, var(--vp-c-bg-soft) 55%, transparent);
}
.skill-mock-bar {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}
.skill-mock-dots {
  display: flex;
  gap: 0.375rem;
}
.skill-mock-dots span {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}
.skill-mock-dots span:nth-child(1) {
  background: #ff5f57;
}
.skill-mock-dots span:nth-child(2) {
  background: #febc2e;
}
.skill-mock-dots span:nth-child(3) {
  background: #28c840;
}
.skill-mock-title {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
}
.skill-mock-caps {
  display: flex;
  overflow-x: auto;
  border-bottom: 1px solid var(--vp-c-divider);
  padding: 0 0.5rem;
}
.skill-mock-cap {
  padding: 0.375rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.skill-mock-cap:hover {
  color: var(--vp-c-text-2);
}
.skill-mock-cap.active {
  color: var(--brand-color);
  border-bottom-color: var(--brand-color);
}
.skill-mock-body {
  padding: 1rem;
  min-height: 12rem;
}
.skill-mock-msg {
  margin-bottom: 0.875rem;
}
.skill-mock-role {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-3);
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}
.skill-mock-role-ai {
  color: var(--brand-color);
}
.skill-mock-bubble {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.5rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
}
.skill-mock-bubble p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  flex: 1;
  min-height: 1.2em;
}
.skill-mock-caret {
  color: var(--brand-color);
  animation: blink-caret 0.6s step-end infinite;
}
@keyframes blink-caret {
  50% { opacity: 0; }
}
.skill-mock-copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  opacity: 0;
  transition: all 0.2s;
}
.skill-mock-bubble:hover .skill-mock-copy {
  opacity: 1;
}
.skill-mock-copy:hover {
  color: var(--brand-color);
}
.skill-mock-stream {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.skill-mock-thinking {
  font-size: 0.875rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}
.skill-mock-cmds {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.skill-mock-cmds code {
  font-size: 0.875rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  background: color-mix(in srgb, var(--vp-c-divider) 30%, transparent);
  border: 1px solid var(--vp-c-divider);
  animation: skill-line-in 0.3s ease both;
}
@keyframes skill-line-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}
.skill-mock-streaming {
  color: var(--brand-color);
  animation: blink-caret 0.6s step-end infinite;
}
.skill-mock-tip {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
}
.skill-mock-tip code {
  font-family: var(--vp-font-family-mono);
  color: var(--brand-color);
  font-weight: 600;
}
.skill-cta-wrap {
  text-align: center;
  margin-top: 1.5rem;
  padding: 0 1.5rem;
}
.skill-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-color);
  text-decoration: none !important;
  transition: gap 0.2s;
}
.skill-cta:hover {
  gap: 0.625rem;
}
@media (max-width: 640px) {
  .skill-agent-row {
    gap: 0.375rem;
  }
  .skill-install-ai-block {
    flex-direction: column;
    align-items: flex-start;
  }
}
`

// ---------------------------------------------------------------------------
// SVG helpers
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface ProductSkillProps {
  locale: Locale
}

export function ProductSkill({ locale }: ProductSkillProps) {
  const content = LOCALE[locale as keyof typeof LOCALE] ?? LOCALE.en
  const semanticText = content.installCmd

  const [activeCapIdx, setActiveCapIdx] = useState(0)
  const [activeCliTab, setActiveCliTab] = useState(0)

  const [typedPrompt, setTypedPrompt] = useState('')
  const [streamLines, setStreamLines] = useState<string[]>([])
  const [streaming, setStreaming] = useState(false)

  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedSemantic, setCopiedSemantic] = useState(false)
  const [copiedCli, setCopiedCli] = useState(false)

  const [mounted, setMounted] = useState(false)

  const typeTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const streamTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
  }, [])

  function startDemo(capIdx: number, capContent: typeof content) {
    setTypedPrompt('')
    setStreamLines([])
    setStreaming(false)
    if (typeTimerRef.current) clearInterval(typeTimerRef.current)
    if (streamTimerRef.current) clearInterval(streamTimerRef.current)

    const fullPrompt = capContent.caps[capIdx]?.example ?? ''
    let charIdx = 0

    typeTimerRef.current = setInterval(() => {
      charIdx += 2
      setTypedPrompt(fullPrompt.substring(0, charIdx))
      if (charIdx >= fullPrompt.length) {
        clearInterval(typeTimerRef.current)
        setTimeout(() => {
          setStreaming(true)
          const capKey = `cap${capIdx + 1}`
          const steps = aiSteps[capKey]
          let stepIdx = 0
          streamTimerRef.current = setInterval(() => {
            if (stepIdx < steps.length) {
              setStreamLines((prev) => [...prev, steps[stepIdx]])
              stepIdx++
            } else {
              clearInterval(streamTimerRef.current)
            }
          }, 400)
        }, 300)
      }
    }, 25)
  }

  useEffect(() => {
    if (!mounted) return
    startDemo(activeCapIdx, content)
    return () => {
      if (typeTimerRef.current) clearInterval(typeTimerRef.current)
      if (streamTimerRef.current) clearInterval(streamTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCapIdx, mounted])

  function copyPrompt() {
    navigator.clipboard.writeText(content.caps[activeCapIdx]?.example ?? '')
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 2000)
  }

  function copySemantic() {
    navigator.clipboard.writeText(semanticText)
    setCopiedSemantic(true)
    setTimeout(() => setCopiedSemantic(false), 2000)
  }

  function copyCli() {
    navigator.clipboard.writeText(cliTabs[activeCliTab].cmd)
    setCopiedCli(true)
    setTimeout(() => setCopiedCli(false), 2000)
  }

  const capKey = `cap${activeCapIdx + 1}`
  const totalSteps = aiSteps[capKey]?.length ?? 0

  return (
    <section data-lbus-component="product-skill" className="skill-section">
      <style dangerouslySetInnerHTML={{ __html: SKILL_CSS }} />

      {/* Header */}
      <div className="skill-header">
        <h2 className="skill-title">{content.title}</h2>
        <p className="skill-subtitle">{content.subtitle}</p>
        <p className="skill-desc" dangerouslySetInnerHTML={{ __html: content.desc }} />
      </div>

      {/* Install — semantic AI prompt first, CLI second */}
      <div className="skill-install-wrap">
        <p className="skill-install-label">{content.installLabel}</p>
        <div className="skill-install-ai-block">
          <div className="skill-install-ai-text">
            <span>{semanticText.split('\n')[0]}</span>
            <span className="skill-install-ai-url">https://open.longbridge.com/skill/install.md</span>
          </div>
          <button className="skill-copy-btn" onClick={copySemantic}>
            {copiedSemantic ? <CheckIcon /> : <CopyIcon />}
          </button>
        </div>

        {/* CLI alternative */}
        <div className="skill-install-cli">
          <span className="skill-install-divider">{content.installOr}</span>
          <div className="skill-install-cmd-wrap">
            <div className="skill-install-tabs">
              {cliTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  className={`skill-install-tab${activeCliTab === idx ? ' active' : ''}`}
                  onClick={() => setActiveCliTab(idx)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="skill-install-cmd">
              <code>{cliTabs[activeCliTab].cmd}</code>
              <button className="skill-copy-btn" onClick={copyCli}>
                {copiedCli ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Agent row — display only */}
      <div className="skill-agent-row">
        {agents.map((agent) => (
          <div key={agent.name} className="skill-agent-chip">
            <img className="skill-agent-logo" src={agent.logo} alt={agent.name} />
            <span className="skill-agent-name">{agent.name}</span>
          </div>
        ))}
        <span className="skill-agent-more">{content.agentMore}</span>
      </div>

      {/* Agent simulator — only rendered client-side */}
      {mounted && (
        <div className="skill-mock">
          <div className="skill-mock-bar">
            <div className="skill-mock-dots">
              <span />
              <span />
              <span />
            </div>
            <span className="skill-mock-title">Claude Code</span>
          </div>

          {/* Capability tabs */}
          <div className="skill-mock-caps">
            {content.caps.map((cap, idx) => (
              <button
                key={idx}
                className={`skill-mock-cap${activeCapIdx === idx ? ' active' : ''}`}
                onClick={() => setActiveCapIdx(idx)}
              >
                {cap.title}
              </button>
            ))}
          </div>

          <div className="skill-mock-body">
            {/* User typing */}
            <div className="skill-mock-msg">
              <span className="skill-mock-role">{content.mockYou}</span>
              <div className="skill-mock-bubble">
                <p>
                  {typedPrompt}
                  {!streaming && <span className="skill-mock-caret">|</span>}
                </p>
                <button className="skill-mock-copy" onClick={copyPrompt}>
                  {copiedPrompt ? <CheckIcon /> : <CopyIcon />}
                </button>
              </div>
            </div>

            {/* AI streaming */}
            {streaming && (
              <div className="skill-mock-msg">
                <span className="skill-mock-role skill-mock-role-ai">Claude Code</span>
                <div className="skill-mock-stream">
                  <span className="skill-mock-thinking">{content.mockThinking}</span>
                  <div className="skill-mock-cmds">
                    {streamLines.map((line, i) => (
                      <code key={i}>{line}</code>
                    ))}
                  </div>
                  {streamLines.length < totalSteps && (
                    <span className="skill-mock-streaming">▊</span>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="skill-mock-tip">
            {content.tipBefore} <code>/longbridge</code> {content.tipAfter}
          </div>
        </div>
      )}

      <div className="skill-cta-wrap">
        <a href="skill/install" className="skill-cta">
          {content.cta}
          <ArrowIcon />
        </a>
      </div>
    </section>
  )
}
