---
slug: all_executions
sidebar_position: 3
title: All Executions
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used to query execution (fill) records, including both buy and sell records. It supports querying today's and historical executions at the same time. Compared with the today/history execution APIs, each record additionally returns the trade `side`.

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

| Name     | Type   | Required | Description                                                                                                                                                                                         |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| symbol   | string | NO       | Stock symbol, use `ticker.region` format, example: `AAPL.US`                                                                                                                                        |
| order_id | string | NO       | Order ID, example: `701276261045858304`                                                                                                                                                             |
| start_at | string | NO       | Start time, formatted as a timestamp (second), example: `1650410999`.<br/><br/> If the start time is null, the default is the 90 days before of the end time or 90 days before of the current time. |
| end_at   | string | NO       | End time, formatted as a timestamp (second), example: `1650410999`. <br/><br/> If the end time is null, the default is the current time or 90 days after of the start time.                         |
| page     | int32  | NO       | Page number, starting from `1`. The maximum number of records per query is 1000. If the number of results exceeds 1000, `has_more` will be `true`, use `page` together with `has_more` to paginate. |

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

| Status | Description                                              | Schema                                          |
| ------ | -------------------------------------------------------- | ----------------------------------------------- |
| 200    | Get All Executions Success                               | [all_executions_rsp](#schemaall_executions_rsp) |
| 400    | The query failed with an error in the request parameter. | None                                            |

<aside className="success">
</aside>

## Schemas

### all_executions_rsp

<a id="schemaall_executions_rsp"></a>
<a id="schemaall_executions_rsp"></a>

| Name            | Type     | Required | Description                                                                                                                                        |
| --------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| has_more        | boolean  | true     | has more orders record.<br/><br/>The maximum number of orders per query is 1000, if the number of results exceeds 1000, then has_more will be true |
| trades          | object[] | false    | Execution Detail                                                                                                                                   |
| ∟ order_id      | string   | true     | Order ID                                                                                                                                           |
| ∟ trade_id      | string   | true     | Execution ID                                                                                                                                       |
| ∟ symbol        | string   | true     | Stock symbol, use `ticker.region` format,example: `AAPL.US`                                                                                        |
| ∟ trade_done_at | string   | true     | Trade done time, formatted as a timestamp (second)                                                                                                 |
| ∟ quantity      | string   | true     | Executed quantity                                                                                                                                  |
| ∟ price         | string   | true     | Executed price                                                                                                                                     |
| ∟ side          | string   | true     | Trade side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                                                                        |
