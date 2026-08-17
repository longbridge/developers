<script setup lang="ts">
import { AccordionItem, type AccordionItemProps, useForwardProps } from 'reka-ui'

const props = defineProps<AccordionItemProps>()
const forwardedProps = useForwardProps(props)
</script>

<template>
  <AccordionItem v-bind="forwardedProps" class="mcp-accordion-item">
    <slot />
  </AccordionItem>
</template>

<style scoped>
.mcp-accordion-item {
  border-bottom: 1px solid var(--vp-c-divider);
}
</style>
