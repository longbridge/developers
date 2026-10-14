import type { Locale } from '@longbridge/openapi-utils'
import './Skill.css'
import { SkillHeroSection } from './skill/SkillHeroSection'
import { SkillDemoSection } from './skill/SkillDemoSection'
import { SkillCatalogSection } from './skill/SkillCatalogSection'
import { SkillCapSection } from './skill/SkillCapSection'
import { SkillCasesSection } from './skill/SkillCasesSection'
import { SkillGetStartedSection } from './skill/SkillGetStartedSection'

interface SkillPageProps {
  locale?: Locale
}

/**
 * The /skill page — 1:1 port of the legacy VitePress `Skill.vue`, split into
 * one component per section in legacy order. Rendered as a hydrated island
 * (`client:load`) from the `[...slug].astro` pages so the tabs, copy buttons,
 * and catalog modal work. `.skill-page-root` scopes Skill.css (the legacy
 * `<style scoped>` block) to this page.
 */
export function SkillPage({ locale = 'en' }: SkillPageProps) {
  return (
    <div data-lbus-component="skill-page" className="skill-page-root">
      <SkillHeroSection locale={locale} />
      <SkillDemoSection locale={locale} />
      <SkillCatalogSection locale={locale} />
      <SkillCapSection locale={locale} />
      <SkillCasesSection locale={locale} />
      <SkillGetStartedSection locale={locale} />
    </div>
  )
}
