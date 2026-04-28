---
title: 'ah-premium'
sidebar_label: 'ah-premium'
sidebar_position: 16
---

# longbridge ah-premium

View the A/H premium ratio for dual-listed stocks — K-line history or intraday timeshare data.

## Basic Usage

```bash
longbridge ah-premium 939.HK
```

```
| date       | A-share(CNY) | H-share(HKD) | premium | fx_rate  |
|------------|--------------|--------------|---------|----------|
| 2025-11-18 | 9.520        | 8.130        | -21.92% | 0.914300 |
| 2025-11-19 | 9.820        | 8.220        | -23.58% | 0.913000 |
| 2025-11-20 | 9.790        | 8.090        | -24.57% | 0.912800 |
...
```

## Examples

### A/H premium K-line

```bash
longbridge ah-premium 939.HK
longbridge ah-premium 1398.HK --kline-type day --count 100
```

Shows daily A/H premium ratio data. Kline types: `1m`, `5m`, `15m`, `30m`, `60m`, `day`, `week`, `month`, `year`.

### Intraday premium data

```bash
longbridge ah-premium intraday 939.HK
longbridge ah-premium intraday 1398.HK
```

Shows intraday timeshare A/H premium ratio data.

### JSON output

```bash
longbridge ah-premium 939.HK --format json
```

## Notes

Only works for HK stocks that are dual-listed on A-share markets (e.g. 939.HK, 1398.HK). If no data is returned, the stock is not dual-listed.
