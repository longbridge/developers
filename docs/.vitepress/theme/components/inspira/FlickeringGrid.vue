<script lang="ts" setup>
import { cn } from '@inspira-ui/plugins'
import { onBeforeUnmount, onMounted, ref, toRefs, computed } from 'vue'

interface ColorEntry {
  color: string
  weight: number
}

interface FlickeringGridProps {
  squareSize?: number
  gridGap?: number
  flickerChance?: number
  color?: string
  colors?: ColorEntry[]
  width?: number
  height?: number
  class?: string
  maxOpacity?: number
  shape?: 'square' | 'circle'
}

const props = withDefaults(defineProps<FlickeringGridProps>(), {
  squareSize: 4,
  gridGap: 6,
  flickerChance: 0.3,
  color: 'rgb(0, 0, 0)',
  maxOpacity: 0.3,
  shape: 'square',
})

const { squareSize, gridGap, flickerChance, color, colors, maxOpacity, width, height, shape } = toRefs(props)

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
const context = ref<CanvasRenderingContext2D>()
const isInView = ref(false)
const canvasSize = ref({ width: 0, height: 0 })

// Parse color string → "rgba(r,g,b," prefix
function parseColor(c: string): string {
  const rgbMatch = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]},`
  const hex = c.replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map(x => x + x).join('') : hex
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b},`
}

// Resolved colors with cumulative weights
const resolvedColors = computed(() => {
  const list = colors.value && colors.value.length > 0
    ? colors.value
    : [{ color: color.value, weight: 1 }]
  const total = list.reduce((s, c) => s + c.weight, 0)
  let acc = 0
  return list.map(e => ({ rgba: parseColor(e.color), cumulative: (acc += e.weight / total) }))
})

function pickColorIndex(): number {
  const rand = Math.random()
  const cl = resolvedColors.value
  for (let k = 0; k < cl.length; k++) {
    if (rand <= cl[k].cumulative) return k
  }
  return cl.length - 1
}

interface GridParams {
  cols: number
  rows: number
  squares: Float32Array
  colorIndices: Uint8Array
  dpr: number
  offsetX: number
  offsetY: number
}

// Initial setup — creates all dot data
function setupCanvas(canvas: HTMLCanvasElement, w: number, h: number): GridParams {
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr

  const step = squareSize.value + gridGap.value
  const cols = Math.floor(w / step)
  const rows = Math.floor(h / step)
  const count = cols * rows

  const squares = new Float32Array(count)
  const colorIndices = new Uint8Array(count)
  for (let i = 0; i < count; i++) {
    squares[i] = Math.random() * maxOpacity.value
    colorIndices[i] = pickColorIndex()
  }

  return {
    cols, rows, squares, colorIndices, dpr,
    offsetX: ((w - cols * step) / 2) * dpr,
    offsetY: ((h - rows * step) / 2) * dpr,
  }
}

// Resize — preserves existing dot data, only fills new slots
function resizeCanvas(canvas: HTMLCanvasElement, w: number, h: number, p: GridParams): GridParams {
  const dpr = window.devicePixelRatio || 1
  canvas.width = w * dpr
  canvas.height = h * dpr

  const step = squareSize.value + gridGap.value
  const newCols = Math.floor(w / step)
  const newRows = Math.floor(h / step)
  const offsetX = ((w - newCols * step) / 2) * dpr
  const offsetY = ((h - newRows * step) / 2) * dpr

  // If grid dimensions unchanged, just update offsets
  if (newCols === p.cols && newRows === p.rows) {
    p.offsetX = offsetX
    p.offsetY = offsetY
    return p
  }

  // Rebuild arrays, preserving data for overlapping region
  const newCount = newCols * newRows
  const newSquares = new Float32Array(newCount)
  const newColorIndices = new Uint8Array(newCount)

  for (let i = 0; i < newCols; i++) {
    for (let j = 0; j < newRows; j++) {
      const newIdx = i * newRows + j
      if (i < p.cols && j < p.rows) {
        // Preserve existing dot
        const oldIdx = i * p.rows + j
        newSquares[newIdx] = p.squares[oldIdx]
        newColorIndices[newIdx] = p.colorIndices[oldIdx]
      }
      else {
        // Newly visible area — initialise fresh
        newSquares[newIdx] = Math.random() * maxOpacity.value
        newColorIndices[newIdx] = pickColorIndex()
      }
    }
  }

  return { cols: newCols, rows: newRows, squares: newSquares, colorIndices: newColorIndices, dpr, offsetX, offsetY }
}

// Flicker: only update opacity; re-roll color so brand positions shift randomly
function updateSquares(squares: Float32Array, colorIndices: Uint8Array, deltaTime: number) {
  for (let i = 0; i < squares.length; i++) {
    if (Math.random() < flickerChance.value * deltaTime) {
      squares[i] = Math.random() * maxOpacity.value
      colorIndices[i] = pickColorIndex()
    }
  }
}

function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, p: GridParams) {
  ctx.clearRect(0, 0, w, h)
  const dpr = p.dpr
  const size = squareSize.value * dpr
  const step = (squareSize.value + gridGap.value) * dpr
  const radius = size / 2
  const cl = resolvedColors.value

  for (let i = 0; i < p.cols; i++) {
    for (let j = 0; j < p.rows; j++) {
      const idx = i * p.rows + j
      const opacity = p.squares[idx]
      const { rgba } = cl[p.colorIndices[idx]] ?? cl[0]
      ctx.fillStyle = `${rgba}${opacity})`
      const x = p.offsetX + i * step
      const y = p.offsetY + j * step
      if (shape.value === 'circle') {
        ctx.beginPath()
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2)
        ctx.fill()
      }
      else {
        ctx.fillRect(x, y, size, size)
      }
    }
  }
}

const gridParams = ref<GridParams>()

function updateCanvasSize() {
  const newWidth = width.value || containerRef.value!.clientWidth
  const newHeight = height.value || containerRef.value!.clientHeight
  canvasSize.value = { width: newWidth, height: newHeight }
  if (!gridParams.value) {
    gridParams.value = setupCanvas(canvasRef.value!, newWidth, newHeight)
  }
  else {
    gridParams.value = resizeCanvas(canvasRef.value!, newWidth, newHeight, gridParams.value)
  }
}

let animationFrameId: number | undefined
let resizeObserver: ResizeObserver | undefined
let intersectionObserver: IntersectionObserver | undefined
let lastTime = 0

function animate(time: number) {
  if (!isInView.value) return
  const deltaTime = (time - lastTime) / 1000
  lastTime = time
  const p = gridParams.value!
  updateSquares(p.squares, p.colorIndices, deltaTime)
  drawGrid(context.value!, canvasRef.value!.width, canvasRef.value!.height, p)
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  if (!canvasRef.value || !containerRef.value) return
  context.value = canvasRef.value.getContext('2d')!
  if (!context.value) return
  updateCanvasSize()
  resizeObserver = new ResizeObserver(() => updateCanvasSize())
  intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      isInView.value = entry.isIntersecting
      if (isInView.value) animationFrameId = requestAnimationFrame(animate)
    },
    { threshold: 0 },
  )
  resizeObserver.observe(containerRef.value)
  intersectionObserver.observe(canvasRef.value)
})

onBeforeUnmount(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  resizeObserver?.disconnect()
  intersectionObserver?.disconnect()
})
</script>

<template>
  <div ref="containerRef" :class="cn('h-full w-full', props.class)">
    <canvas
      ref="canvasRef"
      class="pointer-events-none flicker-canvas"
    />
  </div>
</template>

<style scoped>
.flicker-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
