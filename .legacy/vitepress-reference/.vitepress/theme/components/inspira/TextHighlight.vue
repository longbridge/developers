<script setup lang="ts">
import { cn } from '@inspira-ui/plugins'
import { computed } from 'vue'

interface Props {
  delay?: number
  duration?: number
  class?: string
  textEndColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  duration: 2000,
  textEndColor: 'inherit',
})

const delayMs = computed(() => `${props.delay}ms`)
const durationMs = computed(() => `${props.duration}ms`)
</script>

<template>
  <span
    :class="cn('text-highlight inline-block', props.class)"
  >
    <slot />
  </span>
</template>

<style scoped>
.text-highlight {
  --delay: v-bind(delayMs);
  --duration: v-bind(durationMs);
  --text-end-color: v-bind(textEndColor);

  background: linear-gradient(to right, var(--brand-color, #00b8b8) 50%, transparent 50%);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left center;
  padding: 0 0.15em;
  border-radius: 0.15em;
  animation:
    highlight-bg var(--duration) ease-in-out var(--delay) forwards,
    highlight-text var(--duration) ease-in-out var(--delay) forwards;
}

@keyframes highlight-bg {
  from {
    background-size: 0% 100%;
  }
  to {
    background-size: 200% 100%;
  }
}

@keyframes highlight-text {
  from {
    color: inherit;
  }
  to {
    color: var(--text-end-color);
  }
}
</style>
