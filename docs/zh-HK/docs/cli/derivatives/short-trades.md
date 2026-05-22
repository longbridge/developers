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
Updated: 2026-05-18T04:00:00Z

| date                     | rate%  | nus_amount | ny_amount | total_amount | close   |
|--------------------------|--------|------------|-----------|--------------|---------|
| 2026-05-18T04:00:00Z    | 25.61% | 2,179,682  | 0         | 8,510,570    | 297.840 |
| 2026-05-17T04:00:00Z    | 36.43% | 5,748,485  | 0         | 15,778,974   | 300.230 |
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
| `date` | 交易日（含時區） |
| `rate%` | 沽空量佔當日總成交量的比例 |
| `nus_amount` | 全國交易系統（NUS）沽空股數 |
| `ny_amount` | 紐交所（NYSE）沽空股數 |
| `total_amount` | 當日總沽空股數 |
| `close` | 當日收盤價 |

### 查看港股每日沽空成交量

```bash
longbridge short-trades 700.HK
longbridge short-trades 700.HK --count 30
```

```
Short Trades — 700.HK
Updated: 2026-05-18T16:00:00Z

| date                     | rate%  | amount    | balance          | total_amount | close |
|--------------------------|--------|-----------|------------------|--------------|-------|
| 2026-05-18T16:00:00Z    | 10.65% | 3,592,700 | 1,657,732,820.00 | 33,736,701   | 460.0 |
```

港股欄位說明：

| 欄位 | 說明 |
|------|------|
| `date` | 交易日（含時區） |
| `rate%` | 沽空量佔當日總成交量的比例 |
| `amount` | 當日沽空股數 |
| `balance` | 未平倉沽空餘額（港元） |
| `total_amount` | 市場當日總成交股數 |
| `close` | 當日收盤價 |

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
