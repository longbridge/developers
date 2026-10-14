---
title: 'short-trades'
sidebar_label: 'short-trades'
sidebar_position: 4
---

# longbridge short-trades

Daily short sale volume — unlike `short-positions` (outstanding balance), this command shows the actual short selling transactions that occurred each day. Supports US stocks (FINRA/Nasdaq) and HK stocks (HKEX). Market is auto-detected from the symbol suffix.

<QuotePermission command="short-trades" />

## Basic Usage

```bash
longbridge short-trades AAPL.US
```

```
Short Trades — AAPL.US

| date       | nas_short | ny_short | total_vol  | rate%  | close   |
|------------|-----------|----------|------------|--------|---------|
| 2026-05-22 | 3,809,598 | 0        | 10,564,290 | 36.06% | 308.820 |
| 2026-05-21 | 3,485,781 | 0        | 9,375,861  | 37.18% | 304.990 |
```

## Examples

### View US daily short sale volume

```bash
longbridge short-trades AAPL.US
longbridge short-trades AAPL.US --count 30
```

US field reference:

| Field | Description |
|-------|-------------|
| `date` | Trading date (`YYYY-MM-DD`) |
| `nas_short` | Short volume on Nasdaq/national trading systems |
| `ny_short` | Short volume on NYSE |
| `total_vol` | Total short volume for the day |
| `rate%` | Short volume as a percentage of total daily volume |
| `close` | Closing price for the day |

### US JSON output

```bash
longbridge short-trades AAPL.US --format json
```

```json
{
  "symbol": "AAPL.US",
  "data": [
    {
      "close": "308.820",
      "nus_amount": "3809598",
      "ny_amount": "0",
      "rate": "0.3606",
      "timestamp": "1779422400",
      "total_amount": "10564290"
    }
  ],
  "sources": 1
}
```

JSON field reference (US):

| Field | Description |
|-------|-------------|
| `symbol` | Symbol in `CODE.MARKET` format |
| `data[].timestamp` | Trading date as Unix timestamp (seconds) |
| `data[].nus_amount` | Short volume on national trading systems (NUS/Nasdaq) |
| `data[].ny_amount` | Short volume on NYSE |
| `data[].total_amount` | Total short volume for the day |
| `data[].rate` | Short volume as a ratio (e.g. `"0.3606"` = 36.06%) |
| `data[].close` | Closing price for the day |

### View HK daily short sale volume

```bash
longbridge short-trades 700.HK
longbridge short-trades 700.HK --count 30
```

```
Short Trades — 700.HK

| date       | rate%  | short_shares | balance          | total_vol  | close |
|------------|--------|--------------|------------------|------------|-------|
| 2026-05-21 | 8.16%  | 1,957,600    | 865,793,700.00   | 23,998,219 | 441.4 |
```

HK field reference:

| Field | Description |
|-------|-------------|
| `date` | Trading date (`YYYY-MM-DD`) |
| `short_shares` | Short shares sold for the day |
| `balance` | Outstanding short selling balance (HKD) |
| `total_vol` | Total market shares traded for the day |
| `rate%` | Short volume as a percentage of total daily volume |
| `close` | Closing price for the day |

### HK JSON output

```bash
longbridge short-trades 700.HK --format json
```

```json
{
  "symbol": "700.HK",
  "data": [
    {
      "amount": "1957600",
      "balance": "865793700.00",
      "close": "441.4",
      "rate": "0.0816",
      "timestamp": "1779379200",
      "total_amount": "23998219"
    }
  ]
}
```

JSON field reference (HK):

| Field | Description |
|-------|-------------|
| `symbol` | Symbol in `CODE.MARKET` format |
| `data[].timestamp` | Trading date as Unix timestamp (seconds) |
| `data[].amount` | Short shares sold for the day |
| `data[].balance` | Outstanding short selling balance (HKD) |
| `data[].total_amount` | Total market shares traded for the day |
| `data[].rate` | Short volume ratio (e.g. `"0.0816"` = 8.16%) |
| `data[].close` | Closing price for the day |

### Difference from short-positions

- `short-trades`: actual short sale transactions that happened each day (flow)
- `short-positions`: outstanding short position balance at a point in time (stock), updated bi-monthly for US stocks

## Options

| Flag | Description |
|------|-------------|
| `--count` | Number of records (1–100, default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Requirements

- US: US market data subscription required.
- HK: HK market data subscription required.
