import { cn } from '@inspira-ui/plugins'
import type { ReactNode } from 'react'

const marqueeStyles = `
@keyframes inspira-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-100% - var(--gap))); }
}
@keyframes inspira-marquee-vertical {
  from { transform: translateY(0); }
  to { transform: translateY(calc(-100% - var(--gap))); }
}
.inspira-animate-marquee {
  animation: inspira-marquee var(--duration) linear infinite;
}
.inspira-animate-marquee-vertical {
  animation: inspira-marquee-vertical var(--duration) linear infinite;
}
`

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  vertical?: boolean
  repeat?: number
  children?: ReactNode
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
}: MarqueeProps) {
  return (
    <>
      <style>{marqueeStyles}</style>
      <div
        data-lbus-component="inspira-marquee"
        className={cn(
          'group flex gap-[--gap] overflow-hidden p-2 [--duration:40s] [--gap:1rem]',
          vertical ? 'flex-col' : 'flex-row',
          className,
        )}
      >
        {Array.from({ length: repeat }).map((_, index) => (
          <div
            key={index}
            style={{ animationDirection: reverse ? 'reverse' : 'normal' }}
            className={cn(
              'flex shrink-0 justify-around gap-[--gap]',
              vertical
                ? 'inspira-animate-marquee-vertical flex-col'
                : 'inspira-animate-marquee flex-row',
              pauseOnHover ? 'group-hover:[animation-play-state:paused]' : '',
            )}
          >
            {children}
          </div>
        ))}
      </div>
    </>
  )
}
