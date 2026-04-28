import type { DefaultTheme, LocaleSpecificConfig } from 'vitepress'
import { nav } from './nav'
import { search } from './search'
import { sidebar } from './sidebar'
import { logoLink } from '../../theme/utils/link'
export const zhHKConfig: LocaleSpecificConfig<DefaultTheme.Config> = {
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://assets.lbctrl.com/uploads/b510b04f-9238-4fe0-b39d-11e076876ac1/longbridge-og.png',
      },
    ],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:alt', content: 'Longbridge Developers' }],
    ['meta', { property: 'og:locale', content: 'zh-HK' }],
    ['meta', { property: 'og:site_name', content: 'Longbridge Developers' }],
  ],
  title: 'Longbridge Developers',
  description: '探索 Longbridge Developers，提供 API、LLM、MCP、CLI 等全方位開發資源，助力構建您的金融應用。',

  themeConfig: {
    logoLink: logoLink(),
    nav: nav('zh-HK'),
    sidebar: sidebar,
    search: {
      provider: 'local',
      options: search,
    },
    docFooter: {
      prev: '上一頁',
      next: '下一頁',
    },

    outline: {
      label: '頁面導航',
    },

    lastUpdated: {
      text: '最後更新於',
    },

    notFound: {
      title: '頁面未找到',
      quote: '但如果你不改變方向，並且繼續尋找，你可能最終會到達你所前往的地方。',
      linkLabel: '前往首頁',
      linkText: '帶我回首頁',
    },

    langMenuLabel: '多語言',
    returnToTopLabel: '回到頂部',
    sidebarMenuLabel: '菜單',
    darkModeSwitchLabel: '主題',
    lightModeSwitchTitle: '切換到淺色模式',
    darkModeSwitchTitle: '切換到深色模式',
    skipToContentLabel: '跳轉到內容',
  },
}
