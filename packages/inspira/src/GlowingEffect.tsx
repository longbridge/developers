import { useEffect, useRef, useState } from 'react'

interface GlowingEffectProps {
  spread?: number
  proximity?: number
  disabled?: boolean
  borderWidth?: number
}

export function GlowingEffect({
  spread = 30,
  proximity = 80,
  disabled = false,
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)
  const [angle, setAngle] = useState(0)
  const rafRef = useRef<number>(0)
  const currentAngleRef = useRef<number>(0)

  useEffect(() => {
    if (disabled) return

    function handlePointerMove(e: PointerEvent) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const el = containerRef.current
        if (!el) return
        const { left, top, width, height } = el.getBoundingClientRect()

        const near =
          e.clientX > left - proximity &&
          e.clientX < left + width + proximity &&
          e.clientY > top - proximity &&
          e.clientY < top + height + proximity

        setIsActive(near)

        if (near) {
          const cx = left + width / 2
          const cy = top + height / 2
          const target = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) + 90
          const diff = ((target - currentAngleRef.current + 180) % 360) - 180
          currentAngleRef.current += diff
          setAngle(currentAngleRef.current)
        }
      })
    }

    document.addEventListener('pointermove', handlePointerMove, { passive: true })
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      document.removeEventListener('pointermove', handlePointerMove)
    }
  }, [disabled, proximity, spread])

  const rad = (angle - 90) * (Math.PI / 180)
  const x = 50 + Math.cos(rad) * 50
  const y = 50 + Math.sin(rad) * 50

  return (
    <div
      data-lbus-component="inspira-glowing-effect"
      ref={containerRef}
      style={{
        pointerEvents: 'none',
        position: 'absolute',
        inset: '-3px',
        borderRadius: 'inherit',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          transition: 'opacity 0.3s ease',
          filter: 'blur(6px)',
          opacity: isActive ? 1 : 0,
          background: `radial-gradient(circle at ${x}% ${y}%, color-mix(in srgb, var(--brand-color) 25%, transparent) 0%, color-mix(in srgb, var(--cyan-60, #66dada) 10%, transparent) 35%, transparent 55%)`,
        }}
      />
    </div>
  )
}
