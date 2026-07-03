---
slug: all_executions
sidebar_position: 3
title: 全部成交明细
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于获取订单的成交明细，包括买入和卖出的成交记录，同时支持当日成交和历史成交查询。相比当日/历史成交接口，每条记录额外返回买卖方向 `side`。

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
| symbol   | string | NO       | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                                                              |
| order_id | string | NO       | 订单 ID，例如：`701276261045858304`                                                                                |
| start_at | string | NO       | 开始时间，格式为时间戳 (秒)，例如：`1650410999`。<br/><br/>开始时间为空时，默认为结束时间或当前时间前九十天。      |
| end_at   | string | NO       | 结束时间，格式为时间戳 (秒)，例如：`1650410999`。<br/><br/>结束时间为空时，默认为开始时间后九十天或当前时间。      |
| page     | string | NO       | 页码，从 `1` 开始。单次查询最多返回 1000 条记录，若结果超过 1000 条，`has_more` 为 `true`，可结合 `has_more` 翻页。 |

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
| 200    | 获取全部成交明细成功 | [all_executions_rsp](#schemaall_executions_rsp) |
| 400    | 请求参数有误，查询失败 | None                                            |

<aside className="success">
</aside>

## Schemas

### all_executions_rsp

<a id="schemaall_executions_rsp"></a>
<a id="schemaall_executions_rsp"></a>

| Name            | Type     | Required | Description                                                            |
| --------------- | -------- | -------- | --------------------------------------------------------------------- |
| has_more        | boolean  | true     | 是否有更多记录。<br/><br/>单次查询最多返回 1000 条记录，若结果超过 1000 条，has_more 为 true |
| trades          | object[] | false    | 成交明细                                                              |
| ∟ order_id      | string   | true     | 订单 ID                                                               |
| ∟ trade_id      | string   | true     | 成交 ID                                                               |
| ∟ symbol        | string   | true     | 股票代码，使用 `ticker.region` 格式，例如：`AAPL.US`                  |
| ∟ trade_done_at | string   | true     | 成交时间，格式为时间戳 (秒)                                           |
| ∟ quantity      | string   | true     | 成交数量                                                              |
| ∟ price         | string   | true     | 成交价格                                                              |
| ∟ side          | string   | true     | 买卖方向<br/><br/> **可选值：**<br/> `Buy` - 买入<br/> `Sell` - 卖出   |
