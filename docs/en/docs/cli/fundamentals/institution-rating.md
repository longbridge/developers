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

### Rating history with target price changes

```bash
longbridge institution-rating TSLA.US --history
```

Shows how the rating distribution and consensus price target have changed over time — useful for tracking momentum shifts in analyst sentiment.

### Industry-wide ranking

```bash
longbridge institution-rating TSLA.US --industry-rank
# Paginate
longbridge institution-rating TSLA.US --industry-rank --page 2 --limit 20
```

```
| key             | value      |
|-----------------|------------|
| industry_name   | Automobile Manufacturers |
| industry_rank   | 1          |
| industry_mean   | 10         |
| industry_total  | 30         |

items:
| symbol   | name   | buy | hold | sell | total | rank |
|----------|--------|-----|------|------|-------|------|
| TSLA.US  | Tesla  | 23  | 17   | 10   | 51    | 1    |
| GM.US    | GM     | 20  | 5    | 1    | 27    | 2    |
...
```

Ranks every stock in the same industry by total analyst coverage, so you can see where your stock stands relative to peers.

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
