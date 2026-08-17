<template>
  <BaseForm
    :title="$t('parameters.title')"
    :empty-message="$t('parameters.noParameters')"
    :fields="formFields"
    @form-change="onChange" />
</template>

<script setup lang="ts">
import type { ParameterRow } from '../../../types'
import BaseForm from './BaseForm.vue'
import { computed } from 'vue'

interface Props {
  parameters?: ParameterRow[]
}

const props = withDefaults(defineProps<Props>(), {
  parameters: () => [],
})

// 定义事件
const emit = defineEmits<{
  'form-change': [data: Record<string, any>]
}>()

// 将 ParameterRow[] 转换为 FormField[]
const formFields = computed(() => {
  return props.parameters.map((param) => ({
    name: param.name,
    type: param.type,
    description: param.description,
    required:
      param.required.toLowerCase() === 'true' ||
      param.required.toLowerCase() === 'yes' ||
      param.required.toLowerCase() === '是',
  }))
})

// 表单变化处理
const onChange = (data: Record<string, any>) => {
  // 发出事件给父组件
  emit('form-change', data)
}
</script>
