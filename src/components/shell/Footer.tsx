import { t } from '../../lib/i18n'
import type { Locale } from '../../lib/i18n'

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

function switchLocale(targetLocale: string) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  // Detect current locale prefix
  const localeMatch = path.match(/^\/(zh-CN|zh-HK)/)
  const cur = localeMatch ? localeMatch[1] : null
  let newPath: string
  if (cur) {
    if (targetLocale === 'en') {
      newPath = path.replace(`/${cur}`, '') || '/'
    } else {
      newPath = path.replace(`/${cur}`, `/${targetLocale}`)
    }
  } else {
    newPath = targetLocale === 'en' ? path : `/${targetLocale}${path}`
  }
  window.location.href = newPath
}

export default function Footer({ locale }: Props) {
  const year = new Date().getFullYear()
  const base = sgBaseUrl(locale)
  const homeHref = locale === 'en' ? '/' : `/${locale}/`

  return (
    <footer className="app-footer" data-lbus-component="footer">
      <div className="app-footer-inner-v2">
        {/* Brand column */}
        <div className="app-footer-brand">
          <a href={homeHref} className="app-brand" aria-label="Longbridge Developers">
            <img
              className="brand-logo brand-logo-light"
              src={LOGO_LIGHT}
              alt="Longbridge Developers"
              style={{ height: 24 }}
            />
            <img
              className="brand-logo brand-logo-dark"
              src={LOGO_DARK}
              alt="Longbridge Developers"
              style={{ height: 24 }}
            />
          </a>
          <p>{t(locale, 'footer.tagline')}</p>
          <div className="footer-status">
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
          <h5>{t(locale, 'footer.products')}</h5>
          <ul>
            <li><a href={localePath(locale, '/skill')}>AI Skill</a></li>
            <li><a href={localePath(locale, '/docs/cli')}>CLI</a></li>
            <li><a href={localePath(locale, '/docs/mcp')}>MCP</a></li>
            <li><a href={localePath(locale, '/docs/llm')}>LLMs</a></li>
            <li><a href="https://navi-lang.org" target="_blank" rel="noreferrer">Navi</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h5>{t(locale, 'footer.resources')}</h5>
          <ul>
            <li><a href={localePath(locale, '/docs/getting-started')}>{t(locale, 'footer.gettingStarted')}</a></li>
            <li><a href={localePath(locale, '/docs')}>Documentation</a></li>
            <li><a href={localePath(locale, '/docs/assets')}>{t(locale, 'footer.assets')}</a></li>
            <li><a href={localePath(locale, '/docs/quote/pull/quote')}>Quote API</a></li>
            <li><a href={localePath(locale, '/docs/trade/order/submit')}>Trade API</a></li>
            <li><a href={localePath(locale, '/docs/changelog')}>{t(locale, 'footer.changelog')}</a></li>
            <li>
              <a
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
          <h5>{t(locale, 'footer.company')}</h5>
          <ul>
            <li><a href="https://longbridge.com" target="_blank" rel="noreferrer">Longbridge</a></li>
            <li><a href="https://longbridge.com/download" target="_blank" rel="noreferrer">{t(locale, 'footer.download')}</a></li>
            <li><a href="https://status.longbridge.com" target="_blank" rel="noreferrer">{t(locale, 'footer.statusPage')}</a></li>
            <li><a href="https://longbridge.com/about" target="_blank" rel="noreferrer">{t(locale, 'footer.about')}</a></li>
            <li><a href="https://github.com/longbridge" target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h5>{t(locale, 'footer.legal')}</h5>
          <ul>
            <li>
              <a
                href={`${base}/support/topics/us-trade/user-agreement`}
                target="_blank"
                rel="noreferrer"
              >
                {t(locale, 'footer.terms')}
              </a>
            </li>
            <li>
              <a
                href={`${base}/support/topics/Other/privacy-policy`}
                target="_blank"
                rel="noreferrer"
              >
                {t(locale, 'footer.privacy')}
              </a>
            </li>
            <li><a href={localePath(locale, '/docs/legal')}>{t(locale, 'footer.agreements')}</a></li>
          </ul>
        </div>
      </div>

      <div className="app-footer-bottom">
        <div>{t(locale, 'footer.rights', { year })}</div>
        <div className="app-footer-bottom-links">
          <span style={{ color: 'var(--lb-fg-3)' }}>·</span>
          <button type="button" onClick={() => switchLocale('en')}>English</button>
          <button type="button" onClick={() => switchLocale('zh-CN')}>简体中文</button>
          <button type="button" onClick={() => switchLocale('zh-HK')}>繁體中文</button>
        </div>
      </div>
    </footer>
  )
}
