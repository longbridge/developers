---
title: 'intraday'
sidebar_label: 'intraday'
sidebar_position: 5
---

# longbridge intraday

获取任意标的逐分钟的价格和成交量数据（分时线）——今日实时数据或历史日期数据。

## 基本用法

```bash
longbridge intraday TSLA.US
```

```
| Time                | Price   | Avg Price | Volume  | Turnover       |
|---------------------|---------|-----------|---------|----------------|
| 2026-04-09 13:30:00 | 343.150 | 343.150   | 1234567 | 423567890.000  |
| 2026-04-09 13:31:00 | 344.200 | 343.675   | 987654  | 339876540.000  |
| 2026-04-09 13:32:00 | 343.800 | 343.717   | 876543  | 301234560.000  |
...
```

## 示例

### 查看今日分时线

```bash
longbridge intraday TSLA.US
longbridge intraday TSLA.US --format json
```

从开盘至最新一分钟，每分钟输出一条数据，包含价格、均价、成交量和成交额。

### 包含美股盘前和盘后数据

```bash
longbridge intraday AAPL.US --session all
```

```json
[
  {
    "avg_price": "258.368439",
    "price": "258.330",
    "time": "2026-04-09 08:00:00",
    "turnover": "97663.270",
    "volume": "378"
  },
  {
    "avg_price": "258.382920",
    "price": "258.240",
    "time": "2026-04-09 08:01:00",
    "turnover": "1622133.447",
    "volume": "6278"
  }
]
```

`--session all` 包含从美东时间约早上 8:00 开始的盘前数据，以及下午 4:00 之后的盘后数据。

### 查看历史分时数据

```bash
longbridge intraday TSLA.US --date 20260401
longbridge intraday AAPL.US --date 20260401 --format json
```

使用 `--date YYYYMMDD` 获取指定历史交易日的分时数据，而非今日实时数据。
