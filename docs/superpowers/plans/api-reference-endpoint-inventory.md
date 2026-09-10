# API Reference 接口清单（path → tag → Rust 源）

> 来源：`grep -rhoE '"/v[0-9][^"]*"' openapi/rust/src | sort -u`（138 条 HTTP path）+ WebSocket 合成 path。
> Rust context 文件位于 `openapi/rust/src/<module>/context.rs`，请求体位于 `openapi/rust/src/<module>/requests/`。
> 执行内容任务（Task 6–13）时逐条勾选。归类为**建议**，最终以 spec §4.3 taxonomy 为准；如 Rust path 与归类冲突，以 Rust path 语义为准并在提交信息注明。

## Realtime (WebSocket)
源：`quote/context.rs`、`trade/context.rs`、`crates/proto`。合成 path：
- [ ] quote/subscribe · quote/unsubscribe
- [ ] quote/push/quote · quote/push/depth · quote/push/brokers · quote/push/trade
- [ ] quote/subscribe/candlesticks · quote/push/candlestick
- [ ] trade/subscribe · trade/unsubscribe · trade/push/order

## Quote（HTTP 行情）
源：`quote/context.rs`。按源码 path 归入（实时/静态类 HTTP）：
- [ ] static_info、realtime HTTP、option_chain（expiry-date-list / info-by-date）、warrant_list、trading_session、trading_days、capital_flow、capital_distribution、calc_indexes 等。

## Watchlist
源：`sharelist/`、`quote/context.rs`。
- [ ] /v1/watchlist/groups（GET/POST/PUT/DELETE）
- [ ] /v1/sharelists · /v1/sharelists/popular · /v1/sharelists/{id} · /v1/sharelists/{id}/items · /v1/sharelists/{id}/items/sort

## Analytics（分析/基本面/估值/筛选/信号）— 最大一组
源：`fundamental/`、`screener/`、`signal/`、`quote/`。
- [ ] /v1/quote/valuation · /v1/quote/valuation/detail · /v1/quote/compare/valuation
- [ ] /v1/quote/industry-valuation-comparison · /v1/quote/industry-valuation-distribution · /v1/quote/industry/rank · /v1/quote/industries/peers
- [ ] /v1/quote/financial-reports · /v1/quote/financial-consensus-detail · /v1/quote/financials/earnings-snapshot · /v1/quote/forecast-eps
- [ ] /v1/quote/fundamentals/business-segments · /v1/quote/fundamentals/business-segments/history · /v1/quote/operatings
- [ ] /v1/quote/comp-overview · /v1/quote/company-act · /v1/quote/company-professionals · /v1/quote/invest-relations
- [ ] /v1/quote/dividends · /v1/quote/dividends/details · /v1/quote/buy-backs · /v1/quote/changes
- [ ] /v1/quote/shareholders · /v1/quote/shareholders/holding · /v1/quote/shareholders/top · /v1/quote/fund-holders
- [ ] /v1/quote/institution-rating-latest · /v1/quote/institution-ratings · /v1/quote/institution-ratings/detail · /v1/quote/ratings · /v1/quote/ratings/institutional
- [ ] /v1/quote/short-positions/hk · /v1/quote/short-positions/us · /v1/quote/short-trades/hk · /v1/quote/short-trades/us
- [ ] /v1/quote/trades-statistics · /v1/quote/broker-holding · /v1/quote/broker-holding/daily · /v1/quote/broker-holding/detail
- [ ] /v1/quote/etf-asset-allocation · /v1/quote/ahpremium/klines · /v1/quote/ahpremium/timeshares · /v1/quote/filings · /v1/facts/security_facts
- [ ] /v1/quote/option-volume-stats · /v1/quote/option-volume-stats/daily
- [ ] /v1/quote/ai/screener/indicators · /v1/quote/ai/screener/search · /v1/quote/ai/screener/strategies/mine · /v1/quote/ai/screener/strategies/recommend · /v1/quote/ai/screener/strategy/{id} · /v1/quote/ai/screener/strategy/{sid}
- [ ] /v1/signals · /v1/signals/{signal_id}

## Trade（交易与订单）
源：`trade/context.rs`。
- [ ] /v1/trade/order（GET 详情 / POST 提交 / PUT 改单 / DELETE 撤单）
- [ ] /v1/trade/order/history · /v1/trade/order/today · /v1/trade/order/multileg
- [ ] /v1/trade/execution/history · /v1/trade/execution/today
- [ ] /v1/trade/estimate/buy_limit · /v1/orders/info

## Assets（持仓与资金）
源：`asset/`、`portfolio/`。
- [ ] /v1/asset/account · /v1/asset/fund · /v1/asset/stock · /v1/asset/cashflow · /v1/asset/exchange_rates
- [ ] /v1/us/assets/overview
- [ ] /v1/portfolio/profit-analysis-summary · /v1/portfolio/profit-analysis-sublist · /v1/portfolio/profit-analysis/by-market · /v1/portfolio/profit-analysis/detail · /v1/portfolio/profit-analysis/flows
- [ ] /v1/risk/margin-ratio
- [ ] /v1/statement/list · /v1/statement/download

## Grid（网格交易）
源：`grid/`。
- [ ] /v1/gridtrading/submit · replace · cancel · suspend · restart · detail · list · trigger_history_list

## DCA（定投）
源：`dca/`。
- [ ] /v1/dailycoins/create · update · query · query-records · statistic · toggle · batch-check-support · calc-trd-date · update-alter-hours

## Alert（提醒）
源：`alert/`。
- [ ] /v1/notify/reminders（增删改查按源码方法拆）

## Content（社区与资讯）
源：`content/`。
- [ ] /v1/content/{symbol}/news · /v1/content/{symbol}/topics
- [ ] /v1/content/topics · /v1/content/topics/mine · /v1/content/topics/{id} · /v1/content/topics/{topic_id}/comments

## Market（市场）
源：`market/`、`calendar/`、`quote/`。
- [ ] /v1/quote/market-status · /v1/quote/market_temperature · /v1/quote/history_market_temperature
- [ ] /v1/quote/finance_calendar · /v1/quote/get_security_list · /v1/quote/index-constituents
- [ ] /v1/quote/market/rank/categories · /v1/quote/market/rank/list · /v1/quote/market/stock-events

## AI
源：`agent/`。
- [ ] /v1/ai/agents · /v1/ai/agents/{agent_id}/conversations · /v1/ai/agents/{agent_id}/conversations/{chat_uid}/messages/{message_id}/continue
- [ ] /v1/ai/workspaces · /v1/ai/workspaces/{workspace_id}/agents

## 认证/杂项
- [ ] /v1/token/refresh（认证；可归 x-pages 说明页而非接口）

## 注意
- 现有 `openapi.yaml` 里有 `提交策略问卷`（submit strategy questionnaire）操作，但对应 SDK 接口 `GridContext.submit_strategy_questionnaire`（`/v1/record/questionnaire`）已在 commit `0e013a645` 从 Rust 移除 —— 迁移 Grid 时应一并删除该操作。
