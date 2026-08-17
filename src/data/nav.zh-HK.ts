import type { NavItem } from './nav.en'

export const nav: NavItem[] = [
  { text: '定價', link: '/zh-HK/pricing', activeMatch: '^/zh-HK/pricing' },
  { text: 'Skill', link: '/zh-HK/skill', activeMatch: '^/zh-HK/skill' },
  { text: 'CLI', link: '/zh-HK/docs/cli', activeMatch: '^/zh-HK/docs/cli' },
  { text: 'MCP', link: '/zh-HK/docs/mcp', activeMatch: '^/zh-HK/docs/mcp' },
  { text: '文檔', link: '/zh-HK/docs', activeMatch: '^/zh-HK/docs(?!/cli)(?!/api)(?!/mcp)' },
]
