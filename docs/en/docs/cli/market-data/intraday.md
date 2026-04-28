---
title: 'intraday'
sidebar_label: 'intraday'
sidebar_position: 5
---

# longbridge intraday

Get minute-by-minute price and volume data (intraday line) for any symbol — today's live data or a historical date.

## Basic Usage

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

## Examples

### View today's intraday price line

```bash
longbridge intraday TSLA.US
longbridge intraday TSLA.US --format json
```

Outputs one bar per minute from market open to the latest available tick, showing price, average price, volume, and turnover.

### Include pre-market and post-market for US stocks

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

`--session all` includes pre-market bars starting from approximately 8:00 AM ET, as well as post-market bars after 4:00 PM ET.

### Historical intraday data

```bash
longbridge intraday TSLA.US --date 20260401
longbridge intraday AAPL.US --date 20260401 --format json
```

Use `--date YYYYMMDD` to retrieve intraday data for a past trading date instead of today's live data.
