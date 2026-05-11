---
title: 'operating'
sidebar_label: 'operating'
sidebar_position: 11
---

# longbridge operating

View a company's operating reviews — key financial indicators and management commentary by report period.

:::info
This command only supports Hong Kong stocks.
:::

## Basic Usage

```bash
longbridge operating 700.HK
```

```
Currency: HKD

| period | revenue  | revenue_yoy | net_income | net_income_yoy | eps   | eps_yoy |
|--------|----------|-------------|------------|----------------|-------|---------|
| af *   | 821.7B   | 14.96%      | 245.7B     | 16.98%         | 26.4  | 19.04%  |
| q3     | 605.6B   | 13.98%      | 181.1B     | 16.41%         | 19.47 | 18.88%  |
| saf    | 394.7B   | 14.07%      | 112.0B     | 15.95%         | 12.05 | 19.04%  |
| q1     | 192.8B   | 11.53%      | 51.2B      | 12.81%         | 5.49  | 15.55%  |
...
```

## Examples

### View operating review

```bash
longbridge operating 700.HK
longbridge operating 9988.HK
```

Displays financial indicator tables and management review summaries.

### Filter by report period

```bash
# Annual report
longbridge operating 700.HK --report af
# Q1 report
longbridge operating 700.HK --report q1
```

Supported report types: `af` (annual), `saf` (semi-annual), `q1` (Q1), `q3` (Q3). Multiple types can be comma-separated.

### JSON output

```bash
longbridge operating 700.HK --format json
```
