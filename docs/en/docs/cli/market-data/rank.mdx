---
title: 'rank'
sidebar_label: 'rank'
sidebar_position: 20
---

# longbridge rank

LB popularity rankings — a composite score of trading activity, community discussion, watchlist additions, and other signals. Without `--key`, lists all available rank categories. With `--key`, shows the ranked stock list for that category.

<QuotePermission command="rank" />

## Basic Usage

```bash
longbridge rank
```

```
Ranking Categories (use second-level key with --key)

| key            | name   | sub-key           | market |
|----------------|--------|-------------------|--------|
| hot_all        | 总热度 | hot_all-us        | US     |
| hot_all        | 总热度 | hot_all-hk        | HK     |
| hot_up         | 热度上升 | hot_up-us       | US     |
| hot_up         | 热度上升 | hot_up-hk       | HK     |
| trade_heat     | 热门交易 | trade_heat-us   | US     |
| trade_heat     | 热门交易 | trade_heat-hk   | HK     |
| discuss_heat   | 热议   | discuss_heat-us   | US     |
| discuss_heat   | 热议   | discuss_heat-hk   | HK     |
| discuss_heat   | 热议   | discuss_heat-cn   | CN     |
| discuss_heat   | 热议   | discuss_heat-sg   | SG     |
| watchlist_heat | 关注度 | watchlist_heat-us | US     |
| watchlist_heat | 关注度 | watchlist_heat-hk | HK     |
| watchlist_heat | 关注度 | watchlist_heat-cn | CN     |
| watchlist_heat | 关注度 | watchlist_heat-sg | SG     |
```

## Examples

### View US total heat ranking

```bash
longbridge rank --key hot_all-us
```


```
Rank — hot_all-us

| rank | symbol  | name  | price   | chg%    | pre/post | pre/post chg% |
|------|---------|-------|---------|---------|----------|---------------|
| 1    | NVDA.US | 英伟达 | 215.330 | -0.0190 | 214.297  | -0.0048       |
| 2    | AAPL.US | 苹果  | 205.100 | -0.42%  | 204.800  | -0.0015       |
```

### View HK total heat ranking

```bash
longbridge rank --key hot_all-hk
```

### View heat-rising ranking (top 20)

```bash
longbridge rank --key hot_up-us --count 20
```

### List all categories

```bash
longbridge rank
```

Without `--key`, displays a table of all available rank categories and their sub-keys.

### JSON output — with `--key`

```bash
longbridge rank --key hot_all-us --format json
```

```json
{
  "bmp": false,
  "lists": [
    {
      "symbol": "NVDA.US",
      "name": "英伟达",
      "last_done": "215.330",
      "chg": "-0.0190",
      "pre_post_price": "214.297",
      "pre_post_chg": "-0.0048",
      "inflow": "-750205778"
    }
  ]
}
```

Key JSON fields:

| Field | Description |
|-------|-------------|
| `lists[].symbol` | Symbol in `CODE.MARKET` format |
| `lists[].name` | Stock name |
| `lists[].last_done` | Last traded price |
| `lists[].chg` | Price change ratio (e.g. `-0.0190` = −1.90%) |
| `lists[].pre_post_price` | Pre/post-market price |
| `lists[].pre_post_chg` | Pre/post-market change ratio |
| `lists[].inflow` | Net capital inflow (positive = inflow, negative = outflow) |

### JSON output — without `--key`

```bash
longbridge rank --format json
```

```json
{
  "first_tags": [
    {
      "key": "hot_all",
      "name": "总热度",
      "second_tags": [
        { "key": "hot_all-us", "market": "US", "name": "美股" },
        { "key": "hot_all-hk", "market": "HK", "name": "港股" }
      ]
    }
  ]
}
```

## Options

| Flag | Description |
|------|-------------|
| `--key` | Rank category sub-key (from the no-args table, e.g. `hot_all-us`) |
| `--count` | Number of results (default: 20) |
| `--format` | Output format: `table` (default) or `json` |

## Notes

- Rankings are a composite of trading volume, community discussion, watchlist additions, and more — not simply price performance
