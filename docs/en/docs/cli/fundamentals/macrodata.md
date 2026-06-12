---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 20
---

# longbridge macrodata

Browse macroeconomic indicators and their historical release data — covering US, HK, CN, EU, JP, and SG markets.

## Modes

| Mode | Usage | Description |
| ---- | ----- | ----------- |
| List | `longbridge macrodata` | List all available indicators |
| History | `longbridge macrodata <CODE>` | Historical releases for one indicator |

## Examples

### List all indicators

```bash
longbridge macrodata
```

```
Total: 619
Code     Name                    Category    Country   Frequency   Source
US00175  Non-Farm Payroll        Employment  US        Monthly     Bureau of Labor Statistics
US00176  Unemployment Rate       Employment  US        Monthly     Bureau of Labor Statistics
...
```

### Filter by country

```bash
longbridge macrodata --country US
longbridge macrodata --country HK
longbridge macrodata --country CN
```

Supported country codes: `HK`, `CN`, `US`, `EU`, `JP`, `SG`.

### Paginate the list

```bash
longbridge macrodata --country US --limit 50 --page 2
```

### Historical releases for a specific indicator

```bash
longbridge macrodata US00175
```

```
Non-Farm Payroll  [Employment | Bureau of Labor Statistics · Monthly]

Period      Actual   Forecast  Previous  Revised   Unit
2026-05-01  272000   250000    265000    263500    Thousand
2026-04-01  228000   137000    228000    228000    Thousand
...
```

### Filter history by date range

```bash
longbridge macrodata US00175 --start 2024-01-01 --end 2024-12-31
```

### JSON output for AI / scripting

```bash
# List as JSON
longbridge macrodata --format json

# History as JSON
longbridge macrodata US00175 --format json
```

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--country` | Filter list: `HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | All |
| `--start` | History start date `YYYY-MM-DD` | — |
| `--end` | History end date `YYYY-MM-DD` | — |
| `--limit` | Max records (list: max 1000, history: max 100) | 1000 (list) / 20 (history) |
| `--page` | Page number, 1-based | 1 |
| `--format` | `table` or `json` | `table` |
