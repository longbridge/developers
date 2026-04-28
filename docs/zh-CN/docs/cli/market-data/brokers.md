---
title: 'brokers'
sidebar_label: 'brokers'
sidebar_position: 3
---

# longbridge brokers

查看港股盘口各价位的券商 ID 分布，适合识别机构资金的委托流向。

## 基本用法

```bash
longbridge brokers 700.HK
```

```
Symbol: 700.HK

Ask Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 3014, 6409    |
| 2        | 7707, 724     |
| 3        | 1142          |

Bid Brokers:
| Position | Broker IDs    |
|----------|---------------|
| 1        | 5428, 3423    |
| 2        | 3506, 3507    |
| 3        | 4482, 4483    |
```

## 示例

### 查看券商分布

```bash
longbridge brokers 700.HK
longbridge brokers 700.HK --format json
```

显示港股盘口各价位及在该价位挂单的券商 ID。

## 权限要求

需要 Level 2 行情订阅，仅支持港股市场。详见 [行情订阅](/zh-CN/docs/quote/) 中的订阅选项。

## 说明

使用 `longbridge participants` 可按 ID 查询券商名称。`brokers` 输出中的券商 ID 与 participants 列表中的 `broker_id` 字段直接对应。
