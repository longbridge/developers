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

export const QUOTE_COMMANDS: Record<string, CommandEntry> = permissionsYaml.commands

export const QUOTE_PERMISSION_TITLE: L10n = {
  en: 'Quote Permission Required',
  'zh-CN': '行情权限要求',
  'zh-HK': '行情權限要求',
}

export const QUOTE_BADGE_LABELS: Record<QuoteLevel, L10n> = {
  basic: { en: 'Basic', 'zh-CN': '基础行情', 'zh-HK': '基礎行情' },
  lv1: { en: 'LV1 Real-time', 'zh-CN': 'LV1 实时', 'zh-HK': 'LV1 實時' },
  lv2: { en: 'LV2 Subscription', 'zh-CN': 'LV2 订阅', 'zh-HK': 'LV2 訂閱' },
  overnight: { en: 'Overnight', 'zh-CN': '盘前盘后', 'zh-HK': '盤前盤後' },
  opra: { en: 'OPRA', 'zh-CN': 'OPRA 期权', 'zh-HK': 'OPRA 期權' },
}

export const QUOTE_DESCRIPTIONS: Record<QuoteLevel, L10n> = {
  basic: {
    en: 'Included with OpenAPI activation — no extra purchase needed.',
    'zh-CN': '开通 OpenAPI 后自动获得，无需额外购买。',
    'zh-HK': '開通 OpenAPI 後自動獲得，無需額外購買。',
  },
  lv1: {
    en: 'Enables real-time HK stock quotes and WebSocket quote push. Purchase LV1 in the Quote Store.',
    'zh-CN': '开启港股实时报价，支持行情数据实时推送。需在行情商城购买 LV1 行情卡。',
    'zh-HK': '開啟港股實時報價，支持行情數據實時推送。需在行情商城購買 LV1 行情卡。',
  },
  lv2: {
    en: 'Provides top-10 bid/ask order book depth and real-time depth push. Purchase LV2 in the Quote Store.',
    'zh-CN': '提供十档买卖盘口数据，支持深度行情实时推送。需在行情商城购买 LV2 行情卡。',
    'zh-HK': '提供十檔買賣盤口數據，支持深度行情實時推送。需在行情商城購買 LV2 行情卡。',
  },
  overnight: {
    en: 'US extended hours (pre/post-market) data. Requires LV1 purchase and environment variable LONGBRIDGE_ENABLE_OVERNIGHT=true.',
    'zh-CN': '美股盘前/盘后行情数据。需购买 LV1 行情卡，并设置环境变量 LONGBRIDGE_ENABLE_OVERNIGHT=true。',
    'zh-HK': '美股盤前/盤後行情數據。需購買 LV1 行情卡，並設置環境變量 LONGBRIDGE_ENABLE_OVERNIGHT=true。',
  },
  opra: {
    en: 'US options real-time quotes. Purchase "OPRA US Options Quotes (OpenAPI)" in the Quote Store.',
    'zh-CN': '美股期权实时行情。需在行情商店购买「OPRA US Options Quotes (OpenAPI)」行情卡。',
    'zh-HK': '美股期權實時行情。需在行情商店購買「OPRA US Options Quotes (OpenAPI)」行情卡。',
  },
}

export const QUOTE_LINK_URL: Record<QuoteLevel, string> = {
  basic: 'https://open.longbridge.com/account',
  lv1: 'https://open.longbridge.com/account',
  lv2: 'https://open.longbridge.com/account',
  overnight: 'https://open.longbridge.com/account',
  opra: 'https://open.longbridge.com/account',
}

export const QUOTE_LINK_TEXT: Record<QuoteLevel, L10n> = {
  basic: { en: 'My Quotes', 'zh-CN': '我的行情权限', 'zh-HK': '我的行情權限' },
  lv1: { en: 'Go to Quote Store', 'zh-CN': '前往行情商城', 'zh-HK': '前往行情商城' },
  lv2: { en: 'Go to Quote Store', 'zh-CN': '前往行情商城', 'zh-HK': '前往行情商城' },
  overnight: { en: 'Go to Quote Store', 'zh-CN': '前往行情商城', 'zh-HK': '前往行情商城' },
  opra: { en: 'Go to Quote Store', 'zh-CN': '前往行情商城', 'zh-HK': '前往行情商城' },
}

export const QUOTE_SEPARATE_NOTE: L10n = {
  en: 'OpenAPI quote perms are separate from App/Web perms',
  'zh-CN': 'OpenAPI 行情权限独立于 App/Web 行情权限',
  'zh-HK': 'OpenAPI 行情權限獨立於 App/Web 行情權限',
}

export const QUOTE_MARKET_LABELS: Record<string, L10n> = {
  HK: { en: 'HK', 'zh-CN': '港股', 'zh-HK': '港股' },
  US: { en: 'US', 'zh-CN': '美股', 'zh-HK': '美股' },
  'HK only': { en: 'HK only', 'zh-CN': '仅港股', 'zh-HK': '僅港股' },
}

export const QUOTE_ACTIVATED_LABEL: L10n = {
  en: 'Activated',
  'zh-CN': '已开通',
  'zh-HK': '已開通',
}

export const QUOTE_NOT_ACTIVATED_LABEL: L10n = {
  en: 'Not activated',
  'zh-CN': '未开通',
  'zh-HK': '未開通',
}

export const QUOTE_ALREADY_ACTIVATED_NOTE: L10n = {
  en: 'You already have this permission',
  'zh-CN': '您已开通此权限',
  'zh-HK': '您已開通此權限',
}
