/**
 * EndpointUrlBar — method badge + full URL, an env (生产/测试) segmented control,
 * a copy-URL button and a split "copy page" dropdown (copy markdown / view as
 * markdown / open in ChatGPT / open in Claude). Mirrors the reference design.
 */
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { useEnv } from './EnvContext'

const L = {
  prod: { en: 'Prod', 'zh-CN': '生产', 'zh-HK': '生產' },
  test: { en: 'Test', 'zh-CN': '测试', 'zh-HK': '測試' },
  copyPage: { en: 'Copy page', 'zh-CN': '复制页面', 'zh-HK': '複製頁面' },
  copied: { en: 'Copied', 'zh-CN': '已复制', 'zh-HK': '已複製' },
  copyUrl: { en: 'Copy URL', 'zh-CN': '复制 URL', 'zh-HK': '複製 URL' },
  viewMd: { en: 'View as Markdown', 'zh-CN': '以 Markdown 查看', 'zh-HK': '以 Markdown 檢視' },
  openChatgpt: { en: 'Open in ChatGPT', 'zh-CN': '在 ChatGPT 中打开', 'zh-HK': '在 ChatGPT 中開啟' },
  openClaude: { en: 'Open in Claude', 'zh-CN': '在 Claude 中打开', 'zh-HK': '在 Claude 中開啟' },
} as const

export interface EndpointUrlBarProps {
  method: string
  path: string
  localePrefix: string
  operationId: string
  locale: Locale
}

// Simple monochrome glyphs for the dropdown items.
const IconDoc = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
)
const IconChatgpt = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M22 9.5a5 5 0 0 0-.55-4.15 5.06 5.06 0 0 0-5.44-2.42A5 5 0 0 0 7.6 4a5 5 0 0 0-3.34 2.42A5.06 5.06 0 0 0 4.9 13a5 5 0 0 0 .55 4.15 5.06 5.06 0 0 0 5.44 2.42A5 5 0 0 0 16.4 20a5 5 0 0 0 3.34-2.42A5.06 5.06 0 0 0 22 11zm-7.5 10a3.7 3.7 0 0 1-2.38-.86l3.3-1.9a.55.55 0 0 0 .27-.47v-4.65l1.4.81v3.86a3.73 3.73 0 0 1-2.6 3.2zM6.2 16.16a3.7 3.7 0 0 1-.44-2.49l3.3 1.9a.54.54 0 0 0 .54 0l4-2.32v1.62l-3.34 1.93a3.73 3.73 0 0 1-4.06-.64zm-.87-7.1a3.7 3.7 0 0 1 1.94-1.62v3.94a.54.54 0 0 0 .27.47l4 2.31-1.4.81-3.34-1.93a3.73 3.73 0 0 1-1.47-3.99zm11.9 2.77l-4-2.32 1.4-.8 3.34 1.92a3.72 3.72 0 0 1-.57 6.72V13.4a.55.55 0 0 0-.17-.57zm1.4-2.1l-3.3-1.9a.54.54 0 0 0-.54 0l-4 2.31V8.53l3.34-1.93a3.72 3.72 0 0 1 4.5 5.93zM9.9 12.63l-1.4-.81V7.96a3.72 3.72 0 0 1 6.1-2.86l-3.3 1.9a.55.55 0 0 0-.27.47zm.76-1.63L12 9.85l1.34.77v1.54L12 14l-1.34-.77z" />
  </svg>
)
const IconClaude = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12 2c.4 0 .74.26.86.64l2.1 6.4 6.4 2.1a.9.9 0 0 1 0 1.72l-6.4 2.1-2.1 6.4a.9.9 0 0 1-1.72 0l-2.1-6.4-6.4-2.1a.9.9 0 0 1 0-1.72l6.4-2.1 2.1-6.4A.9.9 0 0 1 12 2z" />
  </svg>
)

export function EndpointUrlBar({ method, path, localePrefix, operationId, locale }: EndpointUrlBarProps) {
  const { env, setEnv, displayBaseUrl } = useEnv()
  const [urlCopied, setUrlCopied] = useState(false)
  const [pageCopied, setPageCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const fullUrl = `${displayBaseUrl}${path}`

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const mdUrl = `${localePrefix}/docs/api/${operationId}.md`
  const absMdUrl = `${origin}${mdUrl}`
  const prompt = `Read ${absMdUrl} so I can ask questions about this API.`

  // Close the dropdown on outside click.
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [menuOpen])

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 1500)
    })
  }
  const copyPage = async () => {
    try {
      const res = await fetch(mdUrl)
      const md = await res.text()
      await navigator.clipboard.writeText(md)
      setPageCopied(true)
      setTimeout(() => setPageCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }
  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setMenuOpen(false)
  }

  return (
    <div className="ep-urlbar" data-lbus-component="endpoint-url-bar">
      <span className={`ep-method-badge method-${method.toLowerCase()}`}>{method}</span>
      <code className="ep-urlbar-url" title={fullUrl}>
        {fullUrl}
      </code>
      <button type="button" className="ep-urlbar-icon" onClick={copyUrl} title={L.copyUrl[locale]}>
        {urlCopied ? '✓' : '⧉'}
      </button>
      <div className="ep-urlbar-env" role="tablist" aria-label="environment">
        <button
          type="button"
          className={`ep-env-seg${env === 'prod' ? ' is-active' : ''}`}
          onClick={() => setEnv('prod')}>
          {L.prod[locale]}
        </button>
        <button
          type="button"
          className={`ep-env-seg${env === 'test' ? ' is-active' : ''}`}
          onClick={() => setEnv('test')}>
          {L.test[locale]}
        </button>
      </div>
      <div className="ep-copypage" ref={wrapRef}>
        <button type="button" className="ep-copypage-main" onClick={copyPage}>
          <span className="ep-copypage-ic">⧉</span>
          {pageCopied ? L.copied[locale] : L.copyPage[locale]}
        </button>
        <button
          type="button"
          className="ep-copypage-toggle"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}>
          ⌄
        </button>
        {menuOpen && (
          <div className="ep-copypage-menu" role="menu">
            <a className="ep-copypage-item" role="menuitem" href={mdUrl} target="_blank" rel="noopener noreferrer" onClick={() => setMenuOpen(false)}>
              <IconDoc />
              {L.viewMd[locale]}
            </a>
            <button
              type="button"
              className="ep-copypage-item"
              role="menuitem"
              onClick={() => openExternal(`https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt)}`)}>
              <IconChatgpt />
              {L.openChatgpt[locale]}
            </button>
            <button
              type="button"
              className="ep-copypage-item"
              role="menuitem"
              onClick={() => openExternal(`https://claude.ai/new?q=${encodeURIComponent(prompt)}`)}>
              <IconClaude />
              {L.openClaude[locale]}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
