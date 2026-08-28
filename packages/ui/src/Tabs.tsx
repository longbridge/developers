import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

// ──────────────────────────────────────────────
// Context shared between <Tabs> and <TabItem>
// ──────────────────────────────────────────────
export interface TabInfo {
  value: string
  label: string
  default?: boolean
}

export interface TabsContextValue {
  activeTab: string
  registerTab: (tab: TabInfo) => void
  setActiveTab: (value: string) => void
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext() {
  return useContext(TabsContext)
}

// ──────────────────────────────────────────────
// Global window state (mirrors VitePress pattern)
// ──────────────────────────────────────────────
declare global {
  interface Window {
    __LBTabsState: Record<string, string>
    __LBTabsListeners: Record<string, Set<(value: string) => void>>
  }
}

function initGlobal() {
  if (typeof window === 'undefined') return
  if (!window.__LBTabsState) window.__LBTabsState = {}
  if (!window.__LBTabsListeners) window.__LBTabsListeners = {}
}

// ──────────────────────────────────────────────
// <Tabs>
// ──────────────────────────────────────────────
export interface TabsProps {
  groupId?: string
  variant?: 'line' | 'pill'
  children?: React.ReactNode
}

export function Tabs({ groupId, variant = 'line', children }: TabsProps) {
  // NOTE: In Astro's MDX rendering model each React component is rendered in
  // its own isolated React root. By the time Tabs() is called, children have
  // already been serialised to HTML. This means:
  //   • React.Children.forEach returns [] — no tab data is available here.
  //   • TabsContext.Provider never wraps TabItem's render — !ctx always fires
  //     there, so TabItem emits data-tab-value/label/default attrs instead.
  //
  // The SSR output therefore contains:
  //   <div data-lbus-component="tabs" data-tabs-group-id="…" …>
  //     <div data-tabs-bar />          ← empty; tabs-hydrate.ts fills it
  //     <div class="relative">
  //       <div data-lbus-component="tab-item" data-tab-value="…" …>…</div>
  //     </div>
  //   </div>
  //
  // The tabs-hydrate.ts client script (injected by BaseLayout.astro) reads
  // the data-tab-* attrs and creates interactive buttons + manages visibility.
  //
  // registerTab / setActiveTab / useEffect are retained for potential future
  // client:load hydration scenarios; they are no-ops in the current SSR path.

  const [, setTabs] = useState<TabInfo[]>([])
  const [activeTab, setActiveTabState] = useState<string>('')
  const listenerRef = useRef<((v: string) => void) | null>(null)

  const setActiveTab = (value: string) => {
    setActiveTabState(value)
    if (groupId && typeof window !== 'undefined') {
      window.__LBTabsState[groupId] = value
      window.__LBTabsListeners[groupId]?.forEach((l) => l(value))
      try {
        localStorage.setItem(`vitepress-tabs-${groupId}`, value)
      } catch {
        /* ignore */
      }
    }
  }

  const registerTab = (tab: TabInfo) => {
    setTabs((prev) => {
      const idx = prev.findIndex((t) => t.value === tab.value)
      const next = idx >= 0 ? [...prev.slice(0, idx), tab, ...prev.slice(idx + 1)] : [...prev, tab]
      return next
    })
    setActiveTabState((cur) => {
      if (!cur || tab.default) return tab.value
      return cur
    })
  }

  // Mount: subscribe to group sync + restore from localStorage
  useEffect(() => {
    if (!groupId || typeof window === 'undefined') return
    initGlobal()
    if (!window.__LBTabsListeners[groupId]) window.__LBTabsListeners[groupId] = new Set()

    const listener = (value: string) => {
      setTabs((ts) => {
        if (ts.some((t) => t.value === value)) setActiveTabState(value)
        return ts
      })
    }
    listenerRef.current = listener
    window.__LBTabsListeners[groupId].add(listener)

    // Restore from localStorage
    try {
      const saved = localStorage.getItem(`vitepress-tabs-${groupId}`)
      if (saved) {
        setActiveTabState(saved)
        window.__LBTabsState[groupId] = saved
      }
    } catch {
      /* ignore */
    }

    // Apply already-set global state
    const global = window.__LBTabsState[groupId]
    if (global) setActiveTabState(global)

    return () => {
      window.__LBTabsListeners[groupId]?.delete(listener)
    }
  }, [groupId])

  const ctx: TabsContextValue = { activeTab, registerTab, setActiveTab }

  // Empty bar — client-side tabs-hydrate.ts populates with buttons
  const barClassName =
    variant === 'line'
      ? 'flex border-b border-[var(--vp-c-divider)] mb-4 overflow-x-auto gap-1'
      : 'inline-flex items-center rounded-md mb-4 overflow-x-auto gap-1'

  return (
    <TabsContext.Provider value={ctx}>
      <div
        data-lbus-component="tabs"
        data-tabs-group-id={groupId}
        data-tabs-variant={variant}
        className="my-4">
        {/* SSR: empty placeholder — tabs-hydrate.ts populates this bar */}
        <div data-tabs-bar className={barClassName} />
        <div className="relative">{children}</div>
      </div>
    </TabsContext.Provider>
  )
}
