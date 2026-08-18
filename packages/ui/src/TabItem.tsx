import React, { useEffect } from 'react'
import { useTabsContext } from './Tabs'

export interface TabItemProps {
  value: string
  label: string
  default?: boolean
  children?: React.ReactNode
}

export function TabItem({ value, label, default: isDefault, children }: TabItemProps) {
  const ctx = useTabsContext()

  useEffect(() => {
    if (ctx) {
      ctx.registerTab({ value, label, default: isDefault })
    }
    // Only run on mount — registerTab identity is stable within a Tabs instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!ctx) {
    // SSR path: Astro renders each React component in its own isolated React root,
    // so TabsContext.Provider from <Tabs> is never in scope here.
    // Emit data-* attrs so the tabs-hydrate client script can discover this item,
    // build the tab bar, and manage visibility without React involvement.
    return (
      <div
        data-lbus-component="tab-item"
        data-tab-value={value}
        data-tab-label={label}
        data-tab-default={isDefault ? 'true' : undefined}
        className="py-4">
        {children}
      </div>
    )
  }

  const isActive = ctx.activeTab === value

  return (
    <div
      data-lbus-component="tab-item"
      style={{
        display: isActive ? undefined : 'none',
        animation: isActive ? 'lbus-fade-in 0.2s ease-in-out' : undefined,
      }}>
      {children}
    </div>
  )
}
