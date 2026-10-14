import { cn } from '@inspira-ui/plugins'
import { useEffect, useRef } from 'react'

interface MorphingTextProps {
  texts: string[]
  morphTime?: number
  coolDownTime?: number
  className?: string
}

const TEXT_CLASSES = 'absolute inset-x-0 top-0 m-auto inline-block w-full'

export function MorphingText({
  texts,
  morphTime = 1.5,
  coolDownTime = 0.5,
  className,
}: MorphingTextProps) {
  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)
  const stateRef = useRef({
    textIndex: 0,
    morph: 0,
    coolDown: 0,
    lastTime: Date.now(),
  })

  useEffect(() => {
    const state = stateRef.current

    function setStyles(fraction: number) {
      const t1 = text1Ref.current
      const t2 = text2Ref.current
      if (!t1 || !t2) return
      t2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`
      t2.style.opacity = `${fraction ** 0.4 * 100}%`
      const inv = 1 - fraction
      t1.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`
      t1.style.opacity = `${inv ** 0.4 * 100}%`
      t1.textContent = texts[state.textIndex % texts.length]
      t2.textContent = texts[(state.textIndex + 1) % texts.length]
    }

    function doMorph() {
      state.morph -= state.coolDown
      state.coolDown = 0
      let fraction = state.morph / morphTime
      if (fraction > 1) {
        state.coolDown = coolDownTime
        fraction = 1
      }
      setStyles(fraction)
      if (fraction === 1) state.textIndex++
    }

    function doCoolDown() {
      state.morph = 0
      const t1 = text1Ref.current
      const t2 = text2Ref.current
      if (!t1 || !t2) return
      t2.style.filter = 'none'
      t2.style.opacity = '100%'
      t1.style.filter = 'none'
      t1.style.opacity = '0%'
    }

    let rafId: number
    function animate() {
      rafId = requestAnimationFrame(animate)
      const now = Date.now()
      const dt = (now - state.lastTime) / 1000
      state.lastTime = now
      state.coolDown -= dt
      if (state.coolDown <= 0) doMorph()
      else doCoolDown()
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [texts, morphTime, coolDownTime])

  return (
    <div
      data-lbus-component="inspira-morphing-text"
      className={cn(
        'relative mx-auto inline-block w-full text-center font-sans font-bold filter-[url(#threshold)_blur(0.6px)]',
        className,
      )}
    >
      <span ref={text1Ref} className={TEXT_CLASSES} />
      <span ref={text2Ref} className={TEXT_CLASSES} />
      <svg id="filters" className="fixed size-0" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
