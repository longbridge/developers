---
title: 'short-positions'
sidebar_label: 'short-positions'
sidebar_position: 3
---

# longbridge short-positions

美股放空資料——空頭比例、空頭股數、平倉天數（days-to-cover）及日均成交量。僅支援美股及 ETF，資料由 FINRA 每兩週更新一次。

## 基本用法

```bash
longbridge short-positions TSLA.US
```

```
Short Selling Data — TSLA.US

| date       | rate% | short_shares | avg_daily_vol | days_cover | close   |
|------------|-------|--------------|---------------|------------|---------|
| 2026-03-31 | 1.75% | 65,598,603   | 62,121,644    | 1.06       | 371.750 |
| 2026-03-13 | 1.62% | 60,860,404   | 60,676,562    | 1.00       | 391.200 |
| 2026-02-27 | 1.65% | 61,839,735   | 51,533,435    | 1.20       | 402.510 |
```

## 示例

### 查看放空歷史資料

```bash
longbridge short-positions TSLA.US
longbridge short-positions AAPL.US --count 50
```

最多返回 100 筆記錄，按日期倒序排列。每行包含結算日、空頭比例（空頭股數 ÷ 流通股數）、空頭股數、日均成交量、平倉天數及當日收盤價。

### 機器可讀格式

```bash
longbridge short-positions NVDA.US --format json
```

```json
[
  {
    "date": "2026-03-31",
    "rate": "0.0175",
    "short_shares": "65598603",
    "avg_daily_vol": "62121644",
    "days_cover": "1.06",
    "close": "371.750"
  }
]
```

## 參數

| 參數 | 說明 |
|------|------|
| `--count` | 返回筆數（1–100，預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 權限要求

需要美股行情權限，僅支援美股及 ETF。
