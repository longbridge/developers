import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (lang: string): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { text: '首页', link: `/${lang}/`, activeMatch: `^/${lang}/$` },
    { text: 'Skill', link: `/${lang}/skill`, activeMatch: `^/${lang}/skill` },
    { text: 'CLI', link: `/${lang}/docs/cli`, activeMatch: `^/${lang}/docs/cli` },
    { text: 'MCP', link: `/${lang}/docs/mcp`, activeMatch: `^/${lang}/docs/mcp` },
    { text: '文档', link: `/${lang}/docs`, activeMatch: `^/${lang}/docs(?!/cli)(?!/api)(?!/mcp)` },
    { text: 'API 参考', link: `/${lang}/docs/api`, activeMatch: `^/${lang}/docs/api` },
    { text: 'SDK', link: `/${lang}/sdk`, activeMatch: `^/${lang}/sdk` },
    { text: 'Feedback', link: 'https://github.com/longbridge/developers/issues', target: '_blank' },
  ])
}
