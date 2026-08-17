---
slug: submit_multileg
sidebar_position: 8
title: Submit Multi-leg Order
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

This API is used to submit a multi-leg option combination order (such as vertical spreads, straddles, strangles, collars, etc.). All legs are submitted together as a single strategy order.

<SDKLinks module="trade" klass="TradeContext" method="submit_multileg" />

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>POST</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/trade/order/multileg </td></tr>
</tbody>
</table>

### Parameters

> Content-Type: application/json; charset=utf-8

| Name               | Type     | Required | Description                                                                                                                                                        |
| ------------------ | -------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| side               | string   | YES      | Order Side<br/><br/> **Enum Value:**<br/> `Buy`<br/> `Sell`                                                                                                        |
| order_type         | string   | YES      | [Order Type](../trade-definition#ordertype)                                                                                                                        |
| submitted_price    | string   | NO       | Submitted price, example: `1.5`<br/><br/> Required for limit order types such as `LO`                                                                              |
| submitted_quantity | string   | YES      | Submitted quantity (number of combinations), example: `1`                                                                                                          |
| strategy           | string   | YES      | Multi-leg strategy<br/><br/> **Enum Value:**<br/> `CoveredCall` - Covered stock<br/> `CoveredPut` - Covered stock<br/> `VerticalCallSpread` - Vertical spread<br/> `VerticalPutSpread` - Vertical spread<br/> `Collar` - Collar<br/> `Straddle` - Straddle<br/> `Strangle` - Strangle |
| legs               | object[] | YES      | Legs of the combination order                                                                                                                                      |
| ∟ symbol           | string   | YES      | Option symbol, use `ticker.region` format, example: `QQQ260731C764000.US`                                                                                          |
| ∟ ratio_quantity   | string   | YES      | Leg ratio quantity, example: `1`                                                                                                                                   |
| remark             | string   | NO       | Remark (Maximum 255 characters)                                                                                                                                    |
| client_request_id  | string   | NO       | Client request ID, used for idempotency (Maximum 64 characters)                                                                                                    |

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
    "order_id": 683615454870679600
  }
}
```

### Response Status

| Status | Description                                                   | Schema |
| ------ | ------------------------------------------------------------- | ------ |
| 200    | The submission was successful and the order was commissioned. | None   |
| 400    | The submit was rejected with an incorrect request parameter.  | None   |

<aside className="success">
</aside>
