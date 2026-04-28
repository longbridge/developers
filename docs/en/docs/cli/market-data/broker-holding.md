---
title: 'broker-holding'
sidebar_label: 'broker-holding'
sidebar_position: 15
---

# longbridge broker-holding

View broker holding positions for HK-listed stocks — top buyers/sellers, full detail list, and daily history per broker.

## Basic Usage

```bash
longbridge broker-holding 700.HK
```

```
Broker Holding Top (updated: 2026.04.10)

Buy:
| broker                              | parti_no | change(shares) |
|-------------------------------------|----------|----------------|
| ABN AMRO Clearing Hong Kong Limited | B01555   | +1,481,964     |
| Merrill Lynch Far East Limited      | B01224   | +1,145,214     |
| UBS Securities Hong Kong Limited    | B01161   | +903,134       |
...

Sell:
| broker           | parti_no | change(shares) |
|------------------|----------|----------------|
| HSBC             | C00019   | -4,325,085     |
...
```

## Examples

### Top broker holdings

```bash
longbridge broker-holding 700.HK
longbridge broker-holding 9988.HK --period rct_5
```

Shows top buying and selling brokers. Period options: `rct_1` (1 day, default), `rct_5` (5 days), `rct_20` (20 days), `rct_60` (60 days).

### Full broker detail list

```bash
longbridge broker-holding detail 700.HK
longbridge broker-holding detail 9988.HK
```

Lists all brokers with their holding positions.

### Daily history for a specific broker

```bash
longbridge broker-holding daily 700.HK --broker B01224
```

Shows daily holding changes for a specific broker identified by participant number.

### JSON output

```bash
longbridge broker-holding 700.HK --format json
```

## Notes

HK market only. US and other markets are not supported.
