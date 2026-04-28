---
title: 'dca'
sidebar_label: 'dca'
sidebar_position: 10
---

# longbridge dca

Recurring investment — automatically invest a fixed amount at regular intervals. Create and manage plans that execute stock purchases on a daily, weekly, fortnightly, or monthly schedule. Track trade history, monitor cumulative profit, and check upcoming trade dates.

Without a subcommand, lists all recurring investment plans.

## Basic Usage

```bash
longbridge dca
```

```
| Plan ID             | Symbol  | Status   | Amount | Frequency   | Day of Week | Next Trade Date      | Cum Amount | Cum Profit | Avg Cost |
|---------------------|---------|----------|--------|-------------|-------------|----------------------|------------|------------|----------|
| 1225781523156889600 | SPY.US  | Finished | 750    | Fortnightly | Wed         | 2026-04-08T14:00:00Z | 0          | 0          | 0        |
| 1225781323482853376 | QQQ.US  | Finished | 750    | Fortnightly | Tue         | 2026-04-07T14:00:00Z | 0          | 0          | 0        |
```

## Examples

### List plans

```bash
longbridge dca
longbridge dca --status Active
longbridge dca --symbol AAPL.US
```

Filter plans by status (`Active`, `Suspended`, `Finished`) or by symbol.

### Create a plan

```bash
# Monthly on the 15th
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15

# Weekly every Monday
longbridge dca create TSLA.US --amount 200 --frequency weekly --day-of-week mon

# Fortnightly every Wednesday
longbridge dca create 700.HK --amount 1000 --frequency fortnightly --day-of-week wed
```

Before creating a plan, the CLI shows Terms and Conditions with links. Confirm interactively, or pass `--agree-terms` to skip the prompt:

```bash
longbridge dca create AAPL.US --amount 500 --frequency monthly --day-of-month 15 --agree-terms
```

### Manage plans

```bash
longbridge dca pause 1225781523156889600
longbridge dca resume 1225781523156889600
longbridge dca stop 1225781523156889600
```

`stop` permanently terminates a plan and cannot be undone.

### Trade history

```bash
longbridge dca history 1225781523156889600
```

Shows the execution history for a specific plan — trade dates, amounts, prices, and quantities.

### Statistics summary

```bash
longbridge dca stats
```

```
| Field           | Value |
|-----------------|-------|
| active_count    | 2     |
| finished_count  | 3     |
| suspended_count | 0     |
| total_amount    | 1500  |
| total_profit    | 243   |
```

### Check if a symbol supports recurring investment

```bash
longbridge dca check AAPL.US TSLA.US 700.HK
```

```
| Symbol  | Supports Recurring Investment |
|---------|-------------------------------|
| AAPL.US | yes                           |
| TSLA.US | yes                           |
| 700.HK  | yes                           |
```

### Calculate next trade date

```bash
longbridge dca calc-date --frequency weekly --day-of-week wed
longbridge dca calc-date --frequency monthly --day-of-month 15
```

Returns the next scheduled trade date for the given plan parameters, without creating a plan.

### Set pre-trade reminder

```bash
longbridge dca set-reminder --hours 1
```

Sets how many hours before each trade execution you receive a reminder notification.

## Requirements

A Longbridge account with recurring investment enabled is required. HK and SG accounts must agree to the respective Terms and Conditions before creating a plan. See [Trade Permissions](/docs/trade/) for account setup.
