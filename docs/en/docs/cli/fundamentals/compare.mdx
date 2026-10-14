---
title: 'compare'
sidebar_label: 'compare'
sidebar_position: 18
---

# longbridge compare

Cross-stock valuation comparison (PE/PB/PS/market cap/close price/ROE). When no comparison symbols are specified, the server automatically selects peers from the same industry.

## Basic Usage

```bash
longbridge compare AAPL.US
```

```
Valuation Comparison

| symbol  | name      | market_value | close    | pe    | pb    | ps    | roe    |
|---------|-----------|--------------|----------|-------|-------|-------|--------|
| AAPL.US | Apple     | $3.01T       | 205.10   | 31.2  | 45.2  | 7.8   | 136.5% |
| MSFT.US | Microsoft | $3.12T       | 420.30   | 35.8  | 12.1  | 12.3  | 35.2%  |
```

When no peers are specified, the system automatically selects representative stocks from the same industry.

## Examples

### Auto-select industry peers

```bash
longbridge compare AAPL.US
```

The system selects industry peers automatically based on the sector classification of the primary symbol.

### Specify comparison symbols

```bash
longbridge compare AAPL.US MSFT.US GOOGL.US
```

Supports up to 5 stocks (including the primary symbol) for side-by-side comparison.

### HK stocks with currency conversion

```bash
longbridge compare 700.HK 9988.HK --currency HKD
```

Use `--currency` to unify market cap and price units when comparing across markets.

### JSON output

```bash
longbridge compare TSLA.US RIVN.US --format json
```

## Options

| Flag | Description |
|------|-------------|
| `symbol` | Primary symbol (required) |
| `[others...]` | Comparison symbols (optional, up to 4) |
| `--currency` | Normalise to a single currency: `USD`, `HKD`, or `CNY` |
| `--format` | Output format: `table` (default) or `json` |

## Notes

- When comparing across markets (e.g. US vs HK), use `--currency` to avoid FX distortions
- PE, PB, PS use TTM (trailing twelve months) data
- ROE is based on the most recent reporting period
