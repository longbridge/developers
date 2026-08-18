/**
 * ParametersForm — renders API parameter fields from ParameterRow[]
 * Ported from legacy TryIt/ParametersForm.vue + BaseForm.vue
 * Replaces @jsonforms/vue with native controlled inputs
 */

import React, { useState } from 'react'

export interface ParameterRow {
  name: string
  type: string
  description?: string
  required?: string | boolean
}

interface ParametersFormProps {
  parameters?: ParameterRow[]
  onChange: (data: Record<string, unknown>) => void
}

function isRequired(val?: string | boolean): boolean {
  if (typeof val === 'boolean') return val
  if (!val) return false
  const lower = val.toLowerCase()
  return lower === 'true' || lower === 'yes' || lower === '是'
}

function normalizeType(type: string): 'number' | 'boolean' | 'array' | 'text' {
  const lower = type.toLowerCase()
  if (lower === 'integer' || lower === 'int' || lower === 'number') return 'number'
  if (lower === 'boolean' || lower === 'bool') return 'boolean'
  if (lower === 'string[]' || lower === 'array') return 'array'
  return 'text'
}

export function ParametersForm({ parameters = [], onChange }: ParametersFormProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})

  if (parameters.length === 0) {
    return null
  }

  const update = (name: string, value: unknown) => {
    const next = { ...values, [name]: value }
    setValues(next)
    onChange(next)
  }

  return (
    <div className="tryit-base-form rounded-xl overflow-hidden" style={{ border: '1px solid var(--vp-c-border)' }}>
      <div
        className="flex items-center justify-between cursor-pointer select-none p-4 tryit-form-header"
        onClick={() => setCollapsed((c) => !c)}
      >
        <h2 className="font-semibold m-0" style={{ color: 'var(--vp-c-text-1)' }}>
          Parameters
        </h2>
      </div>
      <div className={`tryit-form-content${collapsed ? ' tryit-collapsed' : ''}`}>
        <div className="px-4 pb-4 flex flex-col gap-3">
          {parameters.map((param) => (
            <ParameterField
              key={param.name}
              param={param}
              value={values[param.name]}
              onChange={(val) => update(param.name, val)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface ParameterFieldProps {
  param: ParameterRow
  value: unknown
  onChange: (val: unknown) => void
}

function ParameterField({ param, value, onChange }: ParameterFieldProps) {
  const kind = normalizeType(param.type)
  const required = isRequired(param.required)

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium flex gap-1 items-center" style={{ color: 'var(--vp-c-text-2)' }}>
        {param.name}
        {required && <span style={{ color: 'var(--vp-c-danger-1)' }}>*</span>}
        {param.description && (
          <span className="font-normal ml-1" style={{ color: 'var(--vp-c-text-3)' }}>
            — {param.description}
          </span>
        )}
      </label>

      {kind === 'boolean' ? (
        <select
          value={value === undefined ? '' : String(value)}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') onChange(undefined)
            else onChange(v === 'true')
          }}
          className="tryit-input"
        >
          <option value="">—</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : kind === 'number' ? (
        <input
          type="number"
          value={value === undefined ? '' : String(value)}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? undefined : Number(v))
          }}
          className="tryit-input"
          placeholder={param.name}
        />
      ) : (
        <input
          type="text"
          value={value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value || undefined)}
          className="tryit-input"
          placeholder={kind === 'array' ? 'comma-separated values' : param.name}
        />
      )}
    </div>
  )
}
