import { cn } from '@inspira-ui/plugins'
import type { ReactNode } from 'react'

interface BentoGridProps {
  className?: string
  children?: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      data-lbus-component="inspira-bento-grid"
      className={cn(
        'mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
