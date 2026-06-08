---
title: 'Stock Screener'
sidebar_label: 'screener'
sidebar_position: 4
slug: '/cli/quant/screener'
---

# Stock Screener

The `screener` command lets you list saved strategies, run a strategy to get matching stocks, apply ad-hoc filters, and browse all available indicator definitions.

<TipContainer type="tip">

**Try it on the web** — All strategies and filter conditions shown below are also available interactively in the [Stock Screener](https://longbridge.com/screener). Try building a filter there first, then automate it with the CLI.

</TipContainer>

## screener strategies

List platform-recommended or your own saved screener strategies.

```bash
# Recommended strategies for the US market (default)
longbridge screener strategies

# Recommended strategies for Hong Kong
longbridge screener strategies --market HK

# Your own saved strategies
longbridge screener strategies --mine
```

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `--market US\|HK\|CN\|SG` | `US` | Market to list strategies for |
| `--mine` | — | Show your own strategies instead of recommended ones |
| `--format json` | — | Output raw JSON |

## screener run \<ID\>

Run a saved strategy and list the stocks that match.

```bash
# Run strategy 42 with defaults
longbridge screener run 42

# Paginate: second page, 50 records per page
longbridge screener run 42 --page 1 --count 50

# Show specific columns
longbridge screener run 42 --show pettm --show pbmrq
```

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `--page N` | `0` | Zero-based page number |
| `--count N` | `20` | Records per page |
| `--sort KEY` | `prevchg` | Column to sort by |
| `--order asc\|desc` | `desc` | Sort direction |
| `--show KEY` | — | Extra column to display (repeatable) |
| `--format json` | — | Output raw JSON |

Default output columns: `prevclose`, `prevchg`, `marketcap`, `salesgrowthyoy`, `pettm`, `pbmrq`, `industry`.

Default sort is `prevchg` descending (top movers first).

**JSON output format** (numeric values, no `filter_` prefix on keys):

```json
{
  "total": 87,
  "page": 0,
  "items": [
    {
      "symbol": "AAPL.US",
      "name": "Apple Inc.",
      "prevchg": 1.24,
      "pettm": 28.5,
      "pbmrq": 45.2,
      "marketcap": 3241500000000
    }
  ]
}
```

## screener filter

Run an ad-hoc screen without a saved strategy. Specify one or more filter conditions directly on the command line.

```bash
# Stocks with P/E between 10 and 50 and ROE above 5% in HK
longbridge screener filter pettm:10:50 roe:5: --market HK

# US stocks with market cap above $100 bn, second page
longbridge screener filter marketcap:100: --market US --page 1 --count 50

# MACD golden-cross stocks in HK (technical indicator with extra parameters)
longbridge screener filter 'macd_day:::category=goldenfork,period=day' --market HK
```

**Condition format:** `KEY:MIN:MAX` or `KEY:MIN:MAX:k=v,k=v` for technical indicators.

- `KEY` — indicator key from `screener indicators` (without `filter_` prefix)
- `MIN` — lower bound (leave empty for no lower bound)
- `MAX` — upper bound (leave empty for no upper bound)
- `k=v,...` — extra key-value parameters for technical indicators

| Flag | Default | Description |
| ---- | ------- | ----------- |
| `--market US\|HK\|CN` | `US` | Market to screen |
| `--sort KEY` | `prevchg` | Column to sort by |
| `--order asc\|desc` | `desc` | Sort direction |
| `--show KEY` | — | Extra column to display (repeatable) |
| `--page N` | `0` | Zero-based page number |
| `--count N` | `20` | Records per page |
| `--format json` | — | Output raw JSON |

## screener indicators

List all indicator definitions supported by the screener.

```bash
longbridge screener indicators
longbridge screener indicators --format json
```

**JSON output** is a flat array (no nested groups) with `filter_` prefix stripped from keys:

```json
[
  {
    "id": 1,
    "key": "marketcap",
    "name": "Market Cap",
    "unit": "bn",
    "min": "0",
    "max": "",
    "tech_values": {}
  },
  {
    "id": 29,
    "key": "divyld",
    "name": "Dividend Yield (TTM)",
    "unit": "%",
    "min": "0",
    "max": "100",
    "tech_values": {}
  }
]
```
