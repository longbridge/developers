---
slug: overview
sidebar_position: 0
title: 網格交易概覽
sidebar_label: '概覽'
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

網格交易是一種自動化策略：在以基準價為錨點的價格區間內，價格下跌時買入、上漲時賣出，透過價格震盪獲利。每下跌一格掛一筆買單，每上漲一格掛一筆賣單，累積的價差即為已實現收益。網格交易 API 讓你以編程方式提交、監控、調整和撤銷網格策略。

## 運作方式

一個網格由基準價和價格區間，以及每一格何時、以多少數量成交的規則共同定義。

- **基準價** — `submitted_base_price` 是網格錨定的中心價格，觸發檔位以該價格為基準計算。
- **上限 / 下限** — `upper_limit_price` 與 `lower_limit_price` 標記區間的上沿與下沿，網格僅在 `[lower_limit_price, upper_limit_price]` 區間內運行。
- **按百分比或價差觸發** — `trigger_price_type` 決定檔位間距的計量方式：`1` = 價差（絕對價格差，對應 `trigger_spread_up` / `trigger_spread_down`），`2` = 百分比（基準價的百分比，對應 `trigger_percent_up` / `trigger_percent_down`）。
- **每次觸發數量** — `trigger_quantity` 是每次觸發檔位時買入或賣出的數量。`upper_limit_quantity` 與 `lower_limit_quantity` 是觸及區間上沿或下沿時處理的數量。
- **上限 / 下限事件** — `upper_limit_event` 與 `lower_limit_event` 決定觸及邊界時的行為：`1` = 忽略（保持網格運行），`2` = 以最新價平倉。
- **網格訂單類型** — 當對應的盤口深度（`trigger_sell_depth` / `trigger_buy_depth`）為 `0` 時，由 `grid_order_type_up` / `grid_order_type_down` 決定訂單類型：`GMO`（網格市價單）、`GLO`（網格限價單）、`GTG`（網格觸價單）。
- **有效期** — `time_in_force` 控制網格保持活躍的時長：`0` = 當日有效，`1` = GTC（撤銷前有效），`6` = GTD（指定日期前有效，需配合 `expire_time`）。

## 前置條件

::: tip 前置條件
網格交易要求存取權杖具備 **Trade** 權限。在提交任何網格訂單之前，你還必須**一次性**記錄策略風險披露同意書，詳見[提交策略問卷](./questionnaire)。你可以透過[網格標的信息](./symbol_info)的 `strategy_granted` 欄位確認是否已記錄同意。
:::

## 典型流程

1. 一次性記錄風險披露同意 —— [提交策略問卷](./questionnaire)。
2. 獲取標的的網格信息（每手股數、最新價、授權狀態）—— [網格標的信息](./symbol_info)。
3. 提交網格策略 —— [提交網格訂單](./submit)。
4. 列出並查看運行中的網格 —— [網格訂單列表](./list) 與 [網格訂單詳情](./detail)。
5. 查看網格已觸發的記錄 —— [觸發歷史](./trigger_history)。
6. 調整或停止網格 —— [掛起](./suspend)、[重啟](./restart)、[修改](./replace) 或 [撤銷](./cancel)。

## 網格接口

| Method | Path | 頁面 | 用途 |
| ------ | ---- | ---- | ---- |
| POST | `/v1/gridtrading/submit` | [提交網格訂單](./submit) | 提交網格策略訂單 |
| POST | `/v1/gridtrading/replace` | [修改網格訂單](./replace) | 修改現有網格訂單的規則 |
| GET | `/v1/gridtrading/list` | [網格訂單列表](./list) | 分頁查詢網格訂單（支持篩選） |
| POST | `/v1/gridtrading/list` | [按 ID 查詢網格訂單](./list_by_ids) | 按 ID 查詢指定網格訂單 |
| GET | `/v1/gridtrading/detail` | [網格訂單詳情](./detail) | 網格訂單詳情，含子訂單與歷史 |
| GET | `/v1/gridtrading/trigger_history_list` | [觸發歷史](./trigger_history) | 分頁查詢單個網格訂單的觸發歷史 |
| POST | `/v1/gridtrading/cancel` | [撤銷網格訂單](./cancel) | 撤銷網格訂單 |
| POST | `/v1/gridtrading/suspend` | [掛起網格訂單](./suspend) | 掛起運行中的網格訂單 |
| POST | `/v1/gridtrading/restart` | [重啟網格訂單](./restart) | 重啟已掛起的網格訂單 |
| POST | `/v1/record/questionnaire` | [提交策略問卷](./questionnaire) | 記錄策略風險披露同意 |
| GET | `/v1/orders/info` | [網格標的信息](./symbol_info) | 用於構建網格訂單的標的信息 |

## 快速開始（CLI）

<CliCommand>
# 一次性記錄策略風險披露同意
longbridge grid questionnaire
# 查看標的的網格信息（每手股數、最新價、授權狀態）
longbridge grid info 700.HK
# 在 700.HK 上提交一個按百分比觸發的網格
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 --trigger-type percent --trigger-up 2 --trigger-down 2 --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# 列出你的網格訂單
longbridge grid
</CliCommand>

<aside className="success">
</aside>
