---
title: 'order'
sidebar_label: 'order'
sidebar_position: 1
---

# longbridge order

View your orders and trade executions, or submit buy/sell orders directly from the terminal.

## Basic Usage

```bash
longbridge order
```

```
| Order ID           | Symbol  | Side | Order Type | Status        | Qty | Price  | Exec Qty | Exec Price | Created At          |
|--------------------|---------|------|------------|---------------|-----|--------|----------|------------|---------------------|
| 701276261045858304 | TSLA.US | Buy  | LO         | Filled        | 10  | 340.00 | 10       | 339.85     | 2026-04-10 09:32:14 |
| 701276261045858305 | NVDA.US | Sell | LO         | PartialFilled | 20  | 185.00 | 12       | 185.00     | 2026-04-10 09:45:01 |
| 701276261045858306 | AAPL.US | Buy  | MO         | New           | 5   | -      | 0        | -          | 2026-04-10 10:01:33 |
```

## Examples

### View today's orders

```bash
longbridge order
```

Lists all orders placed today with their status, symbol, quantity, price, and order ID.

### Historical orders for a symbol

```bash
longbridge order --history --start 2026-01-01 --symbol TSLA.US
```

Fetches historical orders filtered by symbol and date range. Use `--start` and `--end` to set the date window.

### Submit a limit buy order

```bash
longbridge order buy TSLA.US 10 --price 340.00
```

Places a limit buy order for 10 shares of TSLA at $340.00. The command prompts for confirmation before submitting.

### Submit a limit sell order

```bash
longbridge order sell TSLA.US 5 --price 360.00
```

Places a limit sell order for 5 shares of TSLA at $360.00. The command prompts for confirmation before submitting.

### View trade executions

```bash
longbridge order executions
```

Lists all filled trade executions for the current day, including execution price, quantity, and time.

### View order details

```bash
# Fetch full detail for a specific order
longbridge order detail 701276261045858304
```

Returns execution details, timestamps, and fill information for the order.

### Cancel a pending order

```bash
# Cancel prompts for confirmation before submitting
longbridge order cancel 701276261045858304
```

Only orders in cancellable states (New, PartialFilled, etc.) are accepted. Use `-y` to skip the confirmation prompt in scripts.

### Modify an open order

```bash
# Adjust quantity or price on a pending order
longbridge order replace 701276261045858304 --qty 5 --price 350.00
```

`--qty` is required. Omit `--price` to keep the current limit price. Use `-y` to skip the confirmation prompt in scripts.

## Requirements

OAuth trade permission is required to place, cancel, or replace orders. See the [trade permission setup](/docs/trade/) guide to enable trading access.

## Notes

`buy` and `sell` always prompt for confirmation before submitting. Use `-y` with `cancel` and `replace` to skip confirmation in scripting contexts.
