---
title: 'institution-rating'
sidebar_label: 'institution-rating'
sidebar_position: 2
---

# longbridge institution-rating

See the consensus from Wall Street analysts — buy/hold/sell distribution, price target range, and industry rankings.

## Basic Usage

```bash
longbridge institution-rating TSLA.US
```

```
Consensus:
| recommend | target | change | updated_at  |
|-----------|--------|--------|-------------|
| buy       | 415.78 | 20.30% | 2026-04-09  |

Rating breakdown:
| strong_buy | buy | hold | sell | under | no_opinion | total |
|------------|-----|------|------|-------|------------|-------|
| 18         | 5   | 17   | 6    | 2     | 4          | 52    |

Target price range:
| lowest_price | highest_price | prev_close |
|--------------|---------------|------------|
| 125.000      | 600.000       | 345.62     |
```

## Examples

### Check analyst consensus

```bash
longbridge institution-rating TSLA.US
```

Shows the breakdown of analyst ratings (Buy, Hold, Sell, and variants), the consensus price target range, and industry peer ranking.

### View historical rating changes over time

```bash
# Show week-by-week rating count history and individual analyst target prices
longbridge institution-rating detail TSLA.US
```

The `detail` subcommand lists the historical rating distribution by week and individual analyst price targets, so you can track how sentiment has shifted over time.

### JSON for monitoring

```bash
longbridge institution-rating TSLA.US --format json
```

```json
{
  "analyst": {
    "evaluate": {
      "buy": 18,
      "hold": 17,
      "no_opinion": 4,
      "over": 5,
      "sell": 6,
      "under": 2,
      "total": 52
    },
    "target": {
      "highest_price": "600.000",
      "lowest_price": "125.000",
      "prev_close": "345.62"
    }
  }
}
```

The `evaluate` object contains the per-rating counts across all 52 covering analysts. The `target` object shows the highest and lowest price targets alongside the previous close for context.
