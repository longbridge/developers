---
title: 'short-positions'
sidebar_label: 'short-positions'
sidebar_position: 3
---

# longbridge short-positions

做空持仓数据——空头比例、空头股数及相关指标。支持港股和美股，市场根据代码后缀自动识别。

- **港股**：港交所每日数据
- **美股**：FINRA 每两周更新一次


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

### 查看美股做空历史数据

```bash
longbridge short-positions TSLA.US
longbridge short-positions AAPL.US --count 50
```

最多返回 100 条记录，按日期倒序排列。每行包含结算日、空头比例（空头股数 ÷ 流通股数）、空头股数、日均成交量、平仓天数及当日收盘价。

### 查看港股做空持仓

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

港股返回字段：结算日、空头比例、当日沽空金额、未平仓余额及收盘价。

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

- 美股：需要美股行情权限，仅支持美股及 ETF
- 港股：需要港股行情权限
