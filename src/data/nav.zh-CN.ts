import type { NavItem } from './nav.en'

export const nav: NavItem[] = [
  { text: '定价', link: '/zh-CN/pricing', activeMatch: '^/zh-CN/pricing' },
  { text: 'Skill', link: '/zh-CN/skill', activeMatch: '^/zh-CN/skill' },
  { text: 'CLI', link: '/zh-CN/docs/cli', activeMatch: '^/zh-CN/docs/cli' },
  { text: 'MCP', link: '/zh-CN/docs/mcp', activeMatch: '^/zh-CN/docs/mcp' },
  { text: '文档', link: '/zh-CN/docs', activeMatch: '^/zh-CN/docs(?!/cli)(?!/api)(?!/mcp)' },
]
