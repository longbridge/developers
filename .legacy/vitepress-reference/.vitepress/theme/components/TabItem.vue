<template>
  <div v-show="isActive" class="tab-item">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject, computed, onMounted, ref, type Ref } from 'vue'

interface Props {
  value: string
  label: string
  default?: boolean
}

const props = defineProps<Props>()

// 从父组件注入的方法和状态
const registerTab = inject<(tab: { value: string; label: string; default?: boolean }) => void>('tabs-register')
const activeTab = inject<Ref<string>>('tabs-active', ref(''))

// 计算是否激活
const isActive = computed(() => activeTab.value === props.value)

// 组件挂载时注册自己
onMounted(() => {
  if (registerTab) {
    registerTab({
      value: props.value,
      label: props.label,
      default: props.default,
    })
  }
})
</script>

<style scoped>
.tab-item {
  animation: fade-in 0.2s ease-in-out;
}

.tab-item :deep(ul) {
  list-style-type: disc;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

.tab-item :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.25rem;
  margin: 0.75rem 0;
}

.tab-item :deep(li) {
  margin: 0.25rem 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
