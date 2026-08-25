---
slug: signals
title: Get Signals
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query signals with advanced filters. A **signal** is a strategy's take on a security, triggered by a catalyst — it carries a headline, a Markdown summary, an outlook, a risk level, and conservative / benchmark / optimistic target prices.

Filter by symbol, strategy, catalyst and creation time; page with `limit` / `offset`. `total` is the number of signals matching the filters.

The full strategy analysis is carried in `json_data` as a JSON document. It runs to several KB per signal, so fetch it per signal with [Get Signal Detail](/docs/signals/signal-detail) rather than paging through it here.

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals</td></tr>
</tbody>
</table>

### Query Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol_name | string | NO | Filter by stock symbol in `ticker.region` format, e.g. `AAPL.US` or `700.HK`. If omitted, returns signals for all symbols. |
| strategy_id | string | NO | Filter by strategy id, e.g. `buffett-value`. Preferred over the deprecated `strategy_name`; takes precedence when both are provided. |
| strategy_name | string | NO | **Deprecated.** Filter by strategy name. If omitted, returns signals from all strategies. |
| catalyst_name | string | NO | Filter by the catalyst name that triggered the signal. If omitted, signals with any catalyst name are returned. |
| catalyst_type | string | NO | Filter by the catalyst type that triggered the signal, e.g. `News`, `Fundamental`, `Technical`. If omitted, signals with any catalyst type are returned. |
| start_time | string | NO | Only return signals created at or after this time. ISO 8601 datetime with timezone, e.g. `2024-01-15T10:30:00Z`. If omitted, no lower bound. |
| end_time | string | NO | Only return signals created at or before this time. ISO 8601 datetime with timezone. If omitted, no upper bound. |
| limit | int32 | NO | Maximum number of results to return. Defaults to 20. |
| offset | int32 | NO | Number of results to skip for pagination. Defaults to 0. |

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

| Status | Description |
| ------ | ----------- |
| 200 | Success |
| 500 | Internal error |

## Schemas

### signals_response

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| signals | object[] | true | Signals on this page |
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
| total | int64 | true | Total number of signals matching the filters — page through the rest with `offset` |
