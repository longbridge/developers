import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const DEFAULT_COLORS = [
  'rgb(131, 179, 32)',
  'rgb(47, 195, 106)',
  'rgb(42, 169, 210)',
  'rgb(4, 112, 202)',
  'rgb(107, 10, 255)',
  'rgb(183, 0, 218)',
  'rgb(218, 0, 171)',
  'rgb(230, 64, 92)',
  'rgb(232, 98, 63)',
  'rgb(249, 129, 47)',
]

interface ColourfulTextProps {
  text: string
  colors?: string[]
  startColor?: string
  duration?: number
}

export function ColourfulText({
  text,
  colors = DEFAULT_COLORS,
  startColor = 'rgb(255,255,255)',
  duration = 0.5,
}: ColourfulTextProps) {
  const [currentColors, setCurrentColors] = useState<string[]>(colors)
  const [count, setCount] = useState(0)
  const lastHiddenRef = useRef<number>(0)

  useEffect(() => {
    const id = setInterval(() => {
      const shuffled = [...colors].sort(() => 0.5 - Math.random())
      setCurrentColors(shuffled)
      if (document.visibilityState === 'visible') {
        if (Date.now() - lastHiddenRef.current > 500) {
          setCount((c) => c + 1)
        }
      } else {
        lastHiddenRef.current = Date.now()
      }
    }, 5000)
    return () => clearInterval(id)
  }, [colors])

  return (
    <>
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          data-lbus-component="inspira-colourful-text"
          initial={{ y: 0, opacity: 0.2, color: startColor, scale: 1, filter: 'blur(5px)' }}
          transition={{ duration, delay: index * 0.05 }}
          animate={{
            y: [0, -3, 0],
            opacity: [1, 0.8, 1],
            scale: [1, 1.01, 1],
            filter: ['blur(0px)', 'blur(5px)', 'blur(0px)'],
            color: currentColors[index % currentColors.length],
          }}
          exit={{ y: -3, opacity: 1, scale: 1, filter: 'blur(5px)', color: startColor }}
        >
          {char}
        </motion.span>
      ))}
    </>
  )
}
