import type { SidebarNode } from '@longbridge/openapi-utils'
import SidebarItem from './SidebarItem'

interface Props {
  nodes: SidebarNode[]
  pathname?: string
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ nodes, pathname = '/', open = false, onClose: _onClose }: Props) {
  // Mobile: full-height fixed drawer sliding in from the left (z-40 so it
  // covers the sticky header when open, matching legacy AppSidebar
  // behavior). Desktop (lg+): sticky column that starts BELOW the 60px
  // header — never overlaps it.
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--lbus-c-bg)] border-r border-[color:var(--lb-stroke)] transition-transform duration-200 overflow-y-auto py-6 px-4 lg:sticky lg:top-[60px] lg:inset-y-auto lg:h-[calc(100vh-60px)] lg:z-auto lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      data-lbus-component="sidebar"
      aria-label="Documentation navigation"
    >
      <nav aria-label="Sidebar navigation">
        <ul className="list-none p-0 m-0 flex flex-col gap-[0.125rem]" role="list">
          {nodes.map((node, i) => (
            <SidebarItem
              key={node.link ?? `${node.label}-${i}`}
              node={node}
              pathname={pathname}
              depth={0}
            />
          ))}
        </ul>
      </nav>
    </aside>
  )
}
