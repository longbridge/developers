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
Top Movers — US

TSLA  Tesla  -3.88%  [Automobile Manufacturers]
  Alert: Move exceeds 20-day average
  Related news: "Tesla Q1 deliveries miss estimates..."

NVDA  NVIDIA  +4.21%  [Semiconductor Manufacturers]
  Alert: Move exceeds 20-day average
  Related news: "NVIDIA announces next-gen GPU architecture..."
```

## Examples

### View US movers

```bash
longbridge top-movers
longbridge top-movers --market US
```

Default market is US. Results are sorted by heat (relevance/activity).

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

## Options

| Flag | Description |
|------|-------------|
| `--market` | Market: `HK`, `US`, `CN`, `SG` (default: `US`) |
| `--sort` | Sort order: `hot` (default), `time`, or `change` |
| `--count` | Number of results (default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Notes

- `top-movers` links related news, making it useful for understanding the context behind a move; `anomaly` focuses on pure technical signals
- The volatility threshold is based on the 20-day historical standard deviation
