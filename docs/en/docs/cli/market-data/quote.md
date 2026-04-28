---
title: 'quote'
sidebar_label: 'quote'
sidebar_position: 1
---

# longbridge quote

Get real-time quotes for one or more symbols — price, volume, change from previous close, and extended-hours data for US stocks.

## Basic Usage

```bash
longbridge quote TSLA.US NVDA.US
```

```
| Symbol  | Last    | Prev Close | Open    | High    | Low     | Volume    | Turnover        | Status |
|---------|---------|------------|---------|---------|---------|-----------|-----------------|--------|
| TSLA.US | 345.620 | 343.250    | 343.150 | 348.880 | 337.250 | 62164016  | 21375312140.000 | Normal |
| NVDA.US | 183.910 | 182.080    | 181.840 | 184.080 | 180.620 | 116428523 | 21303315176.000 | Normal |

Extended Hours:
| Symbol  | Session | Last    | High    | Low     | Volume  | Prev Close | Time                |
|---------|---------|---------|---------|---------|---------|------------|---------------------|
| TSLA.US | Pre     | 343.100 | 346.450 | 339.695 | 945393  | 343.250    | 2026-04-09 13:30:00 |
| TSLA.US | Post    | 344.930 | 346.260 | 344.820 | 1348872 | 345.620    | 2026-04-09 23:59:59 |
| NVDA.US | Pre     | 181.990 | 182.080 | 180.000 | 1116645 | 182.080    | 2026-04-09 13:30:00 |
| NVDA.US | Post    | 183.020 | 183.950 | 182.900 | 6021581 | 183.910    | 2026-04-09 23:59:58 |
```

## Examples

### Check a single stock

```bash
longbridge quote TSLA.US
```

Displays the latest price, open, high, low, volume, turnover, and previous close for TSLA.

### Compare multiple symbols across markets

```bash
longbridge quote TSLA.US NVDA.US 700.HK
longbridge quote TSLA.US NVDA.US 700.HK --format json
```

Pass multiple symbols in one call to compare quotes side by side. Symbols from different markets (US, HK, CN) are all supported. US stocks include `pre_market_quote` and `post_market_quote` fields when extended-hours data is available.

### Get pre-market and after-hours data

```bash
# pre_market_quote and post_market_quote fields appear in US stock output
longbridge quote TSLA.US --format json
```

For US stocks, JSON output includes `pre_market_quote` and `post_market_quote` objects when extended-hours data is available. These fields are `null` during regular US market hours.
