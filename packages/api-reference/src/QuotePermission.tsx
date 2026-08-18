/**
 * QuotePermission.tsx
 * Renders the permission badge + detail card for a quote command.
 * Ported 1:1 from ApiReference.vue (QuotePermission inline template).
 * Imports quote-permissions.yaml?raw via Vite raw import.
 */
import React from 'react'
import { load } from 'js-yaml'
import type { Locale } from '@longbridge/openapi-utils'

// Vite raw import — resolved at build time
import rawQP from '../../../quote-permissions.yaml?raw'

// ── YAML types ────────────────────────────────────────────────────────────────

interface LocaleString {
  en: string
  'zh-CN': string
  'zh-HK': string
}

interface LevelDef {
  label: LocaleString
  description: LocaleString
  link_text: LocaleString
}

interface CommandDef {
  level: string
  market?: string
  description: LocaleString
}

interface QPData {
  ui: {
    link_url: string
    permission_title: LocaleString
    separate_note: LocaleString
    market_labels: Record<string, LocaleString>
  }
  levels: Record<string, LevelDef>
  commands: Record<string, CommandDef>
}

// ── Level color map ───────────────────────────────────────────────────────────

const LEVEL_CLASS: Record<string, string> = {
  basic: 'qp-badge--green',
  lv1: 'qp-badge--blue',
  lv2: 'qp-badge--orange',
  overnight: 'qp-badge--yellow',
  opra: 'qp-badge--purple',
}

// ── Parse once at module level ────────────────────────────────────────────────

let _qpData: QPData | null = null
function getQPData(): QPData {
  if (!_qpData) {
    _qpData = load(rawQP) as QPData
  }
  return _qpData
}

// ── Component ─────────────────────────────────────────────────────────────────

export interface QuotePermissionProps {
  /** The x-quote-command value from the OpenAPI operation */
  command: string
  locale: Locale
}

export function QuotePermission({ command, locale }: QuotePermissionProps) {
  const qp = getQPData()
  const cmd = qp.commands?.[command]
  if (!cmd) return null

  const level = qp.levels?.[cmd.level]
  if (!level) return null

  const ui = qp.ui
  const locStr = (s: LocaleString) => s?.[locale] ?? s?.en ?? ''
  const badgeClass = LEVEL_CLASS[cmd.level] ?? 'qp-badge--blue'

  const marketKey = cmd.market
  const marketLabel = marketKey ? locStr(ui.market_labels?.[marketKey] ?? { en: marketKey, 'zh-CN': marketKey, 'zh-HK': marketKey }) : null

  return (
    <div data-lbus-component="quote-permission" className="qp-wrapper">
      <div className="qp-header">
        <span className="qp-title">{locStr(ui.permission_title)}</span>
        <span className={`qp-badge ${badgeClass}`}>{locStr(level.label)}</span>
        {marketLabel && <span className="qp-market">{marketLabel}</span>}
      </div>
      <p className="qp-desc">{locStr(cmd.description)}</p>
      {ui.link_url && (
        <p className="qp-note">
          {locStr(ui.separate_note)}{' '}
          <a href={ui.link_url} target="_blank" rel="noopener noreferrer" className="qp-link">
            {locStr(level.link_text)}
          </a>
        </p>
      )}
    </div>
  )
}
