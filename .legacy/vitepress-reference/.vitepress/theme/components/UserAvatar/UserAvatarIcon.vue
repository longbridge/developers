<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  src?: string
  size?: 'sm' | 'md' | 'lg'
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  size: 'md',
  alt: 'User Avatar',
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-8 h-8'
    case 'lg':
      return 'w-12 h-12'
    default:
      return 'w-10 h-10'
  }
})

const avatarSrc = computed(() => {
  return props.src
})
</script>

<template>
  <div class="inline-flex items-center justify-center flex-shrink-0" :class="sizeClasses">
    <img
      v-if="avatarSrc"
      :src="avatarSrc"
      :alt="props.alt"
      class="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-gray-800" />
    <div v-else class="w-full h-full rounded-full bg-[#EAEBEC] dark:bg-[#262626]"></div>
  </div>
</template>
