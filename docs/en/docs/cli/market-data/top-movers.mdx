---
title: 'top-movers'
sidebar_label: 'top-movers'
sidebar_position: 19
---

# longbridge top-movers

Stocks whose price movement exceeds their 20-day standard deviation. The system automatically links related news to explain the reason behind each move. Unlike `anomaly` (pure technical signal), `top-movers` focuses on price moves with news context.

<QuotePermission command="top-movers" />

## Basic Usage

```bash
longbridge top-movers
```

```
| time                 | symbol  | change% | reason           | tags             |
|----------------------|---------|---------|------------------|------------------|
| 2026-05-22T17:44:45Z | TSLA.US | +3.24%  | 波动超 20 日均值 | 汽车制造商       |
| 2026-05-22T14:42:36Z | RKLB.US | +11.32% | 波动超 20 日均值 | 航空航天与国防   |
```

## Examples

### View movers across all markets

```bash
longbridge top-movers
```

Omitting `--market` returns movers across all markets.

### View US movers

```bash
longbridge top-movers --market US
```

### View HK movers

```bash
longbridge top-movers --market HK
```

### Sort by time and increase result count

```bash
longbridge top-movers --market US --sort time --count 50
```

### Sort by price change

```bash
longbridge top-movers --market US --sort change
```

### JSON output

```bash
longbridge top-movers --market US --format json
```

```json
{
  "events": [
    {
      "alert_reason": "波动超 20 日均值",
      "alert_type": 11,
      "timestamp": "1779471885",
      "stock": {
        "symbol": "TSLA.US",
        "code": "TSLA",
        "market": "US",
        "name": "特斯拉",
        "change": "0.0324",
        "last_done": "426.010",
        "labels": ["汽车制造商"]
      }
    }
  ],
  "updated_at": 1779471885
}
```

Key JSON fields:

| Field | Description |
|-------|-------------|
| `events[].timestamp` | Event time as Unix timestamp (seconds) |
| `events[].alert_reason` | Reason for the alert |
| `events[].stock.symbol` | Symbol in `CODE.MARKET` format (e.g. `TSLA.US`) |
| `events[].stock.code` | Stock code (without market suffix) |
| `events[].stock.market` | Market (`US`, `HK`, etc.) |
| `events[].stock.change` | Price change ratio (e.g. `"0.0324"` = +3.24%) |
| `events[].stock.last_done` | Last traded price |
| `events[].stock.labels` | Industry/category tags |

## Options

| Flag | Description |
|------|-------------|
| `--market` | Market: `HK`, `US`, `CN`, `SG`. Optional — omit for all markets. |
| `--sort` | Sort order: `hot` (default), `time`, or `change` |
| `--count` | Number of results (default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Notes

- `top-movers` links related news, making it useful for understanding the context behind a move; `anomaly` focuses on pure technical signals
- The volatility threshold is based on the 20-day historical standard deviation
