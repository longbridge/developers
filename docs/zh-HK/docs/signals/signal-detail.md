---
slug: signal-detail
title: 取得 Signal 詳情
sidebar_position: 2
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

透過 ID 取得特定訊號。回傳欄位與[取得 Signal 列表](/zh-HK/docs/signals/signals)一致，並在 `json_data` 中回傳完整策略分析：契合度評分、估值情景、證據來源，以及與該訊號相關的事實 ID。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals/{signal_id}</td></tr>
</tbody>
</table>

### Path Parameters

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| signal_id | string | YES | 訊號 ID，例如 `sign_992_1a00c9425c3_48ab`，可從[取得 Signal 列表](/zh-HK/docs/signals/signals)取得 |

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

| 狀態碼 | 說明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服務內部錯誤 |

## Schemas

### signal_detail_response

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| signal | object | true | 訊號物件 |
| ∟ id | string | true | 訊號 ID，例如 `sign_992_1a00c9425c3_48ab` |
| ∟ symbol | string | true | 證券代碼，例如 `992.HK` |
| ∟ company_name | string | true | 公司名稱 |
| ∟ market | string | true | 證券所屬市場，例如 `HK` |
| ∟ title | string | true | 訊號標題 |
| ∟ summary | string | true | 自然語言摘要，Markdown 格式 |
| ∟ strategy_id | string | true | 產生該訊號的策略 ID |
| ∟ strategy_name | string | true | 產生該訊號的策略名稱 |
| ∟ recommend_by | string | true | 推薦人；策略自動產生的訊號為空 |
| ∟ expression | string | true | 策略表達式，例如 `992.HK:GROWTH:long` |
| ∟ key_fact_id | string | true | 觸發該訊號的事實 ID，可用[查詢證券 Facts](/zh-HK/docs/signals/security-facts) 查詢 |
| ∟ key_catalyst | string | true | 觸發該訊號的催化劑名稱 |
| ∟ analysis_price | number | true | 分析時所依據的價格 |
| ∟ conservative_price | number | true | 保守情景目標價 |
| ∟ benchmark_price | number | true | 基準情景目標價 |
| ∟ optimistic_price | number | true | 樂觀情景目標價 |
| ∟ outlook | string | true | 取值為 `Strong bullish`、`Bullish`、`Neutral`、`Bearish`、`Strong bearish` 之一 |
| ∟ outlook_desc | string | true | 按呼叫方語言在地化後的看法文案 |
| ∟ risk_level | string | true | 風險等級，例如 `R4`；策略未給出時為空 |
| ∟ status | int32 | true | 訊號狀態 |
| ∟ display_control | int32 | true | 展示控制標記 |
| ∟ json_data | string | true | 完整策略分析（JSON 文件）：契合度評分、估值情景、證據來源與相關事實 ID |
| ∟ created_at | string | true | 建立時間，Unix 時間戳（**毫秒**） |
| ∟ updated_at | string | true | 更新時間，Unix 時間戳（**毫秒**） |
