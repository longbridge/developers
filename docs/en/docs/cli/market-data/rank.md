---
title: 'rank'
sidebar_label: 'rank'
sidebar_position: 20
---

# longbridge rank

LB popularity rankings — a composite score of trading activity, community discussion, watchlist additions, and other signals. Without `--key`, lists all available rank categories. With `--key`, shows the ranked stock list for that category.

<QuotePermission command="rank" />

## Basic Usage

```bash
longbridge rank
```

```
Rank Categories

Total Heat:
  ib_hot_all-us   US stocks
  ib_hot_all-hk   HK stocks
  ib_hot_all-cn   A-shares

Heat Rising:
  ib_hot_up-us    US stocks
  ib_hot_up-hk    HK stocks
  ib_hot_up-cn    A-shares

Heat Falling:
  ib_hot_down-us  US stocks
  ib_hot_down-hk  HK stocks
  ib_hot_down-cn  A-shares
```

## Examples

### View US total heat ranking

```bash
longbridge rank --key ib_hot_all-us
```

```
Rank — ib_hot_all-us

| # | symbol  | name          | last_done | chg     | inflow          |
|---|---------|---------------|-----------|---------|-----------------|
| 1 | MU.US   | Micron        | 698.74    | +4.76%  | -347,041,642    |
| 2 | NVDA.US | NVIDIA        | 131.80    | +3.21%  | +1,234,567,890  |
| 3 | AAPL.US | Apple         | 205.10    | -0.42%  | +567,890,123    |
```

### View HK total heat ranking

```bash
longbridge rank --key ib_hot_all-hk
```

### View heat-rising ranking (top 20)

```bash
longbridge rank --key ib_hot_up-us --count 20
```

### List all categories

```bash
longbridge rank
```

Without `--key`, lists all available rank keys that can be passed directly to `--key`.

## Options

| Flag | Description |
|------|-------------|
| `--key` | Rank category key (from the no-args output) |
| `--market` | Market filter for the category list (default: `US`) |
| `--count` | Number of results (default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Notes

- Rankings are a composite of trading volume, community discussion, watchlist additions, and more — not simply price performance
- `inflow` is net capital flow for the day (positive = inflow, negative = outflow)
