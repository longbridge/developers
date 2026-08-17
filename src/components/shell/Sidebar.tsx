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
      className={`sidebar${open ? ' sidebar--open' : ''}`}
      data-lbus-component="sidebar"
      aria-label="Documentation navigation"
    >
      <nav aria-label="Sidebar navigation">
        <ul className="sidebar-root" role="list">
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
