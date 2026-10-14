import type { Locale } from '@longbridge/openapi-utils'

// 1:1 port of the legacy VitePress "Final CTA" section (NewHomePage/index.vue,
// the `.final-cta` section). Markup, copy, inline styles, and CSS mirror the
// legacy source. Generic legacy utilities (.section / .section-inner /
// .h-section / .btn / .btn-primary / .btn-outline / .btn-lg) are provided
// globally under `.new-home-page` by homepage.css and are NOT redefined here.
const LOCALE = {
  en: {
    title: 'Build smarter financial tools with real-time data and AI.',
    btn1: 'Get started',
    btn2: 'See pricing',
  },
  'zh-CN': {
    title: '用实时数据与 AI 构建更智能的金融工具',
    btn1: '开始使用',
    btn2: '查看定价',
  },
  'zh-HK': {
    title: '用即時數據與 AI 構建更智慧的金融工具',
    btn1: '開始使用',
    btn2: '查看定價',
  },
}

const CTA_CSS = `
.final-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
  padding: 56px;
  border-radius: 24px;
  border: 1px solid var(--app-card-stroke);
  background: var(--lb-card);
}
@media (max-width: 640px) {
  .final-cta {
    padding: 32px 20px;
    border-radius: 16px;
  }
}
`

interface CtaSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function CtaSection({ locale }: CtaSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CTA_CSS }} />
      <section data-lbus-component="cta-section" className="section">
        <div className="section-inner final-cta">
          <h2 className="h-section" style={{ maxWidth: 680 }}>
            {content.title}
          </h2>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a className="btn btn-primary btn-lg" href={localePath(locale, '/docs')}>
              {content.btn1}
              <svg
                width="14"
                height="14"
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
            <a className="btn btn-outline btn-lg" href={localePath(locale, '/pricing')}>
              {content.btn2}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
