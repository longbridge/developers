/**
 * RequestPanel — right-rail top card: an auth-mode dropdown (Signed / OAuth), a
 * language-tabbed code example that follows the mode, a collapsible 设置 Token
 * form whose fields also follow the mode, an editable parameters form and a 发送
 * button that fires a real request (signed or Bearer) against the environment.
 */
import { useMemo, useRef, useState } from 'react'
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
import { pickLocale, type CodeBlock, type XParameter } from './openapi-loader'
import { useEnv, type AuthMode } from './EnvContext'
import { Dropdown } from './Dropdown'
import { signedCodeBlocks } from './signing-samples'

const L = {
  request: { en: 'Request', 'zh-CN': '请求', 'zh-HK': '請求' },
  setToken: { en: 'Set Token', 'zh-CN': '设置 Token', 'zh-HK': '設置 Token' },
  send: { en: 'Try it', 'zh-CN': 'Try it', 'zh-HK': 'Try it' },
  sending: { en: 'Sending…', 'zh-CN': 'Sending…', 'zh-HK': 'Sending…' },
  sign: { en: 'API Key', 'zh-CN': 'API Key', 'zh-HK': 'API Key' },
  oauth: { en: 'OAuth 2.0', 'zh-CN': 'OAuth 2.0', 'zh-HK': 'OAuth 2.0' },
  accessToken: { en: 'Access Token', 'zh-CN': 'Access Token', 'zh-HK': 'Access Token' },
  settings: { en: 'Settings', 'zh-CN': '设置', 'zh-HK': '設置' },
  authMode: { en: 'Auth method', 'zh-CN': '鉴权方式', 'zh-HK': '鑑權方式' },
} as const

const IconSettings = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

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
  const [showSettings, setShowSettings] = useState(false)
  const [sending, setSending] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})
  // Required params flagged as empty after a failed Try it (highlighted red).
  const [invalidParams, setInvalidParams] = useState<Set<string>>(new Set())
  const panelRef = useRef<HTMLElement>(null)
  const settingsRef = useRef<HTMLDivElement>(null)

  const paramRows = useMemo<ParameterRow[]>(
    () =>
      xparams.map((p) => ({
        name: p.name,
        type: p.type ?? 'string',
        description: pickLocale(p.description, p['x-description-zh'], p['x-description-zh-hk'], locale),
        required: p.required,
      })),
    [xparams, locale]
  )

  // Both modes expose the same 8 languages: OAuth shows the authored Bearer
  // samples from the spec; Signed shows client-generated HMAC-signed samples.
  const shownBlocks = useMemo<CodeBlock[]>(
    () => (authMode === 'oauth' ? oauthBlocks : signedCodeBlocks(method, path, displayBaseUrl)),
    [authMode, oauthBlocks, method, path, displayBaseUrl]
  )

  // Substitute what the user typed (token + params) into the code so the
  // displayed/copied sample reflects their input instead of `<placeholders>`.
  const filledBlocks = useMemo<CodeBlock[]>(() => {
    const sub = (code: string): string => {
      let out = code
      if (authData.appKey) out = out.split('<app_key>').join(authData.appKey)
      if (authData.appSecret) out = out.split('<app_secret>').join(authData.appSecret)
      if (authData.accessToken) out = out.split('<access_token>').join(authData.accessToken)
      for (const p of xparams) {
        const v = values[p.name]
        if (v === undefined || v === '') continue
        out = out.split(`<${p.name}>`).join(String(v))
      }
      return out
    }
    return shownBlocks.map((b) => ({ ...b, code: sub(b.code) }))
  }, [shownBlocks, authData, values, xparams])

  const isReq = (v?: string | boolean): boolean => {
    if (typeof v === 'boolean') return v
    if (!v) return false
    const l = String(v).toLowerCase()
    return l === 'true' || l === 'yes' || l === '是'
  }
  const authFilled =
    authMode === 'oauth'
      ? !!authData.accessToken?.trim()
      : !!(authData.appKey?.trim() && authData.appSecret?.trim() && authData.accessToken?.trim())

  // Try it validates on click (never disabled): if the token or a required param
  // is missing, jump to and highlight the first empty field instead of sending.
  const send = async () => {
    if (!authFilled) {
      setShowSettings(true)
      setTimeout(() => {
        const inputs = settingsRef.current?.querySelectorAll<HTMLInputElement>('input')
        const target = inputs && Array.from(inputs).find((i) => !i.value.trim())
        const el = target ?? inputs?.[0]
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el?.focus()
      }, 0)
      return
    }
    const missing = xparams
      .filter((p) => isReq(p.required) && String(values[p.name] ?? '').trim() === '')
      .map((p) => p.name)
    if (missing.length > 0) {
      setInvalidParams(new Set(missing))
      setTimeout(() => {
        const el = panelRef.current?.querySelector<HTMLElement>(`[data-param="${CSS.escape(missing[0])}"]`)
        el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el?.focus()
      }, 0)
      return
    }
    setInvalidParams(new Set())
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
        // Read as text first so a non-JSON body (proxy/HTML error, empty 204) is
        // surfaced instead of a generic "non-JSON response".
        const text = await res.text()
        let json: unknown
        try {
          json = text ? JSON.parse(text) : { code: res.status, msg: `HTTP ${res.status} ${res.statusText}`, data: null }
        } catch {
          json = { code: res.status, msg: text.slice(0, 800), data: null }
        }
        onResponse({ status: res.status, statusText: res.statusText, response: json as ApiResponse['response'] })
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
    <section ref={panelRef} className="api-rail-card" data-lbus-component="request-panel">
      <div className="api-rail-head">
        <span className="api-rail-title">{L.request[locale]}</span>
        <button
          type="button"
          className="api-rail-iconbtn"
          aria-expanded={showSettings}
          aria-label={L.settings[locale]}
          title={L.settings[locale]}
          onClick={() => setShowSettings((v) => !v)}>
          <IconSettings />
        </button>
      </div>
      {showSettings && (
        <div className="api-rail-tokenform" ref={settingsRef}>
          <Dropdown<AuthMode>
            className="ar-auth-block"
            ariaLabel={L.authMode[locale]}
            value={authMode}
            options={[
              { value: 'sign', label: L.sign[locale] },
              { value: 'oauth', label: L.oauth[locale] },
            ]}
            onChange={setAuthMode}
          />
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
      {filledBlocks.length > 0 && <CodeDropdown blocks={filledBlocks} labelCopy={labelCopy} labelCopied={labelCopied} />}
      {paramRows.length > 0 && (
        <div className="api-rail-params">
          <ParametersForm
            parameters={paramRows}
            invalid={invalidParams}
            onChange={(d) => {
              setValues(d)
              if (invalidParams.size) setInvalidParams(new Set())
            }}
          />
        </div>
      )}
      <button type="button" className="api-rail-send" disabled={sending} onClick={send}>
        {sending ? L.sending[locale] : L.send[locale]}
      </button>
    </section>
  )
}
