---
title: 'trade-stats'
sidebar_label: 'trade-stats'
sidebar_position: 17
---

# longbridge trade-stats

查看成交統計——按價格分佈的成交量數據。

## 基本用法

```bash
longbridge trade-stats 700.HK
```

```
Prev Close: 504.500  Avg Price: 491.63  Trades: 32782

| price   | buy(shares) | sell(shares) | neutral(shares) |
|---------|-------------|--------------|-----------------|
| 504.500 | 0           | 0            | 142             |
| 504.000 | 0           | 0            | 15              |
| 503.000 | 700         | 0            | 103             |
...
```

## 示例

### 查看成交分佈

```bash
longbridge trade-stats 700.HK
longbridge trade-stats TSLA.US
```

展示成交量在不同價格區間的分佈情況。

### JSON 輸出

```bash
longbridge trade-stats AAPL.US --format json
```
