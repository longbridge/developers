/**
 * ResponseView — displays API response with syntax highlighting, copy, and download
 * Ported from legacy TryIt/Code.vue; uses shiki for JSON highlighting
 */

import { useState, useEffect, useCallback } from 'react'
import type { ApiResponse } from './clients/http-client'

interface ResponseViewProps {
  result?: ApiResponse | null
}

function getStatusIconClass(status?: number): string {
  if (!status) return 'tryit-status-default'
  if (status >= 200 && status < 300) return 'tryit-status-success'
  if (status >= 400) return 'tryit-status-danger'
  return 'tryit-status-warning'
}

function getStatusText(result?: ApiResponse | null): string {
  if (!result) return ''
  const parts: string[] = []
  if (result.status) parts.push(String(result.status))
  if (result.statusText) parts.push(result.statusText)
  return parts.join(' - ')
}

async function highlightJson(code: string): Promise<string> {
  try {
    const { createHighlighter } = await import('shiki/bundle/web')
    const highlighter = await createHighlighter({
      themes: ['vitesse-dark', 'vitesse-light'],
      langs: ['json'],
    })
    const isDark = document.documentElement.classList.contains('dark')
    return highlighter.codeToHtml(code, {
      lang: 'json',
      theme: isDark ? 'vitesse-dark' : 'vitesse-light',
    })
  } catch {
    return `<pre>${code}</pre>`
  }
}

export function ResponseView({ result }: ResponseViewProps) {
  const [highlightHtml, setHighlightHtml] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (result?.response) {
      const code = JSON.stringify(result.response, null, 2)
      highlightJson(code).then(setHighlightHtml)
    } else {
      setHighlightHtml('')
    }
  }, [result])

  const copyResponse = useCallback(async () => {
    if (!result?.response) return
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.response, null, 2))
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }, [result])

  const downloadResponse = useCallback(() => {
    if (!result?.response) return
    try {
      const jsonText = JSON.stringify(result.response, null, 2)
      const blob = new Blob([jsonText], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'api-response.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }, [result])

  if (!result) return null

  return (
    <div
      className="w-full rounded-xl p-0.5"
      style={{ backgroundColor: 'var(--vp-c-bg-soft)', border: '1px solid var(--vp-c-border)' }}
    >
      {/* Header Bar */}
      <div className="flex w-full px-2 py-1 space-x-3 items-center rounded-t-2xl">
        <div className="flex flex-1 space-x-4 items-center">
          <div className="flex space-x-2 items-center">
            <div className={`w-3.5 h-3.5 rounded-full ${getStatusIconClass(result.status)}`} />
            <div className="text-xs font-medium" style={{ color: 'var(--vp-c-text-1)' }}>
              {getStatusText(result)}
            </div>
          </div>
        </div>

        <div className="flex space-x-2 items-center">
          {/* Download */}
          <button
            onClick={downloadResponse}
            className="h-7 w-7 flex items-center justify-center cursor-pointer rounded-md transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: 'transparent' }}
            title="download"
          >
            <svg
              className="w-4 h-4"
              style={{
                backgroundColor: 'var(--vp-c-text-2)',
                maskImage:
                  "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMgMTNIMTMiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik04IDNWMTFNOCAxMUwxMSA4TTggMTFMNSA4IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')",
                maskRepeat: 'no-repeat',
                maskPosition: 'center center',
              }}
            />
          </button>

          {/* Copy */}
          <button
            onClick={copyResponse}
            className="h-7 w-7 flex items-center justify-center rounded-md transition-all duration-200 hover:scale-110"
            title={copySuccess ? 'Copied' : 'Copy'}
          >
            {copySuccess ? (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--vp-c-success-1)' }}>
                <path d="M15 4.5L7.5 12L3 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ color: 'var(--vp-c-text-2)' }}>
                <path
                  d="M14.25 5.25H7.25C6.14543 5.25 5.25 6.14543 5.25 7.25V14.25C5.25 15.3546 6.14543 16.25 7.25 16.25H14.25C15.3546 16.25 16.25 15.3546 16.25 14.25V7.25C16.25 6.14543 15.3546 5.25 14.25 5.25Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.80103 11.998L1.77203 5.07397C1.61003 3.98097 2.36403 2.96397 3.45603 2.80197L10.38 1.77297C11.313 1.63397 12.19 2.16297 12.528 3.00097"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="rounded-[14px]" style={{ backgroundColor: 'var(--vp-c-bg)' }}>
        <div
          className="px-3 py-3.5 min-h-[200px] max-h-[50vh] whitespace-pre font-mono text-xs leading-5 overflow-auto"
          style={{ color: 'var(--vp-c-text-2)' }}
          dangerouslySetInnerHTML={{ __html: highlightHtml }}
        />
      </div>
    </div>
  )
}
