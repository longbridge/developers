<script setup lang="ts">
import { AccordionContent, type AccordionContentProps } from 'reka-ui'

defineProps<AccordionContentProps>()
</script>

<template>
  <AccordionContent class="mcp-accordion-content">
    <div class="mcp-accordion-content-inner">
      <slot />
    </div>
  </AccordionContent>
</template>

<style scoped>
.mcp-accordion-content {
  overflow: hidden;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.mcp-accordion-content[data-state='open'] {
  animation: slide-down 0.2s ease-out;
}
.mcp-accordion-content[data-state='closed'] {
  animation: slide-up 0.2s ease-out;
}
.mcp-accordion-content-inner {
  padding: 0 0 0.75rem;
}
@keyframes slide-down {
  from { height: 0 }
  to   { height: var(--reka-accordion-content-height) }
}
@keyframes slide-up {
  from { height: var(--reka-accordion-content-height) }
  to   { height: 0 }
}
</style>
