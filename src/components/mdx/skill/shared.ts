import type { Locale } from '@longbridge/openapi-utils'

// Shared bits for the Skill page sections (1:1 port of the legacy VitePress
// `Skill.vue`). Kept tiny on purpose: only what more than one section needs.

/**
 * Legacy `theme/utils/region.ts` resolved this from VITE_SITE_HOSTNAME at
 * runtime. Here the global hostname is the source of truth and the
 * region-hostname-rewrite integration (src/integrations/) swaps it for the
 * regional site in the built output, so a literal is both correct and what
 * the rewrite pairs match on.
 */
export const siteHostname = 'https://open.longbridge.com'

export const CHATGPT_APP_URL = 'https://chatgpt.com/apps/longbridge/asdk_app_6a2baf2fad748191812393c3e00308ef'
export const CLAUDE_CONNECTOR_URL = 'https://claude.ai/directory/connectors/longbridge'

/** Legacy `localePfx`: '' for en, '/zh-CN' / '/zh-HK' otherwise. */
export function localePfx(locale: Locale): string {
  if (locale === 'zh-CN') return '/zh-CN'
  if (locale === 'zh-HK') return '/zh-HK'
  return ''
}
