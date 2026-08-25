---
slug: signals
title: 获取 Signal 列表
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

使用高级筛选查询信号。**Signal** 是策略在某个催化剂触发下对某只证券给出的判断，包含标题、Markdown 摘要、看法、风险等级，以及保守 / 基准 / 乐观目标价。

支持按股票代码、策略、催化剂和创建时间筛选，并用 `limit` / `offset` 分页；`total` 为符合筛选条件的信号总数。

完整策略分析以 JSON 文档形式放在 `json_data` 中。单条信号的分析有数 KB，建议用[获取 Signal 详情](/zh-CN/docs/signals/signal-detail)按需获取，而不是在列表里翻页读取。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals</td></tr>
</tbody>
</table>

### Query Parameters

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| symbol_name | string | NO | 按证券代码筛选，例如 `AAPL.US` 或 `700.HK`；省略则返回全部股票 |
| strategy_id | string | NO | 按策略 id 筛选，例如 `buffett-value`。优先于已废弃的 `strategy_name`，两者同时传入时以此为准 |
| strategy_name | string | NO | **已废弃。**按策略名称筛选；省略则返回全部策略的命中结果 |
| catalyst_name | string | NO | 按触发信号的催化剂名称筛选；省略则不限催化剂名称 |
| catalyst_type | string | NO | 按触发信号的催化剂类型筛选，例如 `News`、`Fundamental`、`Technical`；省略则不限类型 |
| start_time | string | NO | 筛选此时间之后创建的命中记录，ISO 8601 带时区格式，例如 `2024-01-15T10:30:00Z`；省略则不限下限 |
| end_time | string | NO | 筛选此时间之前创建的命中记录，ISO 8601 带时区格式；省略则不限上限 |
| limit | int32 | NO | 返回结果数量上限，默认 20 |
| offset | int32 | NO | 分页跳过的条数，默认 0 |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/signals?symbol_name=700.HK&limit=20" \
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
    "signals": [
      {
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
    ],
    "total": 306
  }
}
```

### Response Status

| 状态码 | 说明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服务内部错误 |

## Schemas

### signals_response

| 名称 | 类型 | 必填 | 说明 |
| ---- | ---- | ---- | ---- |
| signals | object[] | true | 当前页的信号列表 |
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
| total | int64 | true | 符合筛选条件的信号总数，配合 `offset` 翻页 |
