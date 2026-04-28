<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'

interface Props {
  spread?: number
  proximity?: number
  disabled?: boolean
  borderWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  spread: 30,
  proximity: 80,
  disabled: false,
  borderWidth: 2,
})

const containerRef = ref<HTMLElement>()
const isActive = ref(false)
const angle = ref(0)
let raf = 0
let currentAngle = 0

// Convert angle to a position on the border for the glow spot
const glowStyle = computed(() => {
  const rad = (angle.value - 90) * (Math.PI / 180)
  const x = 50 + Math.cos(rad) * 50
  const y = 50 + Math.sin(rad) * 50
  return {
    opacity: isActive.value ? 1 : 0,
    background: `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(--brand-color) 25%, transparent) 0%, color-mix(in srgb, var(--cyan-60, #66dada) 10%, transparent) 35%, transparent 55%)`,
  }
})

function handlePointerMove(e: PointerEvent) {
  if (!containerRef.value) return
  if (raf) cancelAnimationFrame(raf)

  raf = requestAnimationFrame(() => {
    const el = containerRef.value!
    const { left, top, width, height } = el.getBoundingClientRect()

    const near = e.clientX > left - props.proximity
      && e.clientX < left + width + props.proximity
      && e.clientY > top - props.proximity
      && e.clientY < top + height + props.proximity

    isActive.value = near

    if (near) {
      const cx = left + width / 2
      const cy = top + height / 2
      const target = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90
      const diff = ((target - currentAngle + 180) % 360) - 180
      currentAngle += diff
      angle.value = currentAngle
    }
  })
}

onMounted(() => {
  if (props.disabled) return
  document.addEventListener('pointermove', handlePointerMove, { passive: true })
})

onUnmounted(() => {
  if (raf) cancelAnimationFrame(raf)
  document.removeEventListener('pointermove', handlePointerMove)
})
</script>

<template>
  <div ref="containerRef" class="ge-wrap">
    <div class="ge-glow" :style="glowStyle" />
  </div>
</template>

<style scoped>
.ge-wrap {
  pointer-events: none;
  position: absolute;
  inset: -3px;
  border-radius: inherit;
  z-index: 0;
}

.ge-glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  transition: opacity 0.3s ease;
  filter: blur(6px);
}
</style>
