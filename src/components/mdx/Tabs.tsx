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
  const [tabs, setTabs] = useState<TabInfo[]>([])
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
        setActiveTabState((cur) => saved)
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

  return (
    <TabsContext.Provider value={ctx}>
      <div data-lbus-component="tabs" className="my-4">
        {variant === 'line' ? (
          <div className="flex border-b border-[var(--vp-c-divider)] mb-4 overflow-x-auto gap-1">
            {tabs.map((tab) =>
              tab.value === activeTab ? (
                <button
                  key={tab.value}
                  className="tab-line-btn"
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid var(--vp-c-text-1)',
                    color: 'var(--vp-c-text-1)',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </button>
              ) : (
                <button
                  key={tab.value}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid transparent',
                    color: 'var(--vp-c-text-2)',
                    transition: 'color 0.15s, border-color 0.15s',
                  }}
                  onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </button>
              ),
            )}
          </div>
        ) : (
          <div
            className="inline-flex items-center rounded-md mb-4 overflow-x-auto gap-1"
            style={{
              background: 'var(--vp-c-bg-soft)',
              padding: '0.25rem',
            }}>
            {tabs.map((tab) =>
              tab.value === activeTab ? (
                <button
                  key={tab.value}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    borderRadius: '0.125rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'var(--vp-c-bg)',
                    color: 'var(--vp-c-text-1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  }}
                  onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </button>
              ) : (
                <button
                  key={tab.value}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    borderRadius: '0.125rem',
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.15s',
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--vp-c-text-2)',
                  }}
                  onClick={() => setActiveTab(tab.value)}>
                  {tab.label}
                </button>
              ),
            )}
          </div>
        )}
        <div className="relative">{children}</div>
      </div>
    </TabsContext.Provider>
  )
}
