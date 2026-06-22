import { ref, onMounted } from 'vue'

// cspell:ignore lbcommitid
const isWhaleAppReg = /lbcommitid/i

export function detectWhaleApp(ua?: string): boolean {
  if (typeof navigator === 'undefined' && !ua) return false
  return isWhaleAppReg.test(ua ?? navigator.userAgent ?? '')
}

export function useWhaleApp() {
  const isWhaleApp = ref(false)

  onMounted(() => {
    isWhaleApp.value = detectWhaleApp()
  })

  return { isWhaleApp }
}
