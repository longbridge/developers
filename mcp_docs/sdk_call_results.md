# SDK 接口调用结果

| 方法 | SDK 类型 | 状态 | 说明 |
| ---- | -------- | ---- | ---- |
| `company_profile` | `CompanyOverview` | ✓ | `accounting_firm`, `address`, `ads_ratio`, `audit_inst` |
| `financial_report` | `FinancialReports` | ✓ | `list` |
| `valuations` | `ValuationData` | ✓ | `metrics` |
| `ratings` | `StockRatings` | ✓ | `industry_name`, `industry_rank`, `multi_letter`, `multi_score` |
| `institution_rating` | `InstitutionRating` | ✓ | `latest`, `summary` |
| `institution_rating_detail` | `InstitutionRatingDetail` | ✓ | `ccy_symbol`, `evaluate`, `target` |
| `dividends` | `DividendList` | ✓ | `list` |
| `dividend_detail` | `DividendList` | ✓ | `list` |
| `forecast_eps` | `ForecastEps` | ✓ | `items` |
| `consensus` | `FinancialConsensus` | ✓ | `currency`, `current_index`, `current_period`, `list` |
| `valuation_history` | `ValuationHistoryResponse` | ✓ | `history` |
| `industry_valuation` | `IndustryValuationList` | ✓ | `list` |
| `industry_valuation_dist` | `IndustryValuationDist` | ✓ | `pb`, `pe`, `ps` |
| `executives` | `ExecutiveList` | ✓ | `professional_list` |
| `shareholders` | `ShareholderList` | ✓ | `forward_url`, `shareholder_list`, `total` |
| `fund_holdings` | `FundHolders` | ✓ | `lists` |
| `corporate_actions` | `CorpActions` | ✓ | `items` |
| `invest_relation` | `InvestRelations` | ✓ | `forward_url`, `invest_securities` |
| `operating` | `OperatingList` | ✓ | `list` |
| `buyback` | `BuybackData` | ✓ | `buyback_history`, `buyback_ratios`, `recent_buybacks` |
| `market_status` | `MarketStatusResponse` | ✓ | `market_time` |
| `broker_positions` | `BrokerHoldingTop` | ✓ | `buy`, `sell`, `updated_at` |
| `broker_holding_detail` | `BrokerHoldingDetail` | ✓ | `list`, `updated_at` |
| `ah_premium` | `AhPremiumKlines` | ✓ | `klines` |
| `ah_premium_intraday` | `AhPremiumIntraday` | ✓ | `klines` |
| `trading_stats` | `TradeStatsResponse` | ✓ | `statistics`, `trades` |
| `index_components` | `IndexConstituents` | ✓ | `fall_num`, `flat_num`, `rise_num`, `stocks` |
| `unusual_items` | `AnomalyResponse` | ✓ | 空列表: changes |
| `calendar_report` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `calendar_dividend` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `calendar_ipo` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `exchange_rates` | `ExchangeRates` | ✓ | `exchanges` |
| `profit_analysis_summary` | `ProfitAnalysis` | ✓ | `sublist`, `summary` |
| `profit_analysis_by_market` | `ProfitAnalysisByMarket` | ✓ | `has_more`, `profit`, `stock_items` |
| `profit_analysis_detail` | `ProfitAnalysisDetail` | ✓ | `currency`, `default_tag`, `derivative_pnl_details`, `end` |
| `list_alerts` | `AlertList` | ✓ | `lists` |
| `list_dca` | `DcaList` | ✓ | `plans` |
| `dca_stats` | `DcaStats` | ✓ | 空列表: nearest_plans |
| `check_support` | `DcaSupportList` | ✓ | `infos` |
| `list_sharelist` | `SharelistList` | ✓ | 空列表: sharelists, subscribed_sharelists |
| `popular_sharelist` | `SharelistList` | ✓ | 空列表: subscribed_sharelists |
| `macro_calendar` | `CalendarEventsResponse` | ✓ | 空列表: list |
| `split_calendar` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `meeting_calendar` | `CalendarEventsResponse` | ✓ | 空列表: list |
| `merge_calendar` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `broker_holding_daily` | `BrokerHoldingDailyHistory` | ✓ | `list` |
| `dca_history` | `DcaHistoryResponse` | ✓ | 空列表: records |
| `profit_analysis_flows` | `ProfitAnalysisFlows` | ✓ | 空列表: flows_list |
| `create_dca` | `DcaCreateResult` | ✓ | `plan_id` |
| `calc_date` | `DcaCalcDateResult` | ✓ | `trade_date` |
| `set_reminder` | `NoneType` | ✓ | `result` |
| `update_dca` | `DcaCreateResult` | ✓ | `plan_id` |
| `pause_dca` | `NoneType` | ✓ | `result` |
| `resume_dca` | `NoneType` | ✓ | `result` |
| `stop_dca` | `NoneType` | ✓ | `result` |
| `delete_dca` | — | ✗ API 错误 | OpenApiException: (kind=ErrorKind.OpenApi, code=602001, trace_id=fcf3b40b50e3a15 |
| `create_sharelist` | `NoneType` | ✓ |  |
| `create_alert` | `None` | ✓ | returns None (void) |
| `disable_alert` | — | ✗ API 错误 | OpenApiException: (kind=ErrorKind.OpenApi, code=400, trace_id=1457234817a4b55ef7 |
| `enable_alert` | — | ✗ API 错误 | OpenApiException: (kind=ErrorKind.OpenApi, code=400, trace_id=f80a130af56a52c797 |
| `delete_alert` | `None` | ✓ | returns None (void) |
| `add_securities` | `None` | ✓ | returns None (void) |
| `sharelist_detail` | `SharelistDetail` | ✓ | `scopes`, `sharelist` |
| `sort_securities` | `None` | ✓ | returns None (void) |
| `remove_securities` | `None` | ✓ | returns None (void) |
| `delete_sharelist` | `None` | ✓ | returns None (void) |
| `update_sharelist` | `None` | ✓ | No update method in SDK; use create+delete to replace |