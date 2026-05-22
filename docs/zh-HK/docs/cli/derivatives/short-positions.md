---
title: 'short-positions'
sidebar_label: 'short-positions'
sidebar_position: 3
---

# longbridge short-positions

放空持倉資料——空頭比例、空頭股數及相關指標。支援港股和美股，市場根據代碼後綴自動識別。

- **港股**：港交所每日資料
- **美股**：FINRA 每兩週更新一次

加 `--trades` 可切換為每日沽空成交量（區別於持倉餘額）。

<QuotePermission command="short-positions" />

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

### 查看美股放空歷史資料

```bash
longbridge short-positions TSLA.US
longbridge short-positions AAPL.US --count 50
```

最多返回 100 筆記錄，按日期倒序排列。每行包含結算日、空頭比例（空頭股數 ÷ 流通股數）、空頭股數、日均成交量、平倉天數及當日收盤價。

### 查看港股放空持倉

```bash
longbridge short-positions 700.HK
longbridge short-positions 700.HK --count 30
```

```
Short Positions — 700.HK

| date       | rate% | amount       | balance          | close  |
|------------|-------|--------------|------------------|--------|
| 2026-05-19 | 1.45% | 2,748,900    | 1,256,859,880.00 | 455.20 |
```

港股返回欄位：結算日、空頭比例、當日沽空金額、未平倉餘額及收盤價。

### 查看每日沽空成交量（--trades）

```bash
longbridge short-positions AAPL.US --trades
longbridge short-positions 700.HK --trades
```

美股（--trades）：

```
Short Trades — AAPL.US

| date       | rate%  | nus_amount | ny_amount | total_amount |
|------------|--------|------------|-----------|--------------|
| 2026-05-18 | 25.61% | 2,179,682  | 0         | 8,510,570    |
```

港股（--trades）：

```
Short Trades — 700.HK

| date       | rate%  | amount    | balance          | total_amount |
|------------|--------|-----------|------------------|--------------|
| 2026-05-18 | 10.65% | 3,592,700 | 1,657,732,820.00 | 33,736,701   |
```

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
| `--trades` | 顯示每日沽空成交量而非持倉餘額 |
| `--count` | 返回筆數（1–100，預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 權限要求

- 美股：需要美股行情權限，僅支援美股及 ETF
- 港股：需要港股行情權限
