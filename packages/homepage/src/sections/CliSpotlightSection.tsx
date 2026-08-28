import { useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "CLI spotlight" section
// (NewHomePage/index.vue `.cli-spotlight`, legacy section #4). Markup, copy,
// and CSS mirror the legacy source; section-specific rules come verbatim from
// the legacy app-styles.css "CLI spotlight" block. Generic legacy classes
// (.section / .section-inner / .eyebrow / .h-section / .t-meta / .btn* /
// .code* / .ln-* / .is-up / .num) are provided globally under `.new-home-page`
// by homepage.css and are only consumed here.
//
// Legacy OS tab switcher (`const cliOs = ref('macOS')`) swaps the install
// command + the "<os> · bash" label, and the copy button is wired to
// `copyToClipboard(installCmds[cliOs])`. The page is hydrated as a React
// island, so the same interactions live here as `useState` + `onClick`. SSR
// and the first client render both use the default state (macOS tab
// `is-active`, macOS install command shown), so markup is hydration-safe.
interface CliCopy {
  eyebrow: string
  title: string
  feats: [string, string][]
  cta: string
}

const LOCALE = {
  en: {
    eyebrow: 'Longbridge CLI',
    title: 'AI-native command-line tool, covering every OpenAPI.',
    feats: [
      [
        '130+ commands',
        '<a href="https://longbridge.com/markets">Market data</a>, trading, fundamentals — all in your shell.',
      ],
      ['--format json output', "Pipe into jq, awk, or any AI agent's tool channel."],
      ['Multi-period candlesticks', 'Daily, hourly, 15-min, 5-min, 1-min — all from one flag.'],
      ['Portfolio P&L view', 'Position breakdown with allocation drill-down.'],
      ['OAuth 2.0 on SSH', 'Works on headless servers and inside Docker.'],
    ],
    cta: 'CLI Documentation',
  },
  'zh-CN': {
    eyebrow: 'Longbridge CLI',
    title: 'AI 原生命令行工具，覆盖所有 OpenAPI',
    feats: [
      ['130+ 条命令', '<a href="https://longbridge.com/markets">行情</a>、交易、基本面——全在终端中触手可及。'],
      ['--format json 输出', '可直接管道传输给 jq、awk 或任意 AI Agent 工具通道。'],
      ['多周期 K 线', '日线、小时线、15 分钟、5 分钟、1 分钟——一个参数搞定。'],
      ['投资组合盈亏视图', '持仓明细及配置占比下钻分析。'],
      ['SSH 环境 OAuth 2.0', '支持无头服务器和 Docker 容器内运行。'],
    ],
    cta: 'CLI 文档',
  },
  'zh-HK': {
    eyebrow: 'Longbridge CLI',
    title: 'AI 原生命令列工具，覆蓋所有 OpenAPI',
    feats: [
      ['130+ 條命令', '<a href="https://longbridge.com/markets">行情</a>、交易、基本面——全在終端中觸手可及。'],
      ['--format json 輸出', '可直接管道傳輸給 jq、awk 或任意 AI Agent 工具通道。'],
      ['多週期 K 線', '日線、小時線、15 分鐘、5 分鐘、1 分鐘——一個參數搞定。'],
      ['投資組合盈虧視圖', '持倉明細及配置佔比下鑽分析。'],
      ['SSH 環境 OAuth 2.0', '支援無頭伺服器和 Docker 容器內運行。'],
    ],
    cta: 'CLI 文件',
  },
} satisfies Record<Locale, CliCopy>

// Legacy `cliOs` / `installCmds` (locale-independent).
const CLI_OS_TABS = ['macOS', 'Linux', 'Windows']
const CLI_OS_DEFAULT = 'macOS'
const INSTALL_CMDS: Record<string, string> = {
  macOS: 'brew install --cask longbridge/tap/longbridge-terminal',
  Linux: 'curl -sSL https://open.longbridge.com/longbridge/longbridge-terminal/install | sh',
  Windows: 'iwr https://open.longbridge.com/longbridge/longbridge-terminal/install.ps1 | iex',
}

const CLI_SPOTLIGHT_CSS = `
/* CLI spotlight */
.cli-spotlight {
  padding-top: 32px;
}
.cli-spotlight-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 56px;
  align-items: start;
}
@media (max-width: 980px) {
  .cli-spotlight-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
.cli-demo-col {
  min-width: 0;
}
.cli-demo-col .code {
  min-height: 280px;
  overflow: hidden;
}
.cli-demo-col .code-body {
  overflow-x: auto;
  white-space: pre;
}
.cli-feat-list {
  list-style: none;
  padding: 0;
  margin: 28px 0 0;
  display: grid;
  gap: 14px;
}
.cli-feat-list li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.cli-feat-list svg {
  flex-shrink: 0;
  margin-top: 3px;
}
.cli-os-tabs {
  display: inline-flex;
  gap: 2px;
  padding: 3px;
  background: var(--lb-bg-2);
  border-radius: 8px;
}
.cli-os-tab {
  padding: 5px 14px;
  font-size: 12.5px;
  border-radius: 5px;
  color: var(--lb-fg-2);
  border: none;
  background: transparent;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
}
.cli-os-tab.is-active {
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
  box-shadow: var(--app-shadow-1);
}
.cli-mini-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20px;
  padding: 18px 0;
  border-top: 1px solid var(--app-card-stroke);
  border-bottom: 1px solid var(--app-card-stroke);
}
.cli-mini-stats > div {
  text-align: center;
  border-right: 1px solid var(--app-card-stroke);
}
.cli-mini-stats > div:last-child {
  border-right: none;
}
`

interface CliSpotlightSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function CliSpotlightSection({ locale }: CliSpotlightSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const [cliOs, setCliOs] = useState<string>(CLI_OS_DEFAULT)
  const installCmd = INSTALL_CMDS[cliOs]
  // Copied feedback (legacy had none; matches the Skill-page copy buttons).
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMDS[cliOs])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  // NOTE on whitespace inside `.code-body` (white-space: pre): Vue's default
  // "condense" mode keeps a single leading/trailing space on multi-line text
  // nodes, so the three quote rows and the `jq` line render with those spaces
  // in legacy. JSX trims them, hence the explicit {' '} below.
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CLI_SPOTLIGHT_CSS }} />
      <section data-lbus-component="cli-spotlight-section" className="section cli-spotlight">
        <div className="section-inner cli-spotlight-grid">
          <div>
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="h-section" style={{ marginTop: 18 }}>
              {content.title}
            </h2>
            <ul className="cli-feat-list">
              {content.feats.map(([h, d]) => (
                <li key={h}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: 'var(--lb-up)' }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--lb-fg-1)', fontSize: 14 }}>{h}</div>
                    <div className="t-meta" style={{ fontSize: 13, marginTop: 2 }} dangerouslySetInnerHTML={{ __html: d }} />
                  </div>
                </li>
              ))}
            </ul>
            <a className="btn btn-outline" href={localePath(locale, '/docs/cli')} style={{ marginTop: 24 }}>
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
          <div className="cli-demo-col">
            <div className="cli-os-tabs">
              {CLI_OS_TABS.map((o) => (
                <button key={o} className={`cli-os-tab${o === cliOs ? ' is-active' : ''}`} onClick={() => setCliOs(o)}>
                  {o}
                </button>
              ))}
            </div>
            <div className="code" style={{ marginTop: 12 }}>
              <div className="code-head">
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
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" y1="19" x2="20" y2="19" />
                </svg>
                <span style={{ fontSize: 11.5, color: 'var(--lb-fg-3)' }}>{cliOs.toLowerCase()} · bash</span>
                <button className="code-copy" title={copied ? 'Copied!' : 'Copy'} onClick={handleCopy}>
                  {copied ? (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--lb-up)"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <rect x="8" y="8" width="13" height="13" rx="2" />
                      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="code-body">
                <div>
                  <span className="ln-prompt">$ </span>
                  {installCmd}
                </div>
                <div>&nbsp;</div>
                <div>
                  <span className="ln-prompt">$ </span>longbridge auth login
                </div>
                <div style={{ color: 'var(--lb-fg-2)' }}>✓ Browser opened. Logged in as jason@longbridge.com</div>
                <div>&nbsp;</div>
                <div>
                  <span className="ln-prompt">$ </span>longbridge quote <span className="ln-str">"TSLA.US"</span>
                  <span className="ln-str">"NVDA.US"</span> <span className="ln-str">"700.HK"</span>
                </div>
                <div style={{ color: 'var(--lb-fg-2)' }}>SYMBOL &nbsp; LAST &nbsp; &nbsp; CHANGE &nbsp; &nbsp;VOLUME</div>
                <div style={{ color: 'var(--lb-fg-2)' }}>
                  {' '}TSLA.US &nbsp; 421.65 &nbsp; <span className="is-up">+2.31%</span> &nbsp; 18.2M{' '}
                </div>
                <div style={{ color: 'var(--lb-fg-2)' }}>
                  {' '}NVDA.US &nbsp; 142.83 &nbsp; <span className="is-up">+1.18%</span> &nbsp; 62.7M{' '}
                </div>
                <div style={{ color: 'var(--lb-fg-2)' }}>
                  {' '}700.HK &nbsp; &nbsp;528.50 &nbsp; <span className="is-up">+0.86%</span> &nbsp; &nbsp;5.4M{' '}
                </div>
                <div>&nbsp;</div>
                <div>
                  <span className="ln-prompt">$ </span>longbridge portfolio --format json | jq{' '}
                  <span className="ln-str">'.positions[] | select(.pnl_pct &gt; 5)'</span>
                </div>
              </div>
            </div>
            <div className="cli-mini-stats">
              <div>
                <span className="num" style={{ fontWeight: 700, fontSize: 22 }}>
                  120<span style={{ color: 'var(--lb-fg-3)', fontSize: 13 }}>+</span>
                </span>
                <span className="t-meta" style={{ display: 'block', fontSize: 11.5 }}>commands</span>
              </div>
              <div>
                <span className="num" style={{ fontWeight: 700, fontSize: 22 }}>7</span>
                <span className="t-meta" style={{ display: 'block', fontSize: 11.5 }}>output formats</span>
              </div>
              <div>
                <span className="num" style={{ fontWeight: 700, fontSize: 22 }}>3</span>
                <span className="t-meta" style={{ display: 'block', fontSize: 11.5 }}>platforms</span>
              </div>
              <div>
                <span className="num" style={{ fontWeight: 700, fontSize: 22 }}>
                  40<span style={{ color: 'var(--lb-fg-3)', fontSize: 13 }}>ms</span>
                </span>
                <span className="t-meta" style={{ display: 'block', fontSize: 11.5 }}>p50 query</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
