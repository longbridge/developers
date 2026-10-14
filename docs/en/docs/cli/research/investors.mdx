---
title: 'investors'
sidebar_label: 'investors'
sidebar_position: 3
---

# longbridge investors

Browse active institutional fund managers ranked by AUM (from [SEC 13F filings](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F&dateb=&owner=include&count=40)), and drill into any manager's current holdings.

## Basic Usage

```bash
longbridge investors
```

```
| #  | name                              | AUM      | period      | cik        |
|----|-----------------------------------|----------|-------------|------------|
| 1  | Capital International Investors   | $637.97B | 31-DEC-2025 | 0001562230 |
| 2  | Capital Research Global Investors | $541.73B | 31-DEC-2025 | 0001422848 |
| 3  | CTC LLC                           | $404.44B | 31-DEC-2025 | 0001445893 |
| 4  | BERKSHIRE HATHAWAY INC            | $274.16B | 31-DEC-2025 | 0001067983 |
| 5  | DODGE & COX                       | $185.26B | 31-DEC-2025 | 0000200217 |
...
```

## Examples

### Browse top fund managers

Lists the largest institutional investors ranked by AUM, with their CIK identifier, name, reported AUM, and the period of the latest [13F filing](https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=13F&dateb=&owner=include&count=40).

### View a fund manager's holdings

```bash
# Use the CIK from the investors list to drill into holdings
longbridge investors 0001067983
longbridge investors 0001067983 --format json
```

```
BERKSHIRE HATHAWAY INC (period: 2025-12-31)
Portfolio: 42 positions, total value ~$274.16B

| company               | value   | shares  | weight |
|-----------------------|---------|---------|--------|
| APPLE INC             | $61.96B | 227.92M | 22.6%  |
| AMERICAN EXPRESS CO   | $56.09B | 151.61M | 20.5%  |
| BANK AMERICA CORP     | $28.45B | 517.30M | 10.4%  |
| COCA COLA CO          | $27.96B | 400.00M | 10.2%  |
| CHEVRON CORP NEW      | $19.84B | 130.16M | 7.2%   |
...
```

Pass a CIK to see the full list of equity positions reported by that fund manager. CIK `0001067983` is Berkshire Hathaway.

### Compare position changes between filings

```bash
# Changes between the two most recent filings
longbridge investors changes 0001067983
# Compare against a specific base period
longbridge investors changes 0001067983 --from 2024-09-30
```

```
BERKSHIRE HATHAWAY INC — changes vs 2024-09-30

| action  | company                | shares_change | value_change | current_shares | current_value |
|---------|------------------------|---------------|--------------|----------------|---------------|
| NEW     | CONSTELLATION BRANDS   | +5.21M        | +$1.24B      | 5.21M          | $1.24B        |
| ADDED   | SIRIUS XM HOLDINGS INC | +57.83M       | +$1.52B      | 144.42M        | $3.80B        |
| REDUCED | CHEVRON CORP NEW       | -12.50M       | -$1.93B      | 130.16M        | $19.84B       |
| EXITED  | FLOOR & DECOR HLDGS    | -3.97M        | -$414.30M    | 0              | $0            |
...
```

Shows NEW positions, ADDED (increased), REDUCED (decreased), and EXITED positions between two filing periods. Defaults to comparing the latest filing against the previous one.
