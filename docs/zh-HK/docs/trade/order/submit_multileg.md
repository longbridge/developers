---
slug: submit_multileg
sidebar_position: 8
title: 多腿期權下單
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

該接口用於提交多腿期權組合訂單（如垂直價差、跨式、寬跨式、領口等）。各腿作為一個策略訂單一起提交。

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
| side               | string   | YES      | 買賣方向<br/><br/> **可選值：**<br/> `Buy`<br/> `Sell`                                                                                                             |
| order_type         | string   | YES      | [訂單類型](../trade-definition#ordertype)                                                                                                                          |
| submitted_price    | string   | NO       | 下單價格，例如：`1.5`<br/><br/> `LO` 等限價類型訂單必填                                                                                                             |
| submitted_quantity | string   | YES      | 下單數量（組合數量），例如：`1`                                                                                                                                     |
| strategy           | string   | YES      | 多腿策略<br/><br/> **可選值：**<br/> `CoveredCall` - 股票擔保<br/> `CoveredPut` - 股票擔保<br/> `VerticalCallSpread` - 跨價期權<br/> `VerticalPutSpread` - 跨價期權<br/> `Collar` - 領式策略<br/> `Straddle` - 馬鞍式策略<br/> `Strangle` - 勒束式策略 |
| legs               | object[] | YES      | 組合訂單的各腿                                                                                                                                                      |
| ∟ symbol           | string   | YES      | 期權 symbol，使用 `ticker.region` 格式，例如：`QQQ260731C764000.US`                                                                                                |
| ∟ ratio_quantity   | string   | YES      | 該腿比例數量，例如：`1`                                                                                                                                             |
| remark             | string   | NO       | 備註（最多 255 字符）                                                                                                                                               |
| client_request_id  | string   | NO       | 客戶端請求 ID，用於冪等（最多 64 字符）                                                                                                                             |

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

| Status | Description            | Schema |
| ------ | ---------------------- | ------ |
| 200    | 提交成功，訂單已委託     | None   |
| 400    | 提交被拒絕，請求參數有誤 | None   |

<aside className="success">
</aside>
