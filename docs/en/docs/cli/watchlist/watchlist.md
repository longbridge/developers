---
title: 'watchlist'
sidebar_label: 'watchlist'
sidebar_position: 1
---

# longbridge watchlist

View and manage your Longbridge watchlists — list groups, add or remove symbols, create new groups, and pin securities to the top.

## Basic Usage

```bash
longbridge watchlist
```

```
Group: all (ID: 2630)
| Symbol     | Name                               | Market | Pinned |
|------------|------------------------------------|--------|--------|
| SPY.US     | SPDR S&P 500                       | US     | yes    |
| QQQ.US     | Invesco QQQ Trust                  | US     | yes    |
| TSLA.US    | Tesla                              | US     |        |
| AAPL.US    | Apple                              | US     |        |
| QQQI.US    | NEOS Nasdaq-100(R) High Income ETF | US     |        |
```

## Examples

### View all watchlist groups and their securities

```bash
longbridge watchlist
```

```json
[
  {
    "id": 2630,
    "name": "all",
    "securities": [
      { "is_pinned": true, "market": "US", "name": "SPDR S&P 500", "symbol": "SPY.US" },
      { "is_pinned": true, "market": "US", "name": "Invesco QQQ Trust", "symbol": "QQQ.US" },
      { "is_pinned": false, "market": "US", "name": "Tesla", "symbol": "TSLA.US" }
    ]
  }
]
```

Lists all watchlist groups with their IDs, names, and securities. Group IDs are needed for `update`, `pin`, and `delete` subcommands.

### Add symbols to a group

```bash
longbridge watchlist update 2630 --add NVDA.US --add AAPL.US
```

Adds one or more symbols to an existing group. Run `longbridge watchlist` first to find group IDs.

### Remove symbols from a group

```bash
longbridge watchlist update 2630 --remove NVDA.US --remove AAPL.US
```

Removes one or more symbols from an existing group. Run `longbridge watchlist` first to confirm the group ID and current securities.

### Create a new watchlist group

```bash
longbridge watchlist create "Tech Stocks"
```

Creates a new empty watchlist group with the given name. Use `update` afterward to add securities.

### Rename a group

```bash
longbridge watchlist update 2630 --name "New Name"
```

Renames an existing watchlist group. Run `longbridge watchlist` first to find the group ID.

### Pin a security to the top

```bash
longbridge watchlist pin 2630 TSLA.US
```

Pins a security to the top of a watchlist group. Pinned securities appear first and have `is_pinned: true` in the output. Run the command again on a pinned security to unpin it.

### Remove a group

```bash
longbridge watchlist delete 2630
```

Permanently deletes a watchlist group and all its securities. Run `longbridge watchlist` first to confirm the group ID before deleting.

## Requirements

A valid OAuth login is required. Run `longbridge auth login` if you have not yet authenticated.
