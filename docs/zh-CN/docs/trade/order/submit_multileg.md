---
slug: submit_multileg
sidebar_position: 8
title: 多腿期权下单
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

该接口用于提交多腿期权组合订单（如垂直价差、跨式、宽跨式、领口等）。各腿作为一个策略订单一起提交。

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
| side               | string   | YES      | 买卖方向<br/><br/> **可选值：**<br/> `Buy`<br/> `Sell`                                                                                                             |
| order_type         | string   | YES      | [订单类型](../trade-definition#ordertype)                                                                                                                          |
| submitted_price    | string   | NO       | 下单价格，例如：`1.5`<br/><br/> `LO` 等限价类型订单必填                                                                                                             |
| submitted_quantity | string   | YES      | 下单数量（组合数量），例如：`1`                                                                                                                                     |
| strategy           | string   | YES      | 多腿策略<br/><br/> **可选值：**<br/> `CoveredCall` - 股票担保<br/> `CoveredPut` - 股票担保<br/> `VerticalCallSpread` - 垂直策略<br/> `VerticalPutSpread` - 垂直策略<br/> `Collar` - 领式策略<br/> `Straddle` - 跨式策略<br/> `Strangle` - 宽跨式策略 |
| legs               | object[] | YES      | 组合订单的各腿                                                                                                                                                      |
| ∟ symbol           | string   | YES      | 期权 symbol，使用 `ticker.region` 格式，例如：`QQQ260731C764000.US`                                                                                                |
| ∟ ratio_quantity   | string   | YES      | 该腿比例数量，例如：`1`                                                                                                                                             |
| remark             | string   | NO       | 备注（最多 255 字符）                                                                                                                                               |
| client_request_id  | string   | NO       | 客户端请求 ID，用于幂等（最多 64 字符）                                                                                                                             |

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
| 200    | 提交成功，订单已委托     | None   |
| 400    | 提交被拒绝，请求参数有误 | None   |

<aside className="success">
</aside>
