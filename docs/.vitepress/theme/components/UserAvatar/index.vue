<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import UserAvatarIcon from './UserAvatarIcon.vue'
import Dropdown from './UserAvatarDropdown.vue'
import LoginButton from './LoginButton.vue'
import { localePath } from '../../utils/i18n'
import { createLoginRedirectPath } from '../../utils/navigate'
import { useI18n } from 'vue-i18n'
import { useAvatar } from './uesAvatar'
import endsWith from 'lodash/endsWith'

const { t } = useI18n()

const open = ref(false)
const el = ref<HTMLElement>()
const dropdownRef = ref<InstanceType<typeof Dropdown>>()
const closeTimer = ref<NodeJS.Timeout | null>(null)
const isLogin = ref(false)

onMounted(() => {
  isLogin.value = window.longportInternal.isLogin()

  const isProd = !endsWith(location.hostname, '.xyz')
  const loginUrl = createLoginRedirectPath({
    sw_open: '1',
  })
  window.SupportWidgetConfig = {
    isLoggedIn: function () {
      return isLogin.value
    },
    loginUrl,
    proxy: isProd ? 'prod' : 'staging',
  }

  const script = document.createElement('script')
  script.src = 'https://assets.lbkrs.com/h5hub/support-widget/support-widget-1.0.7.iife.js'
  script.async = true
  document.head.appendChild(script)
})

const { avatar } = useAvatar()
const list = computed<{ title: string; href: string }[]>(() => [
  {
    title: t('HD2WD-CgkkcJJW12yOmDM'),
    href: localePath('/account'),
  },
  {
    title: t('JJTHzcLZRxvS2W-2IwWMn'),
    href: localePath('/log-out'),
  },
])

const handleMouseEnter = () => {
  // 清除关闭定时器
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
  open.value = true
}

const handleMouseLeave = () => {
  // 延迟关闭菜单
  closeTimer.value = setTimeout(() => {
    open.value = false
  }, 150)
}

const handleClick = () => {
  open.value = !open.value
}

const handleClickOutside = (event: Event) => {
  if (el.value && !el.value.contains(event.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
  }
})
</script>

<template>
  <ClientOnly>
    <!-- 已登录状态：显示头像和下拉菜单 -->
    <div
      v-if="isLogin"
      ref="el"
      class="VPFlyout"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @focusin="open = true"
      @focusout="open = false">
      <button
        type="button"
        class="flex items-center w-8 h-8 py-3 button focus:outline-none focus:ring-2 focus:ring-offset-0"
        aria-haspopup="true"
        :aria-expanded="open"
        @click="handleClick">
        <UserAvatarIcon :src="avatar" size="sm" />
      </button>

      <div
        class="menu absolute top-[calc(var(--vp-nav-height)/2)] right-0 opacity-0 invisible transition-opacity duration-200">
        <Dropdown ref="dropdownRef" :list="list" v-model:open="open" />
      </div>
    </div>

    <!-- 未登录状态：显示登录按钮 -->
    <LoginButton v-else />
  </ClientOnly>
</template>

<style scoped>
.VPFlyout {
  display: flex;
  align-items: center;
  position: relative;
  margin-right: -8px;
}

@media (min-width: 768px) {
  .VPFlyout::before {
    margin: 0 16px;
    width: 1px;
    height: 24px;
    background-color: var(--vp-c-divider);
    content: '';
  }
}

.VPFlyout:hover {
  color: var(--vp-c-brand-1);
  transition: color 0.25s;
}

.VPFlyout:hover .text {
  color: var(--vp-c-text-2);
}

.VPFlyout:hover .icon {
  fill: var(--vp-c-text-2);
}

.VPFlyout.active .text {
  color: var(--vp-c-brand-1);
}

.VPFlyout.active:hover .text {
  color: var(--vp-c-brand-2);
}

.button[aria-expanded='false'] + .menu {
  opacity: 0;
  visibility: hidden;
  transform: translateY(0);
}

.VPFlyout:hover .menu,
.button[aria-expanded='true'] + .menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}
</style>
