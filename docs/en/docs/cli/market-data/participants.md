---
title: 'participants'
sidebar_label: 'participants'
sidebar_position: 13
---

# longbridge participants

Get the complete broker/participant directory for the HK market — maps broker IDs to firm names, letting you decode the `brokers` command output.

## Basic Usage

```bash
longbridge participants
```

```
| Broker ID  | Name EN                          | Name CN                 |
|------------|----------------------------------|-------------------------|
| 6596       | WE                               | WE Securities           |
| 3014       | DRW (Hong Kong) Limited          | DRW (Hong Kong) Limited |
| 7707, 7708 | Ark Securities (Hong Kong) Ltd   | Ark Securities          |
| 724        | UTR8 Hong Kong Limited           | UTR8 Hong Kong Limited  |
| 1142       | Wanhai Securities (HK) Limited   | Wanhai Securities (HK)  |
| 6409       | Standard Chartered(HK)           | Standard Chartered (HK) |
...
```

## Examples

### Look up all broker IDs

```bash
longbridge participants
longbridge participants --format json
```

Returns the full directory of HK exchange participants, each with their broker ID(s) and firm name. Some firms have multiple broker IDs listed together in a single `broker_id` string.

## Notes

HK market only. Use in conjunction with `longbridge brokers` to identify which firms are placing orders at each price level. The `broker_id` values here correspond directly to the IDs returned by the `brokers` command.
