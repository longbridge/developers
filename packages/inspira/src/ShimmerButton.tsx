import { cn } from '@inspira-ui/plugins'
import type { ReactNode } from 'react'

const shimmerButtonStyles = `
@keyframes inspira-shimmer-slide {
  to { transform: translate(100%, 0); }
}
@keyframes inspira-spin-around {
  0%            { transform: translateZ(0) rotate(0); }
  15%, 35%      { transform: translateZ(0) rotate(90deg); }
  65%, 85%      { transform: translateZ(0) rotate(270deg); }
  100%          { transform: translateZ(0) rotate(360deg); }
}
.inspira-shimmer-slide {
  animation: inspira-shimmer-slide var(--speed) ease-in-out infinite alternate;
}
.inspira-spin-around {
  animation: inspira-spin-around calc(var(--speed) * 2) infinite linear;
}
`

interface ShimmerButtonProps {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: ReactNode
  onClick?: () => void
}

export function ShimmerButton({
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  borderRadius = '100px',
  shimmerDuration = '3s',
  background = 'rgba(0, 0, 0, 1)',
  className,
  children,
  onClick,
}: ShimmerButtonProps) {
  return (
    <>
      <style>{shimmerButtonStyles}</style>
      <button
        data-lbus-component="inspira-shimmer-button"
        onClick={onClick}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        className={cn(
          'group relative z-0 flex transform-gpu cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-white/10 px-6 py-3 text-white transition-transform duration-300 ease-in-out active:translate-y-px dark:text-black [background:var(--bg)] [border-radius:var(--radius)]',
          className,
        )}
      >
        <div className="absolute inset-0 -z-30 overflow-visible blur-[2px]">
          <div className="inspira-shimmer-slide absolute inset-0 aspect-square h-full rounded-none">
            <div className="inspira-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>
        {children}
        <div className="absolute inset-0 size-full transform-gpu rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#ffffff3f] group-active:shadow-[inset_0_-10px_10px_#ffffff3f]" />
        <div
          className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)]"
          style={{ inset: 'var(--cut)' }}
        />
      </button>
    </>
  )
}
