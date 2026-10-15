/**
 * Dropdown — a small custom <select> replacement: a trigger button plus a styled
 * popover menu, so the option list matches the docs styling instead of the OS
 * native select. The menu renders in a portal with fixed positioning so it is
 * never clipped by an ancestor's `overflow: hidden` (e.g. the code card). Closes
 * on outside click / Escape / scroll. Generic over the value type.
 */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface DropdownOption<T extends string> {
  value: T
  label: string
}

interface DropdownProps<T extends string> {
  value: T
  options: DropdownOption<T>[]
  onChange: (value: T) => void
  /** Extra class on the wrapper (for per-context width / placement). */
  className?: string
  ariaLabel?: string
}

export function Dropdown<T extends string>({
  value,
  options,
  onChange,
  className,
  ariaLabel,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const r = btnRef.current?.getBoundingClientRect()
    if (r) setPos({ top: r.bottom + 6, left: r.left, width: r.width })

    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (wrapRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onScroll = () => setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onScroll)
    }
  }, [open])

  const current = options.find((o) => o.value === value)?.label ?? ''

  return (
    <div className={`ar-dropdown${className ? ` ${className}` : ''}`} ref={wrapRef}>
      <button
        ref={btnRef}
        type="button"
        className="ar-dropdown-btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}>
        <span className="ar-dropdown-value">{current}</span>
        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            className="ar-dropdown-menu"
            role="listbox"
            style={{ position: 'fixed', top: pos.top, left: pos.left, minWidth: pos.width }}>
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                className={`ar-dropdown-option${o.value === value ? ' is-active' : ''}`}
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}>
                {o.label}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  )
}
