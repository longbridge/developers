/**
 * mdx-components.tsx
 *
 * Central registry of all custom MDX components used across English, zh-CN,
 * and zh-HK doc pages. Pass `components={mdxComponents}` to every <Content />
 * call in the dynamic route files.
 *
 * Task 11 exports: 7 primitives + 6 T12 placeholders.
 */

import { Tabs } from '@/components/mdx/Tabs'
import { TabItem } from '@/components/mdx/TabItem'
import { TipContainer } from '@/components/mdx/TipContainer'
import { CliCommand } from '@/components/mdx/CliCommand'
import { SDK } from '@/components/mdx/SDK'
import { SDKLinks } from '@/components/mdx/SDKLinks'
import { Skill } from '@/components/mdx/Skill'

// T12 stubs — keep imports so mdx-components.tsx compiles even before T12 ships
import { TryIt } from '@/components/mdx/placeholders/TryIt'
import { McpTools } from '@/components/mdx/placeholders/McpTools'
import { NewHomePage } from '@/components/mdx/placeholders/NewHomePage'
import { Pricing } from '@/components/mdx/placeholders/Pricing'
import { QuotePermission } from '@/components/mdx/placeholders/QuotePermission'
import { ApiReference } from '@/components/mdx/placeholders/ApiReference'

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
  ApiReference,
} as const

export type MdxComponents = typeof mdxComponents
