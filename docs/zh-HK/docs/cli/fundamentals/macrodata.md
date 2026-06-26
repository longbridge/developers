---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 20
---

# longbridge macrodata

瀏覽宏觀數據指標及其歷史發布數據，覆蓋美國、香港、中國大陸、歐元區、日本和新加坡市場。

## 模式

| 模式 | 用法 | 描述 |
| ---- | ---- | ---- |
| 列表 | `longbridge macrodata` | 列出全部可用指標 |
| 歷史 | `longbridge macrodata <CODE>` | 查詢指定指標的歷史數據 |

## 示例

### 列出全部指標

```bash
longbridge macrodata
```

### 按國家/地區篩選

```bash
longbridge macrodata --country US
longbridge macrodata --country HK
```

支持的國家代碼：`HK`、`CN`、`US`、`EU`、`JP`、`SG`。

### 按關鍵詞搜索

```bash
longbridge macrodata --keyword CPI
longbridge macrodata --keyword CPI --country US
```

### 查看某個指標的歷史發布數據

```bash
longbridge macrodata 62267
longbridge macrodata 62267 --start 2024-01-01 --end 2024-12-31
```

### JSON 輸出（適合 AI / 腳本）

```bash
longbridge macrodata --format json
longbridge macrodata 62267 --format json
```

**列表 JSON 結構：**

```json
{
  "count": 619,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "list": [
    {
      "indicator_code": "62267",
      "country": "US",
      "name": "Non-Farm Payroll",
      "periodicity": "Monthly",
      "importance": 3
    }
  ]
}
```

**歷史 JSON 結構：**

```json
{
  "count": 24,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "info": {
    "indicator_code": "62267",
    "country": "US",
    "name": "Non-Farm Payroll",
    "periodicity": "Monthly",
    "importance": 3
  },
  "data": [
    {
      "period": "2026-05-01",
      "release_at": 1781094600,
      "actual_value": "272000",
      "previous_value": "265000",
      "forecast_value": "250000",
      "unit": "Thousand"
    }
  ]
}
```

:::tip
`actual_value` 為空時表示數據尚未發布（僅有 `forecast_value`）。`has_more: true` 表示還有更多數據，用 `--page` 翻頁。
:::

## 選項

| 選項 | 描述 | 默認值 |
| ---- | ---- | ------ |
| `--country` | 篩選列表：`HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | 全部 |
| `--keyword` | 按指標名稱篩選（模糊匹配，僅列表模式） | — |
| `--start` | 歷史開始日期 `YYYY-MM-DD` | — |
| `--end` | 歷史結束日期 `YYYY-MM-DD` | — |
| `--lang` | 名稱/描述語言：`zh-CN` \| `zh-HK` \| `en` | — |
| `--limit` | 每頁最大條數（列表最大 1000，歷史最大 100） | 20 |
| `--page` | 頁碼，從 1 開始 | 1 |
| `--format` | `table` 或 `json` | `table` |
