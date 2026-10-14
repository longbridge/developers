/**
 * AuthorizationForm — app key / secret / token fields with localStorage prefill
 * Ported from legacy TryIt/AuthorizationForm.vue
 */

import React, { useState } from 'react'
import type { AuthData } from './hooks/useAuthorization'

interface AuthorizationFormProps {
  authData: AuthData
  autoFilled?: boolean
  onChange: (data: AuthData) => void
}

export function AuthorizationForm({ authData, autoFilled, onChange }: AuthorizationFormProps) {
  const [collapsed, setCollapsed] = useState(false)

  const update = (field: keyof AuthData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...authData, [field]: e.target.value })
  }

  return (
    <div className="tryit-base-form rounded-xl overflow-hidden" style={{ border: '1px solid var(--vp-c-border)' }}>
      <div
        className="flex items-center justify-between cursor-pointer select-none p-4 tryit-form-header"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h2 className="font-semibold m-0" style={{ color: 'var(--vp-c-text-1)' }}>
          Authorization
        </h2>
        {autoFilled && (
          <span className="text-xs" style={{ color: 'var(--vp-c-brand-1)' }}>
            Auto filled
          </span>
        )}
      </div>

      <div className={`tryit-form-content${collapsed ? ' tryit-collapsed' : ''}`}>
        <div className="px-4 pb-4 flex flex-col gap-3">
          <Field label="App Key" value={authData.appKey} onChange={update('appKey')} />
          <Field label="App Secret" type="password" value={authData.appSecret} onChange={update('appSecret')} />
          <Field label="Access Token" type="password" value={authData.accessToken} onChange={update('accessToken')} />
        </div>
      </div>
    </div>
  )
}

interface FieldProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Field({ label, type = 'text', value, onChange }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--vp-c-text-2)' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="tryit-input"
        placeholder={label}
      />
    </div>
  )
}
