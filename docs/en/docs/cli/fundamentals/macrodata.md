---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 5
---

# longbridge macrodata

Query macroeconomic indicators and historical data. This is the indicator-dimension counterpart of `finance-calendar macrodata`: the same underlying data, organized by indicator instead of by release date.

## Basic usage

```bash
# List all indicators
longbridge macrodata

# Filter by country and keyword
longbridge macrodata --country US --keyword CPI

# Query historical data for a single indicator
longbridge macrodata US00175 --start 2024-01-01 --limit 12
```

## Examples

### List all macroeconomic indicators

```bash
longbridge macrodata
longbridge macrodata --country US
longbridge macrodata --keyword CPI --country US
```

Output includes indicator code, name, category, country/region, release periodicity, and importance rank (1–3 stars).

### Query historical releases

```bash
longbridge macrodata 61744 --start 2024-01-01 --limit 12 --format json
```

Returns actual, forecast, and previous values for each historical release of the indicator.

## Common options

| Option | Description |
| ------ | ----------- |
| `--country HK\|CN\|US\|EU\|JP\|SG` | List only indicators for the specified country/region |
| `--keyword <KEYWORD>` | Filter indicators by keyword in their names |
| `--start` / `--end` | Date range for historical data (YYYY-MM-DD) |
| `--limit` / `--page` | Pagination; default 20 per page |
| `--lang zh-CN\|en` | Language for indicator names and descriptions |
| `--format json` | Structured output for scripting or AI agents |
