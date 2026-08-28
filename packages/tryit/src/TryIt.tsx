/**
 * TryIt — API interactive tester
 * Ported from legacy TryIt/index.vue + TryIt/Content.vue
 *
 * Two render modes:
 *   1. Button mode (default): shows PlayButton that switches to panel mode
 *   2. Panel mode: full form + response layout, entered via ?mode=try-it
 */

import React from 'react'
import { PlayButton } from './PlayButton'
import { AuthorizationForm } from './AuthorizationForm'
import { ParametersForm } from './ParametersForm'
import type { ParameterRow } from './ParametersForm'
import { ResponseView } from './ResponseView'
import { useTryItMode } from './hooks/useTryItMode'
import { useAuthorization } from './hooks/useAuthorization'
import { useResponse } from './hooks/useResponse'
import { createQuickRequest } from './utils/request'

export interface TryItProps {
  operationId?: string
  method?: string
  path?: string
  parameters?: ParameterRow[]
  [k: string]: unknown
}

type MethodColor = 'success' | 'brand' | 'warning' | 'danger' | 'important' | 'default'

function getMethodColor(method?: string): MethodColor {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'success'
    case 'post':
      return 'brand'
    case 'put':
      return 'warning'
    case 'delete':
      return 'danger'
    case 'patch':
      return 'important'
    default:
      return 'default'
  }
}

function getMethodTextClass(method?: string): string {
  switch (method?.toLowerCase()) {
    case 'get':
      return 'method-get'
    case 'post':
      return 'method-post'
    case 'put':
      return 'method-put'
    case 'delete':
      return 'method-delete'
    case 'patch':
      return 'method-patch'
    default:
      return ''
  }
}

export function TryIt({ method, path, parameters = [] }: TryItProps) {
  const { showTryIt, enter, leave } = useTryItMode()
  const { authData, setAuthData, autoFilled } = useAuthorization()
  const { result, setResult, isLoading, setIsLoading } = useResponse()

  const [params, setParams] = React.useState<Record<string, unknown>>({})

  const methodColor = getMethodColor(method)
  const methodTextClass = getMethodTextClass(method)
  const displayMethod = method?.toUpperCase() ?? 'GET'
  const displayPath = path ?? ''

  // ── Button Mode ────────────────────────────────────────────────────────────
  if (!showTryIt) {
    return (
      <PlayButton color={methodColor} onClick={enter}>
        Try it
      </PlayButton>
    )
  }

  // ── Panel Mode ─────────────────────────────────────────────────────────────
  const handleGoBack = () => {
    leave()
    setResult(null)
    setIsLoading(false)
  }

  const handleSend = async () => {
    setResult(null)
    setIsLoading(true)
    try {
      const client = createQuickRequest(authData.appKey, authData.accessToken, authData.appSecret)
      const reqMethod = (method ?? 'get').toLowerCase()
      let res

      // Collect non-undefined params
      const filteredParams: Record<string, unknown> = {}
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== '') filteredParams[k] = v
      }

      if (reqMethod === 'get') {
        res = await client.get(displayPath, filteredParams)
      } else if (reqMethod === 'post') {
        res = await client.post(displayPath, filteredParams)
      } else if (reqMethod === 'put') {
        res = await client.put(displayPath, filteredParams)
      } else if (reqMethod === 'delete') {
        res = await client.delete(displayPath)
      } else {
        res = await client.get(displayPath, filteredParams)
      }
      setResult(res)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setResult({
        status: 500,
        statusText: 'Internal Server Error',
        response: { code: -1, msg: errorMsg, data: null },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      data-lbus-component="tryit"
      className="w-full tryit-panel"
    >
      {/* Header */}
      <div className="flex items-center w-full gap-2 mb-4 flex-wrap">
        {/* Method badge */}
        <span
          className={`tryit-method-badge ${methodTextClass} inline-flex items-center px-2 py-0.5 rounded font-mono text-xs font-semibold`}
        >
          {displayMethod}
        </span>

        {/* URL */}
        <code
          className="flex-1 min-w-0 text-xs truncate"
          style={{ color: 'var(--vp-c-text-2)' }}
          title={displayPath}
        >
          {displayPath}
        </code>

        {/* Back */}
        <button
          onClick={handleGoBack}
          className="ml-auto text-xs underline cursor-pointer"
          style={{ color: 'var(--vp-c-text-3)', background: 'none', border: 'none', padding: 0 }}
        >
          ← Back
        </button>

        {/* Send */}
        <PlayButton
          color={methodColor}
          loading={isLoading}
          disabled={isLoading}
          onClick={handleSend}
        >
          Send
        </PlayButton>
      </div>

      {/* Body: two-column on md+ */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: forms */}
        <div className="flex flex-col gap-4 flex-1 min-w-0">
          <AuthorizationForm
            authData={authData}
            autoFilled={autoFilled}
            onChange={setAuthData}
          />
          {parameters.length > 0 && (
            <ParametersForm parameters={parameters} onChange={setParams} />
          )}
        </div>

        {/* Right: loading spinner or response */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <svg
                className="animate-spin"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                style={{ color: 'var(--vp-c-brand-1)' }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <ResponseView result={result} />
          )}
        </div>
      </div>
    </div>
  )
}
