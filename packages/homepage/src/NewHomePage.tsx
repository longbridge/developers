import React from 'react'
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
  locale: Locale
}

export function NewHomePage({ locale }: NewHomePageProps) {
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
