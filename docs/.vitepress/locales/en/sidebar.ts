import { DefaultTheme } from 'vitepress'
import { genMarkdowDocs, SIDEBAR_ICONS_MAP } from '../../theme/utils/gen'

const docsSidebar = genMarkdowDocs('en', 'docs', { exclude: ['cli'] })
const cliSidebar  = genMarkdowDocs('en', 'docs/cli')

function buildCliSidebar(): DefaultTheme.SidebarItem[] {
  const items = cliSidebar()
  const installIdx = items.findIndex((item) => typeof item.link === 'string' && item.link.includes('installation'))
  const githubItem: DefaultTheme.SidebarItem = {
    text: `<span class="sidebar-item-icon">${SIDEBAR_ICONS_MAP.github}</span>GitHub`,
    link: 'https://github.com/longbridge/longbridge-terminal',
  }
  if (installIdx !== -1) {
    items.splice(installIdx + 1, 0, githubItem)
  } else {
    items.push(githubItem)
  }
  return items
}

function buildDocsSidebar(): DefaultTheme.SidebarItem[] {
  return docsSidebar().filter((item) => {
    const link = typeof item.link === 'string' ? item.link : ''
    return !link.endsWith('/mcp')
  })
}

export const sidebar: DefaultTheme.Sidebar = {
  '/docs/cli': buildCliSidebar(),
  '/docs':     buildDocsSidebar(),
}
