/**
 * CodeSample.tsx
 * Self-contained code card with syntax highlighting + copy button.
 * Ported 1:1 from ApiReference.vue (chunk C highlightCode + code-panel template).
 * No dependency on @longbridge/openapi-ui — intentionally standalone.
 */
import type { CodeBlock } from './openapi-loader'

// ── Escape ────────────────────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ── Syntax highlighter ────────────────────────────────────────────────────────

function highlightCode(code: string, lang: string): string {
  if (lang === 'json') {
    return code.replace(
      /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)|\b(true|false|null)\b/g,
      (_m, key, colon, str, num, bool) => {
        if (key !== undefined)
          return `<span class="hl-k">${esc(key)}</span>${esc(colon ?? '')}`
        if (str !== undefined) return `<span class="hl-s">${esc(str)}</span>`
        if (num !== undefined) return `<span class="hl-n">${esc(num)}</span>`
        if (bool !== undefined) return `<span class="hl-b">${esc(bool)}</span>`
        return esc(_m)
      },
    )
  }

  if (['bash', 'shell', 'sh', 'curl'].includes(lang)) {
    const lines = code.split('\n')
    return lines
      .map((line, idx) => {
        // line continuation backslash
        const continuation = line.endsWith('\\')
        const bare = continuation ? line.slice(0, -1) : line

        const highlightLine = (s: string): string => {
          // --flag or -f patterns
          s = s.replace(/(--[\w-]+=?|-[a-zA-Z])\b/g, (f) => `<span class="hl-flag">${esc(f)}</span>`)
          // quoted strings ' ... '
          s = s.replace(/'([^']*)'/g, (_m, inner) => `'<span class="hl-s">${esc(inner)}</span>'`)
          // remaining plain text: escape non-tagged portions
          // (already done inline above; non-matched chars pass through as-is after esc calls)
          return s
        }

        if (idx === 0) {
          // first line: first token is the command
          const firstSpace = bare.search(/\s/)
          if (firstSpace === -1) {
            const result =
              `<span class="hl-cmd">${esc(bare)}</span>` +
              (continuation ? '<span class="hl-punct"> \\</span>' : '')
            return result
          }
          const cmd = bare.slice(0, firstSpace)
          const rest = bare.slice(firstSpace)
          return (
            `<span class="hl-cmd">${esc(cmd)}</span>` +
            highlightLine(esc(rest)) +
            (continuation ? '<span class="hl-punct"> \\</span>' : '')
          )
        }

        return highlightLine(esc(bare)) + (continuation ? '<span class="hl-punct"> \\</span>' : '')
      })
      .join('\n')
  }

  if (['typescript', 'javascript', 'ts', 'js', 'python', 'py'].includes(lang)) {
    const escaped = esc(code)
    // comments first (so strings inside comments don't get double-wrapped)
    return escaped
      .replace(/(\/\/[^\n]*|#[^\n]*)/g, (c) => `<span class="hl-comment">${c}</span>`)
      .replace(
        /(&quot;[^&]*&quot;|&#39;[^&]*&#39;|`[^`]*`)/g,
        (s) => `<span class="hl-s">${s}</span>`,
      )
      .replace(
        /\b(const|let|var|function|return|import|export|from|async|await|class|new|typeof|instanceof|def|lambda|yield|for|while|if|elif|else|in|not|and|or|True|False|None|pass|with|as|raise|try|except|finally)\b/g,
        (kw) => `<span class="hl-b">${kw}</span>`,
      )
  }

  return esc(code)
}

// ── CodePanel ─────────────────────────────────────────────────────────────────

interface CodePanelProps {
  blocks: CodeBlock[]
  labelCopy: string
  labelCopied: string
}

export function CodePanel({ blocks, labelCopy, labelCopied }: CodePanelProps) {
  const [copiedLabel, setCopiedLabel] = React.useState<string | null>(null)

  function copyCode(label: string, code: string) {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedLabel(label)
        setTimeout(() => setCopiedLabel(null), 1800)
      })
      .catch(() => {})
  }

  return (
    <div data-lbus-component="code-panel" className="code-panel">
      {blocks.map((block) => (
        <div key={block.label} className="code-card">
          <div className="card-header">
            <span className="card-label">{block.label}</span>
            <button
              type="button"
              className="copy-btn"
              onClick={() => copyCode(block.label, block.code)}
            >
              {copiedLabel === block.label ? labelCopied : labelCopy}
            </button>
          </div>
          <div className="card-body">
            <pre className="code-pre">
              <code
                dangerouslySetInnerHTML={{ __html: highlightCode(block.code, block.lang) }}
              />
            </pre>
          </div>
        </div>
      ))}
    </div>
  )
}

// React import needed for useState
import React from 'react'
