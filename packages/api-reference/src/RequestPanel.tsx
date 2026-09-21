/**
 * RequestPanel — right-rail top card: language-tabbed code example, a
 * collapsible 设置 Token (AuthorizationForm), an editable parameters form and a
 * 发送 button that fires a real signed request against the selected environment.
 */
import { useMemo, useState } from 'react'
import type { Locale } from '@longbridge/openapi-utils'
import {
  AuthorizationForm,
  ParametersForm,
  useAuthorization,
  createQuickRequest,
  type ParameterRow,
  type ApiResponse,
} from '@longbridge/openapi-tryit'
import { CodeTabs } from './CodeSample'
import type { CodeBlock, XParameter } from './openapi-loader'
import { useEnv } from './EnvContext'

const L = {
  request: { en: 'Request', 'zh-CN': '请求', 'zh-HK': '請求' },
  setToken: { en: 'Set Token', 'zh-CN': '设置 Token', 'zh-HK': '設置 Token' },
  send: { en: 'Send', 'zh-CN': '发送', 'zh-HK': '發送' },
  sending: { en: 'Sending…', 'zh-CN': '发送中…', 'zh-HK': '發送中…' },
} as const

export interface RequestPanelProps {
  method: string
  path: string
  xparams: XParameter[]
  blocks: CodeBlock[]
  locale: Locale
  onResponse: (r: ApiResponse) => void
  labelCopy: string
  labelCopied: string
}

export function RequestPanel({
  method,
  path,
  xparams,
  blocks,
  locale,
  onResponse,
  labelCopy,
  labelCopied,
}: RequestPanelProps) {
  const { baseUrl } = useEnv()
  const { authData, setAuthData, autoFilled } = useAuthorization()
  const [showToken, setShowToken] = useState(false)
  const [sending, setSending] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})

  const paramRows = useMemo<ParameterRow[]>(
    () => xparams.map((p) => ({ name: p.name, type: p.type ?? 'string', description: p.description, required: p.required })),
    [xparams]
  )

  const send = async () => {
    setSending(true)
    try {
      let finalPath = path
      const query: Record<string, unknown> = {}
      const body: Record<string, unknown> = {}
      for (const p of xparams) {
        const v = values[p.name]
        if (v === undefined || v === '') continue
        if (p.in === 'path') finalPath = finalPath.replace(`{${p.name}}`, String(v))
        else if (p.in === 'body') body[p.name] = v
        else query[p.name] = v
      }
      finalPath = finalPath.replace(/\{[^}]+\}/g, '1')
      const client = createQuickRequest(authData.appKey, authData.accessToken, authData.appSecret, { baseUrl })
      const m = method.toLowerCase()
      let res: ApiResponse
      if (m === 'post') res = await client.post(finalPath, body)
      else if (m === 'put') res = await client.put(finalPath, body)
      else if (m === 'delete') res = await client.delete(finalPath, query)
      else res = await client.get(finalPath, query)
      onResponse(res)
    } catch (err) {
      onResponse({ status: 0, statusText: 'Error', response: { code: -1, msg: err instanceof Error ? err.message : String(err), data: null } })
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="api-rail-card" data-lbus-component="request-panel">
      <div className="api-rail-head">
        <span className="api-rail-title">{L.request[locale]}</span>
        <button type="button" className="api-rail-tokenbtn" onClick={() => setShowToken((v) => !v)}>
          🔑 {L.setToken[locale]}
        </button>
      </div>
      {showToken && (
        <div className="api-rail-tokenform">
          <AuthorizationForm authData={authData} autoFilled={autoFilled} onChange={setAuthData} />
        </div>
      )}
      {blocks.length > 0 && <CodeTabs blocks={blocks} labelCopy={labelCopy} labelCopied={labelCopied} />}
      {paramRows.length > 0 && (
        <div className="api-rail-params">
          <ParametersForm parameters={paramRows} onChange={setValues} />
        </div>
      )}
      <button type="button" className="api-rail-send" disabled={sending} onClick={send}>
        {sending ? L.sending[locale] : `▶ ${L.send[locale]}`}
      </button>
    </section>
  )
}
