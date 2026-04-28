---
title: 'trades'
sidebar_label: 'trades'
sidebar_position: 4
---

# longbridge trades

Fetch recent tick-by-tick trade records for a symbol, including price, volume, time, and trade direction.

## Basic Usage

```bash
longbridge trades TSLA.US
```

```
| Time                | Price   | Volume | Direction | Type |
|---------------------|---------|--------|-----------|------|
| 2026-04-09 23:59:43 | 344.940 | 5      | Down      | I    |
| 2026-04-09 23:59:43 | 344.940 | 40     | Down      |      |
| 2026-04-09 23:59:44 | 344.980 | 40     | Up        |      |
| 2026-04-09 23:59:44 | 344.980 | 5      | Up        | I    |
| 2026-04-09 23:59:45 | 344.970 | 1      | Down      | I    |
| 2026-04-09 23:59:52 | 344.975 | 100    | Neutral   |      |
```

## Examples

### View last 20 trades

```bash
longbridge trades TSLA.US
```

Returns the 20 most recent trades for TSLA, showing price, volume, timestamp, and direction for each tick.

### Get more trades with --count

```bash
longbridge trades TSLA.US --count 50
```

Use `--count` to fetch up to 50 (or more) recent trades in a single call.

### Read buy/sell pressure from trade direction

```bash
# The direction field shows Up, Down, or Neutral relative to the prior trade
longbridge trades TSLA.US --count 50 --format json
```

Each entry includes a `direction` field indicating whether the trade printed above, below, or at the previous price — useful for gauging short-term momentum.
