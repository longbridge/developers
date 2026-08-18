/**
 * useAuthorization — manages app key / secret / token state
 * and pre-fills from localStorage mock_app_auth (same as legacy AuthorizationForm.vue)
 */

import { useState, useEffect } from 'react'

export interface AuthData {
  appKey: string
  appSecret: string
  accessToken: string
}

function readMockAuth(): Partial<AuthData> {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem('mock_app_auth') : null
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return {
      appKey: parsed.access_key_id || '',
      appSecret: parsed.access_key_secret || '',
      accessToken: parsed.token || '',
    }
  } catch {
    return {}
  }
}

export function useAuthorization() {
  const [authData, setAuthData] = useState<AuthData>({
    appKey: '',
    appSecret: '',
    accessToken: '',
  })
  const [autoFilled, setAutoFilled] = useState(false)

  useEffect(() => {
    const mock = readMockAuth()
    if (mock.appKey || mock.appSecret || mock.accessToken) {
      setAuthData({
        appKey: mock.appKey || '',
        appSecret: mock.appSecret || '',
        accessToken: mock.accessToken || '',
      })
      setAutoFilled(true)
    }
  }, [])

  return { authData, setAuthData, autoFilled }
}
