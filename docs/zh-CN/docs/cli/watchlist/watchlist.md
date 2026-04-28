---
title: 'watchlist'
sidebar_label: 'watchlist'
sidebar_position: 1
---

# longbridge watchlist

查看和管理 Longbridge 自选股——列出分组、添加或删除标的、创建新分组，以及将标的置顶。

## 基本用法

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

## 示例

### 查看所有自选分组及其标的

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

列出所有自选分组及其 ID、名称和标的。`update`、`pin`、`delete` 子命令均需要分组 ID。

### 向分组添加标的

```bash
longbridge watchlist update 2630 --add NVDA.US --add AAPL.US
```

向已有分组添加一个或多个标的。先运行 `longbridge watchlist` 查找分组 ID。

### 从分组移除标的

```bash
longbridge watchlist update 2630 --remove NVDA.US --remove AAPL.US
```

从已有分组移除一个或多个标的。先运行 `longbridge watchlist` 确认分组 ID 及当前标的列表。

### 创建新自选分组

```bash
longbridge watchlist create "Tech Stocks"
```

以指定名称创建一个新的空自选分组，之后使用 `update` 添加标的。

### 重命名分组

```bash
longbridge watchlist update 2630 --name "New Name"
```

重命名已有自选分组。先运行 `longbridge watchlist` 查找分组 ID。

### 将标的置顶

```bash
longbridge watchlist pin 2630 TSLA.US
```

将标的置顶显示在自选分组顶部。已置顶的标的在输出中显示 `is_pinned: true`。对已置顶标的再次执行此命令可取消置顶。

### 删除分组

```bash
longbridge watchlist delete 2630
```

永久删除自选分组及其所有标的。删除前先运行 `longbridge watchlist` 确认分组 ID。

## 权限要求

需要有效的 OAuth 登录。未登录时请先运行 `longbridge auth login`。
