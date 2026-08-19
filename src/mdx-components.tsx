/**
 * mdx-components.tsx
 *
 * Central registry of all custom MDX components used across English, zh-CN,
 * and zh-HK doc pages. Pass `components={buildMdxComponents(locale)}` to every
 * <Content /> call in the dynamic route files — the factory closes over the
 * route's locale so components that need it (NewHomePage, McpTools, Pricing,
 * QuotePermission, SkillCatalog) render in the right language at SSR time.
 */

import type { Locale } from '@longbridge/openapi-utils'
import { Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks } from '@longbridge/openapi-ui'
import { SkillCatalog } from '@/components/mdx/SkillCatalog'
import { TryIt } from '@longbridge/openapi-tryit'
import { McpTools } from '@/components/mdx/McpTools'
import { NewHomePage } from '@longbridge/openapi-homepage'
import { Pricing } from '@/components/mdx/Pricing'
import { QuotePermission } from '@/components/mdx/QuotePermission'
// ApiReference is mounted directly by ApiReferenceLayout.astro from
// `@longbridge/openapi-api-reference`; it's not needed here as an mdx tag.
import { QuantChart } from '@/components/mdx/placeholders/QuantChart'
import { Footer } from '@/components/mdx/placeholders/Footer'

/**
 * Build the mdx-component map for a given locale. mdx `<Foo />` tags render
 * server-side without hydration (they are not Astro client islands), so any
 * component that needs to display locale-dependent text must have its locale
 * bound at SSR time — this factory does that binding via closures.
 */
export function buildMdxComponents(locale: Locale) {
  const bindLocale = <P extends { locale?: Locale }>(Component: React.ComponentType<P>) =>
    (props: P) => <Component {...props} locale={props.locale ?? locale} />

  return {
    // Primitives — no locale dependency
    Tabs,
    TabItem,
    TipContainer,
    CliCommand,
    SDK,
    SDKLinks,

    // Locale-bound composites
    Skill: bindLocale(SkillCatalog),
    NewHomePage: bindLocale(NewHomePage),
    McpTools: bindLocale(McpTools),
    Pricing: bindLocale(Pricing),
    QuotePermission: bindLocale(QuotePermission),
    TryIt: bindLocale(TryIt),

    // Placeholders (still stubbed)
    QuantChart,
    Footer,
  } as const
}

/** Convenience alias for existing en-only callers. Prefer buildMdxComponents. */
export const mdxComponents = buildMdxComponents('en')

export type MdxComponents = ReturnType<typeof buildMdxComponents>
