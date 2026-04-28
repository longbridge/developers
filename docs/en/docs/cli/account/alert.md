---
title: 'alert'
sidebar_label: 'alert'
sidebar_position: 8
---

# longbridge alert

Manage price alerts — list, add, and delete alerts for any symbol.

## Basic Usage

```bash
longbridge alert
```

```
| id     | symbol  | price   | alert            | enabled | frequency |
|--------|---------|---------|------------------|---------|-----------|
| 112326 | TSLA.US | 348.950 | Price drop 239   | ✓       | every     |
| 101526 | TSLA.US | 348.950 | Price drop 190   |         | every     |
| 179741 | NVDA.US | 188.630 | Price drop 130   |         | once      |
...
```

## Examples

### List all alerts

```bash
longbridge alert
longbridge alert --format json
```

Shows all active price alerts across all symbols.

### Filter by symbol

```bash
longbridge alert TSLA.US
longbridge alert QQQ.US
```

### Add a price alert

```bash
# Alert when TSLA rises to $300
longbridge alert add TSLA.US --price 300 --direction rise
# Alert when AAPL drops to $150
longbridge alert add AAPL.US --price 150 --direction fall
```

### Enable / Disable an alert

```bash
# Disable an alert (keeps it without deleting)
longbridge alert disable 112326
# Re-enable a disabled alert
longbridge alert enable 112326
```

### Delete an alert

```bash
# Delete alert by ID (from the alert list)
longbridge alert delete 486469
```

## Requirements

OAuth account permission required. See the [account permission setup](/docs/trade/) guide.
