import { ref, onMounted } from 'vue'

// cspell:ignore lbcommitid lbtheme
const isWhaleAppReg = /lbcommitid/i
const themeReg = /lbtheme\/(\S+)/

export function detectWhaleApp(ua?: string): boolean {
  if (typeof navigator === 'undefined' && !ua) return false
  return isWhaleAppReg.test(ua ?? navigator.userAgent ?? '')
}

/**
 * 通过浏览器 UA 来获取主题信息（whale app 注入 `lbtheme/<mode>`）
 */
export function getThemeModeByUA(ua?: string): string {
  if (typeof navigator === 'undefined' && !ua) return ''
  const match = (ua ?? navigator.userAgent ?? '').match(themeReg) || []
  return match[1] || ''
}

export function useWhaleApp() {
  const isWhaleApp = ref(false)

  onMounted(() => {
    isWhaleApp.value = detectWhaleApp()
  })

  return { isWhaleApp }
}
