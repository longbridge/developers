import { watch } from 'vue'
import { useData } from 'vitepress'

export function useLbDarkSync() {
  const { isDark } = useData()
  watch(isDark, (dark) => {
    document.documentElement.classList.toggle('lb-dark', dark)
  }, { immediate: true })
}
