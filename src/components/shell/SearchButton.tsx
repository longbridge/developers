import { useState, useEffect } from 'react'
import type { Locale } from '../../lib/i18n'
import SearchDialog from './SearchDialog'

interface Props {
  locale: Locale
}

/** Returns true if the event target is a form field where '/' should not trigger search. */
function isFormField(el: EventTarget | null): boolean {
  if (!el || !(el instanceof Element)) return false
  const tag = el.tagName.toLowerCase()
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true
  if ((el as HTMLElement).isContentEditable) return true
  return false
}

export default function SearchButton({ locale }: Props) {
  const [open, setOpen] = useState(false)

  // Global keyboard shortcuts: Cmd+K / Ctrl+K / '/'
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Cmd+K (macOS) or Ctrl+K (Win/Linux)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
        return
      }
      // '/' — only when not already in a form field
      if (
        e.key === '/' &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !isFormField(e.target)
      ) {
        e.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <button
        type="button"
        className="search-btn"
        data-lbus-component="search-button"
        aria-label="Search docs (Cmd+K)"
        onClick={() => setOpen(true)}
      >
        {/* Search icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="search-btn-text">Search</span>
        <kbd className="search-btn-kbd" aria-label="Keyboard shortcut: Command K">
          <span aria-hidden="true">⌘K</span>
        </kbd>
      </button>

      <SearchDialog locale={locale} isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
