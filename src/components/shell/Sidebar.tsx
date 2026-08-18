import type { SidebarNode } from '../../lib/navigation'
import SidebarItem from './SidebarItem'

interface Props {
  nodes: SidebarNode[]
  pathname?: string
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ nodes, pathname = '/', open = false, onClose: _onClose }: Props) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-64 bg-[var(--lbus-c-bg)] border-r border-[color:var(--lb-stroke)] transition-transform duration-200 overflow-y-auto lg:relative lg:translate-x-0 lg:border-r-0${open ? ' translate-x-0' : ' -translate-x-full'}`}
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
