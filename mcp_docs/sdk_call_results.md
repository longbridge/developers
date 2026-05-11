# SDK 接口调用结果

| 方法 | SDK 类型 | 状态 | 顶层字段 |
| ---- | -------- | ---- | -------- |
| `company_profile` | `CompanyOverview` | ✓ | `accounting_firm`, `address`, `ads_ratio`, `audit_inst`, `bus_license`, `category`, `chairman`, `company_name`, `email`, `employees`, `fax`, `founded`, `icon`, `issue_price`, `legal_counsel`, `legal_repr`, `listing_date`, `manager`, `market`, `name`, `office_address`, `phone`, `profile`, `region`, `secretary`, `sector`, `securities_rep`, `shares_offered`, `ticker`, `website`, `year_end`, `zip_code` |
| `financial_report` | `FinancialReports` | ✓ | `list` |
| `valuations` | `ValuationData` | ✓ | `metrics` |
| `ratings` | `StockRatings` | ✓ | `industry_name`, `industry_rank`, `multi_letter`, `multi_score`, `multi_score_change`, `ratings_json`, `report_period_txt`, `scale_txt_name`, `style_txt_name` |
| `institution_rating` | `InstitutionRating` | ✓ | `latest`, `summary` |
| `institution_rating_detail` | `InstitutionRatingDetail` | ✓ | `ccy_symbol`, `evaluate`, `target` |
| `dividends` | `DividendList` | ✓ | `list` |
| `dividend_detail` | `DividendList` | ✓ | `list` |
| `forecast_eps` | `ForecastEps` | ✓ | `items` |
| `consensus` | `FinancialConsensus` | ✓ | `currency`, `current_index`, `current_period`, `list`, `opt_periods` |
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
| `unusual_items` | `AnomalyResponse` | ✓ (空列表: changes) | `all_off`, `changes` |
| `calendar_report` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `calendar_dividend` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `calendar_ipo` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `exchange_rates` | `ExchangeRates` | ✓ | `exchanges` |
| `profit_analysis_summary` | `ProfitAnalysis` | ✓ | `sublist`, `summary` |
| `profit_analysis_by_market` | `ProfitAnalysisByMarket` | ✓ | `has_more`, `profit`, `stock_items` |
| `profit_analysis_detail` | `ProfitAnalysisDetail` | ✓ | `currency`, `default_tag`, `derivative_pnl_details`, `end`, `end_date`, `name`, `profit`, `start`, `start_date`, `underlying_details`, `updated_at`, `updated_date` |
| `list_alerts` | `AlertList` | ✓ | `lists` |
| `list_dca` | `DcaList` | ✓ | `plans` |
| `dca_stats` | `DcaStats` | ✓ (空列表: nearest_plans) | `active_count`, `finished_count`, `nearest_plans`, `rest_days`, `suspended_count`, `total_amount`, `total_profit` |
| `check_support` | `DcaSupportList` | ✓ | `infos` |
| `list_sharelist` | `SharelistList` | ✓ (空列表: sharelists, subscribed_sharelists) | `sharelists`, `subscribed_sharelists`, `tail_mark` |
| `popular_sharelist` | `SharelistList` | ✓ (空列表: subscribed_sharelists) | `sharelists`, `subscribed_sharelists`, `tail_mark` |
| `macro_calendar` | `CalendarEventsResponse` | ✓ (空列表: list) | `date`, `list` |
| `split_calendar` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `meeting_calendar` | `CalendarEventsResponse` | ✓ (空列表: list) | `date`, `list` |
| `merge_calendar` | `CalendarEventsResponse` | ✓ | `date`, `list` |
| `broker_holding_daily` | `BrokerHoldingDailyHistory` | ✓ | `list` |
| `dca_history` | `DcaHistoryResponse` | ✓ (空列表: records) | `has_more`, `records` |
| `profit_analysis_flows` | `ProfitAnalysisFlows` | ✓ (空列表: flows_list) | `flows_list`, `has_more` |