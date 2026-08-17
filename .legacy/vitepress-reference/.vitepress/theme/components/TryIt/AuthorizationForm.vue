<template>
  <BaseForm
    :title="$t('authorization.title')"
    :fields="authFields"
    :initial-data="initialAuthData"
    :uischema-options="uischemaOptions"
    @form-change="onAuthChange">
    <template #title-actions>
      <div class="text-xs text-gray-500" v-if="initialAuthData">
        {{ $t('authorization.autoFill') }}
      </div>
    </template>
  </BaseForm>
</template>

<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { computed, onMounted } from 'vue'
import { createLoginRedirectPath } from '../../utils/navigate'

// 定义事件
const emit = defineEmits<{
  'auth-change': [data: Record<string, any>]
}>()

// 授权字段定义
const authFields = computed(() => [
  {
    name: 'appKey',
    type: 'string',
    description: 'Application Key',
    required: true,
  },
  {
    name: 'appSecret',
    type: 'string',
    description: 'Application Secret',
    required: true,
  },
  {
    name: 'accessToken',
    type: 'string',
    description: 'Access Token',
    required: true,
  },
])

const uischemaOptions = computed(() => ({
  accessToken: {
    type: 'password',
  },
  appSecret: {
    type: 'password',
  },
}))

// 定义 mock_app_auth 的类型
interface MockAppAuth {
  access_key_id: string
  access_key_secret: string
  token: string
  expired_at?: string
}

// 从 localStorage 的 mock_app_auth 获取初始数据
const initialAuthData = computed(() => {
  if (typeof window !== 'undefined') {
    try {
      const mockData = window.localStorage.getItem('mock_app_auth')
      if (mockData) {
        const mock = JSON.parse(mockData) as MockAppAuth
        return {
          appKey: mock?.access_key_id || '',
          accessToken: mock?.token || '',
          appSecret: mock?.access_key_secret || '',
        }
      }
    } catch (error) {
      console.warn('Failed to parse mock_app_auth from localStorage:', error)
    }
  }
})

// 处理授权信息变化
const onAuthChange = (data: Record<string, any>) => {
  emit('auth-change', data)
}

// 组件初始化时触发认证数据变化事件
onMounted(() => {
  if (initialAuthData.value) {
    // 如果有初始认证数据，立即触发 auth-change 事件
    emit('auth-change', initialAuthData.value)
  }
})

// 处理立即创建按钮点击
const handleCreateClick = () => {
  const path = createLoginRedirectPath({
    type: 'should_has_mock_token',
  })
  window.location.href = path
}
</script>

<style scoped>
.auth-button {
  background-color: var(--vp-c-brand-3);
  border-color: var(--vp-c-brand-3);
}

.auth-button:hover {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
}
</style>
