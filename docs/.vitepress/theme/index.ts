// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import './style/tailwind.css'
import './style/index.css'
import 'virtual:group-icons.css' //代码组样式
import 'virtual:uno.css'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhCN from './locales/zh-CN.json'
import zhHK from './locales/zh-HK.json'
import { getCurrentLanguage } from './utils/i18n'
/** Layouts */
import Layout from './layouts/Layout.vue'
/** auto import components */
import * as components from './components'

const i18n = createI18n<[typeof en, typeof zhCN, typeof zhHK], 'en' | 'zh-CN' | 'zh-HK'>({
  locale: getCurrentLanguage(),
  legacy: false,
  messages: {
    en: en,
    'zh-CN': zhCN,
    'zh-HK': zhHK,
  },
})

function saveInviteCodeFromUrl() {
  const inviteCode = new URLSearchParams(window.location.search).get('invite-code')
  if (inviteCode) {
    const expires = new Date()
    expires.setDate(expires.getDate() + 7)
    document.cookie = `invite-code=${encodeURIComponent(inviteCode)};expires=${expires.toUTCString()};path=/;SameSite=Lax`
  }
}

export default {
  Layout,
  async enhanceApp({ app, router }) {
    app.use(i18n)
    if (!import.meta.env.SSR) {
      const FloatingVue = await import('floating-vue')
      await import('floating-vue/dist/style.css')
      app.use(FloatingVue.default)
      saveInviteCodeFromUrl()
      router.onAfterRouteChange = saveInviteCodeFromUrl
    }
    for (const component of Object.keys(components)) {
      app.component(component, components[component])
    }
  },
} satisfies Theme
