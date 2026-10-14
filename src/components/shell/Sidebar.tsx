import { useEffect, useRef, useState } from 'react'
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

  // The desktop sidebar island is preserved across navigations via
  // transition:persist (see DocsLayout) — no remount, so expanded groups and
  // scroll position stay put. But the SSR `pathname` prop then freezes at the
  // first page, so track the live location on each ClientRouter swap to keep the
  // active highlight and active-group auto-expand in sync with the current page.
  const [path, setPath] = useState(pathname)
  const asideRef = useRef<HTMLElement>(null)
  useEffect(() => {
    setPath(window.location.pathname)
    const sync = () => setPath(window.location.pathname)
    document.addEventListener('astro:page-load', sync)

    // transition:persist keeps this island, but ClientRouter detaches and
    // re-attaches the element during the swap, which resets its internal
    // scrollTop to 0 (a jump to the top on every navigation). Save the scroll
    // position just before the swap and restore it right after so the sidebar
    // stays exactly where the user left it.
    let savedScroll = 0
    const save = () => {
      if (asideRef.current) savedScroll = asideRef.current.scrollTop
    }
    const restore = () => {
      if (asideRef.current) asideRef.current.scrollTop = savedScroll
    }
    document.addEventListener('astro:before-swap', save)
    document.addEventListener('astro:after-swap', restore)
    return () => {
      document.removeEventListener('astro:page-load', sync)
      document.removeEventListener('astro:before-swap', save)
      document.removeEventListener('astro:after-swap', restore)
    }
  }, [])

  return (
    <aside
      ref={asideRef}
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
                      pathname={path}
                    />
                  ))
                : (
                    <SidebarItem
                      key={g.node.link ?? g.node.label}
                      node={g.node}
                      depth={0}
                      pathname={path}
                    />
                  )}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
