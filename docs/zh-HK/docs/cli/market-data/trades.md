---
title: 'trades'
sidebar_label: 'trades'
sidebar_position: 4
---

# longbridge trades

取得某標的的最近逐筆成交記錄，包括價格、成交量、時間和成交方向。

## 基本用法

```bash
longbridge trades TSLA.US
```

```
| Time                | Price   | Volume | Direction | Type |
|---------------------|---------|--------|-----------|------|
| 2026-04-09 23:59:43 | 344.940 | 5      | Down      | I    |
| 2026-04-09 23:59:43 | 344.940 | 40     | Down      |      |
| 2026-04-09 23:59:44 | 344.980 | 40     | Up        |      |
| 2026-04-09 23:59:44 | 344.980 | 5      | Up        | I    |
| 2026-04-09 23:59:45 | 344.970 | 1      | Down      | I    |
| 2026-04-09 23:59:52 | 344.975 | 100    | Neutral   |      |
```

## 示例

### 查看最近 20 條成交記錄

```bash
longbridge trades TSLA.US
```

返回 TSLA 最近 20 筆成交，每筆顯示價格、成交量、時間戳和成交方向。

### 用 --count 取得更多成交記錄

```bash
longbridge trades TSLA.US --count 50
```

使用 `--count` 可在單次調用中取得最多 50 條（或更多）最近成交記錄。

### 從成交方向判斷買賣壓力

```bash
# direction 欄位顯示相對於前一筆成交的方向：Up、Down 或 Neutral
longbridge trades TSLA.US --count 50 --format json
```

每條記錄包含 `direction` 欄位，表示本筆成交價格相對於前一筆是上漲、下跌還是持平，可用於判斷短期動能。
