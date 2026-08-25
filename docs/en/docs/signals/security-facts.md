---
slug: security-facts
title: Get Security Facts
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

Query the fact (catalyst) events for one security — anomaly detections, factor readings, data sources and natural-language summaries — filtered by time range and count.

Facts are what strategies react to: a signal names the fact that triggered it in `key_fact_id`.

Each fact is a JSON object whose fields depend on its type (news, fundamental, technical).

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/facts/security_facts</td></tr>
</tbody>
</table>

### Query Parameters

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| symbol | string | YES | Security symbol to query, e.g. `AAPL.US` or `700.HK`. |
| begin_time | string | NO | The optional start time of the fact query, formatted as `2006-01-02T15:04:05Z` in UTC. If left empty, the query will include the earliest available data. |
| end_time | string | NO | The end time of the fact to be queried, formatted as `2006-01-02T15:04:05Z` in UTC. If left empty, the query will default to retrieving the latest data. |
| limit | int32 | NO | The maximum number of facts to return. If the number of facts in the time range exceeds this limit, only the latest `limit` facts will be returned. Defaults to 100. |

### Request Example

<Tabs groupId="request-example">
  <TabItem value="curl" label="cURL" default>

```bash
curl "https://openapi.longbridge.com/v1/facts/security_facts?symbol=AAPL.US&limit=20" \
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
    "facts": [
      {
        "fact_id": "technical_macd_12_26_9_short_1787014800188612104",
        "fact_type": "Technical",
        "occur_time": "2026-08-18T01:00:00Z",
        "direction": "short",
        "data_source": [
          {
            "type": "Technical",
            "source_name": "SEHK",
            "url": "",
            "icon": ""
          }
        ],
        "nl_info": {
          "title": "Tencent MACD Indicator Triggers Key Signal: Momentum Factor Shows Abnormal Movement",
          "sub_title": "The MACD (12,26,9) indicator has issued a critical signal, with momentum factors displaying abnormal characteristics.",
          "summary": "[{\"tag\":\"MACD\",\"value\":\"…\"}]",
          "invest_anal": "[{\"tag\":\"momentum\",\"value\":\"…\"}]",
          "eli_explain": "[{\"tag\":\"what_happened\",\"value\":\"…\"}]"
        },
        "symbols_info": [
          {
            "symbol": "700.HK",
            "security_name": "TENCENT"
          }
        ],
        "factors": [
          {
            "name": "macd_12_26_9",
            "factor_groups": [
              "MOMENTUM"
            ],
            "long_short_direction": "short",
            "trigger_condition": "",
            "anomaly_detection": {
              "test_method": "",
              "anomaly_result": "",
              "thresholds": {
                "low": "",
                "medium": "",
                "high": ""
              },
              "significance_level": ""
            }
          }
        ]
      }
    ]
  }
}
```

> **Note:** `nl_info.summary`, `invest_anal` and `eli_explain` each carry a JSON array of `{tag, value}` entries **inside a string** — parse the string to read them.

### Response Status

| Status | Description |
| ------ | ----------- |
| 200 | Success |
| 500 | Internal error |

## Schemas

### security_facts_response

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| facts | object[] | true | Fact events, newest first |
| ∟ fact_id | string | true | Fact ID, e.g. `technical_macd_12_26_9_short_1787014800188612104`. A signal names its trigger here in `key_fact_id` |
| ∟ fact_type | string | true | `News`, `Fundamental` or `Technical` |
| ∟ direction | string | true | Side the fact points to: `long`, `short` or `neutral` |
| ∟ occur_time | string | true | When the fact occurred, RFC 3339 in UTC |
| ∟ symbols_info | object[] | true | Securities the fact is about |
| ∟∟ symbol | string | true | Security symbol, e.g. `700.HK` |
| ∟∟ security_name | string | true | Security name, localized by the `Accept-Language` header |
| ∟ factors | object[] | true | Factors that contributed to the fact |
| ∟∟ name | string | true | Factor name, e.g. `macd_12_26_9` or `EARNINGS_RELEASED` |
| ∟∟ factor_groups | string[] | true | Groups the factor belongs to, e.g. `MOMENTUM` |
| ∟∟ long_short_direction | string | true | Side the factor points to: `long`, `short` or `neutral` |
| ∟∟ trigger_condition | string | true | Condition that fired the factor; empty when not applicable |
| ∟∟ anomaly_detection | object | true | The anomaly test behind the factor — `test_method`, `anomaly_result`, `significance_level` and `thresholds` (`low` / `medium` / `high`). Empty for factors that did not run one |
| ∟ data_source | object[] | true | Where the fact came from |
| ∟∟ source_name | string | true | Source name, e.g. `AASTOCKS News`, `SEHK` |
| ∟∟ type | string | true | Kind of source, same values as `fact_type` |
| ∟∟ url | string | true | Link to the source, when it has one |
| ∟∟ icon | string | true | Source icon URL, when it has one |
| ∟ nl_info | object | true | Natural-language rendering of the fact, localized by the `Accept-Language` header |
| ∟∟ title | string | true | Headline |
| ∟∟ sub_title | string | true | Sub-headline |
| ∟∟ summary | string | true | What happened — a JSON array of `{tag, value}` entries **carried inside a string** |
| ∟∟ invest_anal | string | true | What it may mean for an investor, same JSON-in-a-string shape |
| ∟∟ eli_explain | string | true | Plain-language walk-through, same JSON-in-a-string shape. May be empty |
