import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress hero (NewHomePage/index.vue `.home-hero`).
// Copy, markup, and CSS mirror the legacy source; the only translation is
// the dark-mode selector (`.lb-dark` → `[data-mode="dark"]`). All tokens
// referenced below already exist in src/styles/tokens.css with the legacy
// values.
const LOCALE = {
  en: {
    eyebrow: 'LONGBRIDGE OPENAPI',
    title1: 'Real-time markets,',
    title2: 'built for AI.',
    desc: 'Real-time market data, quantitative research, and AI-powered analysis — through AI Skill, CLI, MCP, SDK and OpenAPI. One credential, every market, zero overhead. Explore <a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">live market data</a> across every market.',
    cta1: 'Get Started',
    cta2: 'Read the Docs',
    highlights: [
      { u: 'markets', d: 'US · HK · SG · CN' },
      { u: 'SDKs', d: 'Python · Rust · Node · Go · Java · C · C++' },
      { u: 'endpoints', d: 'Quote · Trade · Research · News' },
      { u: 'OpenAPI access', d: 'No monthly fees' },
    ],
  },
  'zh-CN': {
    eyebrow: 'LONGBRIDGE OPENAPI',
    title1: '实时市场数据',
    title2: 'AI 直连真实市场',
    desc: '实时行情、量化研究与 AI 驱动分析——通过 AI Skill、CLI、MCP、SDK 和 OpenAPI 一体接入。一套凭证，覆盖所有市场，零额外开销。探索覆盖全球市场的<a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">实时行情</a>。',
    cta1: '开始使用',
    cta2: '阅读文档',
    highlights: [
      { u: '个市场', d: 'US · HK · SG · CN' },
      { u: '个 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
      { u: '+ 个接口', d: '行情 · 交易 · 研究 · 资讯' },
      { u: 'OpenAPI 接入费', d: '集成账户免费' },
    ],
  },
  'zh-HK': {
    eyebrow: 'LONGBRIDGE OPENAPI',
    title1: '即時市場數據，',
    title2: 'AI 直連真實市場',
    desc: '即時行情、量化研究與 AI 驅動分析——透過 AI Skill、CLI、MCP、SDK 和 OpenAPI 一體接入。一套憑證，覆蓋所有市場，零額外開銷。探索覆蓋全球市場的<a href="https://longbridge.com/markets" target="_blank" rel="noreferrer">即時行情</a>。',
    cta1: '開始使用',
    cta2: '閱讀文件',
    highlights: [
      { u: '個市場', d: 'US · HK · SG · CN' },
      { u: '個 SDK', d: 'Python · Rust · Node · Go · Java · C · C++' },
      { u: '+ 個接口', d: '行情 · 交易 · 研究 · 資訊' },
      { u: 'OpenAPI 接入費', d: '整合帳戶免費' },
    ],
  },
}

// Stat values are locale-independent (legacy `heroHighlights` computed).
const HIGHLIGHT_VALUES = ['4', '7', '100+', '$0']

const HERO_CSS = `
/* ---- legacy utilities, scoped to the hero so they don't leak ---- */
.home-hero .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lb-brand);
}
.home-hero .eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 16%, transparent);
}
.home-hero .h-display {
  font-size: clamp(40px, 5.4vw, 64px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.035em;
  margin: 0;
  color: var(--lb-fg-1);
}
.home-hero .t-body {
  font-size: 15px;
  color: var(--lb-fg-2);
  line-height: 1.65;
}
/* Legacy renders the inline link as plain text (same color as the paragraph,
   no underline) — no rule targets it there, so neutralize ours. */
.home-hero .t-body a {
  color: inherit;
  text-decoration: none;
}
.home-hero .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 999px;
  border: 1px solid transparent;
  transition: all var(--lb-transition-fast);
  white-space: nowrap;
  cursor: pointer;
  text-decoration: none;
}
.home-hero .btn-primary {
  background: var(--lb-fg-1);
  color: var(--lb-fg-invert);
}
.home-hero .btn-primary:hover {
  opacity: 0.88;
  transform: translateY(-1px);
}
.home-hero .btn-outline {
  background: transparent;
  color: var(--lb-fg-1);
  border-color: var(--app-card-stroke-strong);
}
.home-hero .btn-outline:hover {
  background: var(--lb-bg-2);
}
.home-hero .btn-lg {
  height: 44px;
  padding: 0 22px;
  font-size: 15px;
}

/* ---- hero ---- */
.home-hero {
  position: relative;
  padding: 56px 24px 72px;
  overflow: hidden;
  border-bottom: 1px solid var(--app-card-stroke);
}
.home-hero-centered {
  padding: 80px 24px 88px;
  min-height: 560px;
}
.home-hero-inner-centered {
  position: relative;
  z-index: 5;
  max-width: 880px;
  margin: 0 auto;
  text-align: center;
}
/* Scoped like the utilities above so these keep winning over .h-display /
   .t-body (same specificity, later in source — the legacy cascade order). */
.home-hero .home-hero-title {
  margin-top: 28px;
  font-size: clamp(44px, 6vw, 72px);
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.home-hero .home-hero-sub {
  margin: 28px auto 0;
  max-width: 580px;
  font-size: 16px;
  line-height: 1.7;
}
.home-hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 36px;
}
.home-hero-highlights {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin: 56px auto 0;
  max-width: 960px;
}
.home-hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  text-align: center;
}
.home-hero-stat-line {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}
.home-hero-stat-v {
  font-family: var(--lb-font-sans);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.025em;
  color: var(--lb-fg-1);
  line-height: 1;
}
.home-hero-stat-u {
  font-size: 13px;
  color: var(--lb-fg-2);
}
.home-hero-stat-d {
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--lb-fg-3);
  white-space: nowrap;
}
.home-hero-stat-sep {
  width: 1px;
  height: 32px;
  background: var(--app-card-stroke);
  flex-shrink: 0;
}
@media (max-width: 820px) {
  .home-hero-highlights {
    flex-wrap: wrap;
    gap: 14px 24px;
  }
  .home-hero-stat-sep {
    display: none;
  }
}
@media (max-width: 700px) {
  .home-hero-centered {
    padding: 72px 20px 96px;
    min-height: 560px;
  }
}

/* ---- background layers ---- */
.hero-bg-data {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}
.hero-bg-blobs {
  position: absolute;
  inset: 0;
  filter: blur(80px);
  opacity: 0.55;
}
[data-mode="dark"] .hero-bg-blobs {
  opacity: 0.28;
}
.hero-blob {
  position: absolute;
  border-radius: 50%;
}
.hero-blob-1 {
  top: -10%;
  left: 18%;
  width: 480px;
  height: 480px;
  background: color-mix(in srgb, var(--lb-brand) 38%, transparent);
  animation: heroBlob1 22s ease-in-out infinite;
}
.hero-blob-2 {
  top: 8%;
  right: 12%;
  width: 380px;
  height: 380px;
  background: color-mix(in srgb, var(--lb-status-neutral) 20%, transparent);
  animation: heroBlob2 26s ease-in-out infinite;
}
.hero-blob-3 {
  bottom: -16%;
  left: 36%;
  width: 520px;
  height: 520px;
  background: color-mix(in srgb, var(--lb-ai-mention) 18%, transparent);
  animation: heroBlob3 28s ease-in-out infinite;
}
[data-mode="dark"] .hero-blob-1 {
  background: color-mix(in srgb, var(--lb-brand) 40%, transparent);
}
[data-mode="dark"] .hero-blob-2 {
  background: color-mix(in srgb, var(--lb-status-neutral) 26%, transparent);
}
[data-mode="dark"] .hero-blob-3 {
  background: color-mix(in srgb, var(--lb-ai-mention) 24%, transparent);
}
.hero-blob-4 {
  display: none;
}
@keyframes heroBlob1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(80px, 60px) scale(1.08); }
}
@keyframes heroBlob2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-60px, 40px) scale(1.1); }
}
@keyframes heroBlob3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(40px, -50px) scale(1.06); }
}
.hero-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 55% 50% at center,
    color-mix(in srgb, var(--lb-bg-1) 30%, transparent) 0%,
    transparent 60%
  );
}
.hero-bg-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle 0.8px at center,
    color-mix(in srgb, var(--lb-fg-1) 28%, transparent) 0%,
    transparent 100%
  );
  background-size: 24px 24px;
  mask-image:
    radial-gradient(ellipse 40% 35% at 50% 38%, transparent 0%, black 60%),
    radial-gradient(ellipse 90% 75% at center, black 30%, transparent 100%);
  -webkit-mask-image:
    radial-gradient(ellipse 40% 35% at 50% 38%, transparent 0%, black 60%),
    radial-gradient(ellipse 90% 75% at center, black 30%, transparent 100%);
  mask-composite: intersect;
  -webkit-mask-composite: source-in;
}
[data-mode="dark"] .hero-bg-dots {
  background-image: radial-gradient(circle 0.8px at center, rgba(255, 255, 255, 0.22) 0%, transparent 100%);
}
.hero-bg-horizon {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 220px;
  background: linear-gradient(to top, color-mix(in srgb, var(--lb-bg-1) 92%, transparent) 0%, transparent 100%);
}
`

interface HeroSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function HeroSection({ locale }: HeroSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const highlights = content.highlights.map((h, i) => ({ ...h, v: HIGHLIGHT_VALUES[i] }))
  const docsHref = localePath(locale, '/docs')

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      <section data-lbus-component="hero-section" className="home-hero home-hero-centered">
        <div className="hero-bg-data" aria-hidden="true">
          <div className="hero-bg-blobs">
            <span className="hero-blob hero-blob-1" />
            <span className="hero-blob hero-blob-2" />
            <span className="hero-blob hero-blob-3" />
            <span className="hero-blob hero-blob-4" />
          </div>
          <div className="hero-bg-dots" />
          <div className="hero-bg-vignette" />
          <div className="hero-bg-horizon" />
        </div>
        <div className="home-hero-inner-centered">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1 className="h-display home-hero-title">
            {content.title1}
            <br />
            <span style={{ color: 'var(--lb-brand)' }}>{content.title2}</span>
          </h1>
          <p className="t-body home-hero-sub" dangerouslySetInnerHTML={{ __html: content.desc }} />
          <div className="home-hero-cta">
            <a className="btn btn-primary btn-lg" href={docsHref}>
              {content.cta1}
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
            <a className="btn btn-outline btn-lg" href={docsHref}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              {content.cta2}
            </a>
          </div>
          <div className="home-hero-highlights">
            {highlights.map((h, i) => (
              <span key={h.u} style={{ display: 'contents' }}>
                <div className="home-hero-stat">
                  <div className="home-hero-stat-line">
                    <span className="home-hero-stat-v">{h.v}</span>
                    <span className="home-hero-stat-u">{h.u}</span>
                  </div>
                  <div className="home-hero-stat-d">{h.d}</div>
                </div>
                {i < highlights.length - 1 && <span className="home-hero-stat-sep" />}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
