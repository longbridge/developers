import permissionsYaml from '../../../../quote-permissions.yaml'

export type QuoteLevel = 'basic' | 'lv1' | 'lv2' | 'overnight' | 'opra'
export type QuoteLocale = 'en' | 'zh-CN' | 'zh-HK'
export type L10n = Record<QuoteLocale, string>

interface CommandEntry {
  level: QuoteLevel
  market?: string
  description?: Record<string, string>
  store_cards?: Record<string, string>
}

const { ui, levels, commands } = permissionsYaml

export const QUOTE_COMMANDS: Record<string, CommandEntry> = commands

export const QUOTE_LINK_URL: string = ui.link_url
export const QUOTE_PERMISSION_TITLE: L10n = ui.permission_title
export const QUOTE_SEPARATE_NOTE: L10n = ui.separate_note
export const QUOTE_MARKET_LABELS: Record<string, L10n> = ui.market_labels

export const QUOTE_BADGE_LABELS: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.label])
) as Record<QuoteLevel, L10n>

export const QUOTE_DESCRIPTIONS: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.description])
) as Record<QuoteLevel, L10n>

// Tailwind color tokens shared across QuotePermission and Pricing components
// basic=green, lv1=blue, lv2=orange, opra=purple
export const LEVEL_COLORS: Record<QuoteLevel | 'opra', { hex: string; text: string; bg: string; border: string }> = {
  basic:    { hex: '#22c55e', text: '#16a34a', bg: 'rgba(34,197,94,0.07)',   border: 'rgba(34,197,94,0.3)'   }, // green-500 / green-600
  lv1:      { hex: '#3b82f6', text: '#2563eb', bg: 'rgba(59,130,246,0.07)',  border: 'rgba(59,130,246,0.3)'  }, // blue-500 / blue-600
  lv2:      { hex: '#f97316', text: '#ea580c', bg: 'rgba(249,115,22,0.07)',  border: 'rgba(249,115,22,0.3)'  }, // orange-500 / orange-600
  overnight:{ hex: '#eab308', text: '#ca8a04', bg: 'rgba(234,179,8,0.07)',   border: 'rgba(234,179,8,0.3)'   }, // yellow-500 / yellow-600
  opra:     { hex: '#a855f7', text: '#9333ea', bg: 'rgba(168,85,247,0.07)',  border: 'rgba(168,85,247,0.3)'  }, // purple-500 / purple-600
}

export const QUOTE_LINK_TEXT: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.link_text])
) as Record<QuoteLevel, L10n>
