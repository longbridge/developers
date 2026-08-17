import { onMounted, watch } from 'vue'
import { useData } from 'vitepress'
import { detectWhaleApp, getThemeModeByUA } from './useWhaleApp'

export function useLbDarkSync() {
  const { isDark } = useData()
  const sync = (dark: boolean) => document.documentElement.classList.toggle('lb-dark', dark)
  onMounted(() => {
    // whale app 环境下，初始主题以 UA 中的 lbtheme/<mode> 为准 (cspell:ignore lbtheme)
    if (detectWhaleApp()) {
      const mode = getThemeModeByUA()
      if (mode === 'dark' || mode === 'light') {
        isDark.value = mode === 'dark'
      }
    }
    sync(isDark.value)
  })
  watch(
    () => isDark.value,
    (dark) => sync(dark)
  )
}
