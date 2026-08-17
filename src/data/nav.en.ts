export interface NavItem {
  text: string
  link?: string
  items?: NavItem[]
  activeMatch?: string
}

export const nav: NavItem[] = [
  { text: 'Pricing', link: '/pricing', activeMatch: '^(/en)?/pricing' },
  { text: 'Skill', link: '/skill', activeMatch: '^(/en)?/skill' },
  { text: 'CLI', link: '/docs/cli', activeMatch: '^(/en)?/docs/cli' },
  { text: 'MCP', link: '/docs/mcp', activeMatch: '^(/en)?/docs/mcp' },
  { text: 'Docs', link: '/docs', activeMatch: '^(/en)?/docs(?!/cli)(?!/api)(?!/mcp)' },
]
