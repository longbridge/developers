<template>
  <div>
    <div class="pb-6 rounded-2xl mx-8 lg:mt-4">
      <!-- Header -->
      <div class="py-6">
        <div class="flex items-center justify-between">
          <div class="text-lg font-semibold flex items-center gap-2 flex-1 min-w-0" style="color: var(--vp-c-text-1)">
            <span
              class="text-base items-center justify-center px-3 py-1 font-medium rounded-xl shadow-none flex-shrink-0"
              :class="getMethodTextColor(httpInfo.method)">
              {{ httpInfo.method }}
            </span>
            <span class="overflow-x-auto whitespace-nowrap min-w-0 flex-1" style="color: var(--vp-c-text-2)">{{
              httpInfo.url
            }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="handleGoBack"
              class="flex items-center gap-1 px-3 py-2 text-sm rounded-lg transition-colors flex-shrink-0 hover:opacity-80"
              style="
                color: var(--vp-c-text-1);
                background-color: var(--vp-c-default-soft);
                border: 1px solid var(--vp-c-divider);
              ">
              {{ $t('tryIt.backToDoc') }}
            </button>
            <PlayButton
              class="flex-shrink-0"
              :color="getMethodColor(httpInfo.method)"
              :loading="isLoading"
              @click="handleSend">
              {{ $t('tryIt.send') }}
            </PlayButton>
          </div>
        </div>
        <p class="text-sm mt-2" style="color: var(--vp-c-text-2)" v-if="httpInfo.description">
          {{ httpInfo.description }}
        </p>
      </div>
      <div class="flex gap-4 items-start flex-col xl:flex-row">
        <div class="flex-1 w-full min-w-0 space-y-4">
          <AuthorizationForm @auth-change="onAuthChange" />
          <ParametersForm :parameters="parametersTable.parameters" @form-change="onFormChange" />
        </div>
        <div v-if="result || isLoading" class="flex-1 w-full min-w-0">
          <!-- Loading State -->
          <LoadingSpinner v-if="isLoading" />
          <!-- Result Display -->
          <Code v-if="result" :result="result" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import 'vue-i18n'
import { ref, computed } from 'vue'
import ParametersForm from './ParametersForm.vue'
import AuthorizationForm from './AuthorizationForm.vue'
import PlayButton from './PlayButton.vue'
import Code from './Code.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { type ApiResponse } from '../../utils/http-client'
import { createQuickRequest } from '../../utils/request'
import { useData, useRouter } from 'vitepress'
import type { HttpInfo, ParametersTable } from '../../../types'

const { frontmatter } = useData()

const httpInfo = computed<HttpInfo>(() => frontmatter.value.httpInfo || {})
const parametersTable = computed<ParametersTable>(() => frontmatter.value.parametersTable || {})
const router = useRouter()

const formData = ref<Record<string, any>>({})
const authData = ref<Record<string, any>>({})
const isLoading = ref(false)

const onFormChange = (data: Record<string, any>) => {
  formData.value = data
}

const onAuthChange = (data: Record<string, any>) => {
  authData.value = data
}

const result = ref<ApiResponse | undefined>()
const handleGoBack = () => {
  router.go(router.route.path, { replace: true })
}

const handleSend = async () => {
  if (isLoading.value) return

  // 清除之前的结果，显示加载状态
  result.value = undefined
  isLoading.value = true

  try {
    const method = httpInfo.value.method.toLowerCase()
    const url = httpInfo.value.url

    // 根据认证参数动态创建 request 实例
    const request = createQuickRequest(authData.value.appKey, authData.value.accessToken, authData.value.appSecret)

    // 根据不同的 HTTP 方法调用对应的 API
    let localResult: ApiResponse
    switch (method) {
      case 'get':
        localResult = await request.get(url, formData.value)
        break
      case 'post':
        localResult = await request.post(url, formData.value)
        break
      case 'put':
        localResult = await request.put(url, formData.value)
        break
      case 'delete':
        localResult = await request.delete(url, formData.value)
        break
      default:
        throw new Error(`不支持的 HTTP 方法：${method}`)
    }

    result.value = localResult
  } catch (error) {
    console.error('API request failed:', error)
    // 设置错误结果
    result.value = {
      status: 500,
      statusText: 'Internal Server Error',
      response: {
        code: -1,
        msg: error instanceof Error ? error.message : '请求失败',
        data: null,
      },
    }
  } finally {
    isLoading.value = false
  }
}

const getMethodColor = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'success'
    case 'post':
      return 'brand'
    case 'put':
      return 'warning'
    case 'delete':
      return 'danger'
    case 'patch':
      return 'important'
    default:
      return 'default'
  }
}

const getMethodTextColor = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'method-get'
    case 'post':
      return 'method-post'
    case 'put':
      return 'method-put'
    case 'delete':
      return 'method-delete'
    case 'patch':
      return 'method-patch'
    default:
      return 'method-default'
  }
}

const isOpen = ref(false)

function setIsOpen(value) {
  isOpen.value = value
}
</script>

<style scoped>
.method-get {
  color: var(--vp-c-success-1);
  background-color: var(--vp-c-success-soft);
}

.method-post {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.method-put {
  color: var(--vp-c-warning-1);
  background-color: var(--vp-c-warning-soft);
}

.method-delete {
  color: var(--vp-c-danger-1);
  background-color: var(--vp-c-danger-soft);
}

.method-patch {
  color: var(--vp-c-important-1);
  background-color: var(--vp-c-important-soft);
}

.method-default {
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-default-soft);
}
</style>
