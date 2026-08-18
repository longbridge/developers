import React, { useState, useRef } from 'react'

export interface CliCommandProps {
  children?: React.ReactNode
}

export function CliCommand({ children }: CliCommandProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  const copyCommand = async () => {
    const text = codeRef.current?.innerText ?? ''
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore clipboard errors */
    }
  }

  return (
    <div
      data-lbus-component="cli-command"
      className="relative">
      <div ref={codeRef}>{children}</div>
      <button
        onClick={copyCommand}
        aria-label={copied ? 'Copied!' : 'Copy'}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          padding: '0.25rem',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          opacity: 0.6,
          fontSize: '0.75rem',
          color: 'var(--vp-c-text-2)',
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.6')}>
        {copied ? '✓' : '⎘'}
      </button>
    </div>
  )
}
