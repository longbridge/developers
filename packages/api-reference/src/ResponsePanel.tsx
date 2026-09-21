/**
 * ResponsePanel — right-rail bottom card: status tabs (200/400/401/403/408)
 * showing documented example bodies; when a live TryIt response arrives it is
 * routed to its status tab and flagged 实测.
 */
import { useEffect, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import type { ApiResponse } from '@longbridge/openapi-tryit'
import { highlightCode } from './CodeSample'
import type { ResponseExample } from './openapi-loader'

const L = {
  response: { en: 'Response', 'zh-CN': '响应', 'zh-HK': '響應' },
  live: { en: 'Live', 'zh-CN': '实测', 'zh-HK': '實測' },
} as const

export interface ResponsePanelProps {
  examples: ResponseExample[]
  live: ApiResponse | null
  locale: Locale
}

export function ResponsePanel({ examples, live, locale }: ResponsePanelProps) {
  const statuses = examples.map((e) => e.status)
  const liveStatus = live?.status && live.status > 0 ? live.status : null
  const [active, setActive] = useState<number>(statuses[0] ?? 200)

  // Jump to the live response's status tab when one arrives.
  useEffect(() => {
    if (liveStatus) setActive(liveStatus)
  }, [live, liveStatus])

  const tabStatuses = liveStatus && !statuses.includes(liveStatus) ? [...statuses, liveStatus] : statuses
  const isLiveTab = liveStatus === active
  const body = isLiveTab
    ? JSON.stringify((live as any).response ?? live, null, 2)
    : (examples.find((e) => e.status === active)?.body ?? '')

  return (
    <section className="api-rail-card" data-lbus-component="response-panel">
      <div className="api-rail-head">
        <span className="api-rail-title">{L.response[locale]}</span>
        {isLiveTab && <span className="api-rail-live">{L.live[locale]}</span>}
      </div>
      <div className="api-rail-tabs" role="tablist">
        {tabStatuses.map((s) => (
          <button
            key={s}
            type="button"
            className={`api-rail-tab${s === active ? ' is-active' : ''}${s >= 400 ? ' is-err' : ''}`}
            onClick={() => setActive(s)}>
            {s}
          </button>
        ))}
      </div>
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(body, 'json') }} />
      </pre>
    </section>
  )
}
