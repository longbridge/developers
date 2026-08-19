import React, { useState, useEffect } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { HeroSection } from './sections/HeroSection'
import { ProductSkill } from './sections/ProductSkill'
import { ProductCLI } from './sections/ProductCLI'
import { ProductMCP } from './sections/ProductMCP'
import { ProductOpenAPI } from './sections/ProductOpenAPI'
import { PlatformStats } from './sections/PlatformStats'
import { ArchSection } from './sections/ArchSection'
import { CoreFeaturesSection } from './sections/CoreFeaturesSection'
import { MarketCoverage } from './sections/MarketCoverage'
import { CapSection } from './sections/CapSection'
import { GetStarted } from './sections/GetStarted'
import { HomepageFooter } from './sections/HomepageFooter'
import './homepage.css'

interface NewHomePageProps {
  locale?: Locale
}

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  // Prefer <html lang="…"> which BaseLayout stamps from the route locale;
  // fall back to pathname prefix.
  const htmlLang = document.documentElement.lang
  if (htmlLang === 'zh-CN' || htmlLang === 'zh-HK') return htmlLang
  const p = window.location.pathname
  if (p.startsWith('/zh-CN')) return 'zh-CN'
  if (p.startsWith('/zh-HK')) return 'zh-HK'
  return 'en'
}

export function NewHomePage({ locale: propsLocale }: NewHomePageProps) {
  const [locale, setLocale] = useState<Locale>(propsLocale ?? 'en')
  // MDX cannot thread a locale prop through <Content components={...}>, so
  // detect from window.location on client hydration if none passed.
  useEffect(() => {
    if (!propsLocale) setLocale(detectLocale())
  }, [propsLocale])
  return (
    <div data-lbus-component="new-home-page" className="new-home-page">
      <HeroSection locale={locale} />
      <ProductSkill locale={locale} />
      <ProductCLI locale={locale} />
      <ProductMCP locale={locale} />
      <ProductOpenAPI locale={locale} />
      <PlatformStats locale={locale} />
      <ArchSection locale={locale} />
      <CoreFeaturesSection locale={locale} />
      <MarketCoverage locale={locale} />
      <CapSection locale={locale} />
      <GetStarted locale={locale} />
      <HomepageFooter locale={locale} />
    </div>
  )
}
