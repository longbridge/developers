import { cn } from '@inspira-ui/plugins'
import type { ReactNode } from 'react'

const textHighlightStyles = `
@keyframes inspira-highlight-bg {
  from { background-size: 0% 100%; }
  to   { background-size: 200% 100%; }
}
@keyframes inspira-highlight-text {
  from { color: inherit; }
  to   { color: var(--text-end-color); }
}
.inspira-text-highlight {
  background: linear-gradient(to right, var(--brand-color, #00b8b8) 50%, transparent 50%);
  background-size: 0% 100%;
  background-repeat: no-repeat;
  background-position: left center;
  padding: 0 0.15em;
  border-radius: 0.15em;
  animation:
    inspira-highlight-bg var(--duration) ease-in-out var(--delay) forwards,
    inspira-highlight-text var(--duration) ease-in-out var(--delay) forwards;
}
`

interface TextHighlightProps {
  delay?: number
  duration?: number
  textEndColor?: string
  className?: string
  children?: ReactNode
}

export function TextHighlight({
  delay = 0,
  duration = 2000,
  textEndColor = 'inherit',
  className,
  children,
}: TextHighlightProps) {
  return (
    <>
      <style>{textHighlightStyles}</style>
      <span
        data-lbus-component="inspira-text-highlight"
        className={cn('inspira-text-highlight inline-block', className)}
        style={
          {
            '--delay': `${delay}ms`,
            '--duration': `${duration}ms`,
            '--text-end-color': textEndColor,
          } as React.CSSProperties
        }
      >
        {children}
      </span>
    </>
  )
}
