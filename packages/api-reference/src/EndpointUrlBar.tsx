/**
 * EndpointUrlBar — method badge + full URL, an env (生产/测试) segmented control,
 * a copy-URL button and a copy-page (Markdown) button. Mirrors the reference
 * design's URL row.
 */
import React, { useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import { useEnv } from './EnvContext'

const L = {
  prod: { en: 'Prod', 'zh-CN': '生产', 'zh-HK': '生產' },
  test: { en: 'Test', 'zh-CN': '测试', 'zh-HK': '測試' },
  copyPage: { en: 'Copy page', 'zh-CN': '复制页面', 'zh-HK': '複製頁面' },
  copied: { en: 'Copied', 'zh-CN': '已复制', 'zh-HK': '已複製' },
  copyUrl: { en: 'Copy URL', 'zh-CN': '复制 URL', 'zh-HK': '複製 URL' },
} as const

export interface EndpointUrlBarProps {
  method: string
  path: string
  localePrefix: string
  operationId: string
  locale: Locale
}

export function EndpointUrlBar({ method, path, localePrefix, operationId, locale }: EndpointUrlBarProps) {
  const { env, setEnv, displayBaseUrl } = useEnv()
  const [urlCopied, setUrlCopied] = useState(false)
  const [pageCopied, setPageCopied] = useState(false)
  const fullUrl = `${displayBaseUrl}${path}`

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 1500)
    })
  }
  const copyPage = async () => {
    try {
      const res = await fetch(`${localePrefix}/docs/api/${operationId}.md`)
      const md = await res.text()
      await navigator.clipboard.writeText(md)
      setPageCopied(true)
      setTimeout(() => setPageCopied(false), 1500)
    } catch {
      /* ignore */
    }
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
      <button type="button" className="ep-urlbar-copypage" onClick={copyPage}>
        {pageCopied ? L.copied[locale] : L.copyPage[locale]}
      </button>
    </div>
  )
}
