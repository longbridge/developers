---
title: 'topic'
sidebar_label: 'topic'
sidebar_position: 3
---

# longbridge topic

Fetch community discussion topics related to a symbol from the Longbridge platform.

## Basic Usage

```bash
longbridge topic TSLA.US
```

```
| id       | title                                           | published_at         | likes | comments | shares |
|----------|-------------------------------------------------|----------------------|-------|----------|--------|
| 39798312 | AI's Hard Limit: Compute Boom Meets a Power Cr… | 2026-04-09T11:32:03Z | 41    | 7        | 97     |
| 39816927 | Tesla is weirdly terrible. Other stocks are up… | 2026-04-09T19:54:50Z | 6     | 4        | 0      |
| 39822930 | What does everyone think about current Tesla?   | 2026-04-10T04:43:49Z | 0     | 0        | 0      |
...
```

## Examples

### View community discussions

```bash
longbridge topic TSLA.US
# View discussions for another symbol
longbridge topic NVDA.US
```

Lists community posts and discussions related to the symbol, including titles, descriptions, and engagement metrics.

### Read the full content of a post

```bash
longbridge topic detail 39798312
```

```
ID:       39798312
Type:     article
Title:    AI's Hard Limit: Compute Boom Meets a Power Crunch; Gas Turbines the Hidden Boss?
Tickers:  ST/US/TSLA, ST/US/NVDA, ST/US/GOOG
Stats:    42 likes  7 comments  0 views
Created:  2026-04-09T11:32:03Z
URL:      https://longbridge.cn/topics/39798312

In the prior piece on AI infrastructure, Dolphin Research argued that
the U.S. power shortfall is not a cyclical mismatch but a structural conflict
between surging AI compute and long-lagging energy and grid build-out...
```

Use the `id` from the topic list to fetch the full body text of any post.

### Find high-engagement posts

```bash
# Filter posts with significant likes using jq
longbridge topic TSLA.US --format json | jq '[.[] | select(.likes_count > 10)]'
```

Combines with `jq` to surface the most-discussed posts. Useful for gauging retail sentiment spikes around earnings or news events.

### View your own topics

```bash
longbridge topic mine
# Filter by content type
longbridge topic mine --type article
longbridge topic mine --type post
```

Lists topics you have published. Use `--page` and `--size` to paginate through results.

### View replies to a topic

```bash
longbridge topic replies 39798312
# Paginate through replies
longbridge topic replies 39798312 --page 2 --size 10
```

Lists replies under a specific topic. Use the `id` from the topic list.

### Publish a new post

```bash
# Short-form post (plain text)
longbridge topic create --body "TSLA earnings beat expectations, bullish on Q3 guidance"
# Post with associated tickers
longbridge topic create --body "Watching NVDA and ARM for AI infrastructure plays" --tickers NVDA.US,ARM.US
```

Creates a short-form community post. Text is plain text. Use `--tickers` to tag related symbols (max 10, comma-separated).

### Publish an article

```bash
longbridge topic create --type article --title "Tesla Q1 2026 Earnings Analysis" --body "## Key Takeaways\n\nRevenue grew 15% YoY..."
```

Creates a long-form article with a title. The body supports Markdown formatting. `--title` is required for articles.

### Reply to a topic

```bash
# Top-level reply
longbridge topic create-reply 39798312 --body "Great analysis, thanks for sharing"
# Nested reply (reply to a specific reply)
longbridge topic create-reply 39798312 --body "Agreed" --reply-to 50012345
```

Posts a reply to a community topic. Use `--reply-to` with a reply ID (from `topic replies`) to create a nested reply.

## Requirements

A valid OAuth login is required for `mine`, `create`, and `create-reply`. Run `longbridge auth login` if you have not yet authenticated.
