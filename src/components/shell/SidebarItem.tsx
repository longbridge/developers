import type { SidebarNode } from '../../lib/navigation'

interface Props {
  node: SidebarNode
  depth?: number
  pathname?: string
}

function isActiveNode(node: SidebarNode, pathname: string): boolean {
  if (node.link) return pathname === node.link || pathname.startsWith(node.link + '/')
  if (node.items) return node.items.some((c) => isActiveNode(c, pathname))
  return false
}

export { isActiveNode }

export default function SidebarItem({ node, depth = 0, pathname = '/' }: Props) {
  const active = isActiveNode(node, pathname)

  if (!node.items?.length) {
    // Leaf node
    return (
      <li className="flex flex-col" data-lbus-component="sidebar-item">
        <a
          href={node.link}
          className={active ? 'flex-1 block px-2 py-1 rounded text-sm bg-[var(--lb-bg-2)] text-[color:var(--lb-brand)] font-medium no-underline' : 'flex-1 block px-2 py-1 rounded text-sm text-[color:var(--lbus-c-text)] no-underline hover:bg-[var(--lb-bg-2)]'}
          aria-current={active ? 'page' : undefined}
        >
          {node.icon && <span className="inline-flex w-4 h-4 items-center justify-center text-[color:var(--lb-fg-2)]" aria-hidden="true" data-icon={node.icon} />}
          <span className="flex-1 text-sm">{node.label}</span>
        </a>
      </li>
    )
  }

  // Group node
  const open = active || !node.collapsed
  return (
    <li className="flex flex-col" data-lbus-component="sidebar-group">
      <button
        className="flex items-center gap-1 w-full bg-transparent border-0 cursor-pointer text-left"
        aria-expanded={open}
        type="button"
      >
        {node.icon && <span className="inline-flex w-4 h-4 items-center justify-center text-[color:var(--lb-fg-2)]" aria-hidden="true" data-icon={node.icon} />}
        <span className="flex-1 font-medium text-[color:var(--lb-fg-2)] text-sm py-1">{node.label}</span>
        <span className="ml-auto text-xs text-[color:var(--lb-fg-2)]" aria-hidden="true">›</span>
      </button>
      {open && (
        <ul className="list-none pl-3 py-0 m-0 flex flex-col gap-[0.125rem]" role="list">
          {node.items.map((child) => (
            <SidebarItem key={child.link ?? child.label} node={child} depth={depth + 1} pathname={pathname} />
          ))}
        </ul>
      )}
    </li>
  )
}
