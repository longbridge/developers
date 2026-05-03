---
title: 'corp-action'
sidebar_label: 'corp-action'
sidebar_position: 12
---

# longbridge corp-action

View corporate actions for a stock — splits, dividends, rights issues, and more.

## Basic Usage

```bash
longbridge corp-action 700.HK
```

```
| date     | date_type | action    | description          |
|----------|-----------|-----------|----------------------|
| 20260601 | Pay Date  | Dividend  | HKD 5.3 per share    |
| 20260518 | Record    | Dividend  | HKD 5.3 per share    |
| 20260515 | Ex-Date   | Dividend  | HKD 5.3 per share    |
| 20260318 |           | Earnings  | FY2025 Q4 Revenue 216.1B, Net Income 64.8B |
...
```

Returns the 30 most recent records by default. Use `--all` to retrieve the full history.

## Examples

### View corporate actions

```bash
longbridge corp-action 700.HK
longbridge corp-action AAPL.US
```

Lists the 30 most recent corporate actions including stock splits, dividend distributions, and rights offerings.

### View full history

```bash
longbridge corp-action 700.HK --all
```

Returns all available corporate action records.

### JSON output

```bash
longbridge corp-action TSLA.US --format json
longbridge corp-action TSLA.US --all --format json
```
