import { DefaultTheme } from 'vitepress'

export const search: DefaultTheme.LocalSearchOptions = {
  translations: {
    button: {
      buttonText: '搜尋文檔',
      buttonAriaLabel: '搜尋文檔',
    },
    modal: {
      displayDetails: '顯示詳情',
      resetButtonTitle: '清除查詢條件',
      backButtonTitle: '返回',
      noResultsText: '無法找到相關結果',
      footer: {
        selectText: '選擇',
        navigateText: '切換',
        closeText: '關閉',
      },
    },
  },
}
