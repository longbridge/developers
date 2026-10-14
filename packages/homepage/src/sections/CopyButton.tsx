import { useState } from 'react'

/**
 * Copy-to-clipboard icon button with a 2-second "copied" checkmark, matching
 * the Skill-page copy buttons. The legacy homepage copy buttons gave no visual
 * feedback; this shared component adds it for every homepage code block
 * (CLI spotlight, MCP, SDK, AI Skill).
 */
export function CopyButton({ text, className = 'code-copy' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false)
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }
  return (
    <button className={className} title={copied ? 'Copied!' : 'Copy'} onClick={onCopy}>
      {copied ? (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--lb-up)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round">
          <rect x="8" y="8" width="13" height="13" rx="2" />
          <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
        </svg>
      )}
    </button>
  )
}
