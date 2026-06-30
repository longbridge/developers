// Helora 客服 SDK 的全局类型声明
// 脚本通过 <script> 注入 window.Helora，需要给 TS 一个最小的形状
// cSpell:words Helora helora

interface HeloraHeaderAction {
  id: string
  label: string
  icon?: string
  intent?: 'event' | 'link' | string
}

interface HeloraBootConfig {
  proxy: 'prod' | 'staging'
  guest?: boolean
  configPlatform: 'web' | string
  configKey: string
  source?: string
  locale?: 'zh-CN' | 'zh-HK' | 'en'
  /** 初始主题：对象形态，`mode` 走明暗，`color` 为 legacy 快捷主题色 */
  theme?: { mode?: 'system' | 'light' | 'dark'; color?: string }
  headerActions?: HeloraHeaderAction[]
  [key: string]: unknown
}

interface HeloraSDK {
  boot: (config: HeloraBootConfig) => void
  /** 完整主题 patch（对象） */
  setTheme?: (theme: { mode?: 'system' | 'light' | 'dark'; color?: string }) => void
  /** 明暗模式热切换（字符串薄封装，= setTheme({ mode })） */
  setThemeMode?: (mode: 'light' | 'dark') => void
  /** locale 热切换，不重载 iframe */
  setLocale?: (locale: 'zh-CN' | 'zh-HK' | 'en') => void
  /** 订阅运行时事件，返回取消函数 */
  on?: (event: string, handler: (payload: any) => void) => () => void
}

declare global {
  interface Window {
    Helora?: HeloraSDK
  }
}

export {}
