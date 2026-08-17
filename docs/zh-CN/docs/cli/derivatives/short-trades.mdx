---
title: 'short-trades'
sidebar_label: 'short-trades'
sidebar_position: 4
---

# longbridge short-trades

每日沽空成交量——区别于 `short-positions`（持仓数据），此命令显示每日实际发生的沽空交易量。支持美股（FINRA/纳斯达克）和港股（港交所）。市场根据代码后缀自动识别。

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

美股字段说明：

| 字段 | 说明 |
|------|------|
| `date` | 交易日（`YYYY-MM-DD`） |
| `nas_short` | 纳斯达克/全国交易系统沽空股数 |
| `ny_short` | 纽交所（NYSE）沽空股数 |
| `total_vol` | 当日总沽空股数 |
| `rate%` | 沽空量占当日总成交量的比例 |
| `close` | 当日收盘价 |

### 美股 JSON 输出

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

美股 JSON 字段说明：

| 字段 | 说明 |
|------|------|
| `symbol` | `CODE.MARKET` 格式的标的代码 |
| `data[].timestamp` | Unix 时间戳（秒） |
| `data[].nus_amount` | 纳斯达克/全国交易系统沽空股数 |
| `data[].ny_amount` | 纽交所（NYSE）沽空股数 |
| `data[].total_amount` | 当日总沽空股数 |
| `data[].rate` | 沽空量占当日总成交量的比例 |
| `data[].close` | 当日收盘价 |

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

港股字段说明：

| 字段 | 说明 |
|------|------|
| `date` | 交易日（`YYYY-MM-DD`） |
| `short_shares` | 当日沽空股数 |
| `balance` | 未平仓沽空余额（港元） |
| `total_vol` | 市场当日总成交股数 |
| `rate%` | 沽空量占当日总成交量的比例 |
| `close` | 当日收盘价 |

### 港股 JSON 输出

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

港股 JSON 字段说明：

| 字段 | 说明 |
|------|------|
| `symbol` | `CODE.MARKET` 格式的标的代码 |
| `data[].timestamp` | Unix 时间戳（秒） |
| `data[].amount` | 当日沽空股数 |
| `data[].balance` | 未平仓沽空余额（港元） |
| `data[].total_amount` | 市场当日总成交股数 |
| `data[].rate` | 沽空量占当日总成交量的比例 |
| `data[].close` | 当日收盘价 |

### 与 short-positions 的区别

- `short-trades`：每日实际发生的沽空成交量（流量）
- `short-positions`：某时点的未平仓沽空余额（存量），美股每两周更新

## 参数

| 参数 | 说明 |
|------|------|
| `--count` | 返回条数（1–100，默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 权限要求

- 美股：需要美股行情权限
- 港股：需要港股行情权限
