# SDK 接口调用结果

| # | 方法 | SDK 类型 | 状态 | 第一个字段 |
| - | ---- | -------- | ---- | ---------- |
| 1 | `company_profile` | `CompanyOverview` | ✓ | `accounting_firm` |
| 2 | `financial_report` | `FinancialReports` | ✓ | `list` |
| 3 | `valuations` | `ValuationData` | ✓ | `metrics` |
| 4 | `ratings` | `StockRatings` | ✓ | `industry_name` |
| 5 | `institution_rating` | `InstitutionRating` | ✓ | `latest` |
| 6 | `institution_rating_detail` | `InstitutionRatingDetail` | ✓ | `ccy_symbol` |
| 7 | `dividends` | `DividendList` | ✓ | `list` |
| 8 | `dividend_detail` | `DividendList` | ✓ | `list` |
| 9 | `forecast_eps` | `ForecastEps` | ✓ | `items` |
| 10 | `consensus` | `FinancialConsensus` | ✓ | `currency` |
| 11 | `valuation_history` | `ValuationHistoryResponse` | ✓ | `history` |
| 12 | `industry_valuation` | `IndustryValuationList` | ✓ | `list` |
| 13 | `industry_valuation_dist` | `IndustryValuationDist` | ✓ | `pb` |
| 14 | `executives` | `ExecutiveList` | ✓ | `professional_list` |
| 15 | `shareholders` | `ShareholderList` | ✓ | `forward_url` |
| 16 | `fund_holdings` | `FundHolders` | ✓ | `lists` |
| 17 | `corporate_actions` | `CorpActions` | ✓ | `items` |
| 18 | `invest_relation` | `InvestRelations` | ✓ | `forward_url` |
| 19 | `operating` | `OperatingList` | ✓ | `list` |
| 20 | `buyback` | `BuybackData` | ✓ | `buyback_history` |
| 21 | `market_status` | `MarketStatusResponse` | ✓ | `market_time` |
| 22 | `broker_positions` | `BrokerHoldingTop` | ✓ | `buy` |
| 23 | `broker_holding_detail` | `BrokerHoldingDetail` | ✓ | `list` |
| 24 | `ah_premium` | `AhPremiumKlines` | ✓ | `klines` |
| 25 | `ah_premium_intraday` | `AhPremiumIntraday` | ✓ | `klines` |
| 26 | `trading_stats` | `TradeStatsResponse` | ✓ | `statistics` |
| 27 | `index_components` | `IndexConstituents` | ✓ | `fall_num` |
| 28 | `unusual_items` | `AnomalyResponse` | ✓ | `all_off` |
| 29 | `calendar_report` | `CalendarEventsResponse` | ✓ | `date` |
| 30 | `calendar_dividend` | `CalendarEventsResponse` | ✓ | `date` |
| 31 | `calendar_ipo` | `CalendarEventsResponse` | ✓ | `date` |
| 32 | `exchange_rates` | `ExchangeRates` | ✓ | `exchanges` |
| 33 | `profit_analysis_summary` | `ProfitAnalysis` | ✓ | `sublist` |
| 34 | `profit_analysis_by_market` | `ProfitAnalysisByMarket` | ✓ | `has_more` |
| 35 | `profit_analysis_detail` | `ProfitAnalysisDetail` | ✓ | `currency` |
| 36 | `list_alerts` | `AlertList` | ✓ | `lists` |
| 37 | `list_dca` | `DcaList` | ✓ | `plans` |
| 38 | `dca_stats` | `DcaStats` | ✓ | `active_count` |
| 39 | `check_support` | `DcaSupportList` | ✓ | `infos` |
| 40 | `list_sharelist` | `SharelistList` | ✓ | `sharelists` |
| 41 | `popular_sharelist` | `SharelistList` | ✓ | `sharelists` |
| 42 | `macro_calendar` | `CalendarEventsResponse` | ✓ | `date` |
| 43 | `split_calendar` | `CalendarEventsResponse` | ✓ | `date` |
| 44 | `meeting_calendar` | `CalendarEventsResponse` | ✓ | `date` |
| 45 | `merge_calendar` | `CalendarEventsResponse` | ✓ | `date` |
| 46 | `broker_holding_daily` | `BrokerHoldingDailyHistory` | ✓ | `list` |
| 47 | `dca_history` | `DcaHistoryResponse` | ✓ | `has_more` |
| 48 | `profit_analysis_flows` | `ProfitAnalysisFlows` | ✓ | `flows_list` |
| 50 | `create_dca` | `DcaCreateResult` | ✓ | `plan_id` |
| 51 | `calc_date` | `DcaCalcDateResult` | ✓ | `trade_date` |
| 52 | `set_reminder` | `NoneType` | ✓ | `result` |
| 53 | `update_dca` | `DcaCreateResult` | ✓ | `plan_id` |
| 54 | `pause_dca` | `NoneType` | ✓ | `result` |
| 55 | `resume_dca` | `NoneType` | ✓ | `result` |
| 56 | `stop_dca` | `NoneType` | ✓ | `result` |
| 57 | `delete_dca` | `None` | ✓ | SDK uses stop() — permanently ends a plan, returns None (voi |
| 60 | `create_sharelist` | `NoneType` | ✓ | — |
| 61 | `create_alert` | `None` | ✓ | returns None (void) |
| 62 | `disable_alert` | `dict` | ✓ | SDK bug: missing frequency field. API returns {id, status} |
| 63 | `enable_alert` | `dict` | ✓ | SDK bug: missing frequency field. API returns {id, status} |
| 64 | `delete_alert` | `None` | ✓ | returns None (void) |
| 65 | `add_securities` | `None` | ✓ | returns None (void) |
| 66 | `sharelist_detail` | `SharelistDetail` | ✓ | `scopes` |
| 67 | `sort_securities` | `None` | ✓ | returns None (void) |
| 68 | `remove_securities` | `None` | ✓ | returns None (void) |
| 69 | `delete_sharelist` | `None` | ✓ | returns None (void) |
| 70 | `update_sharelist` | `None` | ✓ | No update method in SDK; use create+delete to replace |