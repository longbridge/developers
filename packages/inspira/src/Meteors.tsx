import { cn } from '@inspira-ui/plugins'
import { useMemo } from 'react'

const meteorStyles = `
.inspira-meteor-particle {
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 9999px;
  background: var(--brand-color);
  opacity: 0;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
  animation: inspira-meteor-fall 5s linear infinite;
}
.inspira-meteor-particle::before {
  content: '';
  position: absolute;
  top: 50%;
  width: 50px;
  height: 1px;
  transform: translateY(-50%);
  background: linear-gradient(to right, var(--brand-color), transparent);
}
@keyframes inspira-meteor-fall {
  0% { transform: rotate(215deg) translateX(0); opacity: 1; }
  70% { opacity: 1; }
  100% { transform: rotate(215deg) translateX(-500px); opacity: 0; }
}
`

interface MeteorsProps {
  count?: number
  className?: string
}

export function Meteors({ count = 20, className }: MeteorsProps) {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        key: `meteor-${i}`,
        left: `${Math.floor(Math.random() * 800 - 400)}px`,
        animationDelay: `${Math.random() * 0.6 + 0.2}s`,
        animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
      })),
    [count],
  )

  return (
    <>
      <style>{meteorStyles}</style>
      {meteors.map(({ key, left, animationDelay, animationDuration }) => (
        <span
          key={key}
          data-lbus-component="inspira-meteors"
          className={cn('inspira-meteor-particle', className)}
          style={{ top: 0, left, animationDelay, animationDuration }}
        />
      ))}
    </>
  )
}
