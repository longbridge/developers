import { useState } from 'react'
import type { SidebarNode } from '@longbridge/openapi-utils'
import { SIDEBAR_ICONS } from './sidebar-icons'

interface Props {
  node: SidebarNode
  depth?: number
  pathname?: string
}

function isActiveNode(node: SidebarNode, pathname: string): boolean {
  // A link is active only on its EXACT page. Prefix matching would light up
  // ancestor-path links on every descendant — e.g. the root "Overview"
  // (/docs) would stay highlighted on /docs/getting-started and every other
  // /docs/* page. Group activeness is derived purely from descendants below.
  if (node.link && pathname === node.link) return true
  if (node.items) return node.items.some((c) => isActiveNode(c, pathname))
  return false
}

export { isActiveNode }

/** 16×16 lucide glyph. Color follows the parent's text color (currentColor). */
function SidebarIcon({ name, active }: { name: string; active: boolean }) {
  const svg = SIDEBAR_ICONS[name]
  if (!svg) return null
  return (
    <span
      className={`sidebar-item-icon inline-flex items-center shrink-0 mr-3 ${active ? 'text-[color:var(--lb-brand)]' : 'text-[color:var(--lb-fg-3)]'}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

/** Chevron that points right when collapsed, rotates to point down when open.
 *  Mirrors the legacy vitepress `.caret-icon` rotate transition. */
function Caret({ open }: { open: boolean }) {
  return (
    <span className="ml-auto inline-flex items-center justify-center shrink-0 text-[color:var(--lb-fg-3)]" aria-hidden="true">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  )
}

export default function SidebarItem({ node, depth = 0, pathname = '/' }: Props) {
  const active = isActiveNode(node, pathname)

  // Leaf link
  if (!node.items?.length) {
    // A top-level category with no child pages (e.g. cli/ipo/) renders as a
    // bold header-style link, matching its sibling section headers (Quant,
    // Market Data, …) rather than a muted sub-page leaf.
    const isCategoryLeaf = depth === 0 && node.isSection
    const base = 'flex items-center rounded-lg py-1 text-[14px] leading-6 no-underline'
    const pad = isCategoryLeaf ? 'px-2' : 'px-4'
    const cls = active
      ? `${base} ${pad} bg-[color-mix(in_oklab,var(--lb-brand)_10%,transparent)] text-[color:var(--lb-brand)] font-medium`
      : isCategoryLeaf
        ? `${base} ${pad} text-[color:var(--lb-fg-1)] font-bold hover:bg-[var(--lb-bg-2)]`
        : `${base} ${pad} text-[color:var(--lb-fg-2)] hover:text-[color:var(--lb-brand)] hover:bg-[var(--lb-bg-2)]`
    return (
      <li data-lbus-component="sidebar-item">
        <a href={node.link} className={cls} aria-current={active ? 'page' : undefined}>
          {node.icon && <SidebarIcon name={node.icon} active={active} />}
          <span className={`flex-1 min-w-0 truncate${isCategoryLeaf ? ' font-bold' : ''}`}>{node.label}</span>
        </a>
      </li>
    )
  }

  // Collapsible group (level-0 = bold section header with icon; deeper =
  // medium sub-section header). Open state seeds from active/collapsed and is
  // then user-toggled.
  return <SidebarGroup node={node} depth={depth} pathname={pathname} active={active} />
}

function SidebarGroup({
  node,
  depth,
  pathname,
  active,
}: {
  node: SidebarNode
  depth: number
  pathname: string
  active: boolean
}) {
  const [open, setOpen] = useState(active || !node.collapsed)

  const isTop = depth === 0
  // Only the top-level section headers (Quote / Fundamental / …) are bold.
  // Nested sub-section headers (Subscribe / Stocks / …) render at normal
  // weight, matching their sibling leaf links.
  const labelCls = isTop
    ? 'flex-1 min-w-0 truncate font-bold text-[color:var(--lb-fg-1)]'
    : 'flex-1 min-w-0 truncate font-normal text-[color:var(--lb-fg-2)]'

  return (
    <li data-lbus-component="sidebar-group">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center w-full bg-transparent border-0 cursor-pointer text-left rounded-lg px-2 py-1 text-[14px] leading-6 hover:bg-[var(--lb-bg-2)]"
      >
        {node.icon && <SidebarIcon name={node.icon} active={false} />}
        <span className={labelCls}>{node.label}</span>
        <Caret open={open} />
      </button>
      {open && (
        <ul className="list-none pl-3 py-0 m-0 flex flex-col gap-[2px]" role="list">
          {node.items!.map((child) => (
            <SidebarItem
              key={child.link ?? child.label}
              node={child}
              depth={depth + 1}
              pathname={pathname}
            />
          ))}
        </ul>
      )}
    </li>
  )
}
