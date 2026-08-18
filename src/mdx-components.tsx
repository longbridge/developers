/**
 * mdx-components.tsx
 *
 * Central registry of all custom MDX components used across English, zh-CN,
 * and zh-HK doc pages. Pass `components={mdxComponents}` to every <Content />
 * call in the dynamic route files.
 *
 * Task 11 exports: 7 primitives + 6 T12 placeholders.
 */

import { Tabs, TabItem, TipContainer, CliCommand, SDK, SDKLinks, Skill } from '@longbridge/openapi-ui'

// T12 stubs — keep imports so mdx-components.tsx compiles even before T12 ships
import { TryIt } from '@/components/mdx/placeholders/TryIt'
import { McpTools } from '@/components/mdx/placeholders/McpTools'
import { NewHomePage } from '@/components/mdx/placeholders/NewHomePage'
import { Pricing } from '@/components/mdx/placeholders/Pricing'
import { QuotePermission } from '@/components/mdx/placeholders/QuotePermission'
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
  Skill,

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
