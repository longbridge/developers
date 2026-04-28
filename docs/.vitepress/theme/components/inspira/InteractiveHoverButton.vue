<script lang="ts" setup>
import { cn } from '@inspira-ui/plugins'
import { ref } from 'vue'

interface Props {
  text?: string
  class?: string
  dotColor?: string
  hoverTextColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  text: 'Button',
  dotColor: 'var(--brand-100, #00b8b8)',
  hoverTextColor: 'inherit',
})

const buttonRef = ref<HTMLButtonElement>()
</script>

<template>
  <button
    ref="buttonRef"
    :class="
      cn(
        'ihb group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold',
        props.class
      )
    ">
    <div class="flex items-center gap-2">
      <div class="ihb-dot size-2 scale-100 rounded-full transition-all duration-300 group-hover:scale-[100.8]" />
      <span
        class="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {{ text }}
      </span>
    </div>
    <div
      class="ihb-hover-text absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
      <span class="whitespace-nowrap">{{ text }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </div>
  </button>
</template>

<style scoped>
.ihb-dot {
  background: v-bind(dotColor);
}
.ihb-hover-text {
  color: v-bind(hoverTextColor);
}
</style>
