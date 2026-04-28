---
title: 'warrant'
sidebar_label: 'warrant'
sidebar_position: 2
---

# longbridge warrant

Browse HK warrants — list all warrants on an underlying, get real-time quotes for individual warrant contracts, or look up issuer information.

## Basic Usage

```bash
longbridge warrant 700.HK
```

```
| Symbol   | Name            | Last | Leverage Ratio | Expiry     | Type |
|----------|-----------------|------|----------------|------------|------|
| 24760.HK | UBTENCT@EP2606B | 0.66 | 7.65           | 2026-06-30 | Call |
| 25228.HK | GJTENCT@EP2606B | 0.65 | 7.77           | 2026-06-30 | Call |
| 24687.HK | JPTENCT@EP2606A | 0.65 | 7.77           | 2026-06-30 | Call |
| 24880.HK | CITENCT@EP2606B | 0.64 | 7.89           | 2026-06-30 | Call |
...
```

## Examples

### List all warrants on a stock

```bash
longbridge warrant 700.HK --format json
```

```json
[
  {
    "expiry": "2026-06-30",
    "last": "0.65",
    "leverage_ratio": "7.7846153846153845",
    "name": "UBTENCT@EP2606B",
    "symbol": "24760.HK",
    "type": "Put"
  },
  {
    "expiry": "2026-06-30",
    "last": "0.65",
    "leverage_ratio": "7.7846153846153845",
    "name": "JPTENCT@EP2606A",
    "symbol": "24687.HK",
    "type": "Put"
  },
  {
    "expiry": "2026-06-30",
    "last": "0.64",
    "leverage_ratio": "7.90625",
    "name": "GJTENCT@EP2606B",
    "symbol": "25228.HK",
    "type": "Put"
  }
]
```

Returns all listed warrants for the underlying, including type (Call/Put), last price, leverage ratio, and expiry date. Use the `symbol` field to get a detailed quote.

### Get a quote for one warrant

```bash
longbridge warrant quote 24760.HK --format json
```

```json
[
  {
    "expiry": "2026-06-30",
    "implied_vol": "0.344",
    "last": "0.650",
    "prev_close": "0.640",
    "symbol": "24760.HK",
    "type": "Put"
  }
]
```

Returns the real-time quote including implied volatility alongside the last and previous close prices.

### Look up warrant issuers

```bash
longbridge warrant issuers --format json
```

```json
[
  { "id": "1", "name_cn": "瑞信", "name_en": "CS" },
  { "id": "3", "name_cn": "摩通", "name_en": "JP" },
  { "id": "4", "name_cn": "麦银", "name_en": "MB" },
  { "id": "8", "name_cn": "法兴", "name_en": "SG" }
]
```

Lists all active warrant issuers in the HK market with their IDs and names.

## Requirements

Warrant market data permission is required. Warrant data covers the HK market only. See [Quote Subscriptions](/docs/quote/) for permission details.
