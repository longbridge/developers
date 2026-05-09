---
sidebar_position: 0
id: account_overview
title: 概覽
slug: overview
---

# 賬戶 API 概覽

賬戶管理接口，涵盖组合分析、價格提醒、定投计划和股單管理。大多数接口需要交易级别的认证权限。

## PortfolioContext

组合盈亏分析与外汇汇率查询。

| 方法 | 说明 |
|---|---|
| [profit_analysis_summary](./portfolio/profit-analysis-summary) | 组合整体盈亏汇总 |
| [profit_analysis_detail](./portfolio/profit-analysis-detail) | 按持仓明细的盈亏拆分 |
| [profit_analysis_by_market](./portfolio/profit-analysis-by-market) | 按市场分组的盈亏统计 |
| [capital_flow](./portfolio/capital-flow) | 賬戶资金流水记录 |
| [exchange_rates](./portfolio/exchange-rates) | 支持币种的当前汇率 |

## AlertContext

建立和管理标的價格提醒。

| 方法 | 说明 |
|---|---|
| [list_alerts](./alert/list-alerts) | 查看所有有效的價格提醒 |
| [create_alert](./alert/create-alert) | 建立新的價格提醒 |
| [update_alert](./alert/update-alert) | 修改已有提醒 |
| [delete_alert](./alert/delete-alert) | 刪除價格提醒 |

## DCAContext

管理定期定额投资（定投）计划。

| 方法 | 说明 |
|---|---|
| [list_dca](./dca/list-dca) | 查看所有定投计划 |
| [create_dca](./dca/create-dca) | 新建定投计划 |
| [dca_history](./dca/dca-history) | 查看定投计划的执行记录 |
| [delete_dca](./dca/delete-dca) | 取消定投计划 |

## SharelistContext

建立和管理社区股單（可分享给他人的自选列表）。

| 方法 | 说明 |
|---|---|
| [list_sharelist](./sharelist/list-sharelist) | 查看所有股單 |
| [create_sharelist](./sharelist/create-sharelist) | 新建股單 |
| [update_sharelist](./sharelist/update-sharelist) | 更新股單 |
| [delete_sharelist](./sharelist/delete-sharelist) | 刪除股單 |
