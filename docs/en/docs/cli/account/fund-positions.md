---
title: 'fund-positions'
sidebar_label: 'fund-positions'
sidebar_position: 5
---

# longbridge fund-positions

List your current fund and ETF positions.

## Basic Usage

```bash
longbridge fund-positions
```

```
| Symbol | Name | Net Asset Value | Cost Net Asset Value | Currency | Holding Units |
|--------|------|-----------------|----------------------|----------|---------------|
```

## Examples

### View fund/ETF holdings

```bash
longbridge fund-positions
longbridge fund-positions --format json
```

Displays all fund and ETF positions in your account, including symbol, quantity, and cost information.

## Requirements

OAuth account permission required. See the [account permission setup](/docs/trade/) guide.
