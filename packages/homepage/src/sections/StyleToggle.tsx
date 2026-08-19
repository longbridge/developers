import React from 'react'

interface StyleToggleProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  size?: 'sm' | 'md'
}

export function StyleToggle({ options, value, onChange, size = 'sm' }: StyleToggleProps) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-border/50 bg-background/80 p-0.5 backdrop-blur-sm"
      style={{ fontSize: size === 'sm' ? '0.75rem' : '0.875rem' }}
    >
      {options.map((option) => (
        <button
          key={option}
          className="relative rounded-full px-3 py-1 font-medium transition-all duration-200"
          style={
            value === option
              ? {
                  background: 'var(--vp-c-text-1)',
                  color: 'var(--vp-c-bg)',
                  boxShadow: '0 1px 2px rgba(0,0,0,.1)',
                }
              : {
                  color: 'color-mix(in srgb, var(--vp-c-text-1) 60%, transparent)',
                }
          }
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
