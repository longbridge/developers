// Leaf order within a subgroup, keyed by operationId / ws command id → the docs
// guide page sidebar_position. `docs-order.generated.ts` is the slug-matched
// auto layer; OVERRIDES below hand-map the items whose openapi id doesn't match
// the docs filename (submit_order↔submit, dca_create↔create_dca, grid_*↔*,
// list_topics↔topics, ai_workspaces↔workspaces, valuation↔valuations, …).
// Items with no docs page at all (signals, security_facts, list_securities, …)
// stay absent and sort after the documented leaves.
import { DOCS_ORDER as AUTO } from './docs-order.generated'

const OVERRIDES: Record<string, number> = {
  // Quote / Options
  'ws-optionchain-strike': 12,
  // Quote / Warrants (own subgroup, docs quote/warrants positions)
  'ws-warrant-quote': 4,
  'ws-issuers': 13,
  'ws-warrant-filter': 14,
  // News & Contents / News
  list_news: 1,
  // Trade / Assets (docs positions the account/stock/fund pages together)
  account_balance: 999,
  stock_positions: 999,
  fund_positions: 999,
  // Quote / Analytics
  'ws-capital-flow': 17,
  'ws-capital-dist': 18,
  list_filings: 20.5,
  short_positions_hk: 25,
  short_positions_us: 25.1,
  short_trades_hk: 27,
  short_trades_us: 27.1,
  // Quote / Watchlist
  create_watchlist_group: 2,
  update_watchlist_group: 4,
  watchlist_pinned: 5,
  // Quote / Subscribe
  'ws-push-brokers': 7,
  // Fundamental
  valuation: 4,
  'macrodata_indicator': 20,
  macrodata: 21,
  // Market / Market Status
  list_market_temperature: 3,
  // News & Contents / Topics
  list_topics: 2,
  list_my_topics: 3,
  // News & Contents / Sharelist
  list_sharelists: 1,
  popular_sharelists: 6,
  sharelist_add_securities: 7,
  sharelist_remove_securities: 8,
  sharelist_sort_securities: 9,
  // Trade / Order
  submit_order: 1,
  replace_order: 5,
  estimate_max_purchase: 7,
  // Trade / Grid Trading
  grid_symbol_info: 0.5,
  grid_submit: 1,
  grid_replace: 2,
  grid_list_by_ids: 4,
  grid_detail: 5,
  grid_trigger_history: 6,
  grid_cancel: 7,
  grid_suspend: 8,
  grid_restart: 9,
  // Trade / Notification (one docs page, keep the 3 commands adjacent)
  'ws-trade-sub': 6,
  'ws-trade-unsub': 6.1,
  'ws-trade-notify': 6.2,
  // Account / Portfolio
  exchange_rate: 1,
  // Account / DCA
  dca_list: 1,
  dca_create: 2,
  dca_update: 3,
  dca_toggle: 5,
  dca_check_support: 9,
  dca_calc_date: 10,
  dca_set_reminder: 11,
  // AI Agent / Workspace
  ai_workspaces: 1,
  ai_workspace_agents: 2,
  // AI Agent / Conversation
  ai_conversation: 2,
  ai_continue: 3,
}

// Force certain leaves to the very end of their subgroup, after even the
// undocumented items (which fall back to LEAF_FALLBACK).
export const LEAF_FALLBACK = 1e6
const TRAIL: Record<string, number> = {
  us_crypto_overview: 1e7,
}

export const DOCS_ORDER: Record<string, number> = { ...AUTO, ...OVERRIDES, ...TRAIL }

