---
title: 'market-temp'
sidebar_label: 'market-temp'
sidebar_position: 10
---

# longbridge market-temp

Get the Longbridge market temperature index — a composite 0–100 sentiment gauge combining valuation and market sentiment. Higher = more bullish.

## Basic Usage

```bash
longbridge market-temp US
```

```
| Field       | Value                                 |
|-------------|---------------------------------------|
| Market      | US                                    |
| Temperature | 64                                    |
| Description | Temp Comfortable & Gradually Dropping |
| Valuation   | 83                                    |
| Sentiment   | 45                                    |
```

## Examples

### Current market temperature

```bash
# Hong Kong market
longbridge market-temp HK
# US market
longbridge market-temp US
# China A-shares
longbridge market-temp CN
# JSON output for scripting or monitoring
longbridge market-temp US --format json
```

Supported markets: `HK` (default), `US`, `CN` (aliases: `SH`, `SZ`), `SG`. Running without an argument defaults to `HK`.

### Historical temperature trend

```bash
longbridge market-temp US --history --start 2026-04-01 --end 2026-04-09 --format json
```

```json
[
  { "description": "", "sentiment": "70", "temperature": "67", "time": "2026-04-01 04:00:00", "valuation": "64" },
  { "description": "", "sentiment": "34", "temperature": "50", "time": "2026-04-02 04:00:00", "valuation": "67" },
  { "description": "", "sentiment": "56", "temperature": "61", "time": "2026-04-06 04:00:00", "valuation": "67" }
]
```

Returns one record per trading day over the specified range. Useful for charting sentiment shifts around market events.
