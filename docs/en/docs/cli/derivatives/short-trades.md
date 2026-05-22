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
Updated: 2026-05-18T04:00:00Z

| date                     | rate%  | nus_amount | ny_amount | total_amount | close   |
|--------------------------|--------|------------|-----------|--------------|---------|
| 2026-05-18T04:00:00Z    | 25.61% | 2,179,682  | 0         | 8,510,570    | 297.840 |
| 2026-05-17T04:00:00Z    | 36.43% | 5,748,485  | 0         | 15,778,974   | 300.230 |
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
| `date` | Trading date (with timezone) |
| `rate%` | Short volume as a percentage of total daily volume |
| `nus_amount` | Short volume on national trading systems (NUS) |
| `ny_amount` | Short volume on NYSE |
| `total_amount` | Total short volume for the day |
| `close` | Closing price for the day |

### View HK daily short sale volume

```bash
longbridge short-trades 700.HK
longbridge short-trades 700.HK --count 30
```

```
Short Trades — 700.HK
Updated: 2026-05-18T16:00:00Z

| date                     | rate%  | amount    | balance          | total_amount | close |
|--------------------------|--------|-----------|------------------|--------------|-------|
| 2026-05-18T16:00:00Z    | 10.65% | 3,592,700 | 1,657,732,820.00 | 33,736,701   | 460.0 |
```

HK field reference:

| Field | Description |
|-------|-------------|
| `date` | Trading date (with timezone) |
| `rate%` | Short volume as a percentage of total daily volume |
| `amount` | Short shares sold for the day |
| `balance` | Outstanding short selling balance (HKD) |
| `total_amount` | Total market shares traded for the day |
| `close` | Closing price for the day |

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
