import { useState } from 'react'
import type { SidebarNode } from '../../lib/navigation'

interface Props {
  node: SidebarNode
  pathname?: string
  depth?: number
}

function isActive(node: SidebarNode, pathname: string): boolean {
  if (node.link && pathname === node.link) return true
  if (node.items) {
    return node.items.some((child) => isActive(child, pathname))
  }
  return false
}

export default function SidebarItem({ node, pathname = '/', depth = 0 }: Props) {
  const hasChildren = Boolean(node.items && node.items.length > 0)
  const active = isActive(node, pathname)
  const [collapsed, setCollapsed] = useState(node.collapsed && !active)

  if (!hasChildren) {
    return (
      <li className={`sidebar-item depth-${depth}`}>
        <a
          href={node.link}
          className={`sidebar-link${active ? ' active' : ''}`}
          aria-current={active ? 'page' : undefined}
        >
          {node.icon && <span className="sidebar-icon" aria-hidden="true" data-icon={node.icon} />}
          <span className="sidebar-label">{node.label}</span>
        </a>
      </li>
    )
  }

  return (
    <li className={`sidebar-item sidebar-group depth-${depth}${active ? ' active' : ''}`}>
      <button
        type="button"
        className={`sidebar-group-toggle${active ? ' active' : ''}`}
        aria-expanded={!collapsed}
        onClick={() => setCollapsed((v) => !v)}
      >
        {node.icon && <span className="sidebar-icon" aria-hidden="true" data-icon={node.icon} />}
        <span className="sidebar-label">{node.label}</span>
        <span className="sidebar-chevron" aria-hidden="true">
          {collapsed ? '›' : '⌄'}
        </span>
      </button>
      {!collapsed && (
        <ul className="sidebar-subitems" role="list">
          {node.items!.map((child, i) => (
            <SidebarItem key={child.link ?? `${child.label}-${i}`} node={child} pathname={pathname} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}
