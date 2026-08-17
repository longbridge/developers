import React from 'react'

export interface SDKProps {
  description?: string
  children?: React.ReactNode
}

export function SDK({ description, children }: SDKProps) {
  return (
    <div
      data-lbus-component="sdk"
      style={{
        borderBottom: '1px solid var(--vp-c-divider)',
        paddingBottom: '1.5rem',
        marginBottom: '1.5rem',
      }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>SDK</h2>
      {description && (
        <p style={{ color: 'var(--vp-c-text-2)', marginBottom: '1rem' }}>{description}</p>
      )}
      {children && <div>{children}</div>}
      {/* SDK illustration placeholder — replaced with CDN image in production */}
      <div
        style={{
          marginTop: '1rem',
          padding: '2rem',
          border: '1px dashed var(--vp-c-divider)',
          borderRadius: '0.5rem',
          textAlign: 'center',
          color: 'var(--vp-c-text-3)',
          fontSize: '0.875rem',
        }}>
        /assets/sdk.svg
      </div>
    </div>
  )
}
