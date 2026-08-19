import { cn } from '@inspira-ui/plugins'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface BoxRevealProps {
  color?: string
  duration?: number
  delay?: number
  className?: string
  children?: ReactNode
}

export function BoxReveal({
  color = '#5046e6',
  duration = 0.5,
  delay = 0.25,
  className,
  children,
}: BoxRevealProps) {
  return (
    <div data-lbus-component="inspira-box-reveal" className={cn('relative overflow-hidden', className)}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration, delay: delay * 2 }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0 z-20"
        style={{ background: color }}
        initial={{ left: '0%' }}
        whileInView={{ left: '100%' }}
        transition={{ duration, ease: 'easeIn', delay }}
      />
    </div>
  )
}
