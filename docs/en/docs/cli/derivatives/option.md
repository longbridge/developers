---
title: 'option'
sidebar_label: 'option'
sidebar_position: 1
---

# longbridge option

Look up real-time quotes for US option contracts, browse the full option chain, and view call/put volume statistics.

## Basic Usage

```bash
longbridge option chain AAPL.US
```

```
| Expiry Date |
|-------------|
| 2026-04-17  |
| 2026-04-22  |
| 2026-04-24  |
| 2026-05-01  |
| 2026-05-15  |
| 2026-06-18  |
| 2026-07-17  |
| 2026-09-18  |
...
```

## Examples

### Browse the option chain for a stock

Without `--date`, returns all available expiry dates for the underlying. Pick an expiry date, then pass it with `--date` to see strike prices.

### View strikes for a specific expiry

```bash
longbridge option chain AAPL.US --date 2026-04-17 --format json
```

```json
[
  { "call_symbol": "AAPL260417C110000.US", "put_symbol": "AAPL260417P110000.US", "standard": "true", "strike": "110" },
  { "call_symbol": "AAPL260417C115000.US", "put_symbol": "AAPL260417P115000.US", "standard": "true", "strike": "115" },
  { "call_symbol": "AAPL260417C120000.US", "put_symbol": "AAPL260417P120000.US", "standard": "true", "strike": "120" }
]
```

Each row shows the call and put symbols for that strike. Copy a symbol from `call_symbol` or `put_symbol` to get a live quote.

### Get a real-time quote for an option contract

```bash
longbridge option quote AAPL260417C190000.US --format json
```

```json
[
  {
    "symbol": "AAPL260417C190000.US",
    "last": "12.35",
    "bid": "12.30",
    "ask": "12.40",
    "open_interest": "4821",
    "implied_volatility": "0.2341",
    "delta": "0.4812",
    "gamma": "0.0231",
    "theta": "-0.0512",
    "vega": "0.1843"
  }
]
```

Returns the latest bid, ask, last price, implied volatility, and greeks (delta, gamma, theta, vega) for the given contract.

### Option volume

Real-time call/put volume snapshot for today:

```bash
longbridge option volume AAPL.US
```

```
Option Volume Stats — AAPL.US

| call_vol | put_vol | pc_ratio |
|----------|---------|----------|
| 910,397  | 296,578 | 0.3258   |
```

Historical daily call/put volume and open interest:

```bash
longbridge option volume daily AAPL.US
longbridge option volume daily AAPL.US --count 60
```

```
Option Volume Daily — AAPL.US

| date       | total_vol | call_vol | put_vol | pc_vol   | call_oi   | put_oi    | pc_oi    |
|------------|-----------|----------|---------|----------|-----------|-----------|----------|
| 2026-04-16 | 1,205,125 | 909,133  | 295,992 | 0.325576 | 2,719,025 | 1,913,086 | 0.703593 |
| 2026-04-15 | 1,611,875 | 1,250,894| 360,981 | 0.288578 | 2,684,251 | 1,914,190 | 0.713119 |
```

`pc_vol` is the put/call volume ratio; `pc_oi` is the put/call open interest ratio.

## Requirements

`option quote` requires an options account and options market data permission. `option chain` and `option volume` work with Level 1 quote access. See [Quote Permissions](/docs/quote/) for subscription details.

## Notes

Option symbol format: `AAPL260417C190000.US` — underlying AAPL, expiry 2026-04-17, Call, $190.00 strike. The numeric price component is in units of $0.001, so 190000 = $190.00.
