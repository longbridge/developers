<template>
  <div class="qp-alert" :data-level="level">
    <!-- Header: label + prominent badge -->
    <div class="qp-header">
      <div class="qp-header-left">
        <span class="qp-key-icon" v-html="keyIcon" />
        <span class="qp-label">{{ title }}</span>
        <span v-if="market" class="qp-market-tag">{{ market }}</span>
      </div>
      <span class="qp-badge">{{ badgeLabel }}</span>
    </div>
    <!-- Description -->
    <p class="qp-desc">{{ description }}</p>
    <!-- Footer: action link + separation note -->
    <div class="qp-footer">
      <a :href="linkUrl" target="_blank" rel="noopener noreferrer" class="qp-link">
        <span class="qp-link-icon" v-html="level === 'basic' ? externalLinkIcon : shoppingBagIcon" />
        {{ linkText }}
      </a>
      <span class="qp-sep">·</span>
      <span class="qp-note">{{ separateNote }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

interface Props {
  level: 'basic' | 'lv1' | 'lv2' | 'overnight'
  market?: string
}

const props = defineProps<Props>()
const { lang } = useData()

const isZhCN = computed(() => lang.value === 'zh-CN')
const isZhHK = computed(() => lang.value === 'zh-HK')

const keyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`

const externalLinkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`

const shoppingBagIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`

const title = computed(() => {
  if (isZhCN.value) return '行情权限要求'
  if (isZhHK.value) return '行情權限要求'
  return 'Quote Permission'
})

const badgeLabel = computed(() => {
  const map: Record<string, Record<string, string>> = {
    basic: { en: 'Basic', 'zh-CN': '基础行情', 'zh-HK': '基礎行情' },
    lv1: { en: 'LV1 Real-time', 'zh-CN': 'LV1 实时', 'zh-HK': 'LV1 實時' },
    lv2: { en: 'LV2 Subscription', 'zh-CN': 'LV2 订阅', 'zh-HK': 'LV2 訂閱' },
    overnight: { en: 'Overnight', 'zh-CN': '盘前盘后', 'zh-HK': '盤前盤後' },
  }
  return map[props.level]?.[lang.value] ?? map[props.level]?.en ?? props.level
})

const description = computed(() => {
  const map: Record<string, Record<string, string>> = {
    basic: {
      en: 'Included with OpenAPI activation — no extra purchase needed.',
      'zh-CN': '开通 OpenAPI 后自动获得，无需额外购买。',
      'zh-HK': '開通 OpenAPI 後自動獲得，無需額外購買。',
    },
    lv1: {
      en: 'HK real-time quotes require a LV1 Real-time Quote subscription.',
      'zh-CN': '港股实时报价需要单独购买 LV1 实时行情卡。',
      'zh-HK': '港股實時報價需要單獨購買 LV1 實時行情卡。',
    },
    lv2: {
      en: 'Level 2 order book requires a separate LV2 subscription.',
      'zh-CN': 'Level 2 买卖盘数据需要单独购买 LV2 订阅。',
      'zh-HK': 'Level 2 買賣盤數據需要單獨購買 LV2 訂閱。',
    },
    overnight: {
      en: 'US extended hours require LV1 purchase + set LONGBRIDGE_ENABLE_OVERNIGHT=true.',
      'zh-CN': '美股盘前/盘后需购买 LV1 行情卡，并设置 LONGBRIDGE_ENABLE_OVERNIGHT=true。',
      'zh-HK': '美股盤前/盤後需購買 LV1 行情卡，並設置 LONGBRIDGE_ENABLE_OVERNIGHT=true。',
    },
  }
  return map[props.level]?.[lang.value] ?? map[props.level]?.en ?? ''
})

const linkUrl = computed(() => {
  if (props.level === 'basic') return 'https://open.longbridge.com/account'
  return 'https://longbridge.com/download'
})

const linkText = computed(() => {
  if (props.level === 'basic') {
    if (isZhCN.value) return '开发者中心'
    if (isZhHK.value) return '開發者中心'
    return 'Developer Center'
  }
  if (isZhCN.value) return '行情商城'
  if (isZhHK.value) return '行情商城'
  return 'Quote Store'
})

const separateNote = computed(() => {
  if (isZhCN.value) return 'OpenAPI 权限 ≠ App/Web 权限'
  if (isZhHK.value) return 'OpenAPI 權限 ≠ App/Web 權限'
  return 'OpenAPI perms ≠ App/Web perms'
})
</script>

<style scoped>
.qp-alert {
  border: 1px solid;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  margin: 1rem 0;
}

/* ── level colors ── */
.qp-alert[data-level='basic'] {
  @apply border-green-500/30 bg-green-500/5;
}
.qp-alert[data-level='basic'] .qp-key-icon,
.qp-alert[data-level='basic'] .qp-label {
  @apply text-green-600 dark:text-green-400;
}
.qp-alert[data-level='basic'] .qp-badge {
  @apply bg-green-500/15 text-green-700 dark:bg-green-500/20 dark:text-green-300 ring-1 ring-green-500/30;
}
.qp-alert[data-level='basic'] .qp-desc {
  @apply text-green-800/80 dark:text-green-300/80;
}
.qp-alert[data-level='basic'] .qp-link {
  @apply text-green-700 dark:text-green-400 hover:text-green-900 dark:hover:text-green-200;
}
.qp-alert[data-level='basic'] .qp-note,
.qp-alert[data-level='basic'] .qp-sep {
  @apply text-green-600/50 dark:text-green-500/50;
}
.qp-alert[data-level='basic'] .qp-market-tag {
  @apply text-green-600/70 dark:text-green-400/70 ring-1 ring-green-500/30;
}

.qp-alert[data-level='lv1'] {
  @apply border-blue-500/30 bg-blue-500/5;
}
.qp-alert[data-level='lv1'] .qp-key-icon,
.qp-alert[data-level='lv1'] .qp-label {
  @apply text-blue-600 dark:text-blue-400;
}
.qp-alert[data-level='lv1'] .qp-badge {
  @apply bg-blue-500/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 ring-1 ring-blue-500/30;
}
.qp-alert[data-level='lv1'] .qp-desc {
  @apply text-blue-800/80 dark:text-blue-300/80;
}
.qp-alert[data-level='lv1'] .qp-link {
  @apply text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200;
}
.qp-alert[data-level='lv1'] .qp-note,
.qp-alert[data-level='lv1'] .qp-sep {
  @apply text-blue-600/50 dark:text-blue-500/50;
}
.qp-alert[data-level='lv1'] .qp-market-tag {
  @apply text-blue-600/70 dark:text-blue-400/70 ring-1 ring-blue-500/30;
}

.qp-alert[data-level='lv2'] {
  @apply border-orange-500/30 bg-orange-500/5;
}
.qp-alert[data-level='lv2'] .qp-key-icon,
.qp-alert[data-level='lv2'] .qp-label {
  @apply text-orange-600 dark:text-orange-400;
}
.qp-alert[data-level='lv2'] .qp-badge {
  @apply bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 ring-1 ring-orange-500/30;
}
.qp-alert[data-level='lv2'] .qp-desc {
  @apply text-orange-800/80 dark:text-orange-300/80;
}
.qp-alert[data-level='lv2'] .qp-link {
  @apply text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-200;
}
.qp-alert[data-level='lv2'] .qp-note,
.qp-alert[data-level='lv2'] .qp-sep {
  @apply text-orange-600/50 dark:text-orange-500/50;
}
.qp-alert[data-level='lv2'] .qp-market-tag {
  @apply text-orange-600/70 dark:text-orange-400/70 ring-1 ring-orange-500/30;
}

.qp-alert[data-level='overnight'] {
  @apply border-yellow-500/30 bg-yellow-500/5;
}
.qp-alert[data-level='overnight'] .qp-key-icon,
.qp-alert[data-level='overnight'] .qp-label {
  @apply text-yellow-700 dark:text-yellow-400;
}
.qp-alert[data-level='overnight'] .qp-badge {
  @apply bg-yellow-500/15 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300 ring-1 ring-yellow-500/30;
}
.qp-alert[data-level='overnight'] .qp-desc {
  @apply text-yellow-900/80 dark:text-yellow-300/80;
}
.qp-alert[data-level='overnight'] .qp-link {
  @apply text-yellow-700 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-200;
}
.qp-alert[data-level='overnight'] .qp-note,
.qp-alert[data-level='overnight'] .qp-sep {
  @apply text-yellow-700/50 dark:text-yellow-500/50;
}
.qp-alert[data-level='overnight'] .qp-market-tag {
  @apply text-yellow-700/70 dark:text-yellow-400/70 ring-1 ring-yellow-500/30;
}

/* ── structural styles ── */
.qp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
}

.qp-header-left {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  min-width: 0;
}

.qp-key-icon {
  display: inline-flex;
  flex-shrink: 0;
}

.qp-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  white-space: nowrap;
}

.qp-market-tag {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background: transparent;
  white-space: nowrap;
}

.qp-badge {
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.2rem 0.625rem;
  border-radius: 9999px;
  white-space: nowrap;
  flex-shrink: 0;
  letter-spacing: 0.01em;
}

.qp-desc {
  font-size: 0.8125rem;
  line-height: 1.5;
  margin: 0 0 0.5rem 0;
}

.qp-footer {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
}

.qp-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.15s;
}
.qp-link:hover {
  text-decoration: underline;
}

.qp-link-icon {
  display: inline-flex;
  align-items: center;
}

.qp-sep {
  font-size: 0.75rem;
}

.qp-note {
  font-size: 0.7rem;
  opacity: 0.8;
}
</style>
