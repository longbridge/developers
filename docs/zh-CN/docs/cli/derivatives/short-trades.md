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

美股字段说明：

| 字段 | 说明 |
|------|------|
| `date` | 交易日（含时区） |
| `rate%` | 沽空量占当日总成交量的比例 |
| `nus_amount` | 全国交易系统（NUS）沽空股数 |
| `ny_amount` | 纽交所（NYSE）沽空股数 |
| `total_amount` | 当日总沽空股数 |
| `close` | 当日收盘价 |

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

港股字段说明：

| 字段 | 说明 |
|------|------|
| `date` | 交易日（含时区） |
| `rate%` | 沽空量占当日总成交量的比例 |
| `amount` | 当日沽空股数 |
| `balance` | 未平仓沽空余额（港元） |
| `total_amount` | 市场当日总成交股数 |
| `close` | 当日收盘价 |

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
