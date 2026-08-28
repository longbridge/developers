import { useCallback, useEffect, useRef, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { siteHostname, CHATGPT_APP_URL, CLAUDE_CONNECTOR_URL, localePfx } from './shared'

// 1:1 port of the legacy VitePress `Skill.vue` hero section
// (template 1352–1567; copy `LOCALE.<locale>.hero` + `getstarted.installCmd`).

const LOCALE = {
  en: {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: 'Unlock market insights, deep research and intelligent trading for your AI.',
      desc: 'For Claude Code, Codex, Gemini, and other agents, Longbridge Skill lets your AI <a href="https://longbridge.com/en/screener" target="_blank" rel="noreferrer">screen stocks</a>, decode earnings, track insider moves, and place orders in plain conversation.',
      chatgptLine:
        '<a class="skill-chatgpt-link" href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">ChatGPT</a> and <a class="skill-chatgpt-link" href="https://claude.ai/directory/connectors/longbridge">Claude</a> can install Longbridge directly — use <code>@longbridge</code> in ChatGPT, or the connector in Claude.',
      tabConnect: 'Connect AI',
      tabPrompt: 'Copy command',
      tabChatGPT: 'ChatGPT',
      tabClaude: 'Claude',
      connectLabel: 'Authorization happens upfront — grab a code on the Connect page, hand it to your AI, and it takes care of the rest:',
      connectSteps: [
        'Sign in on the Connect page to get a one-time auth code',
        'Send the authorization snippet to your AI assistant',
        'Your AI redeems the code and plugs into Longbridge — no browser hops along the way',
      ],
      connectCta: 'Connect AI',
      chatgptLabel: 'Enable Longbridge MCP in ChatGPT in under a minute:',
      chatgptSteps: [
        'Open ChatGPT Apps and search for longbridge',
        'Select Longbridge and authorize your Longbridge account',
        'Type @longbridge in the message box to query market data',
      ],
      chatgptCta: 'Open Longbridge in ChatGPT',
      claudeLabel: 'Enable Longbridge in Claude in under a minute:',
      claudeSteps: [
        'Click "Customize" → "Connectors", then click the "Add" button',
        'Select "Browser Connectors" from the dropdown and search for "longbridge"',
        'Connect your Longbridge account and start asking for market data',
      ],
      claudeCta: 'Open Longbridge in Claude',
      installLabel: 'Copy and send to any AI — it will walk you through install:',
      installLink: 'View installation guide for each client',
      agentsLabel: 'Supported AI tools',
      agentsMore: '+ Other AI tools',
    },
    getstarted: {
      installCmd: `Install Longbridge AI toolkit following the guide:\n${siteHostname}/skill/install.md\n\nAnd complete login and test with a market data query.`,
    },
  },
  'zh-CN': {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: '为您的 AI 解锁市场洞察、深度研究与智能交易',
      desc: 'Claude Code、Codex、Gemini 等 Agent 可通过 Longbridge Skill <a href="https://longbridge.com/en/screener" target="_blank" rel="noreferrer">筛选股票</a>、解读财报、追踪机构动向，并直接下单。',
      chatgptLine:
        '<a class="skill-chatgpt-link" href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">ChatGPT</a> 与 <a class="skill-chatgpt-link" href="https://claude.ai/directory/connectors/longbridge">Claude</a> 都能直接安装 Longbridge——在 ChatGPT 中用 <code>@longbridge</code> 调用，在 Claude 中启用连接器即可。',
      tabConnect: 'Connect AI',
      tabPrompt: '复制命令',
      tabChatGPT: 'ChatGPT',
      tabClaude: 'Claude',
      connectLabel: '授权一步前置——在 Connect 页面拿到授权码，交给 AI，剩下的它来完成：',
      connectSteps: [
        '登录 Connect 页面，获取一次性授权码',
        '将授权指令发送给您的 AI 助手',
        'AI 自动兑换授权码并接入 Longbridge，全程无需跳转浏览器',
      ],
      connectCta: 'Connect AI',
      chatgptLabel: '在 ChatGPT 中快速启用 Longbridge MCP：',
      chatgptSteps: [
        '打开 ChatGPT Apps，搜索 longbridge',
        '选择 Longbridge，并按提示完成授权登录',
        '在输入框中输入 @longbridge 开始查询数据',
      ],
      chatgptCta: '在 ChatGPT 中打开 Longbridge',
      claudeLabel: '在 Claude 中快速启用 Longbridge：',
      claudeSteps: [
        '点击 "Customize" → "Connectors"，然后点击 "Add" 按钮',
        '在下拉菜单中选择 "Browser Connectors"，搜索 "longbridge"',
        '授权 Longbridge 账户，开始向 Claude 提问查询市场数据',
      ],
      claudeCta: '在 Claude 中打开 Longbridge',
      installLabel: '复制发送给任意 AI——它将引导您完成安装：',
      installLink: '查看各客户端安装指南',
      agentsLabel: '支持的 AI 工具',
      agentsMore: '+ 更多 AI 工具',
    },
    getstarted: {
      installCmd: `请按照以下指南安装 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安装完成后，完成登录授权，查询一支股票行情确认可用。`,
    },
  },
  'zh-HK': {
    hero: {
      eyebrow: 'AI · Skill',
      title1: 'Longbridge Skill',
      title2: '為您的 AI 解鎖市場洞察、深度研究與智能交易',
      desc: 'Claude Code、Codex、Gemini 等 Agent 可透過 Longbridge Skill <a href="https://longbridge.com/en/screener" target="_blank" rel="noreferrer">篩選股票</a>、解讀財報、追蹤機構動向，並直接下單。',
      chatgptLine:
        '<a class="skill-chatgpt-link" href="https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef">ChatGPT</a> 與 <a class="skill-chatgpt-link" href="https://claude.ai/directory/connectors/longbridge">Claude</a> 都能直接安裝 Longbridge——在 ChatGPT 中用 <code>@longbridge</code> 調用，在 Claude 中啟用連接器即可。',
      tabConnect: 'Connect AI',
      tabPrompt: '複製命令',
      tabChatGPT: 'ChatGPT',
      tabClaude: 'Claude',
      connectLabel: '授權一步前置——在 Connect 頁面拿到授權碼，交給 AI，剩下的它來完成：',
      connectSteps: [
        '登入 Connect 頁面，獲取一次性授權碼',
        '將授權指令發送給您的 AI 助手',
        'AI 自動兌換授權碼並接入 Longbridge，全程無需跳轉瀏覽器',
      ],
      connectCta: 'Connect AI',
      chatgptLabel: '在 ChatGPT 中快速啟用 Longbridge MCP：',
      chatgptSteps: [
        '打開 ChatGPT Apps，搜尋 longbridge',
        '選擇 Longbridge，並按提示完成授權登入',
        '在輸入框中輸入 @longbridge 開始查詢數據',
      ],
      chatgptCta: '在 ChatGPT 中打開 Longbridge',
      claudeLabel: '在 Claude 中快速啟用 Longbridge：',
      claudeSteps: [
        '點擊 "Customize" → "Connectors"，然後點擊 "Add" 按鈕',
        '在下拉選單中選擇 "Browser Connectors"，搜尋 "longbridge"',
        '授權 Longbridge 賬戶，開始向 Claude 提問查詢市場數據',
      ],
      claudeCta: '在 Claude 中打開 Longbridge',
      installLabel: '複製發送給任意 AI——它將引導您完成安裝：',
      installLink: '查看各客戶端安裝指南',
      agentsLabel: '支援的 AI 工具',
      agentsMore: '+ 更多 AI 工具',
    },
    getstarted: {
      installCmd: `請按照以下指南安裝 Longbridge AI toolkit：\n${siteHostname}/skill/install.md\n\n安裝完成後，完成登錄授權，查詢一支股票行情確認可用。`,
    },
  },
}

// Legacy script 883–893.
const SKILL_AGENTS = [
  { name: 'ChatGPT', mark: 'G', color: '#10A37F' },
  { name: 'Claude', mark: 'C', color: '#D97757' },
  { name: 'Codex', mark: 'O', color: '#000000' },
  { name: 'Grok', mark: 'G', color: '#000000' },
  { name: 'Claude Code', mark: 'C', color: '#D97757' },
  { name: 'Cursor', mark: '➤', color: '#000000' },
  { name: 'Gemini', mark: 'G', color: '#1A73E8' },
  { name: 'OpenClaw', mark: 'O', color: 'var(--lb-brand)' },
  { name: 'Zed', mark: 'Z', color: '#0E40D9' },
]

type InstallMode = 'connect' | 'prompt' | 'chatgpt' | 'claude'

const SEG_TABS: { mode: InstallMode; key: 'tabConnect' | 'tabPrompt' | 'tabChatGPT' | 'tabClaude' }[] = [
  { mode: 'connect', key: 'tabConnect' },
  { mode: 'prompt', key: 'tabPrompt' },
  { mode: 'chatgpt', key: 'tabChatGPT' },
  { mode: 'claude', key: 'tabClaude' },
]

// Shared "open external" icon used by the ChatGPT / Claude CTA buttons.
function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

export function SkillHeroSection({ locale }: { locale: Locale }) {
  const content = LOCALE[locale as keyof typeof LOCALE] ?? LOCALE.en
  const hero = content.hero
  const pfx = localePfx(locale)

  // Legacy refs 1118–1119.
  const [installMode, setInstallMode] = useState<InstallMode>('connect')
  const [copied, setCopied] = useState(false)
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Legacy computed 1161.
  const installCmd = content.getstarted.installCmd

  useEffect(
    () => () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
    },
    []
  )

  // Legacy copyInstall() 1163–1171.
  const copyInstall = useCallback(() => {
    if (typeof navigator === 'undefined') return
    navigator.clipboard.writeText(installCmd).then(() => {
      setCopied(true)
      if (copiedTimer.current) clearTimeout(copiedTimer.current)
      copiedTimer.current = setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }, [installCmd])

  return (
    <section className="skill-hero">
      <div className="skill-hero-bg" />
      <div className="section-inner skill-hero-inner">
        <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 className="h-display" style={{ marginTop: '20px', fontSize: 'clamp(36px, 4.8vw, 56px)' }}>
            {hero.title1}
            <br />
            <span style={{ color: 'var(--lb-brand)' }}>{hero.title2}</span>
          </h1>
          <p
            className="t-body skill-hero-desc"
            style={{ marginTop: '24px', maxWidth: '640px', marginLeft: 'auto', marginRight: 'auto', fontSize: '16px' }}
            dangerouslySetInnerHTML={{ __html: hero.desc }}></p>
          <p className="skill-chatgpt-feature">
            <svg
              className="skill-chatgpt-sparkles"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            <span dangerouslySetInnerHTML={{ __html: hero.chatgptLine }}></span>
          </p>

          <div className="skill-hero-install">
            <div className="skill-hero-seg">
              {SEG_TABS.map((t) => (
                <button
                  key={t.mode}
                  className={installMode === t.mode ? 'skill-hero-seg-btn is-active' : 'skill-hero-seg-btn'}
                  onClick={() => setInstallMode(t.mode)}>
                  {hero[t.key]}
                </button>
              ))}
            </div>

            {installMode === 'connect' ? (
              <>
                <div className="skill-hero-install-label">{hero.connectLabel}</div>
                <div className="skill-hero-connect-card">
                  {hero.connectSteps.map((step, i) => (
                    <div key={i} className="skill-hero-connect-step">
                      <span className="skill-hero-connect-step-num">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                  <a className="btn btn-dark" href={pfx + '/connect'} target="_self">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                    {hero.connectCta}
                  </a>
                </div>
              </>
            ) : installMode === 'prompt' ? (
              <>
                <div className="skill-hero-install-label">{hero.installLabel}</div>
                <div className="skill-hero-install-cmd">
                  <code>{installCmd}</code>
                  <button className="code-copy" onClick={copyInstall} title={copied ? 'Copied!' : 'Copy'}>
                    {!copied ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    ) : (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                </div>
                <a className="skill-hero-install-link" href={pfx + '/skill/install'}>
                  {hero.installLink}
                  <svg
                    width="12"
                    height="12"
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
              </>
            ) : installMode === 'chatgpt' ? (
              <>
                <div className="skill-hero-install-label">{hero.chatgptLabel}</div>
                <div className="skill-hero-connect-card">
                  {hero.chatgptSteps.map((step, i) => (
                    <div key={i} className="skill-hero-connect-step">
                      <span className="skill-hero-connect-step-num">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                  <a className="btn btn-dark" href={CHATGPT_APP_URL} target="_blank" rel="noreferrer">
                    <ExternalIcon />
                    {hero.chatgptCta}
                  </a>
                </div>
              </>
            ) : (
              <>
                <div className="skill-hero-install-label">{hero.claudeLabel}</div>
                <div className="skill-hero-connect-card">
                  {hero.claudeSteps.map((step, i) => (
                    <div key={i} className="skill-hero-connect-step">
                      <span className="skill-hero-connect-step-num">{i + 1}</span>
                      <span>{step}</span>
                    </div>
                  ))}
                  <a className="btn btn-dark" href={CLAUDE_CONNECTOR_URL} target="_blank" rel="noreferrer">
                    <ExternalIcon />
                    {hero.claudeCta}
                  </a>
                </div>
              </>
            )}
          </div>

          <div className="skill-hero-agents">
            <span
              className="t-meta"
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--lb-fg-3)',
              }}>
              {hero.agentsLabel}
            </span>
            <div className="skill-hero-agents-row">
              {SKILL_AGENTS.map((a) => (
                <div key={a.name} className="ai-agent-chip">
                  <span className="ai-agent-mark" style={{ background: a.color }}>
                    {a.mark}
                  </span>
                  {a.name}
                </div>
              ))}
              <div className="ai-agent-chip ai-agent-more">{hero.agentsMore}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
