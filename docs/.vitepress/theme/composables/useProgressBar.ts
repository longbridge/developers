import { ref } from 'vue'

const visible = ref(false)
const width = ref(0)
let finishTimer: ReturnType<typeof setTimeout> | null = null
let animTimer: ReturnType<typeof setInterval> | null = null

export { visible, width }

export function startProgress() {
  if (finishTimer) { clearTimeout(finishTimer); finishTimer = null }
  if (animTimer) { clearInterval(animTimer); animTimer = null }
  visible.value = true
  width.value = 8
  let current = 8
  animTimer = setInterval(() => {
    current = Math.min(current + (85 - current) * 0.1, 85)
    width.value = current
  }, 120)
}

export function finishProgress() {
  if (animTimer) { clearInterval(animTimer); animTimer = null }
  width.value = 100
  finishTimer = setTimeout(() => {
    visible.value = false
    width.value = 0
  }, 350)
}
