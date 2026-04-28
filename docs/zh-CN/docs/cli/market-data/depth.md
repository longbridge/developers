---
title: 'depth'
sidebar_label: 'depth'
sidebar_position: 2
---

# longbridge depth

查看某标的的 Level 2 盘口——买卖双方前 10 档价位的委托单数量和挂单量。

## 基本用法

```bash
longbridge depth TSLA.US
```

```
Symbol: TSLA.US

Asks (Sell):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.990 | 200    | 3      |
| 2        | 345.000 | 500    | 8      |
| 3        | 345.010 | 300    | 4      |

Bids (Buy):
| Position | Price   | Volume | Orders |
|----------|---------|--------|--------|
| 1        | 344.980 | 400    | 6      |
| 2        | 344.970 | 600    | 9      |
| 3        | 344.960 | 250    | 3      |
```

## 示例

### 查看盘口

```bash
longbridge depth 700.HK
longbridge depth 700.HK --format json
```

显示 700.HK 当前的买卖盘档位，包括各档价格、挂单量和委托单数量。市场开盘期间每侧最多返回 10 档。

## 权限要求

需要 Level 2 行情订阅。详见 [行情订阅](/zh-CN/docs/quote/) 中的订阅选项。
