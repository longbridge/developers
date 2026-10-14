import React from 'react'

export type TipType = 'tip' | 'warning' | 'danger' | 'info' | 'caution' | 'success'

export interface TipContainerProps {
  type?: TipType
  title?: string
  children?: React.ReactNode
}

const icons: Record<TipType, string> = {
  tip: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  danger: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  caution: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
}

const typeStyles: Record<TipType, React.CSSProperties> = {
  tip: { borderColor: 'rgba(59,130,246,0.3)', backgroundColor: 'rgba(59,130,246,0.05)', color: '#1d4ed8' },
  warning: { borderColor: 'rgba(234,179,8,0.3)', backgroundColor: 'rgba(234,179,8,0.05)', color: '#a16207' },
  danger: { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.05)', color: '#b91c1c' },
  info: { borderColor: 'rgba(6,182,212,0.3)', backgroundColor: 'rgba(6,182,212,0.05)', color: '#0e7490' },
  caution: { borderColor: 'rgba(249,115,22,0.3)', backgroundColor: 'rgba(249,115,22,0.05)', color: '#c2410c' },
  success: { borderColor: 'rgba(34,197,94,0.3)', backgroundColor: 'rgba(34,197,94,0.05)', color: '#15803d' },
}

const iconColors: Record<TipType, string> = {
  tip: '#3b82f6',
  warning: '#eab308',
  danger: '#ef4444',
  info: '#06b6d4',
  caution: '#f97316',
  success: '#22c55e',
}

export function TipContainer({ type = 'tip', title, children }: TipContainerProps) {
  const styles = typeStyles[type] ?? typeStyles.tip
  const iconColor = iconColors[type] ?? iconColors.tip
  const iconSvg = icons[type] ?? icons.tip

  return (
    <div
      data-lbus-component="tip-container"
      data-type={type}
      style={{
        ...styles,
        border: '1px solid',
        borderRadius: '0.5rem',
        padding: '1rem',
        margin: '0.25rem 0',
      }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{ color: iconColor, display: 'inline-flex', marginTop: '1px', flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: iconSvg }}
          />
          <span style={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.4 }}>{title}</span>
        </div>
      )}
      <div style={{ fontSize: '0.875rem', lineHeight: 1.625 }}>{children}</div>
    </div>
  )
}
