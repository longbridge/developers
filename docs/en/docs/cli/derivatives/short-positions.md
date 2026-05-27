---
title: 'short-positions'
sidebar_label: 'short-positions'
sidebar_position: 3
---

# longbridge short-positions

Short selling position data — short ratio, short share count, and related metrics. Supports both HK and US stocks; the market is auto-detected from the symbol suffix.

- **HK**: HKEX daily data
- **US**: FINRA bi-monthly data


<QuotePermission command="short-positions" />

## Basic Usage

```bash
longbridge short-positions TSLA.US
```

```
Short Selling Data — TSLA.US

| date       | rate% | short_shares | avg_daily_vol | days_cover | close   |
|------------|-------|--------------|---------------|------------|---------|
| 2026-03-31 | 1.75% | 65,598,603   | 62,121,644    | 1.06       | 371.750 |
| 2026-03-13 | 1.62% | 60,860,404   | 60,676,562    | 1.00       | 391.200 |
| 2026-02-27 | 1.65% | 61,839,735   | 51,533,435    | 1.20       | 402.510 |
```

## Examples

### View US short interest history

```bash
longbridge short-positions TSLA.US
longbridge short-positions AAPL.US --count 50
```

Returns up to 100 records newest first. Each row shows the settlement date, short ratio (short shares ÷ float), number of short shares, average daily volume, days-to-cover ratio, and closing price.

### View HK short positions

```bash
longbridge short-positions 700.HK
longbridge short-positions 700.HK --count 30
```

```
Short Positions — 700.HK

| date       | rate% | amount       | balance          | close  |
|------------|-------|--------------|------------------|--------|
| 2026-05-19 | 1.45% | 2,748,900    | 1,256,859,880.00 | 455.20 |
```

HK fields: settlement date, short ratio, daily short sale amount, outstanding balance, and closing price.

### Machine-readable output

```bash
longbridge short-positions NVDA.US --format json
```

```json
[
  {
    "date": "2026-03-31",
    "rate": "0.0175",
    "short_shares": "65598603",
    "avg_daily_vol": "62121644",
    "days_cover": "1.06",
    "close": "371.750"
  }
]
```

## Options

| Flag | Description |
|------|-------------|
| `--count` | Number of records (1–100, default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Requirements

- US: US market data subscription required. Only works for US-listed stocks and ETFs.
- HK: HK market data subscription required.
