<template>
  <div
    v-if="props.result"
    class="w-full rounded-xl p-0.5"
    style="background-color: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-border)">
    <!-- Header Bar -->
    <div class="flex w-full px-2 py-1 space-x-3 items-center rounded-t-2xl">
      <div class="flex flex-1 space-x-4 items-center">
        <div class="flex space-x-2 items-center">
          <!-- Status Icon -->
          <div class="w-3.5 h-3.5 rounded-full" :class="getStatusIconClass()"></div>
          <!-- Status Text -->
          <div class="text-xs font-medium" style="color: var(--vp-c-text-1)">
            {{ getStatusText() }}
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex space-x-2 items-center">
        <!-- Download Button -->
        <button
          @click="downloadResponse"
          class="group h-7 w-7 flex items-center justify-center cursor-pointer relative rounded-md transition-all duration-200 hover:scale-110 hover-bg"
          title="download">
          <svg
            class="w-4 h-4 transition-all duration-200 bg-[var(--vp-c-text-2)]"
            style="
              mask-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMTNIMTMiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik04IDNWMTFNOCAxMUwxMSA4TTggMTFMNSA4IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K');
              mask-repeat: no-repeat;
              mask-position: center center;
            "></svg>
        </button>

        <!-- Copy Button -->
        <div class="relative">
          <button
            @click="copyResponse"
            class="h-7 w-7 flex items-center justify-center rounded-md backdrop-blur group/copy-button transition-all duration-200 hover:scale-110 hover-bg"
            :title="copySuccess ? '已复制' : '复制代码'">
            <svg
              v-if="!copySuccess"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4 transition-all duration-200 svg-icon">
              <path
                d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
              <path
                d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <svg
              v-else
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              style="color: var(--vp-c-success-1)">
              <path
                d="M15 4.5L7.5 12L3 7.5"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Code Content -->
    <div class="rounded-[14px]" style="background-color: var(--vp-c-bg)">
      <div class="h-full">
        <div
          class="px-3 py-3.5 min-h-[200px] max-h-[50vh] whitespace-pre font-mono text-xs leading-5 overflow-auto"
          style="color: var(--vp-c-text-2); border-color: var(--vp-c-border)">
          <div v-html="highlightHtml" class="h-full overflow-auto"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, inject } from 'vue'
import { createHighlighter } from 'shiki/bundle/web'
import { type ApiResponse } from '../../utils/http-client'

interface Props {
  result?: ApiResponse
}

const props = withDefaults(defineProps<Props>(), {
  result: undefined,
})

const highlightHtml = ref('')
const copySuccess = ref(false)

const highlighterPromise = inject<ReturnType<typeof createHighlighter>>('highlighter')

const highlightJson = async () => {
  const highlighter = await highlighterPromise
  if (props.result?.response) {
    const code = JSON.stringify(props.result.response, null, 2)
    highlightHtml.value =
      highlighter?.codeToHtml(code, {
        lang: 'json',
        theme: document.documentElement.classList.contains('dark') ? 'vitesse-dark' : 'vitesse-light',
      }) || ''
  } else {
    highlightHtml.value = ''
  }
}

const getStatusIconClass = () => {
  if (!props.result) return 'status-default'

  const status = props.result.status
  if (status >= 200 && status < 300) {
    return 'status-success'
  } else if (status >= 400 && status < 500) {
    return 'status-danger'
  } else if (status >= 500) {
    return 'status-danger'
  } else {
    return 'status-warning'
  }
}

const getStatusText = () => {
  if (!props.result) return ''
  const textList: string[] = []
  if (props.result.status) {
    textList.push(`${props.result.status}`)
  }
  if (props.result.statusText) {
    textList.push(`${props.result.statusText}`)
  }
  return textList.join(' - ')
}

const copyResponse = async () => {
  if (!props.result?.response) return

  try {
    const jsonText = JSON.stringify(props.result.response, null, 2)
    await navigator.clipboard.writeText(jsonText)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败：', err)
  }
}

const downloadResponse = () => {
  if (!props.result?.response) return

  try {
    const jsonText = JSON.stringify(props.result.response, null, 2)
    const blob = new Blob([jsonText], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'api-response.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('下载失败：', err)
  }
}

// 首次加载
onMounted(highlightJson)

watch(() => props.result, highlightJson, { deep: true })
</script>

<style scoped>
.hover-bg:hover {
  background-color: var(--vp-c-bg-soft);
}

.group:hover .svg-icon {
  background-color: var(--vp-c-text-1);
}

.status-success {
  background-color: var(--vp-c-success-1);
}

.status-danger {
  background-color: var(--vp-c-danger-1);
}

.status-warning {
  background-color: var(--vp-c-warning-1);
}

.status-default {
  background-color: var(--vp-c-default-1);
}
</style>
