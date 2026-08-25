---
slug: signals
title: 取得 Signal 列表
sidebar_position: 1
language_tabs: false
toc_footers: []
includes: []
search: true
highlight_theme: ''
headingLevel: 2
---

使用進階篩選查詢訊號。**Signal** 是策略在某個催化劑觸發下對某隻證券給出的判斷，包含標題、Markdown 摘要、看法、風險等級，以及保守 / 基準 / 樂觀目標價。

支援按股票代碼、策略、催化劑和建立時間篩選，並用 `limit` / `offset` 分頁；`total` 為符合篩選條件的訊號總數。

完整策略分析以 JSON 文件形式放在 `json_data` 中。單條訊號的分析有數 KB，建議用[取得 Signal 詳情](/zh-HK/docs/signals/signal-detail)按需取得，而不是在列表裡翻頁讀取。

## Request

<table className="http-basic">
<tbody>
<tr><td className="http-basic-key">HTTP Method</td><td>GET</td></tr>
<tr><td className="http-basic-key">HTTP URL</td><td>/v1/signals</td></tr>
</tbody>
</table>

### Query Parameters

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| symbol_name | string | NO | 按股票代碼篩選，格式為 `ticker.region`，例如 `AAPL.US` 或 `700.HK`；省略則回傳全部股票 |
| strategy_id | string | NO | 按策略 id 篩選，例如 `buffett-value`。優先於已廢棄的 `strategy_name`，兩者同時傳入時以此為準 |
| strategy_name | string | NO | **已廢棄。**按策略名稱篩選；省略則回傳全部策略的命中結果 |
| catalyst_name | string | NO | 按觸發訊號的催化劑名稱篩選；省略則不限催化劑名稱 |
| catalyst_type | string | NO | 按觸發訊號的催化劑類型篩選，例如 `News`、`Fundamental`、`Technical`；省略則不限類型 |
| start_time | string | NO | 篩選此時間之後建立的命中記錄，ISO 8601 帶時區格式，例如 `2024-01-15T10:30:00Z`；省略則不限下限 |
| end_time | string | NO | 篩選此時間之前建立的命中記錄，ISO 8601 帶時區格式；省略則不限上限 |
| limit | int32 | NO | 回傳結果數量上限，預設 20 |
| offset | int32 | NO | 分頁跳過的條數，預設 0 |

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

| 狀態碼 | 說明 |
| ------ | ---- |
| 200 | 成功 |
| 500 | 服務內部錯誤 |

## Schemas

### signals_response

| 名稱 | 類型 | 必填 | 說明 |
| ---- | ---- | ---- | ---- |
| signals | object[] | true | 目前頁的訊號列表 |
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
| total | int64 | true | 符合篩選條件的訊號總數，配合 `offset` 翻頁 |
