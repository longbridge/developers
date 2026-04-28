---
title: 'static'
sidebar_label: 'static'
sidebar_position: 7
---

# longbridge static

Get static reference data for any symbol — name, exchange, currency, lot size, shares outstanding, EPS, BPS, and dividend yield.

## Basic Usage

```bash
longbridge static TSLA.US
```

```
| Symbol  | Name        | Exchange | Currency | Lot Size | Total Shares | Circ. Shares | EPS    | EPS TTM | BPS    | Dividend |
|---------|-------------|----------|----------|----------|--------------|--------------|--------|---------|--------|----------|
| TSLA.US | Tesla, Inc. | NASD     | USD      | 1        | 3752431984   | 2812676349   | 1.0111 | 1.0111  | 21.889 | 0        |
```

## Examples

### Look up multiple symbols at once

```bash
longbridge static NVDA.US TSLA.US
longbridge static NVDA.US TSLA.US --format json
```

Returns reference data for all requested symbols in one call. Useful for quick comparison of fundamental attributes.

### Verify a symbol before trading

```bash
longbridge static 700.HK
```

Confirms the symbol is valid and shows its exchange, currency, lot size, and current share count — handy before placing a trade.
