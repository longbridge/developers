<template>
  <div class="tip-container rounded-lg p-4 my-1" :data-type="type">
    <div v-if="title" class="flex items-center gap-2">
      <div class="tip-icon flex-shrink-0" v-html="iconSvg" />
      <div class="font-semibold text-sm leading-snug">{{ title }}</div>
    </div>
    <div class="tip-content text-sm leading-relaxed">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'tip' | 'warning' | 'danger' | 'info' | 'caution' | 'success'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tip',
  title: '',
})

const icons: Record<string, string> = {
  tip: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  caution: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
}

const iconSvg = computed(() => icons[props.type] || icons.tip)
</script>

<style scoped>
.tip-container {
  border: 1px solid;
}

.tip-container p {
  margin-bottom: 0.75rem;
}

/* tip */
.tip-container[data-type='tip'] {
  @apply border-blue-500/30 bg-blue-500/5 text-blue-700;
}
.tip-container[data-type='tip'] .tip-icon {
  @apply text-blue-500;
}
:global(.dark) .tip-container[data-type='tip'] {
  @apply border-blue-500/40 text-blue-300;
}
:global(.dark) .tip-container[data-type='tip'] .tip-icon {
  @apply text-blue-400;
}

/* warning */
.tip-container[data-type='warning'] {
  @apply border-yellow-500/30 bg-yellow-500/5 text-yellow-700;
}
.tip-container[data-type='warning'] .tip-icon {
  @apply text-yellow-500;
}
:global(.dark) .tip-container[data-type='warning'] {
  @apply border-yellow-500/40 text-yellow-300;
}
:global(.dark) .tip-container[data-type='warning'] .tip-icon {
  @apply text-yellow-400;
}

/* danger */
.tip-container[data-type='danger'] {
  @apply border-red-500/30 bg-red-500/5 text-red-700;
}
.tip-container[data-type='danger'] .tip-icon {
  @apply text-red-500;
}
:global(.dark) .tip-container[data-type='danger'] {
  @apply border-red-500/40 text-red-300;
}
:global(.dark) .tip-container[data-type='danger'] .tip-icon {
  @apply text-red-400;
}

/* info */
.tip-container[data-type='info'] {
  @apply border-cyan-500/30 bg-cyan-500/5 text-cyan-700;
}
.tip-container[data-type='info'] .tip-icon {
  @apply text-cyan-500;
}
:global(.dark) .tip-container[data-type='info'] {
  @apply border-cyan-500/40 text-cyan-300;
}
:global(.dark) .tip-container[data-type='info'] .tip-icon {
  @apply text-cyan-400;
}

/* caution */
.tip-container[data-type='caution'] {
  @apply border-orange-500/30 bg-orange-500/5 text-orange-700;
}
.tip-container[data-type='caution'] .tip-icon {
  @apply text-orange-500;
}
:global(.dark) .tip-container[data-type='caution'] {
  @apply border-orange-500/40 text-orange-300;
}
:global(.dark) .tip-container[data-type='caution'] .tip-icon {
  @apply text-orange-400;
}

/* success */
.tip-container[data-type='success'] {
  @apply border-green-500/30 bg-green-500/5 text-green-700;
}
.tip-container[data-type='success'] .tip-icon {
  @apply text-green-500;
}
:global(.dark) .tip-container[data-type='success'] {
  @apply border-green-500/40 text-green-300;
}
:global(.dark) .tip-container[data-type='success'] .tip-icon {
  @apply text-green-400;
}

.tip-icon {
  display: inline-flex;
  margin-top: 1px;
}

.tip-content :deep(p:last-child) {
  margin-bottom: 0;
}

.tip-content :deep(pre) {
  margin: 0.75rem 0;
}

.tip-content :deep(ul),
.tip-content :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}

.tip-content :deep(li) {
  margin: 0.25rem 0;
}
</style>
