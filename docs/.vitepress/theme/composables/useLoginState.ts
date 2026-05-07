import { ref } from 'vue'

const MOCK_KEY = '__mock_login'

export const isLoginState = ref(false)

export function initLoginState() {
  if (import.meta.env.DEV) {
    isLoginState.value = localStorage.getItem(MOCK_KEY) === 'true'
  } else {
    isLoginState.value = window.longportInternal?.isLogin() ?? false
  }
}

export function toggleMockLogin() {
  isLoginState.value = !isLoginState.value
  localStorage.setItem(MOCK_KEY, String(isLoginState.value))
}
