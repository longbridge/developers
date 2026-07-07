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

### Short sell (no existing position)

```bash
longbridge order sell META.US 1 --price 620.00
```

Submitting a sell order for a symbol with no existing position opens a short. No special flags are required. To close the short, submit a buy order for the same symbol and quantity.

**Market support:**

**US stocks** can be shorted directly with no additional setup.

**HK stocks** require activation: open the Longbridge mobile app, place your first HK short sell order — the app will trigger a Securities Borrowing and Lending (SBL) agreement signing flow. Complete the signing and wait for approval. Note: HK short selling is subject to a fee levied by the Hong Kong Inland Revenue Department; details are described in the in-app agreement. The API returns error `602301` before the HK SBL agreement is signed.

**A-share (SH/SZ)** short selling is not supported — the CLI does not support Northbound (Stock Connect) trading.

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

### View attached child order (US accounts)

```bash
longbridge order detail 701276261045858304 --attached
```

Fetches the order detail along with its attached child order (e.g. bracket or OCO orders). US accounts only.

### Filter US orders by status and side

```bash
# Pending orders only
longbridge order --status pending

# Filled buy orders
longbridge order --status history --action buy
```

:::info US Accounts
For US data-center accounts, `order` routes to the US API automatically. Use `--status` and `--action` to filter US order history. These flags are ignored for non-US accounts.
:::

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

## Options

| Option | Description | Default |
| ------ | ----------- | ------- |
| `--status` | Filter orders: `pending` \| `history` \| `all` (US accounts) | all |
| `--action` | Filter by side: `buy` \| `sell` (US accounts) | — |
| `--attached` | Show attached child order in `order detail` (US accounts) | false |

## Requirements

OAuth trade permission is required to place, cancel, or replace orders. See the [trade permission setup](/docs/trade/) guide to enable trading access.

## Notes

`buy` and `sell` always prompt for confirmation before submitting. Use `-y` with `cancel` and `replace` to skip confirmation in scripting contexts.
