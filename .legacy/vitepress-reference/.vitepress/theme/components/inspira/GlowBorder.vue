<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  borderRadius?: number
  color?: string | string[]
  borderWidth?: number
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 12,
  color: () => ['var(--brand-color)', 'var(--cyan-60)'],
  borderWidth: 2,
  duration: 10,
})

const styles = computed(() => ({
  '--border-radius': `${props.borderRadius}px`,
  '--border-width': `${props.borderWidth}px`,
  '--duration': `${props.duration}s`,
  backgroundImage: `radial-gradient(transparent, transparent, ${
    Array.isArray(props.color) ? props.color.join(',') : props.color
  }, transparent, transparent)`,
  backgroundSize: '300% 300%',
  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  WebkitMaskComposite: 'xor',
  maskComposite: 'exclude',
  padding: 'var(--border-width)',
  borderRadius: 'var(--border-radius)',
}))
</script>

<template>
  <div
    class="glow-border"
    :style="styles"
  />
</template>

<style scoped>
.glow-border {
  pointer-events: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  will-change: background-position;
  animation: glow-spin var(--duration) linear infinite;
}

@keyframes glow-spin {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
</style>
