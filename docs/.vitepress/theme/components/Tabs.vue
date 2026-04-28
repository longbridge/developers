<template>
  <div class="my-4">
    <!-- line variant -->
    <div v-if="variant === 'line'" class="flex border-b border-[var(--vp-c-divider)] mb-4 overflow-x-auto gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-line-btn"
        :class="tab.value === activeTab ? 'tab-line-active' : 'tab-line-inactive'"
        @click="setActiveTab(tab.value)">
        {{ tab.label }}
      </button>
    </div>
    <!-- pill variant -->
    <div v-else class="inline-flex items-center rounded-md bg-[var(--vp-c-bg-soft)] p-1 mb-4 overflow-x-auto gap-1">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all cursor-pointer border-0',
          tab.value === activeTab
            ? 'bg-[var(--vp-c-bg)] text-[var(--vp-c-text-1)] shadow-sm'
            : 'text-[var(--vp-c-text-2)] hover:text-[var(--vp-c-text-1)]',
        ]"
        @click="setActiveTab(tab.value)">
        {{ tab.label }}
      </button>
    </div>
    <div class="relative">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, ref, onMounted } from 'vue'

interface Tab {
  value: string
  label: string
  default?: boolean
}

interface Props {
  groupId?: string
  variant?: 'line' | 'pill'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'line',
})

const tabs = ref<Tab[]>([])
const activeTab = ref<string>('')

// 全局状态管理 - 存储在 window 对象上以实现跨组件同步
declare global {
  interface Window {
    __VitePressTabsState: Record<string, string>
    __VitePressTabsListeners: Record<string, Set<(value: string) => void>>
  }
}

// 初始化全局状态
if (typeof window !== 'undefined') {
  if (!window.__VitePressTabsState) {
    window.__VitePressTabsState = {}
  }
  if (!window.__VitePressTabsListeners) {
    window.__VitePressTabsListeners = {}
  }
}

// 注册 tab
const registerTab = (tab: Tab) => {
  const existingIndex = tabs.value.findIndex((t) => t.value === tab.value)
  if (existingIndex >= 0) {
    tabs.value[existingIndex] = tab
  } else {
    tabs.value.push(tab)
  }

  // 设置默认激活 tab
  if (tab.default || tabs.value.length === 1) {
    setActiveTab(tab.value)
  }
}

// 设置激活 tab
const setActiveTab = (value: string) => {
  activeTab.value = value

  // 如果有 groupId，同步到全局状态
  if (props.groupId && typeof window !== 'undefined') {
    window.__VitePressTabsState[props.groupId] = value

    // 通知其他同组的 tabs
    if (window.__VitePressTabsListeners[props.groupId]) {
      window.__VitePressTabsListeners[props.groupId].forEach((listener) => {
        listener(value)
      })
    }

    // 持久化到 localStorage
    try {
      localStorage.setItem(`vitepress-tabs-${props.groupId}`, value)
    } catch (e) {
      console.warn('Failed to save tab state to localStorage:', e)
    }
  }
}

// 监听全局状态变化
onMounted(() => {
  if (props.groupId && typeof window !== 'undefined') {
    const groupId = props.groupId

    // 注册监听器
    if (!window.__VitePressTabsListeners[groupId]) {
      window.__VitePressTabsListeners[groupId] = new Set()
    }

    const listener = (value: string) => {
      if (tabs.value.some((tab) => tab.value === value)) {
        activeTab.value = value
      }
    }

    window.__VitePressTabsListeners[groupId].add(listener)

    // 从 localStorage 恢复状态
    try {
      const saved = localStorage.getItem(`vitepress-tabs-${groupId}`)
      if (saved && tabs.value.some((tab) => tab.value === saved)) {
        activeTab.value = saved
        window.__VitePressTabsState[groupId] = saved
      }
    } catch (e) {
      console.warn('Failed to read tab state from localStorage:', e)
    }

    // 如果全局状态已经有值，使用它
    if (
      window.__VitePressTabsState[groupId] &&
      tabs.value.some((tab) => tab.value === window.__VitePressTabsState[groupId])
    ) {
      activeTab.value = window.__VitePressTabsState[groupId]
    }
  }
})

// 提供给子组件
provide('tabs-register', registerTab)
provide('tabs-active', activeTab)
</script>

<style scoped>
.tab-line-btn {
  padding: 0.3rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.tab-line-active {
  color: var(--vp-c-text-1);
  border-bottom-color: var(--vp-c-text-1);
}

.tab-line-inactive {
  color: var(--vp-c-text-2);
}

.tab-line-inactive:hover {
  color: var(--vp-c-text-1);
}
</style>
