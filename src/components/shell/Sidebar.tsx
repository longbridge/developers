import type { SidebarNode } from '@longbridge/openapi-utils'
import SidebarItem from './SidebarItem'

interface Props {
  nodes: SidebarNode[]
  pathname?: string
  open?: boolean
  onClose?: () => void
}

/** A rendered group: either a run of consecutive top-level leaf links (no
 *  header) or a single section node (collapsible header + children). Mirrors
 *  legacy vitepress `.group` blocks, which are separated by a top divider. */
type Group =
  | { kind: 'bare'; items: SidebarNode[] }
  | { kind: 'section'; node: SidebarNode }

/** Coalesce the flat top-level node list into groups: consecutive leaf links
 *  bundle into one bare group (rendered header-less), each section node stands
 *  alone. This reproduces the legacy grouping where Overview / Getting Started
 *  / LLMs / Agent Auth Code share one divider block, then each of Quote /
 *  Fundamental / … is its own block. */
function toGroups(nodes: SidebarNode[]): Group[] {
  const groups: Group[] = []
  let bare: SidebarNode[] = []
  const flush = () => {
    if (bare.length) {
      groups.push({ kind: 'bare', items: bare })
      bare = []
    }
  }
  for (const n of nodes) {
    if (n.items?.length) {
      flush()
      groups.push({ kind: 'section', node: n })
    } else {
      bare.push(n)
    }
  }
  flush()
  return groups
}

export default function Sidebar({ nodes, pathname = '/', open = false, onClose: _onClose }: Props) {
  const groups = toGroups(nodes)

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-[var(--lbus-c-bg)] border-r border-[color:var(--lb-stroke)] transition-transform duration-200 overflow-y-auto py-6 px-6 lg:sticky lg:top-[60px] lg:inset-y-auto lg:h-[calc(100vh-60px)] lg:z-auto lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      data-lbus-component="sidebar"
      aria-label="Documentation navigation"
    >
      <nav aria-label="Sidebar navigation">
        {groups.map((g, i) => (
          <div
            key={i}
            className={
              i > 0
                ? 'border-t border-[color:var(--app-card-stroke)] mt-[10px] pt-[10px]'
                : ''
            }
          >
            <ul className="list-none p-0 m-0 flex flex-col gap-[2px]" role="list">
              {g.kind === 'bare'
                ? g.items.map((n) => (
                    <SidebarItem
                      key={n.link ?? n.label}
                      node={n}
                      depth={0}
                      pathname={pathname}
                    />
                  ))
                : (
                    <SidebarItem
                      key={g.node.link ?? g.node.label}
                      node={g.node}
                      depth={0}
                      pathname={pathname}
                    />
                  )}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
