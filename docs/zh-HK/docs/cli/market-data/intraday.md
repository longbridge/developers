---
title: 'intraday'
sidebar_label: 'intraday'
sidebar_position: 5
---

# longbridge intraday

取得任意標的逐分鐘的價格和成交量數據（分時線）——今日即時數據或歷史日期的數據。

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

### 查看今日分時線

```bash
longbridge intraday TSLA.US
longbridge intraday TSLA.US --format json
```

從開盤至最新一分鐘，每分鐘輸出一條數據，包含價格、均價、成交量和成交額。

### 包含美股盤前和盤後數據

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

`--session all` 包含從美東時間約早上 8:00 開始的盤前數據，以及下午 4:00 之後的盤後數據。

### 查看歷史分時數據

```bash
longbridge intraday TSLA.US --date 20260401
longbridge intraday AAPL.US --date 20260401 --format json
```

使用 `--date YYYYMMDD` 取得指定過往交易日的分時數據，而非今日的即時數據。
