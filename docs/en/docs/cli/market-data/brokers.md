---
title: 'brokers'
sidebar_label: 'brokers'
sidebar_position: 3
---

# longbridge brokers

See which broker IDs are present at each price level in the HK order book. Useful for identifying institutional order flow.

## Basic Usage

```bash
longbridge brokers 700.HK
```

```
Symbol: 700.HK

Ask Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 3014, 6409    |
| 2        | 7707, 724     |
| 3        | 1142          |

Bid Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 5428, 3423    |
| 2        | 3506, 3507    |
| 3        | 4482, 4483    |
```

## Examples

### View broker distribution

```bash
longbridge brokers 700.HK
longbridge brokers 700.HK --format json
```

Displays each price level in the HK order book along with the broker IDs placing orders at that level.

## Requirements

Level 2 quote subscription required. HK market only. See [Quote Subscriptions](/docs/quote/) for subscription options.

## Notes

Use `longbridge participants` to look up broker names by ID. Broker IDs in the `brokers` output map directly to the `broker_id` field in the participants list.
