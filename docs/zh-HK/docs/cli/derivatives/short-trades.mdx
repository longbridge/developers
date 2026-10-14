---
title: 'short-trades'
sidebar_label: 'short-trades'
sidebar_position: 4
---

# longbridge short-trades

每日沽空成交量——區別於 `short-positions`（持倉資料），此命令顯示每日實際發生的沽空交易量。支援美股（FINRA/納斯達克）和港股（港交所）。市場根據代碼後綴自動識別。

<QuotePermission command="short-trades" />

## 基本用法

```bash
longbridge short-trades AAPL.US
```

```
Short Trades — AAPL.US

| date       | nas_short | ny_short | total_vol  | rate%  | close   |
|------------|-----------|----------|------------|--------|---------|
| 2026-05-22 | 3,809,598 | 0        | 10,564,290 | 36.06% | 308.820 |
| 2026-05-21 | 3,485,781 | 0        | 9,375,861  | 37.18% | 304.990 |
```

## 示例

### 查看美股每日沽空成交量

```bash
longbridge short-trades AAPL.US
longbridge short-trades AAPL.US --count 30
```

美股欄位說明：

| 欄位 | 說明 |
|------|------|
| `date` | 交易日（`YYYY-MM-DD`） |
| `nas_short` | 納斯達克/全國交易系統沽空股數 |
| `ny_short` | 紐交所（NYSE）沽空股數 |
| `total_vol` | 當日總沽空股數 |
| `rate%` | 沽空量佔當日總成交量的比例 |
| `close` | 當日收盤價 |

### 美股 JSON 輸出

```bash
longbridge short-trades AAPL.US --format json
```

```json
{
  "symbol": "AAPL.US",
  "data": [
    {
      "close": "308.820",
      "nus_amount": "3809598",
      "ny_amount": "0",
      "rate": "0.3606",
      "timestamp": "1779422400",
      "total_amount": "10405642"
    }
  ],
  "sources": 1
}
```

美股 JSON 欄位說明：

| 欄位 | 說明 |
|------|------|
| `symbol` | `CODE.MARKET` 格式的標的代碼 |
| `data[].timestamp` | Unix 時間戳（秒） |
| `data[].nus_amount` | 納斯達克/全國交易系統沽空股數 |
| `data[].ny_amount` | 紐交所（NYSE）沽空股數 |
| `data[].total_amount` | 當日總沽空股數 |
| `data[].rate` | 沽空量佔當日總成交量的比例 |
| `data[].close` | 當日收盤價 |

### 查看港股每日沽空成交量

```bash
longbridge short-trades 700.HK
longbridge short-trades 700.HK --count 30
```

```
Short Trades — 700.HK

| date       | rate%  | short_shares | balance          | total_vol  | close |
|------------|--------|--------------|------------------|------------|-------|
| 2026-05-21 | 8.16%  | 1,957,600    | 865,793,700.00   | 23,998,219 | 441.4 |
```

港股欄位說明：

| 欄位 | 說明 |
|------|------|
| `date` | 交易日（`YYYY-MM-DD`） |
| `short_shares` | 當日沽空股數 |
| `balance` | 未平倉沽空餘額（港元） |
| `total_vol` | 市場當日總成交股數 |
| `rate%` | 沽空量佔當日總成交量的比例 |
| `close` | 當日收盤價 |

### 港股 JSON 輸出

```bash
longbridge short-trades 700.HK --format json
```

```json
{
  "symbol": "700.HK",
  "data": [
    {
      "amount": "1957600",
      "balance": "865793700.00",
      "close": "441.4",
      "rate": "0.0816",
      "timestamp": "1779379200",
      "total_amount": "23998219"
    }
  ]
}
```

港股 JSON 欄位說明：

| 欄位 | 說明 |
|------|------|
| `symbol` | `CODE.MARKET` 格式的標的代碼 |
| `data[].timestamp` | Unix 時間戳（秒） |
| `data[].amount` | 當日沽空股數 |
| `data[].balance` | 未平倉沽空餘額（港元） |
| `data[].total_amount` | 市場當日總成交股數 |
| `data[].rate` | 沽空量佔當日總成交量的比例 |
| `data[].close` | 當日收盤價 |

### 與 short-positions 的區別

- `short-trades`：每日實際發生的沽空成交量（流量）
- `short-positions`：某時點的未平倉沽空餘額（存量），美股每兩週更新

## 參數

| 參數 | 說明 |
|------|------|
| `--count` | 返回筆數（1–100，預設：20） |
| `--format` | 輸出格式：`table`（預設）或 `json` |

## 權限要求

- 美股：需要美股行情權限
- 港股：需要港股行情權限
