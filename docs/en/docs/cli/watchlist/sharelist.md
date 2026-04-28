---
title: 'sharelist'
sidebar_label: 'sharelist'
sidebar_position: 2
---

# longbridge sharelist

Community stock lists — view your own and subscribed sharelists, browse trending lists, and manage constituent stocks.

Without a subcommand, shows your own sharelists and the ones you have subscribed to.

## Basic Usage

```bash
longbridge sharelist
```

```
My Sharelists:
| ID    | Name   | Type    | Day Chg | YTD Chg | Subscribers |
|-------|--------|---------|---------|---------|-------------|
| 15921 | 新能源 | Regular | -0.40%  | 6.64%   | 500         |

Subscribed Sharelists:
| ID    | Name             | Type    | Day Chg | YTD Chg | Subscribers |
|-------|------------------|---------|---------|---------|-------------|
| 11538 | 持股收息等待过激 | Regular | -0.04%  | 5.14%   | 481         |
```

## Examples

### View sharelist details

```bash
longbridge sharelist detail 15921
```

Shows the sharelist description, creator info, and all constituent stocks with live price and day change fetched via the quote API.

### Browse popular sharelists

```bash
longbridge sharelist popular
longbridge sharelist popular --count 20
```

```
| ID       | Name         | Type     | Day Chg | YTD Chg | Subscribers |
|----------|--------------|----------|---------|---------|-------------|
| 12732294 | 无人机概念股 | Official | 20.51%  | -3.82%  | 768         |
| 29001357 | SpaceX概念   | Regular  | 13.34%  | 49.86%  | 107         |
```

### Create a sharelist

```bash
longbridge sharelist create --name "AI Picks" --description "Top AI infrastructure stocks"
```

Creates a new empty sharelist. Use `add` afterward to populate it with stocks.

### Add or remove stocks

```bash
longbridge sharelist add 15921 TSLA.US NVDA.US AAPL.US
longbridge sharelist remove 15921 AAPL.US
```

### Reorder stocks

```bash
longbridge sharelist sort 15921 NVDA.US TSLA.US
```

Sets the display order for stocks in the sharelist. Symbols not listed are appended after the specified ones.

### Delete a sharelist

```bash
longbridge sharelist delete 15921
```

Permanently deletes the sharelist. This cannot be undone.

## Requirements

A valid OAuth login is required. Run `longbridge auth login` if you have not yet authenticated. Only your own sharelists can be modified; subscribed sharelists are read-only.
