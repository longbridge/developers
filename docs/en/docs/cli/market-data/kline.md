---
title: 'kline'
sidebar_label: 'kline'
sidebar_position: 6
---

# longbridge kline

Fetch candlestick (K-line) data for any symbol. Supports multiple periods and historical date ranges.

<QuotePermission command="kline" />

## Quota System

Access to historical K-line data is quota-based. Each account has a monthly limit on the number of unique symbols that can be queried. The quota resets at the start of each calendar month; unused quota does not carry over. Querying the same symbol multiple times in a month counts as one use.

For newly funded accounts, the quota takes effect on the next trading day. When total assets or monthly trade count increases to a higher tier, the new quota takes effect on the next trading day.

**Total assets**: combined value of HK, US, and CN securities accounts converted to HKD. Uses the higher of the last trading day of the previous calendar month vs. the most recent complete trading day.

**Monthly trades**: number of orders with at least one fill (partial, multiple, or single fill all count as 1). Uses the higher of last month's vs. current month's fill count.

| Account Tier | Monthly Symbol Limit |
|---|---|
| Account opened | 100 |
| Total assets ≥ HKD 10,000 | 400 |
| Total assets ≥ HKD 80,000 | 600 |
| Total assets ≥ HKD 400,000 or monthly trades > 160 | 1,000 |
| Total assets ≥ HKD 4,000,000 or monthly trades > 1,600 | 2,000 |
| Total assets ≥ HKD 6,000,000 or monthly trades > 2,500 | 3,000 |

## Basic Usage

```bash
longbridge kline TSLA.US --period day --count 3
```

```
| Time                | Open    | High    | Low     | Close   | Volume   | Turnover        |
|---------------------|---------|---------|---------|---------|----------|-----------------|
| 2026-04-07 04:00:00 | 346.440 | 348.020 | 337.240 | 346.650 | 74515355 | 25563965746.000 |
| 2026-04-08 04:00:00 | 363.790 | 364.500 | 339.670 | 343.250 | 78838616 | 27457043487.000 |
| 2026-04-09 04:00:00 | 343.150 | 348.880 | 337.250 | 345.620 | 62164016 | 21375312140.000 |
```

## Examples

### Daily candles (last 100 days, default)

```bash
longbridge kline TSLA.US
```

Returns the last 100 daily candles by default, with open, high, low, close, volume, and turnover for each day.

### Intraday candles with different period

```bash
longbridge kline TSLA.US --period 1h --count 48
```

Use `--period` to switch granularity (e.g. `1m`, `5m`, `15m`, `30m`, `1h`, `day`, `week`, `month`, `year`) and `--count` to control how many bars are returned.

### Historical date range

```bash
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31
longbridge kline history TSLA.US --period day --start 2025-01-01 --end 2025-03-31 --format json
```

Use the `history` subcommand with `--start` and `--end` (format: `YYYY-MM-DD`) to fetch candles for a specific date window. `--adjust forward` applies forward-adjusted prices. The `time` field in JSON output represents the candle open time — for US daily candles, this is US Eastern midnight expressed in UTC.
