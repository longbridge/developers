---
title: 'news'
sidebar_label: 'news'
sidebar_position: 1
---

# longbridge news

Get latest news articles for a symbol, or fetch the full content of an article by ID.

## Basic Usage

```bash
longbridge news TSLA.US
```

```
| id        | title                                                   | published_at         | likes | comments |
|-----------|---------------------------------------------------------|----------------------|-------|----------|
| 282284711 | Wall Street Backs Tesla? Cathie Wood Spends Nearly $28… | 2026-04-10T03:48:22Z | 0     | 0        |
| 282276051 | In response to market rumors that "Tesla is developing… | 2026-04-10T02:16:27Z | 0     | 0        |
| 282265091 | SpaceX posted nearly $5 billion loss in 2025            | 2026-04-10T00:31:27Z | 0     | 0        |
| 282247843 | Down More Than 30% from All-Time Highs, Should You Buy… | 2026-04-09T20:46:26Z | 0     | 0        |
...
```

## Examples

### Latest news for a stock

```bash
longbridge news TSLA.US
# Get more articles
longbridge news NVDA.US --count 5
# Output as JSON for scripting
longbridge news TSLA.US --format json
```

Lists the most recent news articles for the symbol with titles, publication times, and URLs.

### Get full article content

```bash
longbridge news detail 282276051
```

Fetches the full Markdown content of a single article by its ID. Article IDs are available in the `id` field of the list output.
