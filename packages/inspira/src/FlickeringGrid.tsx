import { cn } from '@inspira-ui/plugins'
import { useEffect, useMemo, useRef } from 'react'

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
  className?: string
  maxOpacity?: number
  shape?: 'square' | 'circle'
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

function parseColor(c: string): string {
  const rgbMatch = c.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]},`
  const hex = c.replace(/^#/, '')
  const full = hex.length === 3 ? hex.split('').map((x) => x + x).join('') : hex
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b},`
}

export function FlickeringGrid({
  squareSize = 4,
  gridGap = 6,
  flickerChance = 0.3,
  color = 'rgb(0, 0, 0)',
  colors,
  width,
  height,
  className,
  maxOpacity = 0.3,
  shape = 'square',
}: FlickeringGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const resolvedColors = useMemo(() => {
    const list =
      colors && colors.length > 0 ? colors : [{ color, weight: 1 }]
    const total = list.reduce((s, c) => s + c.weight, 0)
    let acc = 0
    return list.map((e) => ({
      rgba: parseColor(e.color),
      cumulative: (acc += e.weight / total),
    }))
  }, [color, colors])

  // Keep a stable ref so canvas callbacks always see latest props
  const propsRef = useRef({
    squareSize,
    gridGap,
    flickerChance,
    maxOpacity,
    shape,
    resolvedColors,
    width,
    height,
  })
  propsRef.current = { squareSize, gridGap, flickerChance, maxOpacity, shape, resolvedColors, width, height }

  useEffect(() => {
    const canvasRaw = canvasRef.current
    const containerRaw = containerRef.current
    if (!canvasRaw || !containerRaw) return
    const canvas = canvasRaw as HTMLCanvasElement
    const container = containerRaw as HTMLDivElement

    const ctxRaw = canvas.getContext('2d')
    if (!ctxRaw) return
    const ctx = ctxRaw as CanvasRenderingContext2D

    let gridParams: GridParams | null = null
    let animationFrameId: number
    let isInView = false
    let lastTime = 0

    function pickColorIndex(): number {
      const rand = Math.random()
      const cl = propsRef.current.resolvedColors
      for (let k = 0; k < cl.length; k++) {
        if (rand <= cl[k].cumulative) return k
      }
      return cl.length - 1
    }

    function setupCanvas(w: number, h: number): GridParams {
      const { squareSize, gridGap, maxOpacity } = propsRef.current
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      const step = squareSize + gridGap
      const cols = Math.floor(w / step)
      const rows = Math.floor(h / step)
      const count = cols * rows
      const squares = new Float32Array(count)
      const colorIndices = new Uint8Array(count)
      for (let i = 0; i < count; i++) {
        squares[i] = Math.random() * maxOpacity
        colorIndices[i] = pickColorIndex()
      }
      return {
        cols, rows, squares, colorIndices, dpr,
        offsetX: ((w - cols * step) / 2) * dpr,
        offsetY: ((h - rows * step) / 2) * dpr,
      }
    }

    function resizeCanvas(w: number, h: number, p: GridParams): GridParams {
      const { squareSize, gridGap, maxOpacity } = propsRef.current
      const dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      const step = squareSize + gridGap
      const newCols = Math.floor(w / step)
      const newRows = Math.floor(h / step)
      const offsetX = ((w - newCols * step) / 2) * dpr
      const offsetY = ((h - newRows * step) / 2) * dpr
      if (newCols === p.cols && newRows === p.rows) {
        p.offsetX = offsetX
        p.offsetY = offsetY
        return p
      }
      const newCount = newCols * newRows
      const newSquares = new Float32Array(newCount)
      const newColorIndices = new Uint8Array(newCount)
      for (let i = 0; i < newCols; i++) {
        for (let j = 0; j < newRows; j++) {
          const newIdx = i * newRows + j
          if (i < p.cols && j < p.rows) {
            const oldIdx = i * p.rows + j
            newSquares[newIdx] = p.squares[oldIdx]
            newColorIndices[newIdx] = p.colorIndices[oldIdx]
          } else {
            newSquares[newIdx] = Math.random() * maxOpacity
            newColorIndices[newIdx] = pickColorIndex()
          }
        }
      }
      return { cols: newCols, rows: newRows, squares: newSquares, colorIndices: newColorIndices, dpr, offsetX, offsetY }
    }

    function updateSquares(squares: Float32Array, colorIndices: Uint8Array, deltaTime: number) {
      const { flickerChance, maxOpacity } = propsRef.current
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity
          colorIndices[i] = pickColorIndex()
        }
      }
    }

    function drawGrid(w: number, h: number, p: GridParams) {
      ctx.clearRect(0, 0, w, h)
      const { squareSize, gridGap, shape } = propsRef.current
      const cl = propsRef.current.resolvedColors
      const dpr = p.dpr
      const size = squareSize * dpr
      const step = (squareSize + gridGap) * dpr
      const radius = size / 2
      for (let i = 0; i < p.cols; i++) {
        for (let j = 0; j < p.rows; j++) {
          const idx = i * p.rows + j
          const opacity = p.squares[idx]
          const { rgba } = cl[p.colorIndices[idx]] ?? cl[0]
          ctx.fillStyle = `${rgba}${opacity})`
          const x = p.offsetX + i * step
          const y = p.offsetY + j * step
          if (shape === 'circle') {
            ctx.beginPath()
            ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.fillRect(x, y, size, size)
          }
        }
      }
    }

    function updateCanvasSize() {
      const p = propsRef.current
      const newWidth = p.width ?? container.clientWidth
      const newHeight = p.height ?? container.clientHeight
      if (!gridParams) {
        gridParams = setupCanvas(newWidth, newHeight)
      } else {
        gridParams = resizeCanvas(newWidth, newHeight, gridParams)
      }
    }

    function animate(time: number) {
      if (!isInView || !gridParams) return
      const deltaTime = (time - lastTime) / 1000
      lastTime = time
      updateSquares(gridParams.squares, gridParams.colorIndices, deltaTime)
      drawGrid(canvas.width, canvas.height, gridParams)
      animationFrameId = requestAnimationFrame(animate)
    }

    updateCanvasSize()

    const resizeObserver = new ResizeObserver(() => updateCanvasSize())
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry.isIntersecting
        if (isInView) animationFrameId = requestAnimationFrame(animate)
      },
      { threshold: 0 },
    )
    resizeObserver.observe(container)
    intersectionObserver.observe(canvas)

    return () => {
      cancelAnimationFrame(animationFrameId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  return (
    <div
      data-lbus-component="inspira-flickering-grid"
      ref={containerRef}
      className={cn('h-full w-full', className)}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        className="pointer-events-none"
      />
    </div>
  )
}
