import { t } from '@longbridge/openapi-utils'
import type { Locale } from '@longbridge/openapi-utils'

interface Props {
  locale: Locale
}

const LOGO_LIGHT =
  'https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png'
const LOGO_DARK =
  'https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png'

function localePath(locale: Locale, path: string): string {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

function sgBaseUrl(locale: Locale): string {
  return locale === 'en' ? 'https://longbridge.com/sg' : 'https://longbridge.com/sg/zh-CN'
}

export default function Footer({ locale }: Props) {
  const year = new Date().getFullYear()
  const base = sgBaseUrl(locale)
  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <footer className="border-t border-[color:var(--lb-stroke)] text-[color:var(--lb-fg-2)] text-sm py-8 px-4 mt-16" data-lbus-component="footer">
      <div className="max-w-[80rem] mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
        {/* Brand column */}
        <div className="flex flex-col gap-2 col-span-full lg:col-auto">
          <a href={homeHref} className="inline-flex items-center gap-2 text-[color:var(--lbus-c-text)] no-underline" aria-label="Longbridge Developers">
            <img
              className="h-6 w-auto block [[data-mode='dark']_&]:hidden"
              src={LOGO_LIGHT}
              alt="Longbridge Developers"
            />
            <img
              className="h-6 w-auto hidden [[data-mode='dark']_&]:inline-block"
              src={LOGO_DARK}
              alt="Longbridge Developers"
            />
          </a>
          <p>{t(locale, 'footer.tagline')}</p>
          <div className="inline-flex items-center gap-[0.4rem] text-[color:var(--lb-fg-2)] text-[0.8rem]">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: 'var(--lb-up)',
                boxShadow: '0 0 0 3px color-mix(in srgb, var(--lb-up) 25%, transparent)',
                flexShrink: 0,
                display: 'inline-block',
              }}
            />
            <span>{t(locale, 'footer.status')}</span>
          </div>
        </div>

        {/* Products */}
        <div>
          <h5 className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] mb-3 mt-0 text-[color:var(--lbus-c-text)]">{t(locale, 'footer.products')}</h5>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem]">
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/skill')}>AI Skill</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/cli')}>CLI</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/mcp')}>MCP</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/llm')}>LLMs</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://navi-lang.org" target="_blank" rel="noreferrer">Navi</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h5 className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] mb-3 mt-0 text-[color:var(--lbus-c-text)]">{t(locale, 'footer.resources')}</h5>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem]">
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/getting-started')}>{t(locale, 'footer.gettingStarted')}</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs')}>Documentation</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/assets')}>{t(locale, 'footer.assets')}</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/quote/pull/quote')}>Quote API</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/trade/order/submit')}>Trade API</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/changelog')}>{t(locale, 'footer.changelog')}</a></li>
            <li>
              <a
                className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]"
                href="https://github.com/longbridge/developers/issues"
                target="_blank"
                rel="noreferrer"
              >
                {t(locale, 'footer.feedback')}
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h5 className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] mb-3 mt-0 text-[color:var(--lbus-c-text)]">{t(locale, 'footer.company')}</h5>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem]">
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://longbridge.com" target="_blank" rel="noreferrer">Longbridge</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://longbridge.com/download" target="_blank" rel="noreferrer">{t(locale, 'footer.download')}</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://status.longbridge.com" target="_blank" rel="noreferrer">{t(locale, 'footer.statusPage')}</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://longbridge.com/about" target="_blank" rel="noreferrer">{t(locale, 'footer.about')}</a></li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href="https://github.com/longbridge" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5 className="text-[0.7rem] font-semibold uppercase tracking-[0.06em] mb-3 mt-0 text-[color:var(--lbus-c-text)]">{t(locale, 'footer.legal')}</h5>
          <ul className="list-none p-0 m-0 flex flex-col gap-[0.35rem]">
            <li>
              <a
                className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]"
                href={`${base}/support/topics/us-trade/user-agreement`}
                target="_blank"
                rel="noreferrer"
              >
                {t(locale, 'footer.terms')}
              </a>
            </li>
            <li>
              <a
                className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]"
                href={`${base}/support/topics/Other/privacy-policy`}
                target="_blank"
                rel="noreferrer"
              >
                {t(locale, 'footer.privacy')}
              </a>
            </li>
            <li><a className="text-[color:var(--lb-fg-2)] no-underline text-[0.85rem] hover:text-[color:var(--lb-brand)]" href={localePath(locale, '/docs/legal')}>{t(locale, 'footer.agreements')}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--lb-stroke)] pt-4 flex flex-wrap gap-4 items-center justify-between">
        <div>{t(locale, 'footer.rights', { year })}</div>
        <div className="flex flex-wrap gap-4">
          <span style={{ color: 'var(--lb-fg-3)' }}>·</span>
          <a className="text-[color:var(--lb-fg-2)] no-underline hover:text-[color:var(--lb-brand)]" href="/">English</a>
          <a className="text-[color:var(--lb-fg-2)] no-underline hover:text-[color:var(--lb-brand)]" href="/zh-CN/">简体中文</a>
          <a className="text-[color:var(--lb-fg-2)] no-underline hover:text-[color:var(--lb-brand)]" href="/zh-HK/">繁體中文</a>
        </div>
      </div>
    </footer>
  )
}
