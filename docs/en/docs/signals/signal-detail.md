---
slug: signal-detail
title: Get Signal Detail
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Get one signal by ID. Returns the same fields as [Get Signals](/docs/signals/signals), including the full strategy analysis in `json_data`: strategy fit scores, valuation scenarios, evidence sources, and the IDs of the facts related to the signal.

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals/{signal_id}</td></tr>
</tbody>
</table>

### Path Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| signal_id | string | YES | Signal ID, e.g. `sign_992_1a00c9425c3_48ab`, from [Get Signals](/docs/signals/signals). |

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

| Status | Description |
| ------ | ----------- |
| 200 | Success |
| 500 | Internal error |

## Schemas

### signal_detail_response

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| signal | object | true | The signal |
| ∟ id | string | true | Signal ID, e.g. `sign_992_1a00c9425c3_48ab` |
| ∟ symbol | string | true | Security symbol, e.g. `992.HK` |
| ∟ company_name | string | true | Company name |
| ∟ market | string | true | Market the security trades in, e.g. `HK` |
| ∟ title | string | true | Signal headline |
| ∟ summary | string | true | Natural-language summary, in Markdown |
| ∟ strategy_id | string | true | ID of the strategy that produced the signal |
| ∟ strategy_name | string | true | Name of the strategy that produced the signal |
| ∟ recommend_by | string | true | Who recommended the signal; empty for strategy-generated signals |
| ∟ expression | string | true | Strategy expression, e.g. `992.HK:GROWTH:long` |
| ∟ key_fact_id | string | true | ID of the fact that triggered the signal — look it up with [Get Security Facts](/docs/signals/security-facts) |
| ∟ key_catalyst | string | true | Display name of the catalyst that triggered the signal |
| ∟ analysis_price | number | true | Price the analysis was based on |
| ∟ conservative_price | number | true | Conservative-scenario target price |
| ∟ benchmark_price | number | true | Benchmark-scenario target price |
| ∟ optimistic_price | number | true | Optimistic-scenario target price |
| ∟ outlook | string | true | One of `Strong bullish`, `Bullish`, `Neutral`, `Bearish`, `Strong bearish` |
| ∟ outlook_desc | string | true | Outlook label in the caller's language |
| ∟ risk_level | string | true | Risk level, e.g. `R4`; empty when the strategy did not assign one |
| ∟ status | int32 | true | Signal status |
| ∟ display_control | int32 | true | Display control flag |
| ∟ json_data | string | true | Full strategy analysis as a JSON document: fit scores, valuation scenarios, evidence sources and related fact IDs |
| ∟ created_at | string | true | Creation time, Unix timestamp in **milliseconds** |
| ∟ updated_at | string | true | Last update time, Unix timestamp in **milliseconds** |
