---
title: 'topic'
sidebar_label: 'topic'
sidebar_position: 3
---

# longbridge topic

取得 Longbridge 平台上與某標的相關的社區討論帖子。

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

### 查看社區討論

```bash
longbridge topic TSLA.US
# 查看其他標的的討論
longbridge topic NVDA.US
```

列出與該標的相關的社區帖子，包含標題、摘要及互動數據。

### 閱讀帖子完整內容

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

使用帖子列表中的 `id` 取得任意帖子的完整正文。

### 篩選高互動帖子

```bash
# 使用 jq 篩選點讚數較高的帖子
longbridge topic TSLA.US --format json | jq '[.[] | select(.likes_count > 10)]'
```

結合 `jq` 篩選討論最熱的帖子。適用於在財報或重大新聞事件前後追蹤散戶情緒變化。

### 查看自己發佈的帖子

```bash
longbridge topic mine
# 按內容類型篩選
longbridge topic mine --type article
longbridge topic mine --type post
```

列出你已發佈的帖子。使用 `--page` 和 `--size` 進行分頁。

### 查看帖子回覆

```bash
longbridge topic replies 39798312
# 分頁查看回覆
longbridge topic replies 39798312 --page 2 --size 10
```

列出指定帖子下的回覆。使用帖子列表中的 `id`。

### 發佈短帖

```bash
# 短帖（純文本）
longbridge topic create --body "TSLA 財報超預期，看好 Q3 指引"
# 關聯標的
longbridge topic create --body "關注 NVDA 和 ARM 的 AI 基礎設施佈局" --tickers NVDA.US,ARM.US
```

建立一條短帖。正文為純文本。使用 `--tickers` 關聯相關標的（最多 10 個，逗號分隔）。

### 發佈文章

```bash
longbridge topic create --type article --title "Tesla Q1 2026 財報分析" --body "## 核心要點\n\n營收同比增長 15%..."
```

建立一篇長文。正文支援 Markdown 格式。文章類型必須提供 `--title`。

### 回覆帖子

```bash
# 一級回覆
longbridge topic create-reply 39798312 --body "分析得很好，感謝分享"
# 嵌套回覆（回覆某條回覆）
longbridge topic create-reply 39798312 --body "同意" --reply-to 50012345
```

發表帖子回覆。使用 `--reply-to` 指定回覆 ID（來自 `topic replies`）可建立嵌套回覆。

## 前置條件

`mine`、`create` 和 `create-reply` 需要有效的 OAuth 登入。如未認證請先執行 `longbridge auth login`。
