import { DefaultTheme } from 'vitepress'
import { genMarkdowDocs, SIDEBAR_ICONS_MAP } from '../../theme/utils/gen'

const lang = 'zh-CN'
const docsSidebar = genMarkdowDocs(lang, 'docs', { exclude: ['cli'] })
const cliSidebar = genMarkdowDocs(lang, 'docs/cli')

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
  const apiRefItem: DefaultTheme.SidebarItem = {
    text: `<span class="sidebar-item-icon">${SIDEBAR_ICONS_MAP.book}</span>API 参考`,
    link: `/${lang}/docs/api`,
    target: '_blank',
  }
  const items = docsSidebar().filter((item) => {
    const link = typeof item.link === 'string' ? item.link : ''
    return !link.endsWith('/mcp') && !link.endsWith('/docs/api')
  })
  const llmIdx = items.findIndex((item) => typeof item.link === 'string' && item.link.endsWith('/llm'))
  if (llmIdx !== -1) {
    items.splice(llmIdx + 1, 0, apiRefItem)
  } else {
    items.push(apiRefItem)
  }
  return items
}

export const sidebar: DefaultTheme.Sidebar = {
  [`/${lang}/docs/cli`]: buildCliSidebar(),
  [`/${lang}/docs`]: buildDocsSidebar(),
}
