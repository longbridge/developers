/**
 * ResponsePanel — right-rail bottom card: status tabs (200/400/401/403/408)
 * showing documented example bodies; when a live TryIt response arrives it is
 * routed to its status tab and flagged 实测。
 */
import { useEffect, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import type { ApiResponse } from '@longbridge/openapi-tryit'
import { highlightCode } from './CodeSample'
import type { ResponseExample } from './openapi-loader'

const L = {
  response: { en: 'Response', 'zh-CN': '响应', 'zh-HK': '響應' },
  live: { en: 'Live', 'zh-CN': '实测', 'zh-HK': '實測' },
  error: { en: 'Error', 'zh-CN': '错误', 'zh-HK': '錯誤' },
} as const

export interface ResponsePanelProps {
  examples: ResponseExample[]
  live: ApiResponse | null
  locale: Locale
}

export function ResponsePanel({ examples, live, locale }: ResponsePanelProps) {
  const statuses = examples.map((e) => e.status)
  // A live response always gets a tab — including a network/timeout failure,
  // which surfaces as status 0 (rendered as an "Error" tab) so the user gets
  // feedback instead of the request silently falling back to the doc example.
  const liveStatus = live ? live.status : null
  const [active, setActive] = useState<number>(statuses[0] ?? 200)

  // Jump to the live response's tab when one arrives (0 is a valid tab here).
  useEffect(() => {
    if (liveStatus != null) setActive(liveStatus)
  }, [live, liveStatus])

  const tabStatuses = liveStatus != null && !statuses.includes(liveStatus) ? [...statuses, liveStatus] : statuses
  // Guard against a stale `active` (e.g. an error tab left over from a prior
  // endpoint) that no longer exists in the current tab set.
  const shownActive = tabStatuses.includes(active) ? active : (tabStatuses[0] ?? 200)
  const isLiveTab = liveStatus != null && liveStatus === shownActive
  const body = isLiveTab
    ? JSON.stringify((live as any).response ?? live, null, 2)
    : (examples.find((e) => e.status === shownActive)?.body ?? '')

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
            className={`api-rail-tab${s === shownActive ? ' is-active' : ''}${s === 0 || s >= 400 ? ' is-err' : ''}`}
            onClick={() => setActive(s)}>
            {s === 0 ? L.error[locale] : s}
          </button>
        ))}
      </div>
      <pre className="code-pre">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(body, 'json') }} />
      </pre>
    </section>
  )
}
