import { cn } from '@inspira-ui/plugins'

interface InteractiveHoverButtonProps {
  text?: string
  className?: string
  dotColor?: string
  hoverTextColor?: string
  onClick?: () => void
}

export function InteractiveHoverButton({
  text = 'Button',
  className,
  dotColor = 'var(--brand-100, #00b8b8)',
  hoverTextColor = 'inherit',
  onClick,
}: InteractiveHoverButtonProps) {
  return (
    <button
      data-lbus-component="inspira-interactive-hover-button"
      onClick={onClick}
      className={cn(
        'group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className="size-2 scale-100 rounded-full transition-all duration-300 group-hover:scale-[100.8]"
          style={{ background: dotColor }}
        />
        <span className="inline-block whitespace-nowrap transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {text}
        </span>
      </div>
      <div
        className="absolute top-0 z-10 flex size-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100"
        style={{ color: hoverTextColor }}
      >
        <span className="whitespace-nowrap">{text}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </button>
  )
}
