---
title: 'short-positions'
sidebar_label: 'short-positions'
sidebar_position: 3
---

# longbridge short-positions

美股做空数据——空头比例、空头股数、需几日平仓（days-to-cover）及日均成交量。仅支持美股及 ETF，数据由 FINRA 每两周更新一次。

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

### 查看做空历史数据

```bash
longbridge short-positions TSLA.US
longbridge short-positions AAPL.US --count 50
```

最多返回 100 条记录，按日期倒序排列。每行包含结算日、空头比例（空头股数 ÷ 流通股数）、空头股数、日均成交量、平仓天数及当日收盘价。

### 机器可读格式

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

## 参数

| 参数 | 说明 |
|------|------|
| `--count` | 返回条数（1–100，默认：20） |
| `--format` | 输出格式：`table`（默认）或 `json` |

## 权限要求

需要美股行情权限，仅支持美股及 ETF。
