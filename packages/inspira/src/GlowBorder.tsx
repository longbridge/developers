interface GlowBorderProps {
  borderRadius?: number
  color?: string | string[]
  borderWidth?: number
  duration?: number
}

const glowKeyframes = `
@keyframes inspira-glow-spin {
  0% { background-position: 0% 0%; }
  50% { background-position: 100% 100%; }
  100% { background-position: 0% 0%; }
}
`

export function GlowBorder({
  borderRadius = 12,
  color = ['var(--brand-color)', 'var(--cyan-60)'],
  borderWidth = 2,
  duration = 10,
}: GlowBorderProps) {
  const colorStr = Array.isArray(color) ? color.join(',') : color

  return (
    <>
      <style>{glowKeyframes}</style>
      <div
        data-lbus-component="inspira-glow-border"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          willChange: 'background-position',
          animation: `inspira-glow-spin ${duration}s linear infinite`,
          backgroundImage: `radial-gradient(transparent, transparent, ${colorStr}, transparent, transparent)`,
          backgroundSize: '300% 300%',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: `${borderWidth}px`,
          borderRadius: `${borderRadius}px`,
        } as React.CSSProperties}
      />
    </>
  )
}
