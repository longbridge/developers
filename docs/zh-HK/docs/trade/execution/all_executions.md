---
slug: all_executions
sidebar_position: 3
title: 全部成交明細
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

該接口用於獲取訂單的成交明細，包括買入和賣出的成交記錄，同時支持當日成交和歷史成交查詢。相比當日/歷史成交接口，每條記錄額外返回買賣方向 `side`。

<SDKLinks module="trade" klass="TradeContext" method="all_executions" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v3/trade/execution/all </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name     | Type   | Required | Description                                                                                                        |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------- |
| symbol   | string | NO       | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                                                              |
| order_id | string | NO       | 訂單 ID，例如：`701276261045858304`                                                                                |
| start_at | string | NO       | 開始時間，格式為時間戳 (秒)，例如：`1650410999`。<br/><br/>開始時間為空時，默認為結束時間或當前時間前九十天。      |
| end_at   | string | NO       | 結束時間，格式為時間戳 (秒)，例如：`1650410999`。<br/><br/>結束時間為空時，默認為開始時間後九十天或當前時間。      |
| page     | string | NO       | 頁碼，從 `1` 開始。單次查詢最多返回 1000 條記錄，若結果超過 1000 條，`has_more` 為 `true`，可結合 `has_more` 翻頁。 |

### Request Example

## Response

### Response Headers

- Content-Type: application/json

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "has_more": false,
    "trades": [
      {
        "order_id": "693664675163312128",
        "price": "388",
        "quantity": "100",
        "symbol": "700.HK",
        "trade_done_at": "1648611351",
        "trade_id": "693664675163312128-1648611351433741210",
        "side": "Buy"
      }
    ]
  }
}
```

### Response Status

| Status | Description        | Schema                                          |
| ------ | ------------------ | ----------------------------------------------- |
| 200    | 獲取全部成交明細成功 | [all_executions_rsp](#schemaall_executions_rsp) |
| 400    | 請求參數有誤，查詢失敗 | None                                            |

<aside className="success">
</aside>

## Schemas

### all_executions_rsp

<a id="schemaall_executions_rsp"></a>
<a id="schemaall_executions_rsp"></a>

| Name            | Type     | Required | Description                                                            |
| --------------- | -------- | -------- | --------------------------------------------------------------------- |
| has_more        | boolean  | true     | 是否有更多記錄。<br/><br/>單次查詢最多返回 1000 條記錄，若結果超過 1000 條，has_more 為 true |
| trades          | object[] | false    | 成交明細                                                              |
| ∟ order_id      | string   | true     | 訂單 ID                                                               |
| ∟ trade_id      | string   | true     | 成交 ID                                                               |
| ∟ symbol        | string   | true     | 股票代碼，使用 `ticker.region` 格式，例如：`AAPL.US`                  |
| ∟ trade_done_at | string   | true     | 成交時間，格式為時間戳 (秒)                                           |
| ∟ quantity      | string   | true     | 成交數量                                                              |
| ∟ price         | string   | true     | 成交價格                                                              |
| ∟ side          | string   | true     | 買賣方向<br/><br/> **可選值：**<br/> `Buy` - 買入<br/> `Sell` - 賣出   |
