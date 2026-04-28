---
title: 'option'
sidebar_label: 'option'
sidebar_position: 1
---

# longbridge option

查询美股期权合约的实时行情、浏览完整期权链，以及查看认购/认沽成交量统计。

## 基本用法

```bash
longbridge option chain AAPL.US
```

```
| Expiry Date |
|-------------|
| 2026-04-17  |
| 2026-04-22  |
| 2026-04-24  |
| 2026-05-01  |
| 2026-05-15  |
| 2026-06-18  |
| 2026-07-17  |
| 2026-09-18  |
...
```

## 示例

### 浏览股票期权链

不加 `--date` 时，返回该标的所有可用到期日。选择到期日后，使用 `--date` 参数查看对应的行权价列表。

### 查看指定到期日的行权价

```bash
longbridge option chain AAPL.US --date 2026-04-17 --format json
```

```json
[
  { "call_symbol": "AAPL260417C110000.US", "put_symbol": "AAPL260417P110000.US", "standard": "true", "strike": "110" },
  { "call_symbol": "AAPL260417C115000.US", "put_symbol": "AAPL260417P115000.US", "standard": "true", "strike": "115" },
  { "call_symbol": "AAPL260417C120000.US", "put_symbol": "AAPL260417P120000.US", "standard": "true", "strike": "120" }
]
```

每行展示该行权价对应的认购和认沽合约代码。从 `call_symbol` 或 `put_symbol` 复制合约代码即可获取实时行情。

### 获取期权合约实时行情

```bash
longbridge option quote AAPL260417C190000.US --format json
```

```json
[
  {
    "symbol": "AAPL260417C190000.US",
    "last": "12.35",
    "bid": "12.30",
    "ask": "12.40",
    "open_interest": "4821",
    "implied_volatility": "0.2341",
    "delta": "0.4812",
    "gamma": "0.0231",
    "theta": "-0.0512",
    "vega": "0.1843"
  }
]
```

返回该合约的最新买卖价、最新成交价、隐含波动率及希腊值（delta、gamma、theta、vega）。

### 期权成交量

查看今日实时认购/认沽成交量快照：

```bash
longbridge option volume AAPL.US
```

```
Option Volume Stats — AAPL.US

| call_vol | put_vol | pc_ratio |
|----------|---------|----------|
| 910,397  | 296,578 | 0.3258   |
```

查看历史每日认购/认沽成交量及持仓量：

```bash
longbridge option volume daily AAPL.US
longbridge option volume daily AAPL.US --count 60
```

```
Option Volume Daily — AAPL.US

| date       | total_vol | call_vol | put_vol | pc_vol   | call_oi   | put_oi    | pc_oi    |
|------------|-----------|----------|---------|----------|-----------|-----------|----------|
| 2026-04-16 | 1,205,125 | 909,133  | 295,992 | 0.325576 | 2,719,025 | 1,913,086 | 0.703593 |
| 2026-04-15 | 1,611,875 | 1,250,894| 360,981 | 0.288578 | 2,684,251 | 1,914,190 | 0.713119 |
```

`pc_vol` 为认沽/认购成交量比；`pc_oi` 为认沽/认购持仓量比。

## 权限要求

`option quote` 需要期权账户及期权行情权限；`option chain` 和 `option volume` 需要一级行情权限。参见[行情订阅](/zh-CN/docs/quote/)了解权限详情。

## 说明

期权代码格式：`AAPL260417C190000.US`——标的 AAPL，到期日 2026-04-17，认购（Call），行权价 $190.00。价格部分以 $0.001 为单位，因此 190000 = $190.00。
