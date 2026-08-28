/**
 * mdx-components.tsx
 *
 * Central registry of all custom MDX components used across English, zh-CN,
 * and zh-HK doc pages. Pass `components={buildMdxComponents(locale)}` to every
 * <Content /> call in the dynamic route files — the factory closes over the
 * route's locale so components that need it (NewHomePage, McpTools, Pricing,
 * QuotePermission, SkillPage) render in the right language at SSR time.
 */

import type { Locale } from '@longbridge/openapi-utils'
import { Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks } from '@longbridge/openapi-ui'
import { SkillPage } from '@/components/mdx/SkillPage'
import { TryIt } from '@longbridge/openapi-tryit'
import { McpTools } from '@/components/mdx/McpTools'
import { NewHomePage } from '@longbridge/openapi-homepage'
import { Pricing } from '@/components/mdx/Pricing'
import { QuotePermission } from '@/components/mdx/QuotePermission'
import { getCliDocHref } from '@/lib/cli-doc-map'
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
    SDK,
    SDKLinks,

    // CliCommand needs locale for its "Install CLI" link, and a resolved
    // command-specific "CLI Usage Docs" (book) deep-link — derived from the
    // first command's subcommand (e.g. `longbridge financial-report …` →
    // /docs/cli/fundamentals/financial-report), matching legacy.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CliCommand: (props: any) => {
      const code: string = typeof props.code === 'string' ? props.code : ''
      const firstCmd = code
        .split('\n')
        .map((l) => l.trim())
        .find((l) => l && !l.startsWith('#'))
      const toks = firstCmd ? firstCmd.split(/\s+/) : []
      const sub = toks[0] === 'longbridge' || toks[0] === 'lb' ? toks[1] : undefined
      const docHref = sub ? getCliDocHref(sub, locale) : null
      return (
        <CliCommand {...props} locale={props.locale ?? locale} docHref={docHref ?? undefined} />
      )
    },

    // Locale-bound composites
    Skill: bindLocale(SkillPage),
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
