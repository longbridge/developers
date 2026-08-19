import React from 'react'
import type { Locale } from '@longbridge/openapi-utils'

const LOCALE = {
  en: {
    title: 'Global Market Coverage',
    subtitle: 'Real-time data and trading across major financial markets',
    markets: { hk: 'Hong Kong', us: 'United States', cn: 'China A-Shares', sg: 'Singapore' } as Record<string, string>,
  },
  'zh-CN': {
    title: '全球市场覆盖',
    subtitle: '跨主要金融市场的实时数据和交易',
    markets: { hk: '香港市场', us: '美国市场', cn: 'A 股市场', sg: '新加坡市场' } as Record<string, string>,
  },
  'zh-HK': {
    title: '全球市場覆蓋',
    subtitle: '跨主要金融市場的即時數據和交易',
    markets: { hk: '香港市場', us: '美國市場', cn: 'A 股市場', sg: '新加坡市場' } as Record<string, string>,
  },
}

const markets = [
  {
    key: 'hk',
    flag: `<svg viewBox="0 0 640 480"><path fill="#de2910" d="M0 0h640v480H0z"/><g fill="#fff" transform="translate(320 240) scale(6)"><polygon points="0,-12 3.5,-3.5 12,-3.5 5,2.5 7.5,12 0,6.5 -7.5,12 -5,2.5 -12,-3.5 -3.5,-3.5"/></g></svg>`,
    products: ['Stocks', 'ETFs', 'Warrants', 'CBBC'],
    quote: true,
    trade: true,
    example: '700.HK',
  },
  {
    key: 'us',
    flag: `<svg viewBox="0 0 640 480"><path fill="#bd3d44" d="M0 0h640v37h-640zm0 74h640v37h-640zm0 148h640v37h-640zm0 74h640v37h-640z"/><path fill="#fff" d="M0 37h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640zm0 74h640v37h-640z"/><path fill="#192f5d" d="M0 0h260v260H0z"/></svg>`,
    products: ['Stocks', 'ETFs', 'Options'],
    quote: true,
    trade: true,
    example: 'AAPL.US',
  },
  {
    key: 'cn',
    flag: `<svg viewBox="0 0 640 480"><path fill="#de2910" d="M0 0h640v480H0z"/><g fill="#ff0" transform="translate(96 72) scale(4.8)"><polygon points="0,-12 3.5,-3.5 12,-3.5 5,2.5 7.5,12 0,6.5 -7.5,12 -5,2.5 -12,-3.5 -3.5,-3.5"/></g></svg>`,
    products: ['A-Shares', 'ETFs', 'Indexes'],
    quote: true,
    trade: false,
    example: '600519.SH',
  },
  {
    key: 'sg',
    flag: `<svg viewBox="0 0 640 480"><path fill="#ed2939" d="M0 0h640v240H0z"/><path fill="#fff" d="M0 240h640v240H0z"/></svg>`,
    products: ['Stocks'],
    quote: true,
    trade: false,
    example: 'D05.SG',
  },
]

const MC_CSS = `
.mc-section { padding: 3rem 0 4rem; background: var(--vp-c-bg-soft); border-top: 1px solid var(--vp-c-divider); border-bottom: 1px solid var(--vp-c-divider); }
.mc-grid { display: grid; grid-template-columns: 1fr repeat(4, 1fr); gap: .75rem; max-width: 56rem; margin: 0 auto; padding: 0 1.5rem; align-items: center; }
.mc-label-cell { grid-row: span 2; display: flex; flex-direction: column; justify-content: center; padding: .5rem; }
.mc-label-tag { font-size: 1.125rem; font-weight: 700; color: var(--vp-c-text-1); letter-spacing: -.01em; }
.mc-label-desc { margin-top: .25rem; font-size: .75rem; color: var(--vp-c-text-3); line-height: 1.5; }
.mc-card { padding: 1rem; border-radius: .75rem; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg); transition: all .25s; }
.mc-card:hover { border-color: color-mix(in srgb, var(--brand-color) 30%, var(--vp-c-divider)); box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-color) 5%, transparent); }
.mc-card-top { display: flex; align-items: center; gap: .625rem; margin-bottom: .75rem; }
.mc-flag { display: flex; width: 1.75rem; height: 1.25rem; border-radius: 3px; overflow: hidden; flex-shrink: 0; border: 1px solid var(--vp-c-divider); }
.mc-flag svg { width: 100%; height: 100%; }
.mc-market-name { font-size: .85rem; font-weight: 700; color: var(--vp-c-text-1); }
.mc-example { font-size: .65rem; font-family: var(--vp-font-family-mono, monospace); color: var(--vp-c-text-3); }
.mc-products { display: flex; flex-wrap: wrap; gap: .25rem; margin-bottom: .625rem; }
.mc-product { padding: .125rem .375rem; border-radius: .1875rem; font-size: .65rem; font-weight: 600; background: color-mix(in srgb, var(--brand-color) 8%, transparent); color: var(--brand-color); }
.mc-caps { display: flex; gap: .5rem; }
.mc-cap { display: inline-flex; align-items: center; gap: .2rem; font-size: .65rem; font-weight: 600; color: var(--vp-c-text-3); }
.mc-cap.enabled { color: var(--brand-color); }
.mc-cap svg { flex-shrink: 0; }
@media (max-width: 768px) { .mc-grid { grid-template-columns: repeat(2, 1fr); } .mc-label-cell { grid-column: span 2; grid-row: span 1; text-align: center; } }
@media (max-width: 480px) { .mc-grid { grid-template-columns: 1fr; } .mc-label-cell { grid-column: span 1; } }
`

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="10" height="10">
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  )
}

interface MarketCoverageProps {
  locale: Locale
}

export function MarketCoverage({ locale }: MarketCoverageProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MC_CSS }} />
      <section data-lbus-component="market-coverage" className="mc-section">
        <div className="mc-grid">
          <div className="mc-label-cell">
            <span className="mc-label-tag">{content.title}</span>
            <p className="mc-label-desc">{content.subtitle}</p>
          </div>
          {markets.map((m) => (
            <div key={m.key} className="mc-card">
              <div className="mc-card-top">
                <span
                  className="mc-flag"
                  dangerouslySetInnerHTML={{ __html: m.flag }}
                />
                <div>
                  <h3 className="mc-market-name">{content.markets[m.key]}</h3>
                  <code className="mc-example">{m.example}</code>
                </div>
              </div>
              <div className="mc-products">
                {m.products.map((p) => (
                  <span key={p} className="mc-product">{p}</span>
                ))}
              </div>
              <div className="mc-caps">
                <span className={`mc-cap${m.quote ? ' enabled' : ''}`}>
                  {m.quote ? <CheckIcon /> : <XIcon />}
                  Quote
                </span>
                <span className={`mc-cap${m.trade ? ' enabled' : ''}`}>
                  {m.trade ? <CheckIcon /> : <XIcon />}
                  Trade
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
