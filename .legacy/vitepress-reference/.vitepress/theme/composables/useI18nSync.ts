import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useData } from 'vitepress'

export function useI18nSync() {
  const { lang } = useData()
  const i18n = useI18n()

  // 同步 VitePress 的语言设置和 vue-i18n 的 locale
  watchEffect(() => {
    if (lang.value !== i18n.locale.value) {
      i18n.locale.value = lang.value
    }
  })

  return {
    lang,
    locale: i18n.locale,
  }
}
