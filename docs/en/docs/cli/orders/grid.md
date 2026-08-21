---
title: 'grid'
sidebar_label: 'grid'
sidebar_position: 1.5
---

# longbridge grid

Manage grid trading strategy orders from the terminal — submit a grid, inspect running grids and their triggers, and suspend, restart, replace, or cancel them.

## Basic Usage

```bash
# List your grid orders
longbridge grid
```

```
| Order ID           | Symbol  | Status     | Base   | Range         | Trigger   | Qty | Triggers | Currency |
|--------------------|---------|------------|--------|---------------|-----------|-----|----------|----------|
| 764609681686573056 | 700.HK  | Performing | 300.00 | 240.00–360.00 | ±2%       | 100 | 3        | HKD      |
```

## Examples

### Prepare

```bash
# Record the one-time strategy risk-disclosure consent (required before grid trading)
longbridge grid questionnaire
# Show a symbol's grid info: lot size, last price, authorization, currency
longbridge grid info 700.HK
```

### Submit a grid

```bash
# Percent-triggered grid on 700.HK
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# Validate the rule without submitting
longbridge grid submit 700.HK --currency HKD --base-price 300 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc --dry-run
```

### Inspect

```bash
# Filter the list by symbol / status
longbridge grid --symbol 700.HK --status Performing
# Query specific grids by ID
longbridge grid --ids 764609681686573056 764609681686573057
# Grid detail: rule, sub-orders, and lifecycle history
longbridge grid detail 764609681686573056
# Trigger history for a grid
longbridge grid triggers 764609681686573056
```

### Manage a running grid

```bash
# Modify the grid rule (same flags as submit)
longbridge grid replace 764609681686573056 --base-price 305 --upper-price 360 --lower-price 240 \
  --trigger-type percent --trigger-up 2 --trigger-down 2 \
  --quantity 100 --upper-quantity 200 --lower-quantity 100 --order-type GMO --tif gtc
# Suspend a running grid (kept, can be restarted)
longbridge grid suspend 764609681686573056
# Restart a suspended grid
longbridge grid restart 764609681686573056
# Cancel a grid (permanent)
longbridge grid cancel 764609681686573056
```

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--symbol` | Filter the list by security symbol (e.g. `700.HK`) | — |
| `--status` | Filter the list by status, comma-joined (e.g. `Performing,Suspended`) | — |
| `--market` | Filter the list by market: `US` \| `HK` \| `CN` \| `SG` | — |
| `--ids` | Query specific grid orders by ID | — |
| `--currency` | Settlement currency for `submit` (e.g. `HKD`) | — |
| `--base-price` / `--upper-price` / `--lower-price` | Grid base price and upper/lower bounds | — |
| `--trigger-type` | Trigger interpretation: `percent` \| `spread` | — |
| `--trigger-up` / `--trigger-down` | Up/down trigger, read as percent or spread per `--trigger-type` | — |
| `--quantity` | Quantity per trigger | — |
| `--upper-quantity` / `--lower-quantity` | Quantity handled at the upper/lower bound | — |
| `--order-type` | Order type applied to both sides: `GMO` \| `GLO` \| `GTG` (`--order-type-up` / `--order-type-down` override) | — |
| `--tif` | Time in force: `day` \| `gtc` \| `gtd` | — |
| `--dry-run` | Validate and print the rule without submitting | false |

## Requirements

OAuth trade permission is required to submit or manage grid orders. Before your first grid order, run `longbridge grid questionnaire` once to record the strategy risk-disclosure consent (also visible as the authorization flag in `longbridge grid info`). See the [grid trading](/docs/trade/grid/overview) reference for the full rule and field definitions.

## Notes

`submit`, `replace`, and `cancel` affect live capital and prompt for confirmation before running. Use `--dry-run` on `submit` to validate a rule safely.
