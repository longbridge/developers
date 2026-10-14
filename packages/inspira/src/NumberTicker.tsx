import { cn } from '@inspira-ui/plugins'
import { useEffect, useRef, useState } from 'react'

interface NumberTickerProps {
  value?: number
  direction?: 'up' | 'down'
  duration?: number
  delay?: number
  decimalPlaces?: number
  className?: string
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export function NumberTicker({
  value = 0,
  direction = 'up',
  duration = 1000,
  delay = 0,
  decimalPlaces = 0,
  className,
}: NumberTickerProps) {
  const spanRef = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(direction === 'down' ? value : 0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const startVal = direction === 'down' ? value : 0
    const endVal = direction === 'down' ? 0 : value
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp + delay
      const elapsed = Math.max(0, timestamp - startTime)
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      setDisplayValue(startVal + (endVal - startVal) * eased)
      if (progress < 1) requestAnimationFrame(step)
    }

    const rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [started, value, direction, duration, delay])

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(displayValue.toFixed(decimalPlaces)))

  return (
    <span
      data-lbus-component="inspira-number-ticker"
      ref={spanRef}
      className={cn('inline-block tracking-wider tabular-nums', className)}
    >
      {formatted}
    </span>
  )
}
