---
title: 'capital'
sidebar_label: 'capital'
sidebar_position: 9
---

# longbridge capital

Track intraday capital flow — see where large, medium, and small money is moving minute by minute (`flow` subcommand) or as a snapshot distribution (`dist` subcommand).

## Basic Usage

```bash
longbridge capital flow TSLA.US
```

```
| Time                | Inflow   |
|---------------------|----------|
| 2026-04-09 13:30:00 | 1100.46  |
| 2026-04-09 13:31:00 | 1129.09  |
| 2026-04-09 13:32:00 | 1711.27  |
| 2026-04-09 13:33:00 | 1955.54  |
| 2026-04-09 13:34:00 | 1609.27  |
...
```

## Examples

### Track minute-by-minute large money inflow

```bash
longbridge capital flow TSLA.US --format json
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
longbridge capital dist TSLA.US --format json
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
