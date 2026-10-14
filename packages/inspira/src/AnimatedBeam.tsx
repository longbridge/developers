import { cn } from '@inspira-ui/plugins'
import { useEffect, useMemo, useRef, useState } from 'react'

interface AnimatedBeamProps {
  className?: string
  containerRef: React.RefObject<HTMLElement>
  fromRef: React.RefObject<HTMLElement>
  toRef: React.RefObject<HTMLElement>
  curvature?: number
  reverse?: boolean
  pathColor?: string
  pathWidth?: number
  pathOpacity?: number
  gradientStartColor?: string
  gradientStopColor?: string
  delay?: number
  duration?: number
  startXOffset?: number
  startYOffset?: number
  endXOffset?: number
  endYOffset?: number
}

interface SvgState {
  pathD: string
  width: number
  height: number
  isVertical: boolean
  isRightToLeft: boolean
  isBottomToTop: boolean
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = 'gray',
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = '#FFAA40',
  gradientStopColor = '#9C40FF',
  delay = 0,
  duration,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useMemo(() => `beam-${Math.random().toString(36).substring(2, 10)}`, [])
  const resolvedDuration = useMemo(() => duration ?? Math.random() * 3 + 4, [duration])

  const [svgState, setSvgState] = useState<SvgState>({
    pathD: '',
    width: 0,
    height: 0,
    isVertical: false,
    isRightToLeft: false,
    isBottomToTop: false,
  })

  const updatePath = useRef(() => {})
  updatePath.current = () => {
    const container = containerRef.current
    const from = fromRef.current
    const to = toRef.current
    if (!container || !from || !to) return

    const containerRect = container.getBoundingClientRect()
    const rectA = from.getBoundingClientRect()
    const rectB = to.getBoundingClientRect()

    const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
    const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
    const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
    const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

    const isVertical = Math.abs(endY - startY) > Math.abs(endX - startX)
    const isRightToLeft = endX < startX
    const isBottomToTop = endY < startY

    const controlY = startY - curvature
    const pathD = `M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`

    setSvgState({
      pathD,
      width: containerRect.width,
      height: containerRect.height,
      isVertical,
      isRightToLeft,
      isBottomToTop,
    })
  }

  useEffect(() => {
    requestAnimationFrame(() => updatePath.current())

    const container = containerRef.current
    if (!container) return
    const observer = new ResizeObserver(() => updatePath.current())
    observer.observe(container)
    return () => observer.disconnect()
  }, [containerRef, fromRef, toRef])

  const { pathD, width, height, isVertical, isRightToLeft, isBottomToTop } = svgState

  const x1 = reverse !== isRightToLeft ? '90%; -10%;' : '10%; 110%;'
  const x2 = reverse !== isRightToLeft ? '100%; 0%;' : '0%; 100%;'
  const y1 = reverse !== isBottomToTop ? '90%; -10%;' : '10%; 110%;'
  const y2 = reverse !== isBottomToTop ? '100%; 0%;' : '0%; 100%;'

  const durStr = `${resolvedDuration}s`

  if (!pathD) return null

  return (
    <svg
      data-lbus-component="inspira-animated-beam"
      fill="none"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      className={cn('pointer-events-none absolute top-0 left-0 transform-gpu stroke-2', className)}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      <path
        d={pathD}
        strokeWidth={pathWidth}
        stroke={`url(#${id})`}
        strokeOpacity={1}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          x1="0%"
          x2="0%"
          y1="0%"
          y2="0%"
        >
          <stop stopColor={gradientStartColor} stopOpacity={0} />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity={0} />
          {!isVertical && (
            <>
              <animate
                attributeName="x1"
                values={x1}
                dur={durStr}
                keyTimes="0; 1"
                keySplines="0.16 1 0.3 1"
                calcMode="spline"
                repeatCount="indefinite"
                begin={delay > 0 ? `${delay}s` : undefined}
              />
              <animate
                attributeName="x2"
                values={x2}
                dur={durStr}
                keyTimes="0; 1"
                keySplines="0.16 1 0.3 1"
                calcMode="spline"
                repeatCount="indefinite"
                begin={delay > 0 ? `${delay}s` : undefined}
              />
            </>
          )}
          {isVertical && (
            <>
              <animate
                attributeName="y1"
                values={y1}
                dur={durStr}
                keyTimes="0; 1"
                keySplines="0.16 1 0.3 1"
                calcMode="spline"
                repeatCount="indefinite"
                begin={delay > 0 ? `${delay}s` : undefined}
              />
              <animate
                attributeName="y2"
                values={y2}
                dur={durStr}
                keyTimes="0; 1"
                keySplines="0.16 1 0.3 1"
                calcMode="spline"
                repeatCount="indefinite"
                begin={delay > 0 ? `${delay}s` : undefined}
              />
            </>
          )}
        </linearGradient>
      </defs>
    </svg>
  )
}
