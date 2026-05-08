---
title: 'analyst-estimates'
sidebar_label: 'analyst-estimates'
sidebar_position: 12
---

# longbridge analyst-estimates

View historical and forward EPS analyst consensus estimates for a stock, including high/low/mean/median and the number of covering analysts.

## Basic Usage

```bash
longbridge analyst-estimates TSLA.US
```

```
estimate:
| currency | day        | high | low  | mean | median | num | value |
|----------|------------|------|------|------|--------|-----|-------|
| USD      | 2026-03-31 | 0.24 | 0.07 | 0.15 | 0.13   | 8   |       |
| USD      | 2026-06-30 | 0.38 | 0.09 | 0.21 | 0.18   | 8   |       |
| USD      | 2026-09-30 | 0.48 | 0.14 | 0.29 | 0.26   | 8   |       |
| USD      | 2026-12-31 | 0.58 | 0.14 | 0.35 | 0.32   | 7   |       |
...
```

When `value` is filled, the actual reported EPS is available. Empty means the period has not yet been reported.

## Examples

### EPS estimates

```bash
longbridge analyst-estimates TSLA.US
longbridge analyst-estimates AAPL.US
longbridge analyst-estimates NVDA.US
```

Returns the analyst EPS consensus across past and future periods, with dispersion (high/low) and coverage count.

### JSON output

```bash
longbridge analyst-estimates TSLA.US --format json
```

Returns the full estimate series as JSON for programmatic use.
