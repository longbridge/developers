---
title: 'trade-stats'
sidebar_label: 'trade-stats'
sidebar_position: 17
---

# longbridge trade-stats

查看交易统计——按成交量展示价格分布。

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

### 查看成交分布

```bash
longbridge trade-stats 700.HK
longbridge trade-stats TSLA.US
```

展示成交量在不同价格区间的分布情况。

### JSON 输出

```bash
longbridge trade-stats AAPL.US --format json
```
