<script setup lang="ts">
import { AccordionHeader, AccordionTrigger, type AccordionTriggerProps } from 'reka-ui'

defineProps<AccordionTriggerProps>()
</script>

<template>
  <AccordionHeader class="mcp-accordion-header">
    <AccordionTrigger class="mcp-accordion-trigger">
      <slot />
      <svg
        class="mcp-accordion-chevron"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </AccordionTrigger>
  </AccordionHeader>
</template>

<style scoped>
.mcp-accordion-header {
  display: flex;
  margin: 0;
}
.mcp-accordion-trigger {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: left;
  background: transparent;
  border: 0;
  cursor: pointer;
  color: var(--vp-c-text-1);
}
.mcp-accordion-trigger:hover {
  color: var(--vp-c-brand-1);
}
.mcp-accordion-chevron {
  transition: transform 0.2s ease;
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}
.mcp-accordion-trigger[data-state='open'] .mcp-accordion-chevron {
  transform: rotate(180deg);
}
</style>
