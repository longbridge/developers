---
title: 'macrodata'
sidebar_label: 'macrodata'
sidebar_position: 20
---

# longbridge macrodata

Browse macrodata indicators and their historical release data — covering US, HK, CN, EU, JP, and SG markets.

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
Total: 441
Code   Name              Category    Country   Frequency   Source
61744  Non-Farm Payroll  Employment  US        Monthly     Bureau of Labor Statistics
...
```

### Filter by country

```bash
longbridge macrodata --country US
longbridge macrodata --country HK
longbridge macrodata --country CN
```

Supported country codes: `HK`, `CN`, `US`, `EU`, `JP`, `SG`.

### Search by keyword

```bash
longbridge macrodata --keyword CPI
longbridge macrodata --keyword CPI --country US
```

### Paginate the list

```bash
longbridge macrodata --country US --limit 50 --page 2
```

### Historical releases for a specific indicator

```bash
longbridge macrodata 61744
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
longbridge macrodata 61744 --start 2024-01-01 --end 2024-12-31
```

### JSON output for AI / scripting

```bash
# List as JSON
longbridge macrodata --format json

# History as JSON
longbridge macrodata 61744 --format json
```

**List JSON structure:**

```json
{
  "count": 619,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "list": [
    {
      "indicator_code": "61744",
      "country": "US",
      "name": "Non-Farm Payroll",
      "periodicity": "Monthly",
      "importance": 3
    }
  ]
}
```

**History JSON structure:**

```json
{
  "count": 24,
  "page": 1,
  "limit": 20,
  "has_more": true,
  "info": {
    "indicator_code": "61744",
    "country": "US",
    "name": "Non-Farm Payroll",
    "periodicity": "Monthly",
    "importance": 3
  },
  "data": [
    {
      "period": "2026-05-01",
      "release_at": 1781094600,
      "actual_value": "272000",
      "previous_value": "265000",
      "forecast_value": "250000",
      "unit": "Thousand"
    }
  ]
}
```

:::tip
`actual_value` is empty when the data has not yet been released (only `forecast_value` is available). `has_more: true` means additional pages exist — use `--page` to paginate.
:::

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--country` | Filter list: `HK` \| `CN` \| `US` \| `EU` \| `JP` \| `SG` | All |
| `--keyword` | Server-side keyword search on indicator name (list mode only) | — |
| `--start` | History start date `YYYY-MM-DD` | — |
| `--end` | History end date `YYYY-MM-DD` | — |
| `--lang` | Language for names/descriptions: `zh-CN` \| `en` | — |
| `--limit` | Max records per page (list: max 1000, history: max 100) | 20 |
| `--page` | Page number, 1-based | 1 |
| `--format` | `table` or `json` | `table` |
