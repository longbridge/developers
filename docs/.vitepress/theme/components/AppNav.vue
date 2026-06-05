<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import { useData, useRoute } from 'vitepress'
import { useI18n } from 'vue-i18n'
import endsWith from 'lodash/endsWith'
import { useLocalePath, getBasenameLocale } from '../utils/i18n'
import { createLoginRedirectPath } from '../utils/navigate'
import { isLoginState, initLoginState } from '../composables/useLoginState'
import { useAvatar } from './UserAvatar/uesAvatar'
import UserAvatarIcon from './UserAvatar/UserAvatarIcon.vue'
import UserAvatarDropdown from './UserAvatar/UserAvatarDropdown.vue'
import FeaturesMenu from './FeaturesMenu.vue'

const VPNavBarSearch = defineAsyncComponent(
  () => import('vitepress/dist/client/theme-default/components/VPNavBarSearch.vue')
)

const { isDark } = useData()
const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()

const currentPath = computed(() => {
  route.path // reactive dependency
  if (typeof window === 'undefined') return ''
  const cur = getBasenameLocale()
  const path = window.location.pathname
  return cur ? path.replace(`/${cur}`, '') || '/' : path
})

function isNavActive(href: string): boolean {
  const path = currentPath.value
  if (href === '/docs') {
    return (
      (path === '/docs' || path.startsWith('/docs/')) && !path.startsWith('/docs/cli') && !path.startsWith('/docs/mcp')
    )
  }
  return path === href || path.startsWith(href + '/')
}

const langOpen = ref(false)
const mobileOpen = ref(false)

const APP_NAV_DEF = [
  { key: 'pricing', tKey: 'nav.pricing', href: '/pricing' },
  { key: 'skill', tKey: null, label: 'Skill', href: '/skill' },
  { key: 'cli', tKey: null, label: 'CLI', href: '/docs/cli' },
  { key: 'mcp', tKey: null, label: 'MCP', href: '/docs/mcp' },
  { key: 'docs', tKey: 'nav.docs', href: '/docs' },
]

const isCnDomain = import.meta.env.VITE_REGION === 'cn'

const CN_HIDDEN_KEYS = new Set(['pricing', 'docs', 'features'])

const navLinks = computed(() =>
  APP_NAV_DEF.filter((n) => !isCnDomain || !CN_HIDDEN_KEYS.has(n.key)).map((n) => ({
    ...n,
    label: n.tKey ? t(n.tKey) : n.label!,
  }))
)

const currentLocale = computed(() => {
  if (typeof window === 'undefined') return 'en'
  return getBasenameLocale() || 'en'
})

const langLabels: Record<string, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-HK': '繁體中文',
}

function switchLocale(locale: string) {
  if (typeof window === 'undefined') return
  const path = window.location.pathname
  const cur = getBasenameLocale()
  if (cur) {
    const newPath = locale === 'en' ? path.replace(`/${cur}`, '') || '/' : path.replace(`/${cur}`, `/${locale}`)
    window.location.href = newPath
  } else {
    window.location.href = locale === 'en' ? path : `/${locale}${path}`
  }
}

function toggleTheme(_e: MouseEvent) {
  isDark.value = !isDark.value
}

// Login / avatar
const isLogin = isLoginState
const loginUrl = computed(() => createLoginRedirectPath())
const { avatar } = useAvatar()
const avatarOpen = ref(false)
const avatarEl = ref<HTMLElement>()
const avatarCloseTimer = ref<ReturnType<typeof setTimeout> | null>(null)

const avatarMenuItems = computed(() => [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Connect AI', href: '/connect' },
  { title: 'Log out', href: '/log-out' },
])

function onAvatarMouseEnter() {
  if (avatarCloseTimer.value) {
    clearTimeout(avatarCloseTimer.value)
    avatarCloseTimer.value = null
  }
  avatarOpen.value = true
}
function onAvatarMouseLeave() {
  avatarCloseTimer.value = setTimeout(() => {
    avatarOpen.value = false
  }, 150)
}
function onAvatarClickOutside(e: Event) {
  if (avatarEl.value && !avatarEl.value.contains(e.target as Node)) avatarOpen.value = false
}

function openSearch() {
  const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent)
  document.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'k', metaKey: isMac, ctrlKey: !isMac, bubbles: true, cancelable: true })
  )
}

onMounted(() => {
  initLoginState()
  document.addEventListener('click', onAvatarClickOutside)

  if (!isCnDomain) {
    const swSrc = 'https://assets.lbkrs.com/h5hub/support-widget/support-widget-1.0.7.iife.js'
    const isProd = !endsWith(location.hostname, '.xyz') && !import.meta.env.DEV
    window.SupportWidgetConfig = {
      isLoggedIn: function () {
        return isLogin.value
      },
      loginUrl: createLoginRedirectPath({ sw_open: '1' }),
      proxy: isProd ? 'prod' : 'staging',
    }
    if (!document.querySelector(`script[src="${swSrc}"]`)) {
      const script = document.createElement('script')
      script.src = swSrc
      script.async = true
      document.head.appendChild(script)
    }
  }
})
onUnmounted(() => {
  document.removeEventListener('click', onAvatarClickOutside)
  if (avatarCloseTimer.value) clearTimeout(avatarCloseTimer.value)
})
</script>

<template>
  <nav class="app-nav">
    <div class="app-nav-inner">
      <!-- Brand -->
      <a :href="localePath('/')" class="app-brand" aria-label="Longbridge Developers">
        <img
          class="brand-logo brand-logo-light"
          src="https://assets.lbkrs.com/uploads/e76f6d93-80f8-4f9b-8b8d-2c86f0c94a78/longbridge-developers-light.png"
          alt="Longbridge Developers"
          style="height: 30px" />
        <img
          class="brand-logo brand-logo-dark"
          src="https://assets.lbkrs.com/uploads/37a18fa4-46a4-408c-a36a-560004eb3cfb/longbridge-developers-dark.png"
          alt="Longbridge Developers"
          style="height: 30px" />
      </a>

      <!-- Desktop nav links -->
      <div class="app-nav-links">
        <FeaturesMenu v-if="!isCnDomain" />
        <a v-for="n in navLinks" :key="n.key" :href="localePath(n.href)" :class="{ 'is-active': isNavActive(n.href) }">
          {{ n.label }}
        </a>
      </div>

      <!-- Nav tail -->
      <div class="app-nav-tail">
        <!-- Search -->
        <button type="button" class="app-nav-search" @click="openSearch" aria-label="Search docs">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          {{ t('nav.searchDocs') }}
          <span class="app-nav-search-kbd">⌘K</span>
        </button>

        <!-- Language dropdown -->
        <div class="nav-lang-wrap" @mouseenter="langOpen = true" @mouseleave="langOpen = false">
          <button class="app-nav-icon-btn" aria-label="Language">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20a15 15 0 0 1 0-20z" />
            </svg>
          </button>
          <Transition name="dropdown">
            <div v-if="langOpen" class="nav-lang-menu">
              <a :class="{ 'is-active': currentLocale === 'en' }" @click.prevent="switchLocale('en')" href="#"
                >English</a
              >
              <a :class="{ 'is-active': currentLocale === 'zh-CN' }" @click.prevent="switchLocale('zh-CN')" href="#"
                >简体中文</a
              >
              <a :class="{ 'is-active': currentLocale === 'zh-HK' }" @click.prevent="switchLocale('zh-HK')" href="#"
                >繁體中文</a
              >
            </div>
          </Transition>
        </div>

        <!-- Theme toggle -->
        <button class="app-nav-icon-btn hidden md:grid" @click="toggleTheme" aria-label="Toggle theme">
          <!-- sun (dark mode active → show sun to switch to light) -->
          <svg
            v-if="isDark"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path
              d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <!-- moon (light mode → show moon) -->
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <!-- GitHub -->
        <a
          class="app-nav-icon-btn hidden md:grid"
          href="https://github.com/longbridge/developers"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round">
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>

        <!-- Logged-in: Dashboard + Avatar -->
        <ClientOnly>
          <template v-if="isLogin">
            <a class="btn btn-ghost btn-sm hidden md:inline-flex" target="_self" href="/dashboard">{{
              t('nav.dashboard')
            }}</a>
            <div
              ref="avatarEl"
              class="app-nav-avatar"
              @mouseenter="onAvatarMouseEnter"
              @mouseleave="onAvatarMouseLeave">
              <button
                type="button"
                class="app-nav-avatar-btn"
                :aria-expanded="avatarOpen"
                @click="avatarOpen = !avatarOpen">
                <UserAvatarIcon :src="avatar" size="sm" />
              </button>
              <div class="app-nav-avatar-menu" :class="{ 'is-open': avatarOpen }">
                <UserAvatarDropdown :list="avatarMenuItems" v-model:open="avatarOpen" />
              </div>
            </div>
          </template>
          <!-- Not logged in: Get Started -->
          <a v-else class="btn btn-primary btn-sm" target="_self" :href="loginUrl">
            {{ t('nav.getStarted') }}
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </ClientOnly>

        <!-- Mobile menu toggle -->
        <button class="app-nav-icon-btn app-nav-mobile-menu" @click="mobileOpen = !mobileOpen" aria-label="Menu">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="mobileOpen" class="app-nav-mobile">
        <FeaturesMenu v-if="!isCnDomain" :screenMenu="true" />
        <a v-for="n in navLinks" :key="n.key" :href="localePath(n.href)" @click="mobileOpen = false">
          {{ n.label }}
        </a>
        <a :href="localePath('/')" @click="mobileOpen = false">{{ t('nav.home') }}</a>
      </div>
    </Transition>

    <!-- Hidden VPNavBarSearch: provides ⌘K search modal without VPNav -->
    <ClientOnly>
      <div
        style="position: absolute; width: 0; height: 0; overflow: hidden; visibility: hidden; pointer-events: none"
        aria-hidden="true">
        <VPNavBarSearch />
      </div>
    </ClientOnly>
  </nav>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.15s,
    transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.app-nav-mobile {
  display: none;
  flex-direction: column;
  gap: 0;
  padding: 8px 16px 16px;
  border-top: 1px solid var(--lb-stroke);
  background: var(--lb-bg-1);
}

.app-nav-mobile a {
  display: block;
  padding: 10px 0;
  font-size: 15px;
  color: var(--lb-fg-1);
  text-decoration: none;
  border-bottom: 1px solid var(--lb-stroke);
}

.app-nav-mobile-menu {
  justify-content: center;
  display: none;
}

@media (max-width: 768px) {
  .app-nav-mobile {
    display: flex;
  }
  .app-nav-mobile-menu {
    display: inline-flex;
  }
  .app-nav-links {
    display: none;
  }
  .app-nav-search {
    display: none;
  }
  /* Shrink logo on mobile to reclaim space */
  :deep(.brand-logo) {
    height: 22px !important;
  }
}

.app-nav-avatar {
  position: relative;
  display: flex;
  align-items: center;
}
.app-nav-avatar-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.app-nav-avatar-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.15s,
    visibility 0.15s;
  z-index: 100;
}
.app-nav-avatar-menu.is-open {
  opacity: 1;
  visibility: visible;
}
</style>
