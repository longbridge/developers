<template>
  <div class="qp-card rounded-lg p-4 my-4 border border-cyan-500/30 bg-cyan-500/5">
    <div class="flex items-start gap-3">
      <div class="qp-icon flex-shrink-0 text-cyan-500 mt-0.5" v-html="keyIcon" />
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1.5 flex-wrap">
          <span class="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{{ title }}</span>
          <span class="text-xs font-medium px-2 py-0.5 rounded text-white" :class="badgeClass">{{ badgeLabel }}</span>
          <span v-if="market" class="text-xs text-cyan-600 dark:text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded">{{ market }}</span>
        </div>
        <p class="text-sm text-cyan-700/80 dark:text-cyan-300/80 m-0 mb-1">{{ description }}</p>
        <a :href="linkUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-cyan-600 dark:text-cyan-400 hover:underline">{{ linkText }} →</a>
        <p class="text-xs text-cyan-600/60 dark:text-cyan-400/60 m-0 mt-2">{{ separateNote }}</p>
      </div>
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

const keyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>`

const title = computed(() => {
  if (isZhCN.value) return '行情权限要求'
  if (isZhHK.value) return '行情權限要求'
  return 'Quote Permission Required'
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

const badgeClass = computed(() => ({
  'bg-green-500': props.level === 'basic',
  'bg-blue-500': props.level === 'lv1',
  'bg-orange-500': props.level === 'lv2',
  'bg-yellow-500': props.level === 'overnight',
}))

const description = computed(() => {
  const map: Record<string, Record<string, string>> = {
    basic: {
      en: 'Included with OpenAPI activation. No additional purchase needed.',
      'zh-CN': '开通 OpenAPI 后自动获得，无需额外购买。',
      'zh-HK': '開通 OpenAPI 後自動獲得，無需額外購買。',
    },
    lv1: {
      en: 'HK real-time quotes require a LV1 Real-time Quote subscription. Purchase via Quote Store in the Longbridge App.',
      'zh-CN': '港股实时报价需要购买 LV1 实时行情卡，通过 Longbridge App 行情商城购买。',
      'zh-HK': '港股實時報價需要購買 LV1 實時行情卡，通過 Longbridge App 行情商城購買。',
    },
    lv2: {
      en: 'Level 2 order book data requires a LV2 subscription. Purchase via Quote Store in the Longbridge App.',
      'zh-CN': 'Level 2 买卖盘数据需要购买 LV2 订阅卡，通过 Longbridge App 行情商城购买。',
      'zh-HK': 'Level 2 買賣盤數據需要購買 LV2 訂閱卡，通過 Longbridge App 行情商城購買。',
    },
    overnight: {
      en: 'US extended-hours data requires: (1) purchase "LV1 Real-time Quote (OpenAPI)" via Quote Store, and (2) set LONGBRIDGE_ENABLE_OVERNIGHT=true or enable_overnight=True in config.',
      'zh-CN': '美股盘前/盘后数据需要：(1) 通过行情商城购买「LV1 Real-time Quote (OpenAPI)」；(2) 设置 LONGBRIDGE_ENABLE_OVERNIGHT=true 或在 Config 中传入 enable_overnight=True。',
      'zh-HK': '美股盤前/盤後數據需要：(1) 通過行情商城購買「LV1 Real-time Quote (OpenAPI)」；(2) 設置 LONGBRIDGE_ENABLE_OVERNIGHT=true 或在 Config 中傳入 enable_overnight=True。',
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
    if (isZhCN.value) return '前往开发者中心查看权限'
    if (isZhHK.value) return '前往開發者中心查看權限'
    return 'Check at Developer Center'
  }
  if (isZhCN.value) return '前往 Longbridge App 行情商城购买'
  if (isZhHK.value) return '前往 Longbridge App 行情商城購買'
  return 'Purchase via Quote Store in Longbridge App'
})

const separateNote = computed(() => {
  if (isZhCN.value) return 'OpenAPI 行情权限与手机客户端/PC/网页端权限完全独立，需单独开通。'
  if (isZhHK.value) return 'OpenAPI 行情權限與手機客戶端/PC/網頁端權限完全獨立，需單獨開通。'
  return 'OpenAPI permissions are separate from App/PC/Web permissions and must be purchased independently.'
})
</script>

<style scoped>
.qp-card {
  border: 1px solid;
}

.qp-icon {
  display: inline-flex;
  margin-top: 1px;
}

:global(.dark) .qp-card {
  @apply border-cyan-500/40;
}
</style>
