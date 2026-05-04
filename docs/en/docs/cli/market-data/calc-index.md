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
longbridge calc-index TSLA.US NVDA.US --fields pe,pb
longbridge calc-index TSLA.US NVDA.US --fields pe,pb --format json
```

Calculates the specified indexes for each symbol. Multiple symbols and multiple indexes can be requested in a single call. Only indexes that have data appear in the JSON output — indexes with no value are omitted.

### Default indexes (PE, PB, dividend yield, turnover rate, market cap)

```bash
longbridge calc-index TSLA.US
```

When `--fields` is omitted, the default set is returned: `pe`, `pb`, `dps_rate`, `turnover_rate`, `mktcap`.

### Options greeks for a derivative

```bash
longbridge calc-index 24760.HK --fields delta,gamma,vega,theta
```

For options and warrants, request greeks directly. Only indexes applicable to the instrument type will appear in the output. Greek values are only meaningful for option/warrant symbols — passing a plain stock symbol returns no greek data.

## Notes

Full list of supported field names:

**General:** `last_done`, `change_value`, `change_rate`, `vol`, `turnover`, `ytd_change_rate`, `turnover_rate`, `mktcap`, `capital_flow`, `amplitude`, `volume_ratio`, `pe`, `pb`, `dps_rate`, `five_day_change_rate`, `ten_day_change_rate`, `half_year_change_rate`, `five_minutes_change_rate`

**Options / Warrants:** `iv`, `delta`, `gamma`, `theta`, `vega`, `rho`, `oi`, `exp`, `strike`, `upper_strike_price`, `lower_strike_price`, `outstanding_qty`, `outstanding_ratio`, `premium`, `itm_otm`, `warrant_delta`, `call_price`, `to_call_price`, `effective_leverage`, `leverage_ratio`, `conversion_ratio`, `balance_point`

Unknown field names are silently ignored — double-check spelling if an expected field is missing from the output.
