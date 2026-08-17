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
    // Render outside a Tabs container — always show
    return (
      <div data-lbus-component="tab-item" className="tab-item">
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
