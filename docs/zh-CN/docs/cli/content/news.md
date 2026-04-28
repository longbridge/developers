---
title: 'news'
sidebar_label: 'news'
sidebar_position: 1
---

# longbridge news

获取标的的最新资讯，或通过 ID 获取文章完整内容。

## 基本用法

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

## 示例

### 获取股票最新资讯

```bash
longbridge news TSLA.US
# 获取更多文章
longbridge news NVDA.US --count 5
# 以 JSON 格式输出（便于脚本处理）
longbridge news TSLA.US --format json
```

列出该标的最新资讯，包含标题、发布时间及 URL。

### 获取文章完整内容

```bash
longbridge news detail 282276051
```

通过 ID 获取单篇文章的完整 Markdown 内容。文章 ID 来自列表输出的 `id` 字段。
