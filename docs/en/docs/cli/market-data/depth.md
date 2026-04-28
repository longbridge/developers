---
title: 'depth'
sidebar_label: 'depth'
sidebar_position: 2
---

# longbridge depth

View the Level 2 order book for a symbol — the top 10 bid and ask prices with order counts and volumes.

## Basic Usage

```bash
longbridge depth TSLA.US
```

```
Symbol: TSLA.US

Asks (Sell):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.990 | 200    | 3      |
| 2        | 345.000 | 500    | 8      |
| 3        | 345.010 | 300    | 4      |

Bids (Buy):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.980 | 400    | 6      |
| 2        | 344.970 | 600    | 9      |
| 3        | 344.960 | 250    | 3      |
```

## Examples

### View the order book

```bash
longbridge depth 700.HK
longbridge depth 700.HK --format json
```

Shows the current bid and ask ladder for 700.HK, including price levels, volume at each level, and order count. Up to 10 levels are returned per side when the market is open.

## Requirements

Level 2 quote subscription required. See [Quote Subscriptions](/docs/quote/) for subscription options.
