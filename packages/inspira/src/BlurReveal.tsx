import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Children } from 'react'

interface BlurRevealProps {
  duration?: number
  delay?: number
  blur?: string
  yOffset?: number
  className?: string
  children?: ReactNode
}

export function BlurReveal({
  duration = 1,
  delay = 2,
  blur = '20px',
  yOffset = 20,
  className,
  children,
}: BlurRevealProps) {
  const items = Children.toArray(children)

  return (
    <div data-lbus-component="inspira-blur-reveal" className={className}>
      {items.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, filter: `blur(${blur})`, y: yOffset }}
          whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
          transition={{ duration, ease: 'easeInOut', delay: delay * index }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
