import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (lang: string): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { component: 'FeaturesMenu' } as DefaultTheme.NavItem,
    { text: '定价', link: `/${lang}/pricing`, activeMatch: `^/${lang}/pricing` },
    { text: 'Skill', link: `/${lang}/skill`, activeMatch: `^/${lang}/skill` },
    { text: 'CLI', link: `/${lang}/docs/cli`, activeMatch: `^/${lang}/docs/cli` },
    { text: 'MCP', link: `/${lang}/docs/mcp`, activeMatch: `^/${lang}/docs/mcp` },
    { text: '文档', link: `/${lang}/docs`, activeMatch: `^/${lang}/docs(?!/cli)(?!/api)(?!/mcp)` },
  ])
}
