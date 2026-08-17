import type { SidebarNode } from '../../lib/navigation'

interface Props {
  prev: SidebarNode | null
  next: SidebarNode | null
}

export default function PrevNext({ prev, next }: Props) {
  if (!prev && !next) return null

  return (
    <nav className="prev-next" data-lbus-component="prev-next" aria-label="Previous and next page">
      <div className="prev-next-inner">
        {prev?.link ? (
          <a href={prev.link} className="prev-next-link prev-next-prev">
            <span className="prev-next-dir" aria-hidden="true">←</span>
            <span className="prev-next-label">Previous</span>
            <span className="prev-next-title">{prev.label}</span>
          </a>
        ) : (
          <span />
        )}
        {next?.link ? (
          <a href={next.link} className="prev-next-link prev-next-next">
            <span className="prev-next-label">Next</span>
            <span className="prev-next-title">{next.label}</span>
            <span className="prev-next-dir" aria-hidden="true">→</span>
          </a>
        ) : (
          <span />
        )}
      </div>
    </nav>
  )
}
