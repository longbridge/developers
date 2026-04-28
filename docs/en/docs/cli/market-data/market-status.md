---
title: 'market-status'
sidebar_label: 'market-status'
sidebar_position: 14
---

# longbridge market-status

Check the current open/close status for each exchange.

## Basic Usage

```bash
longbridge market-status
```

```
| market | status     |
|--------|------------|
| US     | Pre-Market |
| HK     | Closed     |
| CN     | Closed     |
| SG     | Closed     |
```

## Examples

### View all market statuses

```bash
longbridge market-status
longbridge market-status --format json
```

Displays whether each exchange (US, HK, CN, SG, etc.) is currently open, closed, or in a pre/post-market session.
