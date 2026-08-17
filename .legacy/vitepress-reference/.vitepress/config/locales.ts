import type { DefaultTheme, LocaleConfig } from 'vitepress'
import { enConfig } from '../locales/en'
import { zhCNConfig } from '../locales/zh-CN'
import { zhHKConfig } from '../locales/zh-HK'

export const localesConfig: LocaleConfig<DefaultTheme.Config> = {
  'zh-CN': {
    label: '简体中文',
    lang: 'zh-CN',
    ...zhCNConfig,
  },
  'zh-HK': {
    label: '繁體中文',
    lang: 'zh-HK',
    ...zhHKConfig,
  },
  root: {
    label: 'English',
    lang: 'en-US',
    ...enConfig,
  },
}
