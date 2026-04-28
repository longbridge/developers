---
title: 'topic'
sidebar_label: 'topic'
sidebar_position: 3
---

# longbridge topic

获取 Longbridge 平台上与某标的相关的社区讨论帖子。

## 基本用法

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

## 示例

### 查看社区讨论

```bash
longbridge topic TSLA.US
# 查看其他标的的讨论
longbridge topic NVDA.US
```

列出与该标的相关的社区帖子，包含标题、摘要及互动数据。

### 阅读帖子完整内容

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

使用帖子列表中的 `id` 获取任意帖子的完整正文。

### 筛选高互动帖子

```bash
# 使用 jq 过滤点赞数较高的帖子
longbridge topic TSLA.US --format json | jq '[.[] | select(.likes_count > 10)]'
```

结合 `jq` 筛选讨论最热的帖子。适用于在财报或重大新闻事件前后追踪散户情绪变化。

### 查看自己发布的帖子

```bash
longbridge topic mine
# 按内容类型筛选
longbridge topic mine --type article
longbridge topic mine --type post
```

列出你已发布的帖子。使用 `--page` 和 `--size` 进行分页。

### 查看帖子回复

```bash
longbridge topic replies 39798312
# 分页查看回复
longbridge topic replies 39798312 --page 2 --size 10
```

列出指定帖子下的回复。使用帖子列表中的 `id`。

### 发布短帖

```bash
# 短帖（纯文本）
longbridge topic create --body "TSLA 财报超预期，看好 Q3 指引"
# 关联标的
longbridge topic create --body "关注 NVDA 和 ARM 的 AI 基础设施布局" --tickers NVDA.US,ARM.US
```

创建一条短帖。正文为纯文本。使用 `--tickers` 关联相关标的（最多 10 个，逗号分隔）。

### 发布文章

```bash
longbridge topic create --type article --title "Tesla Q1 2026 财报分析" --body "## 核心要点\n\n营收同比增长 15%..."
```

创建一篇长文。正文支持 Markdown 格式。文章类型必须提供 `--title`。

### 回复帖子

```bash
# 一级回复
longbridge topic create-reply 39798312 --body "分析得很好，感谢分享"
# 嵌套回复（回复某条回复）
longbridge topic create-reply 39798312 --body "同意" --reply-to 50012345
```

发表帖子回复。使用 `--reply-to` 指定回复 ID（来自 `topic replies`）可创建嵌套回复。

## 前置条件

`mine`、`create` 和 `create-reply` 需要有效的 OAuth 登录。如未认证请先执行 `longbridge auth login`。
