---
title: 'calc-index'
sidebar_label: 'calc-index'
sidebar_position: 8
---

# longbridge calc-index

Compute financial indexes for any symbol — P/E, P/B, dividend yield, turnover rate, options greeks, and more.

## Basic Usage

```bash
longbridge calc-index TSLA.US
```

```
| Symbol  | PE TTM | PB    | DPS Rate | Turnover Rate | Total Market Value  |
|---------|--------|-------|----------|---------------|---------------------|
| TSLA.US | 341.83 | 15.79 | -        | 2.21          | 1296915542310.08    |
```

## Examples

### Check P/E and P/B ratios

```bash
longbridge calc-index TSLA.US NVDA.US --index pe pb
longbridge calc-index TSLA.US NVDA.US --index pe pb --format json
```

Calculates the specified indexes for each symbol. Multiple symbols and multiple indexes can be requested in a single call. Only indexes that have data appear in the JSON output — indexes with no value are omitted.

### Default indexes (PE, PB, dividend yield, turnover rate, market cap)

```bash
longbridge calc-index TSLA.US
```

When `--index` is omitted, the default set is returned: `pe`, `pb`, `dps_rate`, `turnover_rate`, `total_market_value`.

### Options greeks for a derivative

```bash
longbridge calc-index 24760.HK --index delta gamma vega theta
```

For options and warrants, request greeks directly. Only indexes applicable to the instrument type will appear in the output. Greek values are only meaningful for option/warrant symbols — passing a plain stock symbol returns no greek data.

## Notes

Full list of supported index names: `last_done`, `change_value`, `change_rate`, `volume`, `turnover`, `ytd_change_rate`, `turnover_rate`, `total_market_value`, `capital_flow`, `amplitude`, `volume_ratio`, `pe` (alias: `pe_ttm`), `pb`, `dps_rate` (alias: `dividend_yield`), `five_day_change_rate`, `ten_day_change_rate`, `half_year_change_rate`, `five_minutes_change_rate`, `implied_volatility`, `delta`, `gamma`, `theta`, `vega`, `rho`, `open_interest`, `expiry_date`, `strike_price`.

Unknown index names are silently ignored — double-check spelling if an expected field is missing from the output.
