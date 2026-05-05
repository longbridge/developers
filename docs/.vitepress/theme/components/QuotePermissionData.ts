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
export const QUOTE_ACTIVATED_LABEL: L10n = ui.activated_label
export const QUOTE_NOT_ACTIVATED_LABEL: L10n = ui.not_activated_label
export const QUOTE_ALREADY_ACTIVATED_NOTE: L10n = ui.already_activated_note
export const QUOTE_MARKET_LABELS: Record<string, L10n> = ui.market_labels

export const QUOTE_BADGE_LABELS: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.label])
) as Record<QuoteLevel, L10n>

export const QUOTE_DESCRIPTIONS: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.description])
) as Record<QuoteLevel, L10n>

export const QUOTE_LINK_TEXT: Record<QuoteLevel, L10n> = Object.fromEntries(
  Object.entries(levels).map(([k, v]: [string, any]) => [k, v.link_text])
) as Record<QuoteLevel, L10n>
