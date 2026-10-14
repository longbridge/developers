import { useState, useEffect } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
// Section order mirrors the legacy VitePress homepage (NewHomePage/index.vue)
// 1:1: hero → channels → features → cli → ai skill → mcp → api caps → sdk →
// get started → cta. The site footer is rendered by the layout, as in legacy.
import { HeroSection } from './sections/HeroSection'
import { ChannelsSection } from './sections/ChannelsSection'
import { FeaturesSection } from './sections/FeaturesSection'
import { CliSpotlightSection } from './sections/CliSpotlightSection'
import { AiSkillSection } from './sections/AiSkillSection'
import { McpSection } from './sections/McpSection'
import { ApiCapabilitiesSection } from './sections/ApiCapabilitiesSection'
import { SdkSection } from './sections/SdkSection'
import { GetStartedSection } from './sections/GetStartedSection'
import { CtaSection } from './sections/CtaSection'
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
      <ChannelsSection locale={locale} />
      <FeaturesSection locale={locale} />
      <CliSpotlightSection locale={locale} />
      <AiSkillSection locale={locale} />
      <McpSection locale={locale} />
      <ApiCapabilitiesSection locale={locale} />
      <SdkSection locale={locale} />
      <GetStartedSection locale={locale} />
      <CtaSection locale={locale} />
    </div>
  )
}
