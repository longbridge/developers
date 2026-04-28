---
title: 'trading'
sidebar_label: 'trading'
sidebar_position: 11
---

# longbridge trading

Look up trading session schedules and trading day calendars for any market.

## Basic Usage

```bash
longbridge trading session
```

```
| Market | Session  | Open     | Close    |
|--------|----------|----------|----------|
| US     | Pre      | 04:00:00 | 09:30:00 |
| US     | Intraday | 09:30:00 | 16:00:00 |
| US     | Post     | 16:00:00 | 20:00:00 |
| HK     | Intraday | 09:30:00 | 12:00:00 |
| HK     | Intraday | 13:00:00 | 16:00:00 |
```

## Examples

### View trading hours for all markets

```bash
longbridge trading session --format json
```

```json
[
  {
    "market": "US",
    "sessions": [
      { "close": "9:30:00.0", "open": "4:00:00.0", "session": "Pre" },
      { "close": "16:00:00.0", "open": "9:30:00.0", "session": "Intraday" },
      { "close": "20:00:00.0", "open": "16:00:00.0", "session": "Post" }
    ]
  },
  {
    "market": "HK",
    "sessions": [
      { "close": "12:00:00.0", "open": "9:30:00.0", "session": "Intraday" },
      { "close": "16:00:00.0", "open": "13:00:00.0", "session": "Intraday" }
    ]
  }
]
```

The US market has three sessions (Pre, Intraday, Post). HK has two Intraday blocks separated by a lunch break.

### Get trading calendar for a date range

```bash
longbridge trading days HK --start 2026-04-01 --end 2026-04-10 --format json
```

```json
{
  "half_trading_days": [],
  "trading_days": ["2026-04-01", "2026-04-02", "2026-04-08", "2026-04-09", "2026-04-10"]
}
```

Returns the list of full trading days and any half-trading days within the range. Public holidays are excluded automatically.

### Check if today is a trading day

```bash
longbridge trading days US
```

Omitting `--start` and `--end` returns today's trading status. If today is a trading day, it appears in the `trading_days` list.
