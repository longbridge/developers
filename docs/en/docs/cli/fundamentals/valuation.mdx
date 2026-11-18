---
title: 'valuation'
sidebar_label: 'valuation'
sidebar_position: 7
---

# longbridge valuation

Analyze a stock's current valuation (P/E, P/B, P/S, dividend yield) with 5-year historical context and industry peer comparison, or track how valuation has changed over time.

## Basic Usage

```bash
longbridge valuation TSLA.US --indicator pe
```

```
Overview:
| indicator | current | high   | low   | median | industry_median | date       |
|-----------|---------|--------|-------|--------|-----------------|------------|
| PE        | 341.83x | 284.01 | 51.31 | 96.85  | -0.11           | 2026-04-09 |
Current P/E 341.83, above fair range, cheaper than 8.85% of last 5 years, industry rank 19/49

Peers (5):
| name  | pe     |
|-------|--------|
| TSLA  | 341.83 |
...
```

## Examples

### Current valuation snapshot

```bash
longbridge valuation TSLA.US
```

Shows current P/E, P/B, P/S, and dividend yield alongside the 5-year historical range and where the current value sits within that range. Includes industry peer rank.

### Historical P/E chart

```bash
longbridge valuation TSLA.US --history --indicator pe --range 5
```

Returns a 5-year time series of Tesla's P/E ratio. Use `--range` to set the lookback window: `1`, `3`, `5`, or `10` years.

### Compare P/B over time

```bash
longbridge valuation 700.HK --history --indicator pb
```

Tracks Tencent's price-to-book ratio over time. Supported indicators for `--history` mode: `pe`, `pb`, `ps`, `dvd_yld`.

### JSON for monitoring

```bash
# Export historical P/B data as JSON for scripting or monitoring pipelines
longbridge valuation TSLA.US --history --indicator pb --format json
```

```json
{
  "metrics": {
    "pb": {
      "desc": "current P/B 15.79, in reasonable range, cheaper than 50.31% of last 5 years, industry rank 35/49",
      "high": "24.35",
      "list": [
        { "timestamp": "1619841600", "value": "26.87" },
        { "timestamp": "1622520000", "value": "24.53" }
      ]
    }
  }
}
```

The `desc` field provides a human-readable summary of how the current valuation compares to historical range and industry peers. The `list` array contains the time series data points.
