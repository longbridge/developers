---
slug: security-facts
title: 查詢證券 Facts
sidebar_position: 3
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

查詢指定證券的事實事件列表——包含異動偵測、因子資訊、資料來源及自然語言摘要，支援按時間範圍和數量上限篩選。

事實是策略的觸發源：訊號的 `key_fact_id` 即指向觸發它的那條事實。

每條事實都是一個 JSON 物件，欄位隨類型（news、fundamental、technical）而不同。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/facts/security_facts</td></tr>
</tbody>
</table>

### Query Parameters

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| symbol | string | YES | 要查詢的證券代碼，格式為 `ticker.region`，例如 `AAPL.US` 或 `700.HK` |
| begin_time | string | NO | 查詢起始時間，UTC 時區，格式為 `2006-01-02T15:04:05Z`；留空則從最早可用資料開始 |
| end_time | string | NO | 查詢結束時間，UTC 時區，格式為 `2006-01-02T15:04:05Z`；留空則回傳最新資料 |
| limit | int32 | NO | 回傳事實數量上限；時間範圍內的事實超出該上限時，僅回傳最新的 `limit` 條，預設 100 |

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

> **說明：** 事實的結構隨類型而變化且仍在演進，因此 SDK 將每一項原樣透傳為 JSON 物件，不做固定 schema 約束。

### Response Status

| 狀態碼 | 說明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服務內部錯誤 |

## Schemas

### security_facts_response

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| facts | object[] | true | 事實事件列表，每一項都是 JSON 物件，欄位隨事實類型而不同 |
