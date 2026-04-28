---
title: 'trade-stats'
sidebar_label: 'trade-stats'
sidebar_position: 17
---

# longbridge trade-stats

View trade statistics — price distribution by volume for a stock.

## Basic Usage

```bash
longbridge trade-stats 700.HK
```

```
Prev Close: 504.500  Avg Price: 491.63  Trades: 32782

| price   | buy(shares) | sell(shares) | neutral(shares) |
|---------|-------------|--------------|-----------------|
| 504.500 | 0           | 0            | 142             |
| 504.000 | 0           | 0            | 15              |
| 503.000 | 700         | 0            | 103             |
| 502.500 | 4,200       | 0            | 0               |
...
```

## Examples

### View trade distribution

```bash
longbridge trade-stats 700.HK
longbridge trade-stats TSLA.US
```

Shows how trading volume is distributed across different price levels.

### JSON output

```bash
longbridge trade-stats AAPL.US --format json
```
