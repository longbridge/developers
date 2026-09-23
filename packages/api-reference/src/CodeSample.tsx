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

export function highlightCode(code: string, lang: string): string {
  if (lang === 'json') {
    return code.replace(
      /("(?:[^"\\]|\\.)*")(\s*:)|("(?:[^"\\]|\\.)*")|(-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b)|\b(true|false|null)\b/g,
      (_m, key, colon, str, num, bool) => {
        if (key !== undefined) return `<span class="hl-k">${esc(key)}</span>${esc(colon ?? '')}`
        if (str !== undefined) return `<span class="hl-s">${esc(str)}</span>`
        if (num !== undefined) return `<span class="hl-n">${esc(num)}</span>`
        if (bool !== undefined) return `<span class="hl-b">${esc(bool)}</span>`
        return esc(_m)
      }
    )
  }

  // Generic single-pass highlighter for all other languages.
  // Corruption-safe: strings are matched as whole tokens, so `https://` inside a
  // string is never mis-parsed as a `//` comment, and no replacement ever runs
  // over previously-inserted markup.
  const escaped = esc(code)
  const KW =
    'const|let|var|function|func|fn|return|import|export|from|use|mut|pub|async|await|' +
    'class|struct|type|interface|impl|match|new|typeof|instanceof|def|lambda|yield|for|while|' +
    'if|elif|else|in|not|and|or|with|as|raise|try|except|finally|pass|package|println|print|' +
    'true|false|null|nil|None|True|False'
  const TOKEN = new RegExp(
    '(&quot;(?:(?!&quot;).)*&quot;|&#39;(?:(?!&#39;).)*&#39;|`(?:(?!`).)*`)' + // strings
      '|(#[^\\n]*|\\/\\/[^\\n]*)' + // comments (# or //)
      '|\\b(' +
      KW +
      ')\\b',
    'g'
  )
  return escaped.replace(TOKEN, (m, str, comment, kw) => {
    if (str !== undefined) return `<span class="hl-s">${str}</span>`
    if (comment !== undefined) return `<span class="hl-comment">${comment}</span>`
    if (kw !== undefined) return `<span class="hl-b">${kw}</span>`
    return m
  })
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
            <button type="button" className="copy-btn" onClick={() => copyCode(block.label, block.code)}>
              {copiedLabel === block.label ? labelCopied : labelCopy}
            </button>
          </div>
          <div className="card-body">
            <pre className="code-pre">
              <code dangerouslySetInnerHTML={{ __html: highlightCode(block.code, block.lang) }} />
            </pre>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── CodeTabs (docs-style, light) ──────────────────────────────────────────────
// A single light code card with language tabs (used for Request Example).

interface CodeTabsProps {
  blocks: CodeBlock[]
  labelCopy: string
  labelCopied: string
}

export function CodeTabs({ blocks, labelCopy, labelCopied }: CodeTabsProps) {
  const [active, setActive] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  if (!blocks.length) return null
  const block = blocks[Math.min(active, blocks.length - 1)]

  function copy() {
    navigator.clipboard
      .writeText(block.code)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => {})
  }

  return (
    <div data-lbus-component="code-tabs" className="code-tabs">
      <div className="code-tabs-bar">
        <div className="code-tabs-list">
          {blocks.map((b, i) => (
            <button
              key={b.label}
              type="button"
              className={`code-tab${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}>
              {b.label}
            </button>
          ))}
        </div>
        <button type="button" className="code-tabs-copy" onClick={copy}>
          {copied ? labelCopied : labelCopy}
        </button>
      </div>
      <div className="code-tabs-body">
        <pre className="code-pre">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(block.code, block.lang) }} />
        </pre>
      </div>
    </div>
  )
}

// ── CodeDropdown ──────────────────────────────────────────────────────────────
// Same light code card, but the language is picked from a <select> instead of a
// tab strip — for narrow columns (the right rail) where 8 tabs would overflow.

export function CodeDropdown({ blocks, labelCopy, labelCopied }: CodeTabsProps) {
  const [active, setActive] = React.useState(0)
  const [copied, setCopied] = React.useState(false)
  if (!blocks.length) return null
  const block = blocks[Math.min(active, blocks.length - 1)]

  function copy() {
    navigator.clipboard
      .writeText(block.code)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => {})
  }

  return (
    <div data-lbus-component="code-dropdown" className="code-tabs">
      <div className="code-tabs-bar">
        <select
          className="code-lang-select"
          aria-label="language"
          value={active}
          onChange={(e) => setActive(Number(e.target.value))}>
          {blocks.map((b, i) => (
            <option key={b.label} value={i}>
              {b.label}
            </option>
          ))}
        </select>
        <button type="button" className="code-tabs-copy" onClick={copy}>
          {copied ? labelCopied : labelCopy}
        </button>
      </div>
      <div className="code-tabs-body">
        <pre className="code-pre">
          <code dangerouslySetInnerHTML={{ __html: highlightCode(block.code, block.lang) }} />
        </pre>
      </div>
    </div>
  )
}

// React import needed for useState
import React from 'react'
