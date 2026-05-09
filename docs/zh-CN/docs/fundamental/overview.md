---
sidebar_position: 0
id: fundamental_overview
title: 概览
slug: overview
---

# 基本面 API 概览

研究与市场数据接口，涵盖公司基本面、市场结构和财经日历。所有接口均为只读，通过 SDK 调用。

## FundamentalContext

公司层面的财务数据与企业信息。

| 方法 | 说明 |
|---|---|
| [company_profile](./fundamental/company-profile) | 公司概况、行业及基本信息 |
| [financial_report](./fundamental/financial-report) | 利润表、资产负债表和现金流量表 |
| [valuations](./fundamental/valuations) | PE、PB、PS、EV/EBITDA 等估值指标 |
| [ratings](./fundamental/ratings) | 机构评级与目标价 |
| [dividends](./fundamental/dividends) | 历史分红记录 |
| [fund_holdings](./fundamental/fund-holdings) | 机构及基金持仓 |
| [shareholders](./fundamental/shareholders) | 主要股东 |
| [executives](./fundamental/executives) | 管理层与董事会成员 |
| [corporate_actions](./fundamental/corporate-actions) | 拆股、送股、配股等公司行动 |

## MarketContext

市场层面数据，包括指数成分、经纪商持仓和异动扫描。

| 方法 | 说明 |
|---|---|
| [market_status](./market/market-status) | 各市场当前交易状态 |
| [trading_stats](./market/trading-stats) | 标的盘中交易统计 |
| [index_components](./market/index-components) | 指数成分股列表 |
| [ah_premium](./market/ah-premium) | 两地上市股票的 A/H 股溢价率 |
| [broker_positions](./market/broker-positions) | 港股经纪商持仓（中央结算） |
| [unusual_items](./market/unusual-items) | 异常价格或成交量异动 |

## CalendarContext

财经事件日历，用于跟踪财报、分红和宏观数据发布。

| 方法 | 说明 |
|---|---|
| [earnings_calendar](./calendar/earnings-calendar) | 即将发布和近期的财报日期 |
| [dividend_calendar](./calendar/dividend-calendar) | 除权除息日和派息日 |
| [ipo_calendar](./calendar/ipo-calendar) | 新股认购和上市日期 |
| [split_calendar](./calendar/split-calendar) | 股票拆分生效日期 |
| [macro_calendar](./calendar/macro-calendar) | 宏观经济数据发布计划 |
