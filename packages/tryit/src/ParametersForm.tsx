/**
 * ParametersForm — renders API parameter fields from ParameterRow[]
 * Ported from legacy TryIt/ParametersForm.vue + BaseForm.vue
 * Replaces @jsonforms/vue with native controlled inputs
 */

import { useState } from 'react'

export interface ParameterRow {
  name: string
  type: string
  description?: string
  required?: string | boolean
}

interface ParametersFormProps {
  parameters?: ParameterRow[]
  onChange: (data: Record<string, unknown>) => void
  /** Names of required params flagged as empty after a failed submit. */
  invalid?: Set<string>
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

// Above this many total parameters, extra optional fields collapse by default.
const MANY_PARAMS = 6
// Always keep at least this many fields visible up front — if there aren't
// enough required ones, lead optional fields fill the gap so the form is never
// just a bare "show optional" toggle.
const MIN_VISIBLE = 4

export function ParametersForm({ parameters = [], onChange, invalid }: ParametersFormProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const [values, setValues] = useState<Record<string, unknown>>({})

  if (parameters.length === 0) {
    return null
  }

  const update = (name: string, value: unknown) => {
    const next = { ...values, [name]: value }
    setValues(next)
    onChange(next)
  }

  // Required first, optional after. When there are many params, collapse only the
  // OVERFLOW optional fields — always keep at least MIN_VISIBLE fields showing so
  // an all-optional endpoint doesn't render as just a toggle.
  const required = parameters.filter((p) => isRequired(p.required))
  const optional = parameters.filter((p) => !isRequired(p.required))
  const manyParams = parameters.length > MANY_PARAMS
  const leadCount = manyParams ? Math.max(0, MIN_VISIBLE - required.length) : optional.length
  const leadOptional = optional.slice(0, leadCount)
  const restOptional = optional.slice(leadCount)

  return (
    <div className="tryit-base-form overflow-hidden" style={{ border: '1px solid var(--lb-stroke, #e6e7e8)', borderRadius: 'var(--ar-radius-md, 6px)' }}>
      <button
        type="button"
        aria-expanded={!collapsed}
        className="flex items-center justify-between select-none p-4 tryit-form-header w-full text-left"
        style={{ background: 'transparent', border: 'none' }}
        onClick={() => setCollapsed((c) => !c)}
      >
        <h2 className="font-semibold m-0" style={{ color: 'var(--lb-fg-1, #0a0e19)' }}>
          Parameters
        </h2>
      </button>
      <div className={`tryit-form-content${collapsed ? ' tryit-collapsed' : ''}`}>
        <div className="px-4 pb-4 flex flex-col gap-3">
          {[...required, ...leadOptional].map((param) => (
            <ParameterField
              key={param.name}
              param={param}
              value={values[param.name]}
              invalid={invalid?.has(param.name)}
              onChange={(val) => update(param.name, val)}
            />
          ))}
          {restOptional.length > 0 && (
            <button
              type="button"
              aria-expanded={showOptional}
              className="tryit-optional-toggle text-xs font-medium self-start"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--lb-brand, #00b8b8)', padding: '2px 0' }}
              onClick={() => setShowOptional((v) => !v)}
            >
              {showOptional ? '▾ Hide optional parameters' : `▸ Show ${restOptional.length} more optional parameters`}
            </button>
          )}
          {showOptional &&
            restOptional.map((param) => (
              <ParameterField
                key={param.name}
                param={param}
                value={values[param.name]}
                invalid={invalid?.has(param.name)}
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
  invalid?: boolean
}

function ParameterField({ param, value, onChange, invalid }: ParameterFieldProps) {
  const kind = normalizeType(param.type)
  const required = isRequired(param.required)
  const controlClass = `tryit-input${invalid ? ' tryit-input--invalid' : ''}`

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium flex gap-1 items-center" style={{ color: 'var(--lb-fg-2, #6c6e75)' }}>
        {param.name}
        {required && <span style={{ color: 'var(--lb-risk-danger, #ff3a3a)' }}>*</span>}
        {param.description && (
          <span className="font-normal ml-1" style={{ color: 'var(--lb-fg-3, #a9abae)' }}>
            — {param.description}
          </span>
        )}
      </label>

      {kind === 'boolean' ? (
        <select
          data-param={param.name}
          aria-invalid={invalid || undefined}
          value={value === undefined ? '' : String(value)}
          onChange={(e) => {
            const v = e.target.value
            if (v === '') onChange(undefined)
            else onChange(v === 'true')
          }}
          className={controlClass}
        >
          <option value="">—</option>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      ) : kind === 'number' ? (
        <input
          data-param={param.name}
          aria-invalid={invalid || undefined}
          type="number"
          value={value === undefined ? '' : String(value)}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? undefined : Number(v))
          }}
          className={controlClass}
          placeholder={param.name}
        />
      ) : (
        <input
          data-param={param.name}
          aria-invalid={invalid || undefined}
          type="text"
          value={value === undefined ? '' : String(value)}
          onChange={(e) => onChange(e.target.value || undefined)}
          className={controlClass}
          placeholder={kind === 'array' ? 'comma-separated values' : param.name}
        />
      )}
    </div>
  )
}
