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
| symbol | string | YES | 要查詢的證券代碼，例如 `AAPL.US` 或 `700.HK` |
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

> **說明：** `nl_info.summary`、`invest_anal`、`eli_explain` 三個欄位都是**以字串承載**的 `{tag, value}` JSON 陣列，讀取時需要再解析一次字串。

### Response Status

| 狀態碼 | 說明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服務內部錯誤 |

## Schemas

### security_facts_response

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| facts | object[] | true | 事實事件列表，最新的在前 |
| ∟ fact_id | string | true | 事實 ID，例如 `technical_macd_12_26_9_short_1787014800188612104`；訊號的 `key_fact_id` 指向它 |
| ∟ fact_type | string | true | `News`、`Fundamental` 或 `Technical` |
| ∟ direction | string | true | 事實指向的方向：`long`、`short` 或 `neutral` |
| ∟ occur_time | string | true | 事實發生時間，UTC 的 RFC 3339 格式 |
| ∟ symbols_info | object[] | true | 該事實涉及的證券 |
| ∟∟ symbol | string | true | 證券代碼，例如 `700.HK` |
| ∟∟ security_name | string | true | 證券名稱，按 `Accept-Language` 在地化 |
| ∟ factors | object[] | true | 構成該事實的因子 |
| ∟∟ name | string | true | 因子名稱，例如 `macd_12_26_9` 或 `EARNINGS_RELEASED` |
| ∟∟ factor_groups | string[] | true | 因子所屬分組，例如 `MOMENTUM` |
| ∟∟ long_short_direction | string | true | 因子指向的方向：`long`、`short` 或 `neutral` |
| ∟∟ trigger_condition | string | true | 觸發該因子的條件；不適用時為空 |
| ∟∟ anomaly_detection | object | true | 因子背後的異動偵測——`test_method`、`anomaly_result`、`significance_level` 與 `thresholds`（`low` / `medium` / `high`）。未做偵測的因子為空 |
| ∟ data_source | object[] | true | 事實的資料來源 |
| ∟∟ source_name | string | true | 來源名稱，例如 `AASTOCKS News`、`SEHK` |
| ∟∟ type | string | true | 來源類型，取值同 `fact_type` |
| ∟∟ url | string | true | 來源連結（如有） |
| ∟∟ icon | string | true | 來源圖示 URL（如有） |
| ∟ nl_info | object | true | 事實的自然語言呈現，按 `Accept-Language` 在地化 |
| ∟∟ title | string | true | 標題 |
| ∟∟ sub_title | string | true | 副標題 |
| ∟∟ summary | string | true | 發生了什麼——**以字串承載**的 `{tag, value}` JSON 陣列 |
| ∟∟ invest_anal | string | true | 對投資者可能意味著什麼，同樣是 JSON-in-string 結構 |
| ∟∟ eli_explain | string | true | 通俗解讀，同樣是 JSON-in-string 結構；可能為空 |
