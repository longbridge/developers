---
title: 'news'
sidebar_label: 'news'
sidebar_position: 1
---

# longbridge news

取得標的的最新資訊，或透過 ID 取得文章完整內容。

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

### 取得股票最新資訊

```bash
longbridge news TSLA.US
# 取得更多文章
longbridge news NVDA.US --count 5
# 以 JSON 格式輸出（便於腳本處理）
longbridge news TSLA.US --format json
```

列出該標的最新資訊，包含標題、發布時間及 URL。

### 取得文章完整內容

```bash
longbridge news detail 282276051
```

透過 ID 取得單篇文章的完整 Markdown 內容。文章 ID 來自列表輸出的 `id` 字段。
