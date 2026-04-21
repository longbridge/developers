import type { DefaultTheme } from 'vitepress'
import { filterNavItems } from '../../region-utils'

export const nav = (): DefaultTheme.NavItem[] => {
  return filterNavItems([
    { text: 'Home', link: '/', activeMatch: '^(/en)?/$' },
    { text: 'Skill', link: '/skill', activeMatch: '^(/en)?/skill' },
    { text: 'Docs', link: '/docs', activeMatch: '^(/en)?/docs(?!/cli)(?!/api)' },
    { text: 'CLI', link: '/docs/cli', activeMatch: '^(/en)?/docs/cli' },
    { text: 'MCP', link: '/docs/mcp', activeMatch: '^(/en)?/docs/mcp' },
    { text: 'API Reference', link: '/docs/api', activeMatch: '^(/en)?/docs/api' },
    { text: 'SDK', link: '/sdk', activeMatch: '^(/en)?/sdk' },
    { text: 'Feedback', link: 'https://github.com/longbridge/developers/issues', target: '_blank' },
  ])
}
