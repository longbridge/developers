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
| symbol | string | YES | The security symbol to query, formatted as `ticker.region`, e.g. `AAPL.US` or `700.HK`. |
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
    "facts": []
  }
}
```

> **Note:** the fact payload is type-specific and still evolving, so the SDK carries each item through as a raw JSON object rather than a fixed schema.

### Response Status

| Status | Description |
| ------ | ----------- |
| 200 | Success |
| 500 | Internal error |

## Schemas

### security_facts_response

| Name | Type | Required | Description |
| ---- | ---- | -------- | ----------- |
| facts | object[] | true | Fact events, newest last. Each item is a JSON object whose fields depend on the fact type |
