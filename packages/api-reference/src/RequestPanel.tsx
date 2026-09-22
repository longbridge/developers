/**
 * RequestPanel — right-rail top card: an auth-mode dropdown (Signed / OAuth), a
 * language-tabbed code example that follows the mode, a collapsible 设置 Token
 * form whose fields also follow the mode, an editable parameters form and a 发送
 * button that fires a real request (signed or Bearer) against the environment.
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
import { CodeDropdown } from './CodeSample'
import type { CodeBlock, XParameter } from './openapi-loader'
import { useEnv, type AuthMode } from './EnvContext'
import { signedCodeBlocks } from './signing-samples'

const L = {
  request: { en: 'Request', 'zh-CN': '请求', 'zh-HK': '請求' },
  setToken: { en: 'Set Token', 'zh-CN': '设置 Token', 'zh-HK': '設置 Token' },
  send: { en: 'Send', 'zh-CN': '发送', 'zh-HK': '發送' },
  sending: { en: 'Sending…', 'zh-CN': '发送中…', 'zh-HK': '發送中…' },
  sign: { en: 'Signed (App Key)', 'zh-CN': '签名 (App Key)', 'zh-HK': '簽名 (App Key)' },
  oauth: { en: 'OAuth (Bearer)', 'zh-CN': 'OAuth (Bearer)', 'zh-HK': 'OAuth (Bearer)' },
  accessToken: { en: 'Access Token', 'zh-CN': 'Access Token', 'zh-HK': 'Access Token' },
} as const

export interface RequestPanelProps {
  method: string
  path: string
  xparams: XParameter[]
  /** Authored OAuth (Bearer) samples from the spec, shown in OAuth mode. */
  oauthBlocks: CodeBlock[]
  locale: Locale
  onResponse: (r: ApiResponse) => void
  labelCopy: string
  labelCopied: string
}

export function RequestPanel({
  method,
  path,
  xparams,
  oauthBlocks,
  locale,
  onResponse,
  labelCopy,
  labelCopied,
}: RequestPanelProps) {
  const { baseUrl, displayBaseUrl, authMode, setAuthMode } = useEnv()
  const { authData, setAuthData, autoFilled } = useAuthorization()
  const [showToken, setShowToken] = useState(false)
  const [sending, setSending] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})

  const paramRows = useMemo<ParameterRow[]>(
    () => xparams.map((p) => ({ name: p.name, type: p.type ?? 'string', description: p.description, required: p.required })),
    [xparams]
  )

  // Both modes expose the same 8 languages: OAuth shows the authored Bearer
  // samples from the spec; Signed shows client-generated HMAC-signed samples.
  const shownBlocks = useMemo<CodeBlock[]>(
    () => (authMode === 'oauth' ? oauthBlocks : signedCodeBlocks(method, path, displayBaseUrl)),
    [authMode, oauthBlocks, method, path, displayBaseUrl]
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
      const m = method.toLowerCase()

      if (authMode === 'oauth') {
        // Raw Bearer request — no signing.
        const qs = new URLSearchParams(
          Object.entries(query).map(([k, v]) => [k, String(v)])
        ).toString()
        const hasBody = m === 'post' || m === 'put' || m === 'patch'
        const url = `${baseUrl}${finalPath}${qs ? `?${qs}` : ''}`
        const res = await fetch(url, {
          method: method.toUpperCase(),
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
          },
          body: hasBody ? JSON.stringify(body) : undefined,
        })
        const json = await res.json().catch(() => ({ code: -1, msg: 'non-JSON response', data: null }))
        onResponse({ status: res.status, statusText: res.statusText, response: json })
        return
      }

      const client = createQuickRequest(authData.appKey, authData.accessToken, authData.appSecret, { baseUrl })
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
        <select
          className="api-rail-authselect"
          aria-label="auth mode"
          value={authMode}
          onChange={(e) => setAuthMode(e.target.value as AuthMode)}>
          <option value="sign">{L.sign[locale]}</option>
          <option value="oauth">{L.oauth[locale]}</option>
        </select>
        <button type="button" className="api-rail-tokenbtn" onClick={() => setShowToken((v) => !v)}>
          🔑 {L.setToken[locale]}
        </button>
      </div>
      {showToken && (
        <div className="api-rail-tokenform">
          {authMode === 'sign' ? (
            <AuthorizationForm authData={authData} autoFilled={autoFilled} onChange={setAuthData} />
          ) : (
            <div className="api-rail-oauthform">
              <label className="api-rail-oauthlabel">{L.accessToken[locale]}</label>
              <input
                className="tryit-input"
                type="password"
                value={authData.accessToken}
                placeholder={L.accessToken[locale]}
                onChange={(e) => setAuthData({ ...authData, accessToken: e.target.value })}
              />
            </div>
          )}
        </div>
      )}
      {shownBlocks.length > 0 && <CodeDropdown blocks={shownBlocks} labelCopy={labelCopy} labelCopied={labelCopied} />}
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
