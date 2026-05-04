---
title: 'capital'
sidebar_label: 'capital'
sidebar_position: 9
---

# longbridge capital

Track intraday capital flow — view a snapshot distribution of large/medium/small money (default), or get a minute-by-minute time series with `--flow`.

## Basic Usage

```bash
longbridge capital TSLA.US
```

```
| large_in   | medium_in   | small_in    | large_out  | medium_out  | small_out   |
|------------|-------------|-------------|------------|-------------|-------------|
| 30160.97   | 131976.32   | 134017.99   | 21801.89   | 132803.77   | 124441.20   |
```

## Examples

### Track minute-by-minute large money inflow

```bash
longbridge capital TSLA.US --flow --format json
```

```json
[
  { "inflow": "1100.46", "time": "2026-04-09 13:30:00" },
  { "inflow": "1129.09", "time": "2026-04-09 13:31:00" },
  { "inflow": "1711.27", "time": "2026-04-09 13:32:00" }
]
```

Each bar shows net inflow for that minute. Positive values indicate net buying; negative values indicate net selling.

### Snapshot: large/medium/small money distribution

```bash
longbridge capital TSLA.US --format json
```

```json
{
  "capital_in": { "large": "30160.97", "medium": "131976.32", "small": "134017.99" },
  "capital_out": { "large": "21801.89", "medium": "132803.77", "small": "124441.20" },
  "symbol": "TSLA.US",
  "timestamp": "2026-04-09 20:00:00"
}
```

`capital_in` shows total money flowing into the stock broken down by order size (large / medium / small). `capital_out` shows the corresponding outflows. Compare the two to assess whether large institutional money is net buying or selling.
