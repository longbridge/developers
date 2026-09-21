/**
 * EnvContext — 生产/测试 environment for the API Reference.
 *
 * `displayBaseUrl` is the real domain shown in the URL bar and code examples.
 * `baseUrl` is what the TryIt client actually calls: in dev it is a same-origin
 * proxy prefix (/api-prod, /api-test — see astro.config.ts) to dodge CORS; in a
 * production build it is the real domain.
 */
import React, { createContext, useContext, useState, useCallback } from 'react'

export type ApiEnv = 'prod' | 'test'

const DISPLAY: Record<ApiEnv, string> = {
  prod: 'https://openapi.longbridge.com',
  test: 'https://openapi.longbridge.xyz',
}
const DEV_PROXY: Record<ApiEnv, string> = {
  prod: '/api-prod',
  test: '/api-test',
}

const STORAGE_KEY = 'lb-apiref-env'
const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV

function initialEnv(): ApiEnv {
  if (typeof window === 'undefined') return 'prod'
  const v = window.localStorage.getItem(STORAGE_KEY)
  return v === 'test' ? 'test' : 'prod'
}

interface EnvCtx {
  env: ApiEnv
  setEnv: (e: ApiEnv) => void
  /** Real domain, for display (URL bar, code examples). */
  displayBaseUrl: string
  /** What TryIt calls: dev proxy prefix, or real domain in prod builds. */
  baseUrl: string
}

const Ctx = createContext<EnvCtx | null>(null)

export function EnvProvider({ children }: { children: React.ReactNode }) {
  const [env, setEnvState] = useState<ApiEnv>(initialEnv)
  const setEnv = useCallback((e: ApiEnv) => {
    setEnvState(e)
    if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, e)
  }, [])
  const value: EnvCtx = {
    env,
    setEnv,
    displayBaseUrl: DISPLAY[env],
    baseUrl: isDev ? DEV_PROXY[env] : DISPLAY[env],
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useEnv(): EnvCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useEnv must be used within <EnvProvider>')
  return ctx
}
