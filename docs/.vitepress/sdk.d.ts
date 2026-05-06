interface Response<T> {
  code: number
  message: string
  data: T
}

interface Member {
  uuid: string
  phone_number: string
  email: string
  lang: string
  country_code: string
  nickname: string
  desc: string
  real_name: string
  gender: number
  email_check: boolean
  avatar: string
  has_support_manager: boolean
  can_nick_modified: boolean
  mobile: string
  member_id: string
  support_manage_id: string
  user_region: string
  pi_us: string
  account: string
  ms_id: string
}

interface Setting {
  asset_us_option_extend_price: string
  asset_us_overnightprice: string
  asset_us_prepostprice: string
  change_unit_notice: string
  commission_card: string
  cost_type: string
  currency_preference: string
  delegated_orders_panel: string
  desktop_config: string
  desktop_layout: string
  desktop_layout_auto: string
  device_max_nums: string
  earnings_m: string
  exright_m: string
  financing_double_check: string
  header_data: string
  hide_empty_group: string
  hold_column_order: string
  hold_option_order: string
  lang: string
  lb_currency_preference: string
  list_interaction: string
  live_m: string
  login_notice_email: string
  login_notice_sms: string
  market_order_reminder: string
  message_prompt: string
  options_tab_layout: string
  options_tab_sort: string
  p_trade_auth: string
  position_marker: string
  quote_tab_order: string
  recommend: string
  repeat_order_risk: string
  show_delisted_holdings: string
  show_zero_hold: string
  stock_color_preference: string
  stock_style: string
  subscribe_order_stock: string
  symbol_change_m: string
  symbol_delist_m: string
  theme_preference: string
  time_zone: string
  token_expire: string
  trade_double_check: string
  trade_expires_in: string
  trade_limit_notice: string
  trade_sound_on: string
  two_factors_check: string
  wch_market_order: string
  wch_market_order_on: string
  wch_module_order: string
  wch_options_clear: string
  wch_order: string
  wch_order_on: string
}

interface LevelInfo {
  base: number
  verify_info: any[]
}

interface Security {
  password_set: boolean
  trade_password_set: boolean
}

interface Account {
  no: string
  list: any[]
}

interface UserInfo {
  member: Member
  setting: Setting
  level_info: LevelInfo
  security: Security
  account: Account
  setting_updated_at: string
}

interface LongportInternal {
  getUserInfo: () => Promise<Response<UserInfo>>
  isLogin: () => boolean
}

declare const longportInternal: LongportInternal

declare global {
  interface Window {
    longportInternal: LongportInternal
  }

  type LongportInternal = typeof longportInternal
}

export default longportInternal

declare module '*.yaml' {
  const content: any
  export default content
}
