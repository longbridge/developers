import { DefaultTheme } from 'vitepress'

export const search: DefaultTheme.LocalSearchOptions = {
  translations: {
    button: {
      buttonText: '搜索文档',
      buttonAriaLabel: '搜索文档',
    },
    modal: {
      displayDetails: '显示详情',
      resetButtonTitle: '清除查询条件',
      backButtonTitle: '返回',
      noResultsText: '无法找到相关结果',
      footer: {
        selectText: '选择',
        navigateText: '切换',
        closeText: '关闭',
      },
    },
  },
}
