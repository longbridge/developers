import React, { useState, useEffect, useRef } from 'react'
import type { Locale } from '@longbridge/openapi-utils'

const LOCALE = {
  en: {
    titlePrefix: 'Longbridge',
    titleAccent: 'Developers',
    powering: 'Powering',
    subtitle:
      'Real-time market data, trading, and financial intelligence — delivered through {skill}, {cli}, {mcp}, {sdk} and {openapi} for developers worldwide.',
    keywords: { sdk: 'SDK', cli: 'CLI', skill: 'AI Skill', mcp: 'MCP', openapi: 'OpenAPI' },
    cta: { getStarted: 'Get Started', readDocs: 'Docs' },
  },
  'zh-CN': {
    titlePrefix: 'Longbridge',
    titleAccent: 'Developers',
    powering: '接入',
    subtitle: '实时行情、交易和金融数据 — 通过 {skill}、{cli}、{mcp}、{sdk} 及 {openapi} 交付给全球开发者。',
    keywords: { sdk: 'SDK', cli: 'CLI', skill: 'AI Skill', mcp: 'MCP', openapi: 'OpenAPI' },
    cta: { getStarted: '快速开始', readDocs: '阅读文档' },
  },
  'zh-HK': {
    titlePrefix: 'Longbridge',
    titleAccent: 'Developers',
    powering: '接入',
    subtitle: '即時行情、交易和金融數據 — 透過 {skill}、{cli}、{mcp}、{sdk} 及 {openapi} 交付給全球開發者。',
    keywords: { sdk: 'SDK', cli: 'CLI', skill: 'AI Skill', mcp: 'MCP', openapi: 'OpenAPI' },
    cta: { getStarted: '快速開始', readDocs: '閱讀文檔' },
  },
}

const PRODUCTS = ['Skill', 'CLI', 'MCP', 'SDK', 'OpenAPI']

const BRAND_COLORS = [
  'var(--brand-100)',
  'var(--brand-80)',
  'var(--brand-60)',
  'var(--cyan-100)',
  'var(--cyan-80)',
  'var(--cyan-60)',
]

const HERO_CSS = `
.hero-section {
  position: relative;
  overflow: hidden;
  background: var(--vp-c-bg);
}
.hero-bg-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.hero-bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, #00d4a8 10%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 50% 35% at 15% 100%, color-mix(in srgb, #ffe000 4%, transparent) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 85% 100%, color-mix(in srgb, #00dbb6 6%, transparent) 0%, transparent 60%);
}
:root.dark .hero-bg-gradient {
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, color-mix(in srgb, #00dbb6 18%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 50% 35% at 15% 100%, color-mix(in srgb, #ffe000 6%, transparent) 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 85% 100%, color-mix(in srgb, #00d4a8 10%, transparent) 0%, transparent 60%);
}
.hero-bg-flicker {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-flicker-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-bg-fade {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 60% at center, transparent 0%, transparent 40%, var(--vp-c-bg) 90%);
}
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 48rem;
  margin: 0 auto;
  padding: 6rem 1.5rem;
  text-align: center;
  width: 100%;
}
.hero-title {
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--vp-c-text-1);
}
@media (min-width: 640px) {
  .hero-title { font-size: 3.5rem; }
}
@media (min-width: 1024px) {
  .hero-title { font-size: 4rem; }
}
.hero-title-accent {
  color: var(--vp-c-text-1);
}
.hero-powering {
  margin-top: 1.25rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}
.hero-powering-label {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
@media (min-width: 640px) {
  .hero-powering-label { font-size: 1.5rem; }
}
.hero-product-text {
  font-size: 1.25rem;
  font-weight: 700;
  display: inline-block;
  min-width: 100px;
  text-align: left;
  transition: color 0.3s ease;
  animation: heroColorCycle 9s infinite;
}
@media (min-width: 640px) {
  .hero-product-text { font-size: 1.5rem; min-width: 120px; }
}
@keyframes heroColorCycle {
  0%   { color: var(--brand-100); }
  20%  { color: var(--brand-80); }
  40%  { color: var(--brand-60); }
  60%  { color: var(--cyan-100); }
  80%  { color: var(--cyan-80); }
  100% { color: var(--brand-100); }
}
.hero-subtitle {
  margin-top: 1.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--vp-c-text-2);
  font-weight: 400;
  background: color-mix(in srgb, var(--vp-c-bg) 75%, transparent);
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
}
.hero-keyword {
  color: var(--brand-color);
  font-weight: 500;
}
.hero-cta {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
}
.hero-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: var(--lb-btn-primary-h);
  padding: 0 1.5rem;
  font-size: var(--lb-btn-primary-fs);
  font-weight: var(--lb-btn-primary-fw);
  color: var(--lb-btn-primary-color) !important;
  background: var(--lb-btn-primary-bg);
  border-radius: var(--lb-btn-primary-radius);
  text-decoration: none !important;
  transition: opacity 0.2s;
}
.hero-btn-primary:hover { opacity: 0.82; }
.hero-cta-secondary {
  display: inline-flex;
  align-items: center;
  height: var(--lb-btn-primary-h);
  gap: 0.375rem;
  padding: 0 1.25rem;
  font-size: var(--lb-btn-primary-fs);
  font-weight: 400;
  color: var(--vp-c-text-1) !important;
  background: var(--lb-btn-secondary-bg);
  border-radius: var(--lb-btn-secondary-radius);
  text-decoration: none !important;
  border: none;
  transition: background 0.2s, gap 0.2s;
}
.hero-cta-secondary:hover { background: rgba(200,200,200,0.8); gap: 0.625rem; }
:root.dark .hero-cta-secondary { color: var(--lb-btn-secondary-color) !important; }
:root.dark .hero-cta-secondary:hover { background: rgba(100,100,100,0.6); }
`

/** Simple flickering grid via canvas */
function FlickeringGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const SQUARE = 5
    const GAP = 10
    const FLICKER = 0.25
    const COLORS = [
      { color: '#a8b8be', weight: 91.5 },
      { color: '#ffe000', weight: 3 },
      { color: '#00dbb6', weight: 3 },
      { color: '#fc5200', weight: 2.5 },
    ]

    function pickColor() {
      const r = Math.random() * 100
      let acc = 0
      for (const c of COLORS) {
        acc += c.weight
        if (r <= acc) return c.color
      }
      return COLORS[0].color
    }

    let cells: { x: number; y: number; color: string; opacity: number; target: number }[] = []

    function init() {
      const W = canvas!.offsetWidth
      const H = canvas!.offsetHeight
      canvas!.width = W
      canvas!.height = H
      cells = []
      const step = SQUARE + GAP
      for (let x = 0; x < W; x += step) {
        for (let y = 0; y < H; y += step) {
          cells.push({ x, y, color: pickColor(), opacity: Math.random() * 0.5, target: Math.random() * 0.5 })
        }
      }
    }

    let raf: number
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (const c of cells) {
        if (Math.random() < FLICKER * 0.016) {
          c.target = Math.random() * 0.5
          c.color = pickColor()
        }
        c.opacity += (c.target - c.opacity) * 0.1
        ctx!.globalAlpha = c.opacity
        ctx!.fillStyle = c.color
        ctx!.beginPath()
        const r = SQUARE / 2
        ctx!.arc(c.x + r, c.y + r, r, 0, Math.PI * 2)
        ctx!.fill()
      }
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    const ro = new ResizeObserver(init)
    ro.observe(canvas)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return <canvas ref={canvasRef} className="hero-flicker-canvas" />
}

interface HeroSectionProps {
  locale: Locale
}

function localePath(locale: Locale, path: string) {
  if (locale === 'en') return path
  return `/${locale}${path}`
}

export function HeroSection({ locale }: HeroSectionProps) {
  const content = LOCALE[locale] ?? LOCALE.en
  const [productIndex, setProductIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setProductIndex((i) => (i + 1) % PRODUCTS.length), 3000)
    return () => clearInterval(id)
  }, [])

  const subtitleHtml = content.subtitle
    .replace(/\{skill\}/g, `<span class="hero-keyword">${content.keywords.skill}</span>`)
    .replace(/\{cli\}/g, `<span class="hero-keyword">${content.keywords.cli}</span>`)
    .replace(/\{mcp\}/g, `<span class="hero-keyword">${content.keywords.mcp}</span>`)
    .replace(/\{sdk\}/g, `<span class="hero-keyword">${content.keywords.sdk}</span>`)
    .replace(/\{openapi\}/g, `<span class="hero-keyword">${content.keywords.openapi}</span>`)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: HERO_CSS }} />
      <section data-lbus-component="hero-section" className="hero-section">
        <div className="hero-bg-wrapper">
          <div className="hero-bg-gradient" />
          <div className="hero-bg-flicker">
            <FlickeringGrid />
          </div>
          <div className="hero-bg-fade" />
        </div>

        <div className="hero-content">
          <h1 className="hero-title">
            {content.titlePrefix} <span className="hero-title-accent">{content.titleAccent}</span>
          </h1>

          <div className="hero-powering">
            <span className="hero-powering-label">{content.powering}</span>
            <span key={productIndex} className="hero-product-text">
              {PRODUCTS[productIndex]}
            </span>
          </div>

          <p className="hero-subtitle" dangerouslySetInnerHTML={{ __html: subtitleHtml }} />

          <div className="hero-cta">
            <a href={localePath(locale, '/dashboard')} className="hero-btn-primary">
              {content.cta.getStarted}
            </a>
            <a href="/docs/" className="hero-cta-secondary">
              {content.cta.readDocs}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
