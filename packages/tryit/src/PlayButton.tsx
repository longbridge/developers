/**
 * PlayButton — Try it button with method-based color variants
 * Ported from legacy PlayButton.vue
 */

import React from 'react'

type ColorVariant = 'success' | 'brand' | 'warning' | 'danger' | 'important' | 'default'

interface PlayButtonProps {
  color?: ColorVariant
  customClass?: string
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  children?: React.ReactNode
}

function getColorClass(color: ColorVariant): string {
  switch (color) {
    case 'success':
      return 'tryit-btn-success'
    case 'brand':
      return 'tryit-btn-brand'
    case 'warning':
      return 'tryit-btn-warning'
    case 'danger':
      return 'tryit-btn-danger'
    case 'important':
      return 'tryit-btn-important'
    case 'default':
      return 'tryit-btn-default'
    default:
      return 'tryit-btn-brand'
  }
}

export function PlayButton({
  color = 'brand',
  customClass = '',
  disabled = false,
  loading = false,
  onClick,
  children,
}: PlayButtonProps) {
  return (
    <button
      className={[
        'ml-2 inline-flex items-center justify-center px-3 py-1 text-white font-medium rounded-lg cursor-pointer disabled:opacity-70 hover:opacity-80 gap-1 shadow-none transition-all duration-200',
        getColorClass(color),
        customClass,
        loading ? 'cursor-not-allowed' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <span className="text-base font-normal">{children ?? 'Try it'}</span>

      {loading ? (
        <svg className="animate-spin ml-1" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path
            d="M5 3.5C5 3.22386 5.22386 3 5.5 3C5.59721 3 5.69275 3.02799 5.77727 3.08062L13.7773 8.5806C14.0512 8.7641 14.0512 9.2359 13.7773 9.4194L5.77727 14.9194C5.69275 14.972 5.59721 15 5.5 15C5.22386 15 5 14.7761 5 14.5V3.5Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  )
}
