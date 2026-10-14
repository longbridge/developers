import type { SidebarNode } from '@longbridge/openapi-utils'

interface Props {
  prev: SidebarNode | null
  next: SidebarNode | null
}

export default function PrevNext({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav className="border-t border-[color:var(--lb-stroke)] mt-8 pt-6" data-lbus-component="prev-next" aria-label="Previous and next page">
      <div className="flex gap-4">
        {prev?.link ? (
          <a href={prev.link} className="flex flex-col gap-1 flex-1 no-underline text-[color:var(--lbus-c-text)] hover:text-[color:var(--lb-brand)]">
            <span className="text-[color:var(--lb-fg-2)] text-sm" aria-hidden="true">←</span>
            <span className="text-xs text-[color:var(--lb-fg-2)] uppercase tracking-wide">Previous</span>
            <span className="font-medium text-sm">{prev.label}</span>
          </a>
        ) : (
          <span />
        )}
        {next?.link ? (
          <a href={next.link} className="flex flex-col gap-1 flex-1 items-end text-right no-underline text-[color:var(--lbus-c-text)] hover:text-[color:var(--lb-brand)] ml-auto">
            <span className="text-[color:var(--lb-fg-2)] text-sm" aria-hidden="true">→</span>
            <span className="text-xs text-[color:var(--lb-fg-2)] uppercase tracking-wide">Next</span>
            <span className="font-medium text-sm">{next.label}</span>
          </a>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
