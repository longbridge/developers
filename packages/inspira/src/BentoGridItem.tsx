import { cn } from '@inspira-ui/plugins'
import type { ReactNode } from 'react'

interface BentoGridItemProps {
  className?: string
  header?: ReactNode
  icon?: ReactNode
  title?: ReactNode
  description?: ReactNode
}

export function BentoGridItem({ className, header, icon, title, description }: BentoGridItemProps) {
  return (
    <div
      data-lbus-component="inspira-bento-grid-item"
      className={cn(
        'group/bento shadow-input row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-transparent bg-white p-4 transition duration-200 hover:shadow-xl dark:border-white/20 dark:bg-black dark:shadow-none',
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <div className="my-2 font-sans font-bold text-neutral-600 dark:text-neutral-200">
          {title}
        </div>
        <div className="font-sans text-xs font-normal text-neutral-600 dark:text-neutral-300">
          {description}
        </div>
      </div>
    </div>
  )
}
