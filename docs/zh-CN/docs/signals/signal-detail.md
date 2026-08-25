---
slug: signal-detail
title: 获取 Signal 详情
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

通过 ID 获取特定信号。返回字段与[获取 Signal 列表](/zh-CN/docs/signals/signals)一致，并在 `json_data` 中返回完整策略分析：契合度评分、估值情景、证据来源，以及与该信号相关的事实 ID。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals/{signal_id}</td></tr>
</tbody>
</table>

### Path Parameters

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| signal_id | string | YES | 信号 ID，例如 `sign_992_1a00c9425c3_48ab`，可从[获取 Signal 列表](/zh-CN/docs/signals/signals)取得 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/signals/sign_992_1a00c9425c3_48ab" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

  </TabItem>
</Tabs>

## Response

### Response Example

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "signal": {
      "id": "sign_992_1a00c9425c3_48ab",
      "symbol": "992.HK",
      "company_name": "LENOVO GROUP",
      "market": "HK",
      "title": "992.HK: May price surge doubles the stock, overshooting the target range",
      "summary": "Lenovo Group's shares nearly doubled in May 2026 ...",
      "strategy_id": "86",
      "strategy_name": "Universal Quality Growth",
      "recommend_by": "",
      "expression": "992.HK:GROWTH:long",
      "key_fact_id": "news_earnings_released_1786917430537733972",
      "key_catalyst": "May Price Doubling",
      "analysis_price": 23.678,
      "conservative_price": 15.5,
      "benchmark_price": 19,
      "optimistic_price": 23.5,
      "outlook": "Bearish",
      "outlook_desc": "Bearish",
      "risk_level": "R4",
      "status": 1,
      "display_control": 0,
      "json_data": "{\"signal\":{\"core_conclusion\":{...}},\"strategy_fit_score\":{...}}",
      "created_at": "1787131229154",
      "updated_at": "1787131229154"
    }
  }
}
```

### Response Status

| 状态码 | 说明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服务内部错误 |

## Schemas

### signal_detail_response

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| signal | object | true | 信号对象 |
| ∟ id | string | true | 信号 ID，例如 `sign_992_1a00c9425c3_48ab` |
| ∟ symbol | string | true | 证券代码，例如 `992.HK` |
| ∟ company_name | string | true | 公司名称 |
| ∟ market | string | true | 证券所属市场，例如 `HK` |
| ∟ title | string | true | 信号标题 |
| ∟ summary | string | true | 自然语言摘要，Markdown 格式 |
| ∟ strategy_id | string | true | 产生该信号的策略 ID |
| ∟ strategy_name | string | true | 产生该信号的策略名称 |
| ∟ recommend_by | string | true | 推荐人；策略自动产生的信号为空 |
| ∟ expression | string | true | 策略表达式，例如 `992.HK:GROWTH:long` |
| ∟ key_fact_id | string | true | 触发该信号的事实 ID，可用[查询证券 Facts](/zh-CN/docs/signals/security-facts) 查询 |
| ∟ key_catalyst | string | true | 触发该信号的催化剂名称 |
| ∟ analysis_price | number | true | 分析时所依据的价格 |
| ∟ conservative_price | number | true | 保守情景目标价 |
| ∟ benchmark_price | number | true | 基准情景目标价 |
| ∟ optimistic_price | number | true | 乐观情景目标价 |
| ∟ outlook | string | true | 取值为 `Strong bullish`、`Bullish`、`Neutral`、`Bearish`、`Strong bearish` 之一 |
| ∟ outlook_desc | string | true | 按调用方语言本地化后的看法文案 |
| ∟ risk_level | string | true | 风险等级，例如 `R4`；策略未给出时为空 |
| ∟ status | int32 | true | 信号状态 |
| ∟ display_control | int32 | true | 展示控制标记 |
| ∟ json_data | string | true | 完整策略分析（JSON 文档）：契合度评分、估值情景、证据来源与相关事实 ID |
| ∟ created_at | string | true | 创建时间，Unix 时间戳（**毫秒**） |
| ∟ updated_at | string | true | 更新时间，Unix 时间戳（**毫秒**） |
