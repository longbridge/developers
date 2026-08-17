---
title: 'constituent'
sidebar_label: 'constituent'
sidebar_position: 13
---

# longbridge constituent

View constituent stocks of an index or ETF — with sorting options and rise/fall statistics.

<QuotePermission command="constituent" />

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

### View ETF holdings

```bash
longbridge constituent IVV.US
longbridge constituent QQQ.US --limit 20
```

For ETF symbols, `constituent` switches to portfolio holdings instead of index constituents:

- **US ETFs** — the complete portfolio is fetched from SEC EDGAR N-PORT filings by default, with each holding's name, CUSIP, weight, shares, and market value:

```
ETF Holdings — IVV.US (iShares Core S&P 500 ETF)
Source: SEC N-PORT, report period 2026-03-31, filed 2026-05-28, 507 holdings

| #  | name           | cusip     | weight | shares      | value(USD)     |
|----|----------------|-----------|--------|-------------|----------------|
| 1  | NVIDIA Corp.   | 67066G104 | 7.564% | 312,526,688 | 54,504,654,387 |
| 2  | Apple, Inc.    | 037833100 | 6.650% | 188,816,321 | 47,919,694,106 |
...
... and 457 more (use --limit 0 for all)
```

- **Other ETFs** (or when SEC data is unavailable, e.g. UIT-structured funds like `SPY.US`) — falls back to the platform's asset-allocation breakdown, shown as four grouped tables: Holdings, Regional, Asset Class, and Industry.

Notes:

- N-PORT data is a fiscal-quarter-end snapshot filed with up to ~60 days' delay — authoritative but not real-time
- `--limit` caps the holdings rows; `--limit 0` shows all; `--sort` / `--order` are ignored for pre-ranked holdings data
- Index symbols (e.g. `HSI.HK`, `.SPX.US`) behave exactly as before

### JSON output

```bash
longbridge constituent HSI.HK --format json
# ETF holdings as structured JSON (full untruncated list)
longbridge constituent IVV.US --format json
```
