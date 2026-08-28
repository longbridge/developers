import { useEffect, useRef } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "Available in ChatGPT & Claude" section
// (NewHomePage/index.vue `.home-channels`). Markup, copy, and CSS mirror the
// legacy source. Generic legacy utilities (.eyebrow / .h-section /
// .section-inner) are scoped under `.home-channels` so they can't leak.
//
// Legacy also ran an IntersectionObserver that toggled `.is-visible` on the
// subtitle to play a 5s shimmer each time it scrolled into view. The page is
// hydrated (`client:load`), so that logic is restored below in a `useEffect`
// that toggles the class directly on the DOM node (never via React state, so
// SSR and the first client render stay identical and the innerHTML is never
// re-rendered).
const CHATGPT_APP_URL = 'https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef'
const CLAUDE_CONNECTOR_URL = 'https://claude.ai/directory/connectors/longbridge'

type PartnerKey = 'chatgpt' | 'claude'

const LOCALE = {
  en: {
    eyebrow: 'OFFICIAL INTEGRATION · NOW LIVE',
    tagline: 'AI that reads the market.',
    subtitle:
      '<span class="k k-lb">Longbridge</span> is live on <span class="k k-gpt">ChatGPT Apps</span> and <span class="k k-claude">Claude Connectors</span> — check quotes, screen ideas, view positions. One-tap OAuth, no API keys.',
    partners: [
      { key: 'chatgpt' as PartnerKey, brand: 'ChatGPT', cta: 'Open in ChatGPT' },
      { key: 'claude' as PartnerKey, brand: 'Claude', cta: 'Add Claude Connector' },
    ],
  },
  'zh-CN': {
    eyebrow: '官方集成 · 现已上线',
    tagline: '让 AI 读懂市场。',
    subtitle:
      '<span class="k k-lb">Longbridge</span> 已上架 <span class="k k-gpt">ChatGPT Apps</span> 与 <span class="k k-claude">Claude Connectors</span> —— 查行情、筛股票、看持仓，OAuth 授权即用，无需 API Key。',
    partners: [
      { key: 'chatgpt' as PartnerKey, brand: 'ChatGPT', cta: '在 ChatGPT 打开' },
      { key: 'claude' as PartnerKey, brand: 'Claude', cta: '添加 Claude Connector' },
    ],
  },
  'zh-HK': {
    eyebrow: '官方整合 · 現已上線',
    tagline: '讓 AI 讀懂市場。',
    subtitle:
      '<span class="k k-lb">Longbridge</span> 已上架 <span class="k k-gpt">ChatGPT Apps</span> 與 <span class="k k-claude">Claude Connectors</span> —— 查行情、篩股票、看持倉，OAuth 授權即用，無需 API Key。',
    partners: [
      { key: 'chatgpt' as PartnerKey, brand: 'ChatGPT', cta: '在 ChatGPT 開啟' },
      { key: 'claude' as PartnerKey, brand: 'Claude', cta: '加入 Claude Connector' },
    ],
  },
}

const GPT_PATH =
  'M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z'

const CLAUDE_PATH =
  'M4.709 15.955l4.72-2.647.079-.23-.079-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z'

const CHANNELS_CSS = `
/* ---- legacy utilities, scoped ---- */
.home-channels .section-inner {
  max-width: var(--app-max);
  margin: 0 auto;
}
.home-channels .eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--lb-brand);
}
.home-channels .eyebrow::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: currentColor;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 16%, transparent);
}
.home-channels .h-section {
  font-size: clamp(28px, 3vw, 36px);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.025em;
  margin: 0;
  color: var(--lb-fg-1);
}

/* ===== Available in ChatGPT & Claude ===== */
.home-channels {
  position: relative;
  padding: 120px 24px 80px;
  overflow: hidden;
  isolation: isolate;
}
.home-channels::before,
.home-channels::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 180px;
  pointer-events: none;
  z-index: 1;
}
.home-channels::before {
  top: 0;
  background: linear-gradient(to bottom, var(--lb-bg-1), transparent);
}
.home-channels::after {
  bottom: 0;
  background: linear-gradient(to top, var(--lb-bg-1), transparent);
}
.home-channels-inner {
  position: relative;
  z-index: 2;
}
.home-channels-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--lb-fg-1) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--lb-fg-1) 6%, transparent) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%);
  -webkit-mask-image: radial-gradient(ellipse 70% 55% at 50% 45%, #000 0%, transparent 75%);
  opacity: 0.55;
  z-index: 0;
  pointer-events: none;
}
.home-channels-glow {
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.28;
  z-index: 0;
  pointer-events: none;
}
.home-channels-glow--gpt {
  top: -80px;
  left: -60px;
  background: radial-gradient(circle, #10a37f 0%, transparent 65%);
}
.home-channels-glow--claude {
  bottom: -120px;
  right: -80px;
  background: radial-gradient(circle, #d97757 0%, transparent 65%);
}

.home-channels-head {
  text-align: center;
  max-width: 780px;
  margin: 0 auto 56px;
}
/* Scoped like .h-section above so it keeps winning (legacy cascade order). */
.home-channels .home-channels-title {
  margin: 18px 0 20px;
  font-size: clamp(26px, 3.2vw, 40px);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.home-channels-title-line {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.32em;
}
.home-channels-title-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.28em;
}
.home-channels-title-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}
.home-channels-title-logo svg {
  width: 100%;
  height: 100%;
  display: block;
}
.home-channels-title-logo--gpt {
  color: var(--lb-fg-1);
}
.home-channels-title-logo--claude {
  color: #d97757;
}
.home-channels-title-x {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.5em;
  height: 0.5em;
  color: var(--lb-fg-3);
  opacity: 0.55;
  margin: 0 0.1em;
}
.home-channels-title-x svg {
  width: 100%;
  height: 100%;
  display: block;
}
.home-channels-tagline {
  display: block;
  margin-top: 10px;
  font-size: 0.5em;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: var(--lb-fg-3);
}
.home-channels-sub {
  margin: 0 auto;
  max-width: 780px;
  font-size: 17px;
  line-height: 1.8;
  font-weight: 500;
  color: var(--lb-fg-2);
}
.home-channels-sub .k {
  font-size: 1.3em;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.home-channels-sub .k-lb {
  color: var(--lb-fg-1);
}
.home-channels-sub .k-gpt {
  color: var(--lb-brand);
}
.home-channels-sub .k-claude {
  color: #d97757;
}

.home-channels-sub.is-visible,
.home-channels-sub.is-visible .k {
  background-size: 300% 100%;
  background-position: 100% 50%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: home-channels-reveal 5s cubic-bezier(0.22, 1, 0.36, 1);
}
.home-channels-sub.is-visible {
  background-image: linear-gradient(
    105deg,
    var(--lb-fg-2) 0%,
    var(--lb-fg-2) 42%,
    #ffffff 50%,
    var(--lb-fg-2) 58%,
    var(--lb-fg-2) 100%
  );
}
.home-channels-sub.is-visible .k-lb {
  background-image: linear-gradient(
    105deg,
    var(--lb-fg-1) 0%,
    var(--lb-fg-1) 42%,
    #ffffff 50%,
    var(--lb-fg-1) 58%,
    var(--lb-fg-1) 100%
  );
}
.home-channels-sub.is-visible .k-gpt {
  background-image: linear-gradient(
    105deg,
    var(--lb-brand) 0%,
    var(--lb-brand) 42%,
    #ffffff 50%,
    var(--lb-brand) 58%,
    var(--lb-brand) 100%
  );
}
.home-channels-sub.is-visible .k-claude {
  background-image: linear-gradient(
    105deg,
    #d97757 0%,
    #d97757 42%,
    #ffffff 50%,
    #d97757 58%,
    #d97757 100%
  );
}
@keyframes home-channels-reveal {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .home-channels-sub.is-visible,
  .home-channels-sub.is-visible .k {
    animation: none;
    background: none;
    -webkit-text-fill-color: currentColor;
  }
}

.home-channels-cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  max-width: 760px;
  margin: 0 auto;
}
.home-channel-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: 20px;
  border: 1px solid var(--app-card-stroke);
  background: var(--lb-bg-1);
  color: var(--lb-fg-1);
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}
.home-channel-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--card-accent) 55%, transparent),
    transparent 45%,
    transparent 70%,
    color-mix(in srgb, var(--card-accent) 25%, transparent)
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.25s ease;
  pointer-events: none;
  z-index: 2;
}
.home-channel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 60px -32px color-mix(in srgb, var(--card-accent) 60%, rgba(15, 17, 21, 0.28));
}
.home-channel-card:hover::before {
  opacity: 1;
}
.home-channel-card--chatgpt {
  --card-accent: #10a37f;
}
.home-channel-card--claude {
  --card-accent: #d97757;
}

.home-channel-card-glow {
  position: absolute;
  top: -50px;
  right: -50px;
  width: 160px;
  height: 160px;
  border-radius: 999px;
  background: radial-gradient(circle, var(--card-accent) 0%, transparent 70%);
  filter: blur(40px);
  opacity: 0.28;
  z-index: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.home-channel-card:hover .home-channel-card-glow {
  opacity: 0.45;
}

.home-channel-card-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1;
}
.home-channel-card-logo {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--card-accent) 12%, transparent);
  color: var(--card-accent);
}
.home-channel-card-logo svg {
  width: 24px;
  height: 24px;
  display: block;
}
.home-channel-card-logo--chatgpt {
  color: var(--lb-fg-1);
  background: color-mix(in srgb, var(--lb-fg-1) 8%, transparent);
}
.home-channel-card-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 auto;
  min-width: 0;
}
.home-channel-card-brand {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--lb-fg-1);
}
.home-channel-card-cta {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  white-space: nowrap;
  align-self: center;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--card-accent);
  transition: transform 0.2s ease;
}
.home-channel-card:hover .home-channel-card-cta {
  transform: translateX(4px);
}
.home-channel-card--chatgpt .home-channel-card-cta {
  color: var(--lb-brand);
}

@media (max-width: 860px) {
  .home-channels {
    padding: 72px 16px 24px;
  }
  .home-channels-cards {
    grid-template-columns: 1fr;
  }
  .home-channels-head {
    margin-bottom: 40px;
  }
  .home-channels .home-channels-title {
    font-size: clamp(24px, 6.8vw, 32px);
  }
  .home-channel-card {
    padding: 24px;
  }
}
`

function BrandGlyph({ which }: { which: PartnerKey }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={which === 'chatgpt' ? GPT_PATH : CLAUDE_PATH} />
    </svg>
  )
}

interface ChannelsSectionProps {
  locale: Locale
}

export function ChannelsSection({ locale }: ChannelsSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const subtitleRef = useRef<HTMLParagraphElement | null>(null)

  // Legacy NewHomePage/index.vue `onMounted` / `onBeforeUnmount`: replay the
  // `.is-visible` shimmer every time the subtitle scrolls into the middle 20%
  // band of the viewport, and drop the class once the animation has finished.
  useEffect(() => {
    const el = subtitleRef.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('is-visible')
      return
    }
    const handleSubtitleAnimationEnd = (e: AnimationEvent) => {
      if (e.animationName === 'home-channels-reveal' && e.target === el) {
        el.classList.remove('is-visible')
      }
    }
    el.addEventListener('animationend', handleSubtitleAnimationEnd)
    const channelsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 重启动画：先摘掉 class + 强制 reflow，再挂回来
            el.classList.remove('is-visible')
            void el.offsetWidth
            el.classList.add('is-visible')
          }
        })
      },
      { threshold: 0, rootMargin: '-40% 0px -40% 0px' },
    )
    channelsObserver.observe(el)
    return () => {
      channelsObserver.disconnect()
      el.removeEventListener('animationend', handleSubtitleAnimationEnd)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CHANNELS_CSS }} />
      <section data-lbus-component="channels-section" className="home-channels">
        <div className="home-channels-grid-bg" aria-hidden="true" />
        <div className="home-channels-glow home-channels-glow--gpt" aria-hidden="true" />
        <div className="home-channels-glow home-channels-glow--claude" aria-hidden="true" />
        <div className="section-inner home-channels-inner">
          <div className="home-channels-head">
            <span className="eyebrow">{content.eyebrow}</span>
            <h2 className="h-section home-channels-title">
              <span className="home-channels-title-line">
                <span className="home-channels-title-brand">
                  <span className="home-channels-title-logo home-channels-title-logo--gpt" aria-hidden="true">
                    <BrandGlyph which="chatgpt" />
                  </span>
                  ChatGPT
                </span>
                <span className="home-channels-title-x" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </span>
                <span className="home-channels-title-brand">
                  <span className="home-channels-title-logo home-channels-title-logo--claude" aria-hidden="true">
                    <BrandGlyph which="claude" />
                  </span>
                  Claude
                </span>
              </span>
              <span className="home-channels-tagline">{content.tagline}</span>
            </h2>
            <p ref={subtitleRef} className="home-channels-sub" dangerouslySetInnerHTML={{ __html: content.subtitle }} />
          </div>

          <div className="home-channels-cards">
            {content.partners.map((p) => (
              <a
                key={p.key}
                className={`home-channel-card home-channel-card--${p.key}`}
                href={p.key === 'chatgpt' ? CHATGPT_APP_URL : CLAUDE_CONNECTOR_URL}
                target="_blank"
                rel="noreferrer">
                <div className="home-channel-card-glow" aria-hidden="true" />
                <div className="home-channel-card-head">
                  <span className={`home-channel-card-logo home-channel-card-logo--${p.key}`}>
                    <BrandGlyph which={p.key} />
                  </span>
                  <div className="home-channel-card-titles">
                    <div className="home-channel-card-brand">{p.brand}</div>
                  </div>
                  <div className="home-channel-card-cta">
                    <span>{p.cta}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
