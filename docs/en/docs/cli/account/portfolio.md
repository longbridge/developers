---
title: 'portfolio'
sidebar_label: 'portfolio'
sidebar_position: 1
---

# longbridge portfolio

Get a full portfolio overview — total P/L, total assets, market value by market (US/HK/CN/SG), and cash balances.

## Basic Usage

```bash
longbridge portfolio
```

```
| Field             | Value     |
|-------------------|-----------|
| Currency          | USD       |
| Total Asset       | 125422.43 |
| Market Cap        | 66783.59  |
| Total Cash        | 58638.84  |
| P/L               | 140473.44 |
| Intraday P/L      | 14637.05  |
| Margin Call       | 0         |
| Risk Level        | Safe      |
| Credit Limit      | 410651.27 |

| Market | Value (USD) | %       |
|--------|-------------|---------|
| US     | 58659.65    | 46.76%  |
| HK     | 493265.25   | 393.28% |
| Cash   | 58638.84    | 46.75%  |
```

## Examples

### View portfolio summary

```bash
longbridge portfolio
longbridge portfolio --format json
```

Displays total asset value, total and today's P/L, and a breakdown of market value per market.

## Requirements

OAuth account permission required. See the [account permission setup](/docs/trade/) guide.
