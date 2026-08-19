import { cn } from '@inspira-ui/plugins'
import { useState } from 'react'

interface InteractiveGridPatternProps {
  className?: string
  squaresClassName?: string
  width?: number
  height?: number
  squares?: [number, number]
}

export function InteractiveGridPattern({
  className,
  squaresClassName,
  width = 40,
  height = 40,
  squares = [24, 24],
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares
  const totalSquares = horizontal * vertical
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null)
  const gridWidth = width * horizontal
  const gridHeight = height * vertical

  function getX(index: number) {
    return (index % horizontal) * width
  }

  function getY(index: number) {
    return Math.floor(index / horizontal) * height
  }

  return (
    <svg
      data-lbus-component="inspira-interactive-grid-pattern"
      width={gridWidth}
      height={gridHeight}
      className={cn('absolute inset-0 h-full w-full border border-gray-400/30', className)}
    >
      {Array.from({ length: totalSquares }).map((_, index) => (
        <rect
          key={index}
          x={getX(index)}
          y={getY(index)}
          width={width}
          height={height}
          className={cn(
            'stroke-gray-400/30 transition-all duration-100 ease-in-out not-[&:hover]:duration-1000',
            hoveredSquare === index ? 'fill-gray-300/30' : 'fill-transparent',
            squaresClassName,
          )}
          onMouseEnter={() => setHoveredSquare(index)}
          onMouseLeave={() => setHoveredSquare(null)}
        />
      ))}
    </svg>
  )
}
