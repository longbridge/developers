/**
 * mdx-components.tsx
 *
 * Central registry of all custom MDX components used across English, zh-CN,
 * and zh-HK doc pages. Pass `components={mdxComponents}` to every <Content />
 * call in the dynamic route files.
 *
 * Task 11 exports: 7 primitives + 6 T12 placeholders.
 */

import { Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks } from '@longbridge/openapi-ui'
import { SkillCatalog } from '@/components/mdx/SkillCatalog'

// TryIt — ported from legacy openapi-website (§S7)
import { TryIt } from '@longbridge/openapi-tryit'
import { McpTools } from '@/components/mdx/McpTools'
import { NewHomePage } from '@longbridge/openapi-homepage'
import { Pricing } from '@/components/mdx/Pricing'
import { QuotePermission } from '@/components/mdx/QuotePermission'
// ApiReference is mounted directly by ApiReferenceLayout.astro from
// `@longbridge/openapi-api-reference`; it's not needed here as an mdx tag.
import { QuantChart } from '@/components/mdx/placeholders/QuantChart'
import { Footer } from '@/components/mdx/placeholders/Footer'

export const mdxComponents = {
  // ── primitives ──────────────────────────────
  Tabs,
  TabItem,
  TipContainer,
  CliCommand,
  SDK,
  SDKLinks,
  Skill: SkillCatalog,

  // ── T12 placeholders ────────────────────────
  TryIt,
  McpTools,
  NewHomePage,
  Pricing,
  QuotePermission,
  QuantChart,
  Footer,
} as const

export type MdxComponents = typeof mdxComponents
