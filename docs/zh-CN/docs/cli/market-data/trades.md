---
title: 'trades'
sidebar_label: 'trades'
sidebar_position: 4
---

# longbridge trades

获取某标的的最近逐笔成交记录，包括价格、成交量、时间和成交方向。

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

### 查看最近 20 条成交记录

```bash
longbridge trades TSLA.US
```

返回 TSLA 最近 20 笔成交，每笔显示价格、成交量、时间戳和成交方向。

### 用 --count 获取更多成交记录

```bash
longbridge trades TSLA.US --count 50
```

使用 `--count` 可在单次调用中获取最多 50 条（或更多）最近成交记录。

### 从成交方向判断买卖压力

```bash
# direction 字段显示相对于前一笔成交的方向：Up、Down 或 Neutral
longbridge trades TSLA.US --count 50 --format json
```

每条记录包含 `direction` 字段，表示本笔成交价格相对于前一笔是上涨、下跌还是持平，可用于判断短期动量。
