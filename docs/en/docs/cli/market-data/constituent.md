---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

View constituent stocks of an index or ETF — with sorting options and rise/fall statistics.

## Basic Usage

```bash
longbridge constituent HSI.HK
```

```
Constituents (90 total)  Rise: 0  Fall: 0  Flat: 0

| symbol  | name             | price   | prev_close | change% | volume    | turnover   |
|---------|------------------|---------|------------|---------|-----------|------------|
| 1211.HK | BYD              | 110.300 | 105.100    | 0.0495  | 50148879  | 5500136961 |
| 322.HK  | Kangshifu        | 13.230  | 12.990     | 0.0185  | 11929280  | 156922125  |
| 857.HK  | PetroChina       | 10.970  | 10.800     | 0.0157  | 96106689  | 1052688828 |
...
```

## Examples

### View index constituents

```bash
longbridge constituent HSI.HK
longbridge constituent DJI.US
```

Lists constituent stocks sorted by change percentage by default, with price and market data.

### Sort by different indicators

```bash
# Sort by turnover
longbridge constituent HSI.HK --sort turnover
# Sort by market cap, ascending
longbridge constituent DJI.US --sort market-cap --order asc
```

Supported sort fields: `change`, `price`, `turnover`, `inflow`, `turnover-rate`, `market-cap`.

### Limit results

```bash
longbridge constituent HSI.HK --limit 10
longbridge constituent SPX.US --limit 20 --sort inflow
```

### JSON output

```bash
longbridge constituent HSI.HK --format json
```
