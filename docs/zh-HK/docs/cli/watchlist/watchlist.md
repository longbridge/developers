---
title: 'watchlist'
sidebar_label: 'watchlist'
sidebar_position: 1
---

# longbridge watchlist

查看和管理 Longbridge 自選股——列出分組、添加或刪除標的、創建新分組，以及將標的置頂。

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

### 查看所有自選分組及其標的

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

列出所有自選分組及其 ID、名稱和標的。`update`、`pin`、`delete` 子命令均需要分組 ID。

### 向分組添加標的

```bash
longbridge watchlist update 2630 --add NVDA.US --add AAPL.US
```

向已有分組添加一個或多個標的。先運行 `longbridge watchlist` 查找分組 ID。

### 從分組移除標的

```bash
longbridge watchlist update 2630 --remove NVDA.US --remove AAPL.US
```

從已有分組移除一個或多個標的。先運行 `longbridge watchlist` 確認分組 ID 及當前標的列表。

### 創建新自選分組

```bash
longbridge watchlist create "Tech Stocks"
```

以指定名稱創建一個新的空自選分組，之後使用 `update` 添加標的。

### 重命名分組

```bash
longbridge watchlist update 2630 --name "New Name"
```

重命名已有自選分組。先運行 `longbridge watchlist` 查找分組 ID。

### 將標的置頂

```bash
longbridge watchlist pin 2630 TSLA.US
```

將標的置頂顯示在自選分組頂部。已置頂的標的在輸出中顯示 `is_pinned: true`。對已置頂標的再次執行此命令可取消置頂。

### 刪除分組

```bash
longbridge watchlist delete 2630
```

永久刪除自選分組及其所有標的。刪除前先運行 `longbridge watchlist` 確認分組 ID。

## 權限要求

需要有效的 OAuth 登入。未登入時請先運行 `longbridge auth login`。
